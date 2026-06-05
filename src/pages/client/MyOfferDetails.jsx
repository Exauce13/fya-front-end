import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Pencil } from "lucide-react";

import OfferStatusBadge from "../../components/offers/OfferStatusBadge";
import { myOffersSeed, readStoredOffers } from "../../components/offers/offersData";

export default function MyOfferDetails() {
  const { offerId } = useParams();
  const seedOffer = [...readStoredOffers(), ...myOffersSeed].find(
    (offer) => String(offer.id) === offerId
  );
  const [offer, setOffer] = useState(seedOffer);
  const [acceptedApplicant, setAcceptedApplicant] = useState("");

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

  const closeOffer = () => {
    setOffer((current) => ({ ...current, status: "completed" }));
  };

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
            <Link
              to={`/appels-offres/${offer.id}/modifier`}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#C96B2C]/35 px-5 text-sm font-extrabold text-[#C96B2C] transition hover:bg-[#fff3ea]"
            >
              <Pencil size={17} />
              Modifier
            </Link>
            <button
              onClick={closeOffer}
              disabled={offer.status === "completed"}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#267A39] px-5 text-sm font-extrabold text-white transition hover:bg-[#216b31] disabled:cursor-not-allowed disabled:opacity-55"
            >
              <CheckCircle2 size={17} />
              Clôturer
            </button>
          </div>
        </div>

        <section className="mt-8 rounded-xl border border-[#d9e6f4] bg-[#f6fbff] p-5">
          <h2 className="text-xl font-extrabold text-[#182433]">Photos liées à l'appel</h2>
          {offer.photos?.length > 0 ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {offer.photos.map((photo) => (
                <figure key={photo.name} className="overflow-hidden rounded-lg border border-[#d9e6f4] bg-white">
                  <img src={photo.src} alt={photo.name} className="w-full" />
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
            {offer.applicants.length} candidature(s) reçue(s).
          </p>

          {offer.applicants.length === 0 ? (
            <p className="mt-4 rounded-lg bg-white p-4 text-sm font-semibold text-gray-500">
              Aucune candidature reçue pour le moment.
            </p>
          ) : (
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {offer.applicants.map((applicant) => (
                <article key={applicant.name} className="rounded-lg border border-[#d9e6f4] bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-extrabold text-[#182433]">{applicant.name}</h3>
                    <button
                      onClick={() => setAcceptedApplicant(applicant.name)}
                      disabled={acceptedApplicant === applicant.name}
                      className={`rounded-lg px-3 py-1.5 text-xs font-extrabold transition ${
                        acceptedApplicant === applicant.name
                          ? "bg-[#E8F7E9] text-[#267A39]"
                          : "bg-[#145DA0] text-white hover:bg-[#104f88]"
                      }`}
                    >
                      {acceptedApplicant === applicant.name ? "Accepté" : "Accepter"}
                    </button>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-gray-600">
                    {applicant.trade} • {applicant.city}
                  </p>
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
