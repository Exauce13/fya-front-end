import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import FilterSidebar from "../../components/search/FilterSidebar";
import ResultsGrid from "../../components/search/ResultsGrid";
import ResultsList from "../../components/search/ResultsList";
import SearchHeader from "../../components/search/SearchHeader";
import { getMetiers, searchArtisans } from "../../services/artisanService";
import { getApiMessage, getPaginatedItems, getStorageUrl } from "../../services/apiClient";

const normalizeMetier = (metier) => ({
  id: metier?.id,
  name: metier?.nom || metier?.name || "",
});

const normalizeSearchValue = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const normalizeArtisan = (artisan) => ({
  id: artisan.id,
  name: artisan.name || artisan.user?.name || "Artisan",
  job: artisan.metier?.nom || artisan.metier_nom || "Artisan",
  category: artisan.metier?.nom || artisan.metier_nom || "",
  city: artisan.ville || artisan.user?.ville || "",
  district: artisan.quartier || artisan.user?.quartier || "",
  bio: artisan.bio || "",
  workshop: artisan.nom_atelier || artisan.nom_association || "",
  telephone: artisan.telephone || artisan.user?.telephone || "",
  email: artisan.email || artisan.user?.email || "",
  statut: artisan.user?.statut || artisan.statut || "",
  verified: Boolean(artisan.is_certifed || artisan.certifie),
  experience: `${artisan.annees_experiences || 0} an(s) d'expérience`,
  rating: artisan.rating || "0",
  reviews: artisan.reviews || "0",
  image: getStorageUrl(artisan.photo || artisan.user?.photo),
  raw: artisan,
});

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
  const [metiers, setMetiers] = useState([]);
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadMetiers() {
      try {
        const payload = await getMetiers();
        if (active) {
          setMetiers(getPaginatedItems(payload).map(normalizeMetier).filter((metier) => metier.id && metier.name));
        }
      } catch {
        if (active) setMetiers([]);
      }
    }

    loadMetiers();

    return () => {
      active = false;
    };
  }, []);

  const selectedMetier = useMemo(() => {
    const normalizedCategory = normalizeSearchValue(filters.category);
    const normalizedQuery = normalizeSearchValue(query);

    return metiers.find((metier) => {
      const name = normalizeSearchValue(metier.nom || metier.name);
      return name === normalizedCategory || (normalizedQuery && name.includes(normalizedQuery));
    });
  }, [filters.category, metiers, query]);

  useEffect(() => {
    let active = true;

    async function loadArtisans() {
      if (metiers.length === 0) {
        setArtisans([]);
        setApiMessage("Chargement des métiers...");
        return;
      }

      setLoading(true);
      setApiMessage("");

      try {
        const metiersToSearch = selectedMetier?.id ? [selectedMetier] : metiers;
        const requests = metiersToSearch.map((metier) =>
          searchArtisans({
            metier_id: metier.id,
            ville: filters.city || undefined,
            quartier: filters.district || undefined,
            certifie: filters.verifiedOnly ? 1 : undefined,
          })
        );
        const responses = await Promise.allSettled(requests);
        const itemsById = new Map();

        responses.forEach((response) => {
          if (response.status !== "fulfilled") return;

          getPaginatedItems(response.value).forEach((artisan) => {
            if (artisan?.id) itemsById.set(artisan.id, artisan);
          });
        });

        const items = Array.from(itemsById.values()).map(normalizeArtisan);

        if (active) {
          setArtisans(items);
          setApiMessage(items.length ? "" : "Aucun artisan trouvé.");
        }
      } catch (error) {
        if (active) {
          setArtisans([]);
          setApiMessage(getApiMessage(error, "Aucun artisan trouvé."));
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadArtisans();

    return () => {
      active = false;
    };
  }, [filters.city, filters.district, filters.verifiedOnly, metiers, selectedMetier]);

  const filteredArtisans = useMemo(() => {
    return artisans.filter((artisan) => {
      const normalizedQuery = normalizeSearchValue(query);
      const searchableText = [
        artisan.name,
        artisan.job,
        artisan.category,
        artisan.city,
        artisan.district,
      ]
        .join(" ");
      const matchQuery = normalizedQuery
        ? normalizeSearchValue(searchableText).includes(normalizedQuery)
        : true;
      const matchCategory = filters.category
        ? normalizeSearchValue(artisan.category) === normalizeSearchValue(filters.category)
        : true;
      const matchCity = filters.city
        ? normalizeSearchValue(artisan.city).includes(normalizeSearchValue(filters.city))
        : true;
      const matchDistrict = filters.district
        ? normalizeSearchValue(artisan.district).includes(normalizeSearchValue(filters.district))
        : true;
      const matchVerified = filters.verifiedOnly ? artisan.verified : true;

      return matchQuery && matchCategory && matchCity && matchDistrict && matchVerified;
    });
  }, [artisans, filters, query]);

  return (
    <div className="min-h-screen bg-[#F8F5F1] px-6 pb-8 pt-24 text-[#182433] sm:px-8 lg:px-10">
      <SearchHeader value={query} onChange={setQuery} />

      <div className="mt-5 grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)] 2xl:grid-cols-[300px_minmax(0,1fr)]">
        <FilterSidebar
          filters={filters}
          onFilterChange={setFilters}
          categories={metiers.map((metier) => metier.name)}
        />
        <ResultsGrid>
          {loading && (
            <p className="mb-4 rounded-lg border border-[#eadfd3] bg-white p-4 text-sm font-bold text-gray-600">
              Recherche en cours...
            </p>
          )}
          {apiMessage && !loading && (
            <p className="mb-4 rounded-lg border border-[#eadfd3] bg-white p-4 text-sm font-bold text-gray-600">
              {apiMessage}
            </p>
          )}
          <ResultsList artisans={filteredArtisans} />
        </ResultsGrid>
      </div>
    </div>
  );
}
