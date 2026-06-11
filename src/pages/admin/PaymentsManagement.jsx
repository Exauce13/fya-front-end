import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminTable, { StatusPill } from "../../components/admin/AdminTable";
import { downloadAdminPaymentReceipt, exportAdminPayments, getAdminPayments } from "../../services/adminService";
import { getApiMessage, getPaginatedItems } from "../../services/apiClient";

const normalizePayment = (payment) => ({
  id: payment.id || payment.reference,
  user: payment.user?.name || payment.utilisateur?.name || payment.user_name || payment.user || "",
  type: payment.type || "Abonnement",
  amount: payment.amount ? `${Number(payment.amount).toLocaleString("fr-FR")} FCFA` : "",
  provider: payment.provider || payment.operateur || "FedaPay",
  status: payment.status || payment.statut || "En attente",
  date: payment.date || (payment.created_at ? new Date(payment.created_at).toLocaleDateString("fr-FR") : ""),
});

export default function PaymentsManagement() {
  const [filters, setFilters] = useState({ q: "", type: "", status: "" });
  const [payments, setPayments] = useState([]);
  const [message, setMessage] = useState("");

  const exportPayments = async () => {
    try {
      await exportAdminPayments(filters);
    } catch (error) {
      alert(getApiMessage(error, "Impossible d'exporter les paiements."));
    }
  };

  const downloadReceipt = async (payment) => {
    try {
      await downloadAdminPaymentReceipt(payment.id);
    } catch (error) {
      alert(getApiMessage(error, "Impossible de télécharger le reçu."));
    }
  };

  useEffect(() => {
    let active = true;

    async function loadPayments() {
      try {
        const payload = await getAdminPayments(filters);
        if (active) {
          setPayments(getPaginatedItems(payload).map(normalizePayment));
          setMessage("");
        }
      } catch (error) {
        if (active) {
          setPayments([]);
          setMessage(getApiMessage(error, "Impossible de charger les paiements."));
        }
      }
    }

    loadPayments();

    return () => {
      active = false;
    };
  }, [filters]);

  return (
    <div>
      <AdminPageHeader
        title="Paiements"
        description="Suivi des abonnements et renouvellements payés via FedaPay."
        action={<button onClick={exportPayments} className="rounded-lg bg-[#D96822] px-5 py-3 text-sm font-black text-white">Exporter</button>}
      />
      {message && <p className="mb-4 rounded-lg border border-[#F0C5C0] bg-white p-4 text-sm font-bold text-[#B42318]">{message}</p>}
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
        rows={payments}
        columns={[
          { key: "id", label: "Référence" },
          { key: "user", label: "Utilisateur" },
          { key: "type", label: "Type" },
          { key: "amount", label: "Montant" },
          { key: "provider", label: "Opérateur" },
          { key: "date", label: "Date" },
          { key: "status", label: "Statut", render: (row) => <StatusPill status={row.status} /> },
        ]}
        actions={(row) => (
          <div className="flex gap-2">
            <button onClick={() => downloadReceipt(row)} className="rounded-lg border border-[#D7CABD] p-2 text-[#75695F]" title="Télécharger le reçu"><Download size={17} /></button>
          </div>
        )}
      />
    </div>
  );
}
