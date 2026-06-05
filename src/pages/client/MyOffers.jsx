import { Link, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import OfferList from "../../components/offers/OfferList";
import OfferTabs from "../../components/offers/OfferTabs";
import { myOffersSeed, readStoredOffers } from "../../components/offers/offersData";

export default function MyOffers() {
  const navigate = useNavigate();
  const offers = [...readStoredOffers(), ...myOffersSeed];

  const openOfferDetails = (offer) => {
    navigate(`/mes-appels-offres/${offer.id}`);
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
          <OfferList
            offers={offers}
            mode="mine"
            onSelect={openOfferDetails}
          />
        </div>
      </section>
    </div>
  );
}
