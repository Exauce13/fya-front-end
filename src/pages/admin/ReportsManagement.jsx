import { CheckCircle, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminTable, { StatusPill } from "../../components/admin/AdminTable";
import { adminReports } from "../../data/adminData";

export default function ReportsManagement() {
  const [filters, setFilters] = useState({ q: "", status: "" });
  const filteredReports = useMemo(() => {
    return adminReports.filter((report) => {
      const query = filters.q.toLowerCase().trim();
      const matchQuery = query
        ? `${report.id} ${report.user} ${report.target} ${report.reason} ${report.description}`.toLowerCase().includes(query)
        : true;
      const matchStatus = filters.status ? report.status === filters.status : true;
      return matchQuery && matchStatus;
    });
  }, [filters]);

  return (
    <div>
      <AdminPageHeader title="Signalements" description="Traitement des signalements liés aux utilisateurs et conversations." />
      <div className="mb-5 grid gap-3 rounded-lg border border-[#E8DED2] bg-white p-4 md:grid-cols-[1fr_200px]">
        <input
          value={filters.q}
          onChange={(event) => setFilters({ ...filters, q: event.target.value })}
          placeholder="Rechercher par référence, utilisateur, cible ou motif..."
          className="min-h-11 rounded-lg border border-[#E4D9CF] px-3 text-sm font-semibold outline-none focus:border-[#145DA0]"
        />
        <select
          value={filters.status}
          onChange={(event) => setFilters({ ...filters, status: event.target.value })}
          className="min-h-11 rounded-lg border border-[#E4D9CF] px-3 text-sm font-semibold outline-none focus:border-[#145DA0]"
        >
          <option value="">Tous les statuts</option>
          <option value="En attente">En attente</option>
          <option value="Traité">Traité</option>
        </select>
      </div>
      <AdminTable
        rows={filteredReports}
        columns={[
          { key: "id", label: "Référence" },
          { key: "user", label: "Signalé par" },
          { key: "target", label: "Cible" },
          { key: "reason", label: "Motif" },
          { key: "description", label: "Description" },
          { key: "status", label: "Statut", render: (row) => <StatusPill status={row.status} /> },
        ]}
        actions={() => (
          <div className="flex gap-2">
            <button className="rounded-lg border border-[#F0C5C0] p-2 text-[#B42318]" title="Ignoré"><XCircle size={17} /></button>
            <button className="rounded-lg border border-[#BFE5C8] p-2 text-[#237847]" title="Traité"><CheckCircle size={17} /></button>
          </div>
        )}
      />
    </div>
  );
}
