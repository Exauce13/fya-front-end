import { Download, Receipt, RotateCcw } from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminTable, { StatusPill } from "../../components/admin/AdminTable";
import { adminPayments } from "../../data/adminData";

export default function PaymentsManagement() {
  return (
    <div>
      <AdminPageHeader
        title="Paiements"
        description="Suivi des transactions, commissions, mises en avant et paiements en attente."
        action={<button className="rounded-lg bg-[#D96822] px-5 py-3 text-sm font-black text-white">Exporter</button>}
      />
      <AdminTable
        rows={adminPayments}
        columns={[
          { key: "id", label: "Référence" },
          { key: "user", label: "Utilisateur" },
          { key: "label", label: "Libellé" },
          { key: "amount", label: "Montant" },
          { key: "method", label: "Méthode" },
          { key: "status", label: "Statut", render: (row) => <StatusPill status={row.status} /> },
        ]}
        actions={() => (
          <div className="flex gap-2">
            <button className="rounded-lg border border-[#D7CABD] p-2 text-[#102D42]" title="Reçu"><Receipt size={17} /></button>
            <button className="rounded-lg border border-[#D7CABD] p-2 text-[#75695F]" title="Télécharger"><Download size={17} /></button>
            <button className="rounded-lg border border-[#F0C5C0] p-2 text-[#B42318]" title="Rembourser"><RotateCcw size={17} /></button>
          </div>
        )}
      />
    </div>
  );
}
