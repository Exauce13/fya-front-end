import { useEffect, useState } from "react";
import { CheckCircle2, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";

import { SectionHeader } from "./CategoriesSection";
import profileAvatar from "../../assets/images/profile-avatar.svg";
import { getArtisanAvis, getMetiers, searchArtisans } from "../../services/artisanService";
import { getPaginatedItems, getStorageUrl } from "../../services/apiClient";

const normalizeMetier = (metier, index = 0) => ({
  id: metier?.id ?? metier?.metier_id ?? index + 1,
  name: metier?.nom || metier?.name || metier?.libelle || "",
});

const normalizeArtisan = (artisan) => ({
  id: artisan.id,
  userId: artisan.user_id || artisan.user?.id,
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
  verified: Boolean(artisan.is_certifed || artisan.is_certified || artisan.certifie || artisan.verified),
  experience: `${artisan.annees_experiences || 0} an(s) d'expérience`,
  rating: artisan.rating || "0",
  reviews: artisan.reviews || "0",
  image: getStorageUrl(artisan.photo || artisan.user?.photo) || profileAvatar,
  raw: artisan,
});

const getReviewStats = (payload) => payload?.data?.stats || payload?.stats || {};

const applyReviewStats = (artisan, payload) => {
  const stats = getReviewStats(payload);
  const rating = stats.moyenne_note ?? artisan.raw?.moyenne_note ?? artisan.raw?.rating ?? artisan.rating;
  const reviews = stats.total_avis ?? artisan.raw?.total_avis ?? artisan.raw?.avis_count ?? artisan.reviews;

  return {
    ...artisan,
    rating: rating !== null && rating !== undefined && rating !== "" ? Number(rating).toFixed(1) : "0.0",
    reviews: reviews || "0",
  };
};

export default function VerifiedArtisans() {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadVerifiedArtisans() {
      setLoading(true);
      try {
        const metiersPayload = await getMetiers();
        const metiers = getPaginatedItems(metiersPayload)
          .map(normalizeMetier)
          .filter((metier) => metier.id);
        const requests = metiers.length
          ? metiers.map((metier) =>
              searchArtisans({
                metier_id: metier.id,
                certifie: 1,
              })
            )
          : [searchArtisans({ certifie: 1 })];
        const responses = await Promise.allSettled(requests);
        const itemsById = new Map();

        responses.forEach((response) => {
          if (response.status !== "fulfilled") return;

          getPaginatedItems(response.value).forEach((artisan) => {
            if (artisan?.id) itemsById.set(artisan.id, artisan);
          });
        });

        const baseItems = Array.from(itemsById.values())
          .map(normalizeArtisan)
          .filter((artisan) => artisan.verified)
          .slice(0, 5);
        const statsResponses = await Promise.allSettled(
          baseItems.map((artisan) => getArtisanAvis(artisan.id))
        );
        const items = baseItems.map((artisan, index) => (
          statsResponses[index]?.status === "fulfilled"
            ? applyReviewStats(artisan, statsResponses[index].value)
            : artisan
        ));

        if (active) setArtisans(items);
      } catch {
        if (active) setArtisans([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadVerifiedArtisans();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="mt-7">
      <SectionHeader
        title="Artisans vérifiés"
        actionLink="/explorer?verified=true"
        actionLabel="Voir tous +"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {loading && (
          <div className="rounded-lg border border-[#eadfd3] bg-white p-6 text-sm font-bold text-gray-500 sm:col-span-2 lg:col-span-4 xl:col-span-5">
            Chargement des artisans vérifiés...
          </div>
        )}

        {!loading && artisans.length === 0 && (
          <div className="rounded-lg border border-[#eadfd3] bg-white p-6 text-sm font-bold text-gray-500 sm:col-span-2 lg:col-span-4 xl:col-span-5">
            Aucun artisan vérifié à afficher pour le moment.
          </div>
        )}

        {!loading && artisans.map((artisan) => (
          <VerifiedArtisanCard key={artisan.id} artisan={artisan} />
        ))}
      </div>
    </section>
  );
}

function VerifiedArtisanCard({ artisan }) {
  return (
    <Link
      to={`/artisans/${artisan.id}`}
      state={{ artisan }}
      className="group overflow-hidden rounded-lg border border-[#eadfd3] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="aspect-[4/3] overflow-hidden bg-[#f6f2ed]">
        <img
          src={artisan.image || profileAvatar}
          alt={artisan.name}
          onError={(event) => {
            event.currentTarget.src = profileAvatar;
          }}
          className="h-full w-full object-cover transition duration-200 group-hover:scale-[1.03]"
        />
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-extrabold text-[#182433]">{artisan.name}</h3>
            <p className="mt-1 truncate text-xs font-bold text-[#145DA0]">{artisan.job}</p>
          </div>
          <CheckCircle2 size={18} className="shrink-0 text-[#145DA0]" />
        </div>

        <p className="mt-3 flex items-center gap-1 truncate text-xs font-semibold text-gray-500">
          <MapPin size={13} />
          {artisan.city || "Ville non renseignée"}
          {artisan.district ? `, ${artisan.district}` : ""}
        </p>

        <div className="mt-3 flex items-center justify-between gap-2 text-xs font-bold">
          <span className="inline-flex items-center gap-1 text-[#C96B2C]">
            <Star size={14} className="fill-[#C96B2C]" />
            {artisan.rating}
          </span>
          <span className="truncate text-gray-500">{artisan.experience}</span>
        </div>
      </div>
    </Link>
  );
}
