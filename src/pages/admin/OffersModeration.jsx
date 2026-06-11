import { Eye, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminTable, { StatusPill } from "../../components/admin/AdminTable";
import { deleteAdminOffer, getAdminOffers } from "../../services/adminService";
import { getApiMessage, getPaginatedItems, getStorageUrl } from "../../services/apiClient";

const normalizeOffer = (offer) => ({
  id: offer.id,
  title: offer.title || offer.titre || "Appel d'offres",
  category: offer.category || offer.metier?.nom || offer.metier_nom || "",
  owner: offer.owner || offer.user?.name || "",
  budget: offer.budget ? `${Number(offer.budget).toLocaleString("fr-FR")} FCFA` : "Non précisé",
  proposals: offer.proposals || offer.candidatures_count || offer.candidatures?.length || 0,
  status: offer.status === "open" ? "Ouvert" : offer.status === "closed" ? "Terminé" : offer.status || "Ouvert",
  image: getStorageUrl(offer.image || offer.appel_json?.[0] || offer.media_json?.[0]),
});

export default function OffersModeration() {
  const [filters, setFilters] = useState({ q: "", status: "" });
  const [offers, setOffers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadOffers() {
      try {
        const payload = await getAdminOffers(filters);
        if (active) {
          setOffers(getPaginatedItems(payload).map(normalizeOffer));
          setMessage("");
        }
      } catch (error) {
        if (active) {
          setOffers([]);
          setMessage(getApiMessage(error, "Impossible de charger les appels d'offres."));
        }
      }
    }

    loadOffers();

    return () => {
      active = false;
    };
  }, [filters]);

  const removeOffer = async (offer) => {
    try {
      await deleteAdminOffer(offer.id);
      setOffers((current) => current.filter((item) => item.id !== offer.id));
    } catch (error) {
      alert(getApiMessage(error, "Impossible de supprimer cet appel d'offres."));
    }
  };

  return (
    <div>
      <AdminPageHeader title="Appels d'offres" description="Modération des appels publiés, suivi des budgets, propositions et clôtures." />
      {message && <p className="mb-4 rounded-lg border border-[#F0C5C0] bg-white p-4 text-sm font-bold text-[#B42318]">{message}</p>}
      <div className="mb-5 grid gap-3 rounded-lg border border-[#E8DED2] bg-white p-4 md:grid-cols-[1fr_200px]">
        <input
          value={filters.q}
          onChange={(event) => setFilters({ ...filters, q: event.target.value })}
          placeholder="Rechercher par titre, catégorie ou auteur..."
          className="min-h-11 rounded-lg border border-[#E4D9CF] px-3 text-sm font-semibold outline-none focus:border-[#145DA0]"
        />
        <select
          value={filters.status}
          onChange={(event) => setFilters({ ...filters, status: event.target.value })}
          className="min-h-11 rounded-lg border border-[#E4D9CF] px-3 text-sm font-semibold outline-none focus:border-[#145DA0]"
        >
          <option value="">Tous les statuts</option>
          <option value="Ouvert">Ouvert</option>
          <option value="Terminé">Terminé</option>
        </select>
      </div>
      <AdminTable
        rows={offers}
        columns={[
          {
            key: "title",
            label: "Appel d'offres",
            render: (row) => (
              <div className="flex items-center gap-3">
                <img src={row.image} alt="" className="h-14 w-16 rounded-lg bg-[#F6F2ED] object-cover" />
                <div>
                  <p className="font-black">{row.title}</p>
                  <p className="text-xs text-[#75695F]">{row.category} · {row.owner}</p>
                </div>
              </div>
            ),
          },
          { key: "budget", label: "Budget" },
          { key: "proposals", label: "Candidatures" },
          { key: "status", label: "Statut", render: (row) => <StatusPill status={row.status} /> },
        ]}
        actions={(row) => (
          <div className="flex gap-2">
            <button className="rounded-lg border border-[#D7CABD] p-2 text-[#102D42]" title="Voir"><Eye size={17} /></button>
            <button onClick={() => removeOffer(row)} className="rounded-lg border border-[#F0C5C0] p-2 text-[#B42318]" title="Supprimer"><Trash2 size={17} /></button>
          </div>
        )}
      />
    </div>
  );
}
