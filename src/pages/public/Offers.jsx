import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import OfferList from "../../components/offers/OfferList";
import OfferTabs from "../../components/offers/OfferTabs";
import { useUserMode } from "../../context/useUserMode";

const initialOffers = [
  {
    id: 3,
    title: "Réalisation d'armoires de cuisine",
    category: "Menuiserie",
    location: "Porto-Novo",
    budget: "350 000 FCFA",
    proposals: 1,
    publishedAgo: "1 semaine",
    status: "open",
    description: "Conception d'armoires de cuisine avec finitions simples.",
    owner: false,
    applicants: [],
  },
  {
    id: 4,
    title: "Installation électrique complète",
    category: "Électricité",
    location: "Parakou",
    budget: "650 000 FCFA",
    proposals: 7,
    publishedAgo: "4 semaines",
    status: "open",
    description: "Installation électrique pour une maison neuve.",
    owner: false,
    applicants: [],
  },
  {
    id: 5,
    title: "Peinture intérieure d'un appartement",
    category: "Peinture",
    location: "Cotonou",
    budget: "180 000 FCFA",
    proposals: 4,
    publishedAgo: "3 jours",
    status: "open",
    description: "Peinture complète de trois pièces et finitions propres.",
    owner: false,
    applicants: [],
  },
];

export default function Offers() {
  const { user } = useUserMode();
  const [offers] = useState(initialOffers);
  const [appliedOfferIds, setAppliedOfferIds] = useState([]);
  const visibleOffers = user?.trade
    ? offers.filter((offer) => offer.category === user.trade)
    : offers;

  const applyToOffer = (offer) => {
    setAppliedOfferIds((current) =>
      current.includes(offer.id) ? current : [...current, offer.id]
    );
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
          <OfferList
            offers={visibleOffers}
            mode="all"
            appliedOfferIds={appliedOfferIds}
            onApply={applyToOffer}
          />
        </div>
      </section>
    </div>
  );
}
