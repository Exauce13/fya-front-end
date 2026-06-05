import { Eye, Lock, Trash2 } from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminTable, { StatusPill } from "../../components/admin/AdminTable";
import { adminOffers } from "../../data/adminData";

export default function OffersModeration() {
  return (
    <div>
      <AdminPageHeader title="Appels d'offres" description="Modération des appels publiés, suivi des budgets, propositions et clôtures." />
      <AdminTable
        rows={adminOffers}
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
            <button className="rounded-lg border border-[#D7CABD] p-2 text-[#75695F]" title="Clôturer"><Lock size={17} /></button>
            <button className="rounded-lg border border-[#F0C5C0] p-2 text-[#B42318]" title="Supprimer"><Trash2 size={17} /></button>
          </div>
        )}
      />
    </div>
  );
}
