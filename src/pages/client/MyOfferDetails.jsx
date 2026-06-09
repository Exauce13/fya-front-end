import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Download, FileText } from "lucide-react";

import OfferStatusBadge from "../../components/offers/OfferStatusBadge";
import UserNameLink from "../../components/ui/UserNameLink";
import {
  acceptApplication,
  closeOffer as closeOfferApi,
  getMyOfferById,
  normalizeOffer,
  readCreatedOffers,
} from "../../services/offersService";
import { useUserMode } from "../../context/useUserMode";

export default function MyOfferDetails() {
  const { offerId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUserMode();
  const [offer, setOffer] = useState(() => {
    if (location.state?.offer) return location.state.offer;

    const storedOffer = readCreatedOffers(user?.id).find((item) => String(item.id) === String(offerId));
    return storedOffer ? normalizeOffer(storedOffer, true) : null;
  });
  const [loadingFreshOffer, setLoadingFreshOffer] = useState(false);
  const [acceptedApplicantId, setAcceptedApplicantId] = useState("");

  useEffect(() => {
    let active = true;

    async function loadFreshOffer() {
      setLoadingFreshOffer(true);
      try {
        const freshOffer = await getMyOfferById(offerId);
        if (active && freshOffer) {
          setOffer(freshOffer);
        }
      } catch {
        // Keep the navigation state version if the backend detail cannot be refreshed.
      } finally {
        if (active) setLoadingFreshOffer(false);
      }
    }

    loadFreshOffer();

    return () => {
      active = false;
    };
  }, [offerId]);

  if (!offer) {
    return (
      <div className="min-h-screen bg-[#F8F5F1] px-6 pb-8 pt-24 text-[#182433] sm:px-8 lg:px-10">
        <section className="rounded-xl border border-[#eadfd3] bg-white p-6 shadow-sm">
          <Link to="/mes-appels-offres" className="text-sm font-extrabold text-[#145DA0]">
            Retour aux appels d'offres
          </Link>
          <p className="mt-4 font-semibold text-gray-600">Appel d'offre introuvable.</p>
        </section>
      </div>
    );
  }

  const closeOffer = async () => {
    await closeOfferApi(offerId);
    navigate("/offres");
  };

  const acceptApplicant = async (applicant) => {
    await acceptApplication(applicant.id);
    setAcceptedApplicantId(applicant.id);
    setOffer((current) => ({ ...current, status: "closed" }));
  };

  const offerClosed = ["closed", "completed"].includes(String(offer.status || "").toLowerCase());

  return (
    <div className="min-h-screen bg-[#F8F5F1] px-6 pb-8 pt-24 text-[#182433] sm:px-8 lg:px-10">
      <section className="rounded-xl border border-[#eadfd3] bg-white px-6 py-6 shadow-sm lg:px-8">
        <Link
          to="/mes-appels-offres"
          className="mb-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#145DA0]"
        >
          <ArrowLeft size={17} />
          Mes appels d'offres
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-3">
              <OfferStatusBadge status={offer.status} />
            </div>
            <h1 className="text-3xl font-extrabold">{offer.title}</h1>
            <p className="mt-2 text-sm font-semibold text-gray-600">
              {offer.category} • {offer.location} • Budget: {offer.budget}
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-gray-600">
              {offer.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {!offerClosed && (
              <button
                onClick={closeOffer}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#267A39] px-5 text-sm font-extrabold text-white transition hover:bg-[#216b31]"
              >
                <CheckCircle2 size={17} />
                Clôturer
              </button>
            )}
          </div>
        </div>

        <section className="mt-8 rounded-xl border border-[#d9e6f4] bg-[#f6fbff] p-5">
          <h2 className="text-xl font-extrabold text-[#182433]">Photos liées à l'appel</h2>
          {offer.photos?.length > 0 ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {offer.photos.map((photo) => (
                <figure key={photo.name} className="overflow-hidden rounded-lg border border-[#d9e6f4] bg-white">
                  {photo.type === "video" ? (
                    <video src={photo.src} controls className="w-full" />
                  ) : (
                    <img src={photo.src} alt={photo.name} className="w-full" />
                  )}
                  <figcaption className="truncate px-3 py-2 text-xs font-semibold text-gray-600">
                    {photo.name}
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <p className="mt-4 rounded-lg bg-white p-4 text-sm font-semibold text-gray-500">
              Aucune photo jointe à cet appel d'offre.
            </p>
          )}
        </section>

        <section className="mt-6 rounded-xl border border-[#d9e6f4] bg-[#f6fbff] p-5">
          <h2 className="text-xl font-extrabold text-[#182433]">Artisans ayant postulé</h2>
          <p className="mt-1 text-sm font-medium text-gray-500">
            {loadingFreshOffer ? "Actualisation des candidatures..." : `${offer.applicants.length} candidature(s) reçue(s).`}
          </p>

          {offer.applicants.length === 0 ? (
            <p className="mt-4 rounded-lg bg-white p-4 text-sm font-semibold text-gray-500">
              Aucune candidature reçue pour le moment.
            </p>
          ) : (
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {offer.applicants.map((applicant) => (
                <article
                  key={applicant.id || applicant.name}
                  onClick={() => {
                    if (applicant.artisanId) {
                      navigate(`/artisans/${applicant.artisanId}`, { state: applicant.state });
                    }
                  }}
                  className="cursor-pointer rounded-lg border border-[#d9e6f4] bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-extrabold text-[#182433]">
                      <UserNameLink
                        name={applicant.name}
                        id={applicant.artisanId}
                        type="artisan"
                        state={applicant.state}
                      >
                        {applicant.name}
                      </UserNameLink>
                    </h3>
                    {offerClosed ? (
                      String(acceptedApplicantId) === String(applicant.id) && (
                        <span className="rounded-lg bg-[#E8F7E9] px-3 py-1.5 text-xs font-extrabold text-[#267A39]">
                          Accepté
                        </span>
                      )
                    ) : (
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          acceptApplicant(applicant);
                        }}
                        className="rounded-lg bg-[#145DA0] px-3 py-1.5 text-xs font-extrabold text-white transition hover:bg-[#104f88]"
                      >
                        Accepter
                      </button>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-semibold text-gray-600">
                    {applicant.trade} • {applicant.city}
                  </p>
                  <div className="mt-4 rounded-lg bg-[#fbfaf8] p-3">
                    <p className="text-xs font-extrabold uppercase text-gray-400">Description</p>
                    <p className="mt-1 text-sm font-semibold leading-6 text-gray-600">
                      {applicant.description || "Aucune description fournie."}
                    </p>
                    <p className="mt-3 text-xs font-extrabold uppercase text-gray-400">Devis PDF</p>
                    {applicant.quoteFile?.src ? (
                      <a
                        href={applicant.quoteFile.src}
                        download
                        target="_blank"
                        rel="noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        className="mt-2 inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#d9e6f4] bg-white px-3 text-sm font-extrabold text-[#145DA0] transition hover:border-[#145DA0]"
                      >
                        <FileText size={16} />
                        Télécharger le devis
                        <Download size={15} />
                      </a>
                    ) : (
                      <p className="mt-1 text-sm font-semibold text-gray-500">
                        Aucun devis joint.
                      </p>
                    )}
                  </div>
                  <p className="mt-3 text-sm font-extrabold text-[#C96B2C]">
                    Note {applicant.rating}/5
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </div>
  );
}
