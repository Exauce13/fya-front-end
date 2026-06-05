import { Link } from "react-router-dom";
import { useUserMode } from "../../context/useUserMode";

export default function OfferTabs({ active }) {
  const { isClient } = useUserMode();
  const tabs = [
    { id: "mine", label: "Mes appels d'offres", to: "/mes-appels-offres" },
    !isClient && { id: "all", label: "Tous les appels d'offres", to: "/offres" },
  ].filter(Boolean);

  if (tabs.length <= 1) return null;

  return (
    <nav className="mt-8 flex gap-10 border-b border-[#eadfd3] text-sm font-extrabold text-gray-500">
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          to={tab.to}
          className={`pb-5 transition ${
            active === tab.id
              ? "border-b-2 border-[#C96B2C] text-[#182433]"
              : "hover:text-[#182433]"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
