import { Check, Download, X } from "lucide-react";
import { useEffect, useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminTable, { StatusPill } from "../../components/admin/AdminTable";
import { cancelAdminVerification, getAdminVerifications, validateAdminVerification } from "../../services/adminService";
import { getApiMessage, getPaginatedItems, getStorageUrl } from "../../services/apiClient";

const normalizeStatus = (status = "") => {
  const value = String(status).toLowerCase();
  if (["valide", "validé", "validated", "certified"].includes(value)) return "Validé";
  if (["annule", "annulé", "cancelled", "canceled"].includes(value)) return "Annulé";
  return "En attente";
};

const normalizeVerification = (item) => ({
  id: item.id || item.artisan_id,
  name: item.name || item.user?.name || item.artisan?.user?.name || "Artisan",
  association: item.association || item.nom_association || item.artisan?.nom_association || "",
  leader: item.leader || item.dirigeant || item.nom_dirigeant || item.nom_prenoms_dirigeant || "",
  leaderPhone: item.leaderPhone || item.telephone_association || item.telephone_dirigeant || "",
  trade: item.trade || item.metier?.nom || item.artisan?.metier?.nom || "",
  city: item.city || item.user?.ville || item.artisan?.user?.ville || "",
  documents: item.documents || [
    item.piece_identites || item.artisan?.piece_identites
      ? { label: "CIP", url: getStorageUrl(item.piece_identites || item.artisan?.piece_identites), file: "cip.pdf" }
      : null,
    item.diplome || item.artisan?.diplome
      ? { label: "Diplôme", url: getStorageUrl(item.diplome || item.artisan?.diplome), file: "diplome.pdf" }
      : null,
  ].filter(Boolean),
  status: normalizeStatus(item.status || item.raw_status || item.verification_status || item.statut_verification),
  avatar: getStorageUrl(item.avatar || item.user?.photo || item.artisan?.user?.photo),
});

export default function ArtisanVerification() {
  const [filters, setFilters] = useState({ q: "", status: "" });
  const [verifications, setVerifications] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadVerifications() {
      try {
        const payload = await getAdminVerifications(filters);
        if (active) {
          setVerifications(getPaginatedItems(payload).map(normalizeVerification));
          setMessage("");
        }
      } catch (error) {
        if (active) {
          setVerifications([]);
          setMessage(getApiMessage(error, "Impossible de charger les vérifications."));
        }
      }
    }

    loadVerifications();

    return () => {
      active = false;
    };
  }, [filters]);

  const updateVerification = async (row, action) => {
    try {
      await (action === "validate" ? validateAdminVerification(row.id) : cancelAdminVerification(row.id));
      setVerifications((current) =>
        current.map((item) =>
          item.id === row.id ? { ...item, status: action === "validate" ? "Validé" : "En attente" } : item
        )
      );
    } catch (error) {
      alert(getApiMessage(error, "Impossible de mettre à jour la vérification."));
    }
  };

  return (
    <div>
      <AdminPageHeader title="Vérifications" description="Contrôle des informations et documents CIP/diplôme transmis par les artisans." />
      {message && <p className="mb-4 rounded-lg border border-[#F0C5C0] bg-white p-4 text-sm font-bold text-[#B42318]">{message}</p>}
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
        </select>
      </div>
      <AdminTable
        rows={verifications}
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
                    href={document.url || document.href}
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
        actions={(row) => (
          <div className="flex gap-2">
            {row.status === "Validé" ? (
              <button
                onClick={() => updateVerification(row, "cancel")}
                className="inline-flex items-center gap-2 rounded-lg border border-[#F0C5C0] px-3 py-2 text-xs font-black text-[#B42318]"
                title="Retirer la certification"
              >
                <X size={16} />
                Retirer
              </button>
            ) : (
              <button
                onClick={() => updateVerification(row, "validate")}
                className="inline-flex items-center gap-2 rounded-lg border border-[#BFE5C8] px-3 py-2 text-xs font-black text-[#237847]"
                title="Valider la certification"
              >
                <Check size={16} />
                Valider
              </button>
            )}
          </div>
        )}
      />
    </div>
  );
}
