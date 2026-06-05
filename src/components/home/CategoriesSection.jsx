import { useState } from "react";
import { Link } from "react-router-dom";

import CategoryCard from "./CategoryCard";
import { allCategories, categories } from "./homeData";

export default function CategoriesSection() {
  const [showAll, setShowAll] = useState(false);
  const displayedCategories = showAll ? allCategories : categories;

  return (
    <section>
      <SectionHeader
        title="Métiers populaires"
        expanded={showAll}
        onToggle={() => setShowAll((current) => !current)}
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {displayedCategories.map((category) => (
          <CategoryCard key={category.name} category={category} />
        ))}
      </div>
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
