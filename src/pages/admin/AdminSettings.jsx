import AdminPageHeader from "../../components/admin/AdminPageHeader";

const settings = [
  { title: "Validation artisan", description: "Exiger CNI, photo d'atelier et justificatif de métier avant badge vérifié.", enabled: true },
  { title: "Modération automatique", description: "Placer en revue les contenus contenant des mots sensibles.", enabled: true },
  { title: "Publication visiteur", description: "Rediriger toute action visiteur vers la connexion.", enabled: true },
  { title: "Paiements manuels", description: "Autoriser la validation manuelle des transactions Mobile Money.", enabled: false },
];

export default function AdminSettings() {
  return (
    <div>
      <AdminPageHeader title="Paramètres" description="Règles temporaires de gestion en attendant le branchement au backend Laravel." />
      <div className="grid gap-4 lg:grid-cols-2">
        {settings.map((setting) => (
          <article key={setting.title} className="rounded-lg border border-[#E8DED2] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-black">{setting.title}</h2>
                <p className="mt-2 text-sm font-semibold text-[#75695F]">{setting.description}</p>
              </div>
              <button
                type="button"
                className={`relative h-7 w-12 rounded-full transition ${setting.enabled ? "bg-[#1F5B87]" : "bg-[#D7CABD]"}`}
                aria-label={setting.title}
              >
                <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${setting.enabled ? "left-6" : "left-1"}`} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
