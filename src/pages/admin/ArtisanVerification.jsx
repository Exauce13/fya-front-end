import { Check, Download, X } from "lucide-react";
import { useMemo, useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminTable, { StatusPill } from "../../components/admin/AdminTable";
import { adminVerifications } from "../../data/adminData";

export default function ArtisanVerification() {
  const [filters, setFilters] = useState({ q: "", status: "" });
  const filteredVerifications = useMemo(() => {
    return adminVerifications.filter((item) => {
      const query = filters.q.toLowerCase().trim();
      const matchQuery = query
        ? `${item.name} ${item.association} ${item.leader} ${item.trade} ${item.city}`.toLowerCase().includes(query)
        : true;
      const matchStatus = filters.status ? item.status === filters.status : true;
      return matchQuery && matchStatus;
    });
  }, [filters]);

  return (
    <div>
      <AdminPageHeader title="Vérifications" description="Contrôle des informations et documents CIP/diplôme transmis par les artisans." />
      <div className="mb-5 grid gap-3 rounded-lg border border-[#E8DED2] bg-white p-4 md:grid-cols-[1fr_200px]">
        <input
          value={filters.q}
          onChange={(event) => setFilters({ ...filters, q: event.target.value })}
          placeholder="Rechercher par artisan, association, dirigeant, métier..."
          className="min-h-11 rounded-lg border border-[#E4D9CF] px-3 text-sm font-semibold outline-none focus:border-[#145DA0]"
        />
        <select
          value={filters.status}
          onChange={(event) => setFilters({ ...filters, status: event.target.value })}
          className="min-h-11 rounded-lg border border-[#E4D9CF] px-3 text-sm font-semibold outline-none focus:border-[#145DA0]"
        >
          <option value="">Tous les statuts</option>
          <option value="En attente">En attente</option>
          <option value="Validé">Validé</option>
          <option value="Annulé">Annulé</option>
        </select>
      </div>
      <AdminTable
        rows={filteredVerifications}
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
          {
            key: "association",
            label: "Infos",
            render: (row) => (
              <div>
                <p className="font-black">{row.association}</p>
                <p className="text-xs text-[#75695F]">Dirigeant: {row.leader}</p>
                <p className="text-xs text-[#75695F]">Tél: {row.leaderPhone}</p>
              </div>
            ),
          },
          {
            key: "documents",
            label: "Documents",
            render: (row) => (
              <div className="flex flex-col gap-2">
                {row.documents.map((document) => (
                  <a
                    key={document.file}
                    href={`data:application/pdf,${encodeURIComponent(document.label)}`}
                    download={document.file}
                    className="inline-flex items-center gap-2 text-xs font-black text-[#145DA0] hover:underline"
                  >
                    <Download size={14} />
                    {document.label}
                  </a>
                ))}
              </div>
            ),
          },
          { key: "status", label: "Statut", render: (row) => <StatusPill status={row.status} /> },
        ]}
        actions={() => (
          <div className="flex gap-2">
            <button className="rounded-lg border border-[#BFE5C8] p-2 text-[#237847]" title="Valider"><Check size={17} /></button>
            <button className="rounded-lg border border-[#F0C5C0] p-2 text-[#B42318]" title="Annuler"><X size={17} /></button>
          </div>
        )}
      />
    </div>
  );
}
