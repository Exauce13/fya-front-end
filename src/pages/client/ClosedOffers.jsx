import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import OfferList from "../../components/offers/OfferList";
import { useUserMode } from "../../context/useUserMode";
import useMyOffers from "../../hooks/useMyOffers";

export default function ClosedOffers() {
  const navigate = useNavigate();
  const { user } = useUserMode();
  const { offers, loading, message } = useMyOffers(user, "closed");

  const openOfferDetails = (offer) => {
    navigate(`/mes-appels-offres/${offer.id}`, { state: { offer } });
  };

  return (
    <div className="min-h-screen bg-[#F8F5F1] px-6 pb-8 pt-24 text-[#182433] sm:px-8 lg:px-10">
      <section className="rounded-xl border border-[#eadfd3] bg-white px-6 py-6 shadow-sm lg:px-8">
        <Link
          to="/mes-appels-offres"
          className="mb-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#145DA0]"
        >
          <ArrowLeft size={17} />
          Appels d'offres ouverts
        </Link>

        <h1 className="text-3xl font-extrabold">Appels d'offres fermés</h1>
        <p className="mt-2 text-sm font-semibold text-gray-500">
          Retrouvez ici les appels clôturés ou terminés.
        </p>

        <div className="mt-6">
          {loading && (
            <p className="py-6 text-sm font-bold text-gray-500">Chargement des appels fermés...</p>
          )}
          {message && offers.length === 0 && (
            <p className="py-6 text-sm font-bold text-gray-500">Aucun appel d'offres fermé.</p>
          )}
          <OfferList offers={offers} mode="mine" onSelect={openOfferDetails} />
        </div>
      </section>
    </div>
  );
}
