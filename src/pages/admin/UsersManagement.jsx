import { Ban, Eye } from "lucide-react";
import { useMemo, useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminTable, { StatusPill } from "../../components/admin/AdminTable";
import { adminUsers } from "../../data/adminData";

export default function UsersManagement() {
  const [filters, setFilters] = useState({ q: "", role: "", status: "" });
  const filteredUsers = useMemo(() => {
    return adminUsers.filter((user) => {
      const query = filters.q.toLowerCase().trim();
      const matchQuery = query ? `${user.name} ${user.city} ${user.id}`.toLowerCase().includes(query) : true;
      const matchRole = filters.role ? user.role === filters.role : true;
      const matchStatus = filters.status ? user.status === filters.status : true;
      return matchQuery && matchRole && matchStatus;
    });
  }, [filters]);

  return (
    <div>
      <AdminPageHeader
        title="Utilisateurs"
        description="Suivi des comptes actifs ou suspendus."
      />
      <Filters filters={filters} onChange={setFilters} />
      <AdminTable
        rows={filteredUsers}
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
            <button className="rounded-lg border border-[#F0C5C0] p-2 text-[#B42318]" title="Suspendre"><Ban size={17} /></button>
          </div>
        )}
      />
    </div>
  );
}

function Filters({ filters, onChange }) {
  return (
    <div className="mb-5 grid gap-3 rounded-lg border border-[#E8DED2] bg-white p-4 md:grid-cols-[1fr_180px_180px]">
      <input
        value={filters.q}
        onChange={(event) => onChange({ ...filters, q: event.target.value })}
        placeholder="Rechercher par nom, ville ou référence..."
        className="min-h-11 rounded-lg border border-[#E4D9CF] px-3 text-sm font-semibold outline-none focus:border-[#145DA0]"
      />
      <select
        value={filters.role}
        onChange={(event) => onChange({ ...filters, role: event.target.value })}
        className="min-h-11 rounded-lg border border-[#E4D9CF] px-3 text-sm font-semibold outline-none focus:border-[#145DA0]"
      >
        <option value="">Tous les rôles</option>
        <option value="Artisan">Artisan</option>
        <option value="Client">Client</option>
      </select>
      <select
        value={filters.status}
        onChange={(event) => onChange({ ...filters, status: event.target.value })}
        className="min-h-11 rounded-lg border border-[#E4D9CF] px-3 text-sm font-semibold outline-none focus:border-[#145DA0]"
      >
        <option value="">Tous les statuts</option>
        <option value="Actif">Actif</option>
        <option value="Suspendu">Suspendu</option>
      </select>
    </div>
  );
}
