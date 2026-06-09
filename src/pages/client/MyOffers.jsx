import { Link, useNavigate } from "react-router-dom";
import { Archive, Plus } from "lucide-react";

import OfferList from "../../components/offers/OfferList";
import OfferTabs from "../../components/offers/OfferTabs";
import { useUserMode } from "../../context/useUserMode";
import useMyOffers from "../../hooks/useMyOffers";
import {
  getSeenOfferApplications,
  setSeenOfferApplications,
} from "../../utils/offerApplicationsSeenStorage";

export default function MyOffers() {
  const navigate = useNavigate();
  const { user } = useUserMode();
  const { offers, loading, message } = useMyOffers(user, "open");
  const visibleOffers = offers.map((offer) => ({
    ...offer,
    hasNewApplications:
      Number(offer.proposals || 0) > getSeenOfferApplications(user?.id, offer.id),
  }));

  const openOfferDetails = (offer) => {
    setSeenOfferApplications(user?.id, offer.id, offer.proposals);
    navigate(`/mes-appels-offres/${offer.id}`, { state: { offer } });
  };

  return (
    <div className="min-h-screen bg-[#F8F5F1] px-6 pb-8 pt-24 text-[#182433] sm:px-8 lg:px-10">
      <section className="rounded-xl border border-[#eadfd3] bg-white px-6 py-6 shadow-sm lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold">Mes appels d'offres</h1>
            <p className="mt-2 text-sm font-semibold text-gray-500">
              Gérez vos publications, consultez les candidatures et clôturez les projets terminés.
            </p>
          </div>
          <Link
            to="/appels-offres/nouveau"
            className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-[#C96B2C] px-6 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#b65e23]"
          >
            <Plus size={18} />
            Publier un appel d'offres
          </Link>
        </div>

        <OfferTabs active="mine" />

        <div>
          {loading && (
            <p className="py-6 text-sm font-bold text-gray-500">Chargement de vos appels d'offres...</p>
          )}
          {message && offers.length === 0 && (
            <p className="py-6 text-sm font-bold text-gray-500">{message}</p>
          )}
          <OfferList
            offers={visibleOffers}
            mode="mine"
            onSelect={openOfferDetails}
          />
          <div className="mt-6 border-t border-[#eadfd3] pt-5">
            <Link
              to="/mes-appels-offres/fermes"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#d9e6f4] px-5 text-sm font-extrabold text-[#145DA0] transition hover:bg-[#f6fbff]"
            >
              <Archive size={17} />
              Voir les appels d'offres fermés
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
