import SearchFilters, { CheckboxFilter, SelectFilter } from "./SearchFilters";
import { serviceCategories } from "../../data/serviceCategories";

export default function FilterSidebar({ filters, onFilterChange }) {
  const updateFilter = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <aside className="rounded-lg border border-[#eadfd3] bg-white shadow-sm lg:sticky lg:top-24">
      <div className="border-b border-[#eadfd3] px-5 py-5">
        <h2 className="text-lg font-extrabold text-[#182433]">Filtres</h2>
      </div>

      <div className="px-5">
        <SearchFilters title="Catégorie">
          <SelectFilter
            label="Toutes les catégories"
            value={filters.category}
            options={serviceCategories}
            onChange={(value) => updateFilter("category", value)}
          />
        </SearchFilters>

        <SearchFilters title="Ville">
          <input
            value={filters.city}
            onChange={(event) => updateFilter("city", event.target.value)}
            className="min-h-11 w-full rounded-lg border border-[#eadfd3] px-3 text-sm font-medium text-gray-700 outline-none focus:border-[#C96B2C]"
            placeholder="Ex: Cotonou"
          />
        </SearchFilters>

        <SearchFilters title="Quartier">
          <input
            value={filters.district}
            onChange={(event) => updateFilter("district", event.target.value)}
            className="min-h-11 w-full rounded-lg border border-[#eadfd3] px-3 text-sm font-medium text-gray-700 outline-none focus:border-[#C96B2C]"
            placeholder="Ex: Fidjrossè"
          />
        </SearchFilters>

        <SearchFilters title="Artisan vérifié">
          <CheckboxFilter
            label="Vérifiés uniquement"
            checked={filters.verifiedOnly}
            onChange={(checked) => updateFilter("verifiedOnly", checked)}
          />
        </SearchFilters>
      </div>
    </aside>
  );
}
