import { Eye, EyeOff, Trash2 } from "lucide-react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminTable, { StatusPill } from "../../components/admin/AdminTable";
import { adminPosts } from "../../data/adminData";

export default function PostsModeration() {
  return (
    <div>
      <AdminPageHeader title="Contenus" description="Modération des publications, réalisations, commentaires et médias partagés sur FYA." />
      <AdminTable
        rows={adminPosts}
        columns={[
          { key: "id", label: "Référence" },
          { key: "author", label: "Auteur" },
          { key: "type", label: "Type" },
          { key: "title", label: "Contenu" },
          { key: "reports", label: "Signalements" },
          { key: "status", label: "Statut", render: (row) => <StatusPill status={row.status} /> },
        ]}
        actions={() => (
          <div className="flex gap-2">
            <button className="rounded-lg border border-[#D7CABD] p-2 text-[#102D42]" title="Voir"><Eye size={17} /></button>
            <button className="rounded-lg border border-[#D7CABD] p-2 text-[#75695F]" title="Masquer"><EyeOff size={17} /></button>
            <button className="rounded-lg border border-[#F0C5C0] p-2 text-[#B42318]" title="Supprimer"><Trash2 size={17} /></button>
          </div>
        )}
      />
    </div>
  );
}
