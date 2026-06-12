import { CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminTable, { StatusPill } from "../../components/admin/AdminTable";
import { getAdminReports, ignoreAdminReport, markAdminReportAsTreated } from "../../services/adminService";
import { getApiMessage, getPaginatedItems } from "../../services/apiClient";

const getUserName = (...values) => {
  for (const value of values) {
    if (!value) continue;
    if (typeof value === "string" && value.trim() && value.trim().toLowerCase() !== "utilisateur") {
      return value;
    }
    if (typeof value === "object") {
      const name = value.name || value.nom || value.full_name || value.email;
      if (name) return name;
    }
  }

  return "Utilisateur";
};

const normalizeReport = (report) => ({
  id: report.id || report.reference,
  user: getUserName(
    report.plaignant,
    report.signale_par,
    report.signalePar,
    report.reported_by,
    report.auteur,
    report.user,
    report.plaignant_name,
    report.signalement_par
  ),
  target: getUserName(
    report.mise_en_cause,
    report.miseEnCause,
    report.cible_user,
    report.cibleUser,
    report.cible,
    report.target
  ),
  reason: report.reason || report.motif || "",
  description: report.description || "",
  status: report.status || report.statut_plainte || report.statut || "En attente",
});

export default function ReportsManagement() {
  const [filters, setFilters] = useState({ q: "", status: "" });
  const [reports, setReports] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadReports() {
      try {
        const payload = await getAdminReports(filters);
        if (active) {
          setReports(getPaginatedItems(payload).map(normalizeReport));
          setMessage("");
        }
      } catch (error) {
        if (active) {
          setReports([]);
          setMessage(getApiMessage(error, "Impossible de charger les signalements."));
        }
      }
    }

    loadReports();

    return () => {
      active = false;
    };
  }, [filters]);

  const updateReport = async (row, action) => {
    try {
      await (action === "treated" ? markAdminReportAsTreated(row.id) : ignoreAdminReport(row.id));
      setReports((current) =>
        current.map((item) => (item.id === row.id ? { ...item, status: action === "treated" ? "Traité" : "Ignoré" } : item))
      );
    } catch (error) {
      alert(getApiMessage(error, "Impossible de mettre à jour le signalement."));
    }
  };

  return (
    <div>
      <AdminPageHeader title="Signalements" description="Traitement des signalements liés aux utilisateurs et conversations." />
      {message && <p className="mb-4 rounded-lg border border-[#F0C5C0] bg-white p-4 text-sm font-bold text-[#B42318]">{message}</p>}
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
        rows={reports}
        columns={[
          { key: "id", label: "Référence" },
          { key: "user", label: "Signalé par" },
          { key: "target", label: "Cible" },
          { key: "reason", label: "Motif" },
          { key: "description", label: "Description" },
          { key: "status", label: "Statut", render: (row) => <StatusPill status={row.status} /> },
        ]}
        actions={(row) => (
          <div className="flex gap-2">
            <button onClick={() => updateReport(row, "ignored")} className="rounded-lg border border-[#F0C5C0] p-2 text-[#B42318]" title="Ignoré"><XCircle size={17} /></button>
            <button onClick={() => updateReport(row, "treated")} className="rounded-lg border border-[#BFE5C8] p-2 text-[#237847]" title="Traité"><CheckCircle size={17} /></button>
          </div>
        )}
      />
    </div>
  );
}
