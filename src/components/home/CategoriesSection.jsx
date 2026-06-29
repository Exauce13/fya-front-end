import { Link } from "react-router-dom";

import CategoryCard from "./CategoryCard";
import useMetiers from "../../hooks/useMetiers";

export default function CategoriesSection() {
  const { metiers, loading } = useMetiers();
  const categories = metiers.slice(0, 8).map((metier) => ({ name: metier.name }));

  return (
    <section className="hidden sm:block">
      <SectionHeader
        title="Métiers populaires"
        actionLink="/metiers"
        actionLabel="Voir toutes +"
      />
      <div className="flex gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-8 lg:overflow-visible lg:pb-0">
        {categories.map((category) => (
          <div key={category.name} className="w-36 shrink-0 lg:w-auto">
            <CategoryCard category={category} />
          </div>
        ))}
      </div>
      {!loading && categories.length === 0 && (
        <p className="rounded-lg border border-[#eadfd3] bg-white p-5 text-sm font-bold text-gray-500">
          Aucun métier disponible pour le moment.
        </p>
      )}
    </section>
  );
}

export function SectionHeader({
  title,
  className = "",
  expanded = false,
  onToggle,
  actionLink,
  actionLabel = "Voir toutes +",
}) {
  return (
    <div className={`mb-4 flex items-center justify-between ${className}`}>
      <h2 className="text-xl font-extrabold text-[#182433]">{title}</h2>
      {actionLink ? (
        <Link to={actionLink} className="text-sm font-bold text-[#2563EB]">
          {actionLabel}
        </Link>
      ) : onToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="text-sm font-bold text-[#2563EB]"
        >
          {expanded ? "Voir moins" : "Voir toutes +"}
        </button>
      )}
    </div>
  );
}
