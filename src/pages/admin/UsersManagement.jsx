import { Ban, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminTable, { StatusPill } from "../../components/admin/AdminTable";
import { activateAdminUser, getAdminUsers, suspendAdminUser } from "../../services/adminService";
import { getApiMessage, getPaginatedItems, getStorageUrl } from "../../services/apiClient";

const normalizeUser = (user) => ({
  id: user.id || user.reference,
  name: user.name || user.nom || "Utilisateur",
  role: user.role || user.statut || "Client",
  city: user.city || user.ville || "",
  status: user.status || user.statut_compte || user.account_status || "Actif",
  joined: user.joined || (user.created_at ? new Date(user.created_at).toLocaleDateString("fr-FR") : ""),
  avatar: getStorageUrl(user.avatar || user.photo),
});

export default function UsersManagement() {
  const [filters, setFilters] = useState({ q: "", role: "", status: "" });
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadUsers() {
      try {
        const payload = await getAdminUsers(filters);
        if (active) {
          setUsers(getPaginatedItems(payload).map(normalizeUser));
          setMessage("");
        }
      } catch (error) {
        if (active) {
          setUsers([]);
          setMessage(getApiMessage(error, "Impossible de charger les utilisateurs."));
        }
      }
    }

    loadUsers();

    return () => {
      active = false;
    };
  }, [filters]);

  const toggleStatus = async (user) => {
    const suspended = String(user.status).toLowerCase().includes("suspend");
    try {
      await (suspended ? activateAdminUser(user.id) : suspendAdminUser(user.id));
      setUsers((current) =>
        current.map((item) =>
          item.id === user.id ? { ...item, status: suspended ? "Actif" : "Suspendu" } : item
        )
      );
    } catch (error) {
      alert(getApiMessage(error, "Action impossible sur cet utilisateur."));
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Utilisateurs"
        description="Suivi des comptes actifs ou suspendus."
      />
      {message && <p className="mb-4 rounded-lg border border-[#F0C5C0] bg-white p-4 text-sm font-bold text-[#B42318]">{message}</p>}
      <Filters filters={filters} onChange={setFilters} />
      <AdminTable
        rows={users}
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
        actions={(row) => (
          <div className="flex gap-2">
            <button className="rounded-lg border border-[#D7CABD] p-2 text-[#102D42]" title="Voir le compte"><Eye size={17} /></button>
            <button onClick={() => toggleStatus(row)} className="rounded-lg border border-[#F0C5C0] p-2 text-[#B42318]" title="Suspendre"><Ban size={17} /></button>
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
