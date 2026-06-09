import { Eye, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminTable, { StatusPill } from "../../components/admin/AdminTable";
import { adminOffers } from "../../data/adminData";

export default function OffersModeration() {
  const [filters, setFilters] = useState({ q: "", status: "" });
  const filteredOffers = useMemo(() => {
    return adminOffers.filter((offer) => {
      const query = filters.q.toLowerCase().trim();
      const matchQuery = query ? `${offer.title} ${offer.category} ${offer.owner}`.toLowerCase().includes(query) : true;
      const matchStatus = filters.status ? offer.status === filters.status : true;
      return matchQuery && matchStatus;
    });
  }, [filters]);

  return (
    <div>
      <AdminPageHeader title="Appels d'offres" description="Modération des appels publiés, suivi des budgets, propositions et clôtures." />
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
        rows={filteredOffers}
        columns={[
          {
            key: "title",
            label: "Appel d'offres",
            render: (row) => (
              <div className="flex items-center gap-3">
                <img src={row.image} alt="" className="h-14 w-16 rounded-lg object-cover" />
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
        actions={() => (
          <div className="flex gap-2">
            <button className="rounded-lg border border-[#D7CABD] p-2 text-[#102D42]" title="Voir"><Eye size={17} /></button>
            <button className="rounded-lg border border-[#F0C5C0] p-2 text-[#B42318]" title="Supprimer"><Trash2 size={17} /></button>
          </div>
        )}
      />
    </div>
  );
}
