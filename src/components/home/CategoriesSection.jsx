import CategoryCard from "./CategoryCard";
import { categories } from "./homeData";

export default function CategoriesSection() {
  return (
    <section>
      <SectionHeader title="Catégories populaires" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {categories.map((category) => (
          <CategoryCard key={category.name} category={category} />
        ))}
      </div>
    </section>
  );
}

export function SectionHeader({ title, className = "" }) {
  return (
    <div className={`mb-4 flex items-center justify-between ${className}`}>
      <h2 className="text-xl font-extrabold text-[#182433]">{title}</h2>
      <button className="text-sm font-bold text-[#2563EB]">Voir toutes +</button>
    </div>
  );
}
