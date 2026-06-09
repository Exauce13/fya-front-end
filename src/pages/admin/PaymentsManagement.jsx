import { Download } from "lucide-react";
import { useMemo, useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminTable, { StatusPill } from "../../components/admin/AdminTable";
import { adminPayments } from "../../data/adminData";

export default function PaymentsManagement() {
  const [filters, setFilters] = useState({ q: "", type: "", status: "" });
  const filteredPayments = useMemo(() => {
    return adminPayments.filter((payment) => {
      const query = filters.q.toLowerCase().trim();
      const matchQuery = query ? `${payment.id} ${payment.user}`.toLowerCase().includes(query) : true;
      const matchType = filters.type ? payment.type === filters.type : true;
      const matchStatus = filters.status ? payment.status === filters.status : true;
      return matchQuery && matchType && matchStatus;
    });
  }, [filters]);

  return (
    <div>
      <AdminPageHeader
        title="Paiements"
        description="Suivi des abonnements et renouvellements payés via FedaPay."
        action={<button className="rounded-lg bg-[#D96822] px-5 py-3 text-sm font-black text-white">Exporter</button>}
      />
      <div className="mb-5 grid gap-3 rounded-lg border border-[#E8DED2] bg-white p-4 md:grid-cols-[1fr_190px_190px]">
        <input
          value={filters.q}
          onChange={(event) => setFilters({ ...filters, q: event.target.value })}
          placeholder="Rechercher par référence ou utilisateur..."
          className="min-h-11 rounded-lg border border-[#E4D9CF] px-3 text-sm font-semibold outline-none focus:border-[#145DA0]"
        />
        <select
          value={filters.type}
          onChange={(event) => setFilters({ ...filters, type: event.target.value })}
          className="min-h-11 rounded-lg border border-[#E4D9CF] px-3 text-sm font-semibold outline-none focus:border-[#145DA0]"
        >
          <option value="">Tous les types</option>
          <option value="Abonnement">Abonnement</option>
          <option value="Renouvellement">Renouvellement</option>
        </select>
        <select
          value={filters.status}
          onChange={(event) => setFilters({ ...filters, status: event.target.value })}
          className="min-h-11 rounded-lg border border-[#E4D9CF] px-3 text-sm font-semibold outline-none focus:border-[#145DA0]"
        >
          <option value="">Tous les statuts</option>
          <option value="Payé">Payé</option>
          <option value="En attente">En attente</option>
        </select>
      </div>
      <AdminTable
        rows={filteredPayments}
        columns={[
          { key: "id", label: "Référence" },
          { key: "user", label: "Utilisateur" },
          { key: "type", label: "Type" },
          { key: "amount", label: "Montant" },
          { key: "provider", label: "Opérateur" },
          { key: "date", label: "Date" },
          { key: "status", label: "Statut", render: (row) => <StatusPill status={row.status} /> },
        ]}
        actions={() => (
          <div className="flex gap-2">
            <button className="rounded-lg border border-[#D7CABD] p-2 text-[#75695F]" title="Télécharger le reçu"><Download size={17} /></button>
          </div>
        )}
      />
    </div>
  );
}
