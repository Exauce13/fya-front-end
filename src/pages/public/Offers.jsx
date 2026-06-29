import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import ApplicationModal from "../../components/offers/ApplicationModal";
import OfferList from "../../components/offers/OfferList";
import OfferMediaViewer from "../../components/offers/OfferMediaViewer";
import OfferTabs from "../../components/offers/OfferTabs";
import { applyToOffer, getOfferFeed, getOfferItems, normalizeOffer } from "../../services/offersService";
import { getApiMessage } from "../../services/apiClient";
import { onRealtimeEvent, realtimeEvents } from "../../services/realtimeService";
import { useUserMode } from "../../context/useUserMode";
import { getAppliedOfferIds, setOfferApplied } from "../../utils/appliedOffersStorage";

export default function Offers() {
  const { user } = useUserMode();
  const currentArtisanId = user?.artisan?.id || user?.artisan_p?.id || user?.artisan_id;
  const [offers, setOffers] = useState([]);
  const [appliedOfferIds, setAppliedOfferIds] = useState(() => getAppliedOfferIds(user?.id));
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [previewedOffer, setPreviewedOffer] = useState(null);
  const [applying, setApplying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState("");

  const loadOffers = useCallback(async ({ silent = false } = {}) => {
    const storedAppliedIds = getAppliedOfferIds(user?.id).map(String);

    if (!silent) setLoading(true);
    setApiMessage("");
    try {
      const payload = await getOfferFeed();
      const items = getOfferItems(payload)
        .map((offer) => normalizeOffer(offer, false));
      const backendAppliedIds = items
        .filter((offer) =>
          offer.applicants?.some((applicant) =>
            Number(applicant.userId) === Number(user?.id) ||
            Number(applicant.artisanId) === Number(currentArtisanId)
          )
        )
        .map((offer) => String(offer.id));
      backendAppliedIds.forEach((offerId) => setOfferApplied(user?.id, offerId));
      setOffers(items);
      setAppliedOfferIds((current) =>
        Array.from(new Set([...current.map(String), ...storedAppliedIds, ...backendAppliedIds]))
      );
      setApiMessage(items.length ? "" : "Aucun appel d'offres correspondant à votre métier.");
    } catch (error) {
      if (!silent) {
        setOffers([]);
        setApiMessage(getApiMessage(error, "Aucun appel d'offres disponible."));
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, [currentArtisanId, user?.id]);

  useEffect(() => {
    let active = true;

    async function loadInitialOffers() {
      try {
        await loadOffers();
      } finally {
        if (!active) {
          setLoading(false);
        }
      }
    }

    loadInitialOffers();

    return () => {
      active = false;
    };
  }, [loadOffers]);

  useEffect(() => onRealtimeEvent(
    [realtimeEvents.offerPublished, realtimeEvents.offerApplication, realtimeEvents.notification],
    (event) => {
      const detail = event.detail || {};

      if (event.type === realtimeEvents.notification && detail.type === "nouvel_appel_offre") {
        const offerFromNotification = detail.data?.appel_offre_id
          ? normalizeOffer(
              {
                id: detail.data.appel_offre_id,
                titre: detail.data.titre,
                metier_id: detail.data.metier_id,
                ville: detail.data.ville,
                created_at: detail.raw?.created_at,
              },
              false
            )
          : null;

        if (offerFromNotification?.id) {
          setOffers((current) => (
            current.some((offer) => String(offer.id) === String(offerFromNotification.id))
              ? current
              : [offerFromNotification, ...current]
          ));
          setApiMessage("");
        }

        loadOffers({ silent: true }).catch(() => {});
        return;
      }

      if (event.type === realtimeEvents.offerPublished && detail.offer?.id) {
        const nextOffer = normalizeOffer(detail.offer, false);
        setOffers((current) => (
          current.some((offer) => String(offer.id) === String(nextOffer.id))
            ? current
            : [nextOffer, ...current]
        ));
        setApiMessage("");
      }

      if (event.type === realtimeEvents.offerApplication && detail.offerId) {
        setOffers((current) => current.map((offer) => (
          String(offer.id) === String(detail.offerId)
            ? { ...offer, proposals: Number(offer.proposals || 0) + 1 }
            : offer
        )));
      }
    }
  ), [loadOffers]);

  const openApplicationForm = (offer) => {
    setSelectedOffer(offer);
  };

  const submitApplication = async (payload) => {
    if (!selectedOffer) return;

    setApplying(true);
    try {
      await applyToOffer(selectedOffer.id, payload);
      setOfferApplied(user?.id, selectedOffer.id);
      setAppliedOfferIds((current) =>
        current.some((id) => String(id) === String(selectedOffer.id))
          ? current
          : [...current, String(selectedOffer.id)]
      );
      setOffers((current) =>
        current.map((offer) =>
          String(offer.id) === String(selectedOffer.id)
            ? { ...offer, proposals: Number(offer.proposals || 0) + 1 }
            : offer
        )
      );
      setSelectedOffer(null);
    } catch (error) {
      alert(getApiMessage(error, "Impossible d'envoyer la candidature."));
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F1] px-6 pb-8 pt-24 text-[#182433] sm:px-8 lg:px-10">
      <section className="rounded-xl border border-[#eadfd3] bg-white px-6 py-6 shadow-sm lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold">Appels d'offres</h1>
            <p className="mt-2 text-sm font-semibold text-gray-500">
              Consultez les besoins publiés correspondant à votre métier.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/appels-offres/nouveau"
              className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-[#C96B2C] px-6 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#b65e23]"
            >
              <Plus size={18} />
              Publier un appel d'offres
            </Link>
          </div>
        </div>

        <OfferTabs active="all" />

        <div>
          {loading && (
            <p className="py-6 text-sm font-bold text-gray-500">Chargement des appels d'offres...</p>
          )}
          {apiMessage && !loading && (
            <p className="py-6 text-sm font-bold text-gray-500">{apiMessage}</p>
          )}
          <OfferList
            offers={offers}
            mode="all"
            appliedOfferIds={appliedOfferIds}
            onApply={openApplicationForm}
            onPreviewMedia={setPreviewedOffer}
          />
        </div>
      </section>

      <ApplicationModal
        offer={selectedOffer}
        loading={applying}
        onClose={() => setSelectedOffer(null)}
        onSubmit={submitApplication}
      />
      <OfferMediaViewer offer={previewedOffer} onClose={() => setPreviewedOffer(null)} />
    </div>
  );
}
