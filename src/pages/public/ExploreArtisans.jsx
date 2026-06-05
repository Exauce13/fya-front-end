import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import FilterSidebar from "../../components/search/FilterSidebar";
import ResultsGrid from "../../components/search/ResultsGrid";
import ResultsList from "../../components/search/ResultsList";
import SearchHeader from "../../components/search/SearchHeader";

const artisans = [
  {
    name: "Hervé A.",
    job: "Menuisier",
    category: "Menuiserie",
    city: "Cotonou",
    district: "Fidjrossè",
    verified: true,
    experience: "7 ans d'expérience",
    rating: "4.8",
    reviews: "123",
    image:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Yao M.",
    job: "Plombier",
    category: "Plomberie",
    city: "Cotonou",
    district: "Akpakpa",
    verified: true,
    experience: "12 ans d'expérience",
    rating: "4.6",
    reviews: "99",
    image:
      "https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Arnaud S.",
    job: "Electricien",
    category: "Électricité",
    city: "Abomey-Calavi",
    district: "Godomey",
    verified: true,
    experience: "8 ans d'expérience",
    rating: "4.7",
    reviews: "74",
    image:
      "https://images.unsplash.com/photo-1601055283742-8b27e81b5553?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Grace C.",
    job: "Couturière",
    category: "Couture",
    city: "Porto-Novo",
    district: "Jéricho",
    verified: false,
    experience: "6 ans d'expérience",
    rating: "4.9",
    reviews: "94",
    image:
      "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&w=500&q=80",
  },
];

export default function ExploreArtisans() {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("categorie") || "";
  const queryFromUrl = searchParams.get("q") || "";
  const verifiedFromUrl = searchParams.get("verified") === "true";
  const [query, setQuery] = useState(queryFromUrl);
  const [filters, setFilters] = useState({
    category: categoryFromUrl,
    city: "",
    district: "",
    verifiedOnly: verifiedFromUrl,
  });

  const filteredArtisans = useMemo(() => {
    return artisans.filter((artisan) => {
      const normalizedQuery = query.toLowerCase().trim();
      const searchableText = [
        artisan.name,
        artisan.job,
        artisan.category,
        artisan.city,
        artisan.district,
      ]
        .join(" ")
        .toLowerCase();
      const matchQuery = normalizedQuery
        ? searchableText.includes(normalizedQuery)
        : true;
      const matchCategory = filters.category
        ? artisan.category === filters.category
        : true;
      const matchCity = filters.city
        ? artisan.city.toLowerCase().includes(filters.city.toLowerCase().trim())
        : true;
      const matchDistrict = filters.district
        ? artisan.district.toLowerCase().includes(filters.district.toLowerCase().trim())
        : true;
      const matchVerified = filters.verifiedOnly ? artisan.verified : true;

      return matchQuery && matchCategory && matchCity && matchDistrict && matchVerified;
    });
  }, [filters, query]);

  return (
    <div className="min-h-screen bg-[#F8F5F1] px-6 pb-8 pt-24 text-[#182433] sm:px-8 lg:px-10">
      <SearchHeader value={query} onChange={setQuery} />

      <div className="mt-5 grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)] 2xl:grid-cols-[300px_minmax(0,1fr)]">
        <FilterSidebar filters={filters} onFilterChange={setFilters} />
        <ResultsGrid>
          <ResultsList artisans={filteredArtisans} />
        </ResultsGrid>
      </div>
    </div>
  );
}
