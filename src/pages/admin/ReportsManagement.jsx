import { CheckCircle, Eye, ShieldAlert } from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminTable, { StatusPill } from "../../components/admin/AdminTable";
import { adminReports } from "../../data/adminData";

export default function ReportsManagement() {
  return (
    <div>
      <AdminPageHeader title="Signalements" description="Traitement des abus, faux profils, conversations et contenus signalés par les utilisateurs." />
      <AdminTable
        rows={adminReports}
        columns={[
          { key: "id", label: "Référence" },
          { key: "user", label: "Signalé par" },
          { key: "reason", label: "Motif" },
          { key: "target", label: "Cible" },
          { key: "priority", label: "Priorité" },
          { key: "status", label: "Statut", render: (row) => <StatusPill status={row.status} /> },
        ]}
        actions={() => (
          <div className="flex gap-2">
            <button className="rounded-lg border border-[#D7CABD] p-2 text-[#102D42]" title="Voir"><Eye size={17} /></button>
            <button className="rounded-lg border border-[#F0C5C0] p-2 text-[#B42318]" title="Sanctionner"><ShieldAlert size={17} /></button>
            <button className="rounded-lg border border-[#BFE5C8] p-2 text-[#237847]" title="Résoudre"><CheckCircle size={17} /></button>
          </div>
        )}
      />
    </div>
  );
}
