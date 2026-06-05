import { Check, FileSearch, X } from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminTable, { StatusPill } from "../../components/admin/AdminTable";
import { adminVerifications } from "../../data/adminData";

export default function ArtisanVerification() {
  return (
    <div>
      <AdminPageHeader title="Artisans vérifiés" description="Contrôle des dossiers, pièces justificatives et demandes de badge vérifié." />
      <AdminTable
        rows={adminVerifications}
        columns={[
          {
            key: "name",
            label: "Artisan",
            render: (row) => (
              <div className="flex items-center gap-3">
                <img src={row.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
                <div>
                  <p className="font-black">{row.name}</p>
                  <p className="text-xs text-[#75695F]">{row.trade}</p>
                </div>
              </div>
            ),
          },
          { key: "city", label: "Ville" },
          { key: "documents", label: "Documents" },
          { key: "status", label: "Statut", render: (row) => <StatusPill status={row.status} /> },
        ]}
        actions={() => (
          <div className="flex gap-2">
            <button className="rounded-lg border border-[#D7CABD] p-2 text-[#102D42]" title="Consulter"><FileSearch size={17} /></button>
            <button className="rounded-lg border border-[#BFE5C8] p-2 text-[#237847]" title="Valider"><Check size={17} /></button>
            <button className="rounded-lg border border-[#F0C5C0] p-2 text-[#B42318]" title="Refuser"><X size={17} /></button>
          </div>
        )}
      />
    </div>
  );
}
