import { Ban, Eye, RotateCcw } from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminTable, { StatusPill } from "../../components/admin/AdminTable";
import { adminUsers } from "../../data/adminData";

export default function UsersManagement() {
  return (
    <div>
      <AdminPageHeader
        title="Utilisateurs"
        description="Suivi des visiteurs inscrits, clients, artisans et comptes placés sous surveillance."
      />
      <AdminTable
        rows={adminUsers}
        columns={[
          {
            key: "name",
            label: "Utilisateur",
            render: (row) => (
              <div className="flex items-center gap-3">
                <img src={row.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
                <div>
                  <p className="font-black">{row.name}</p>
                  <p className="text-xs text-[#75695F]">{row.id}</p>
                </div>
              </div>
            ),
          },
          { key: "role", label: "Rôle" },
          { key: "city", label: "Ville" },
          { key: "joined", label: "Inscription" },
          { key: "status", label: "Statut", render: (row) => <StatusPill status={row.status} /> },
        ]}
        actions={() => (
          <div className="flex gap-2">
            <button className="rounded-lg border border-[#D7CABD] p-2 text-[#102D42]" title="Voir le compte"><Eye size={17} /></button>
            <button className="rounded-lg border border-[#D7CABD] p-2 text-[#A15C00]" title="Réinitialiser"><RotateCcw size={17} /></button>
            <button className="rounded-lg border border-[#F0C5C0] p-2 text-[#B42318]" title="Suspendre"><Ban size={17} /></button>
          </div>
        )}
      />
    </div>
  );
}
