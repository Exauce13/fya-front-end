import { serviceCategories } from "./serviceCategories";

export const adminOverview = {
  users: "12 458",
  artisans: "3 245",
  turnover: "8 750 000",
  support: {
    name: "Admin FYA",
    role: "Administrateur",
    scope: "Equipe technique",
    avatar: "https://i.pravatar.cc/160?img=12",
  },
};

export const adminUsers = [
  { id: "USR-4812", name: "Hervé A.", role: "Artisan", city: "Cotonou", status: "Actif", joined: "12 janv. 2026", avatar: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=160&q=80" },
  { id: "USR-4813", name: "Grace C.", role: "Artisan", city: "Porto-Novo", status: "Actif", joined: "18 janv. 2026", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&q=80" },
  { id: "USR-4814", name: "John Doe", role: "Client", city: "Cotonou", status: "Actif", joined: "24 févr. 2026", avatar: "https://i.pravatar.cc/160?img=3" },
  { id: "USR-4815", name: "Yao M.", role: "Artisan", city: "Abomey-Calavi", status: "Suspendu", joined: "03 mars 2026", avatar: "https://images.unsplash.com/photo-1618077360395-f3068be8e001?auto=format&fit=crop&w=160&q=80" },
];

export const adminVerifications = [
  {
    id: "VER-203",
    name: "Moudjibou K.",
    association: "Association MK Tapisserie",
    leader: "Moudjibou K.",
    leaderPhone: "0197456321",
    trade: "Tapisserie",
    city: "Cotonou",
    documents: [
      { label: "CIP", file: "cip-moudjibou-k.pdf" },
      { label: "Diplôme", file: "diplome-moudjibou-k.pdf" },
    ],
    status: "En attente",
    avatar: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: "VER-204",
    name: "Arnaud S.",
    association: "Association Electriciens Godomey",
    leader: "Arnaud S.",
    leaderPhone: "0165987421",
    trade: "Électricité",
    city: "Abomey-Calavi",
    documents: [
      { label: "CIP", file: "cip-arnaud-s.pdf" },
      { label: "Diplôme", file: "diplome-arnaud-s.pdf" },
    ],
    status: "En attente",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: "VER-205",
    name: "Grace C.",
    association: "Maison Grace Couture",
    leader: "Grace C.",
    leaderPhone: "0198124503",
    trade: "Couture",
    city: "Porto-Novo",
    documents: [
      { label: "CIP", file: "cip-grace-c.pdf" },
      { label: "Diplôme", file: "diplome-grace-c.pdf" },
    ],
    status: "Validé",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&q=80",
  },
];

export const adminOffers = [
  { id: "OFF-1208", title: "Construction d'une clôture", category: "Maçonnerie", owner: "John Doe", budget: "850 000 FCFA", proposals: 5, status: "Ouvert", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=320&q=80" },
  { id: "OFF-1209", title: "Réhabilitation plomberie maison", category: "Plomberie", owner: "Awa S.", budget: "220 000 FCFA", proposals: 3, status: "Ouvert", image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=320&q=80" },
  { id: "OFF-1210", title: "Installation électrique complète", category: "Électricité", owner: "Daniel K.", budget: "500 000 FCFA", proposals: 7, status: "Terminé", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=320&q=80" },
];

export const adminReports = [
  { id: "REP-331", user: "John Doe", target: "Artisan Yao M.", reason: "Faux profil", description: "Les informations affichées ne semblent pas correspondre à l'artisan.", status: "En attente" },
  { id: "REP-332", user: "Grace C.", target: "Client Serge K.", reason: "Comportement abusif", description: "Messages insistants après refus du devis.", status: "Traité" },
  { id: "REP-333", user: "Afi D.", target: "Conversation #118", reason: "Litige sur service", description: "Le service marqué terminé ne correspond pas au devis validé.", status: "En attente" },
];

export const adminPayments = [
  { id: "PAY-908", user: "Hervé A.", type: "Abonnement", amount: "1 000 FCFA", provider: "FedaPay", status: "Payé", date: "10 mai 2026" },
  { id: "PAY-909", user: "Grace C.", type: "Renouvellement", amount: "500 FCFA", provider: "FedaPay", status: "Payé", date: "18 mai 2026" },
  { id: "PAY-910", user: "Yao M.", type: "Abonnement", amount: "1 000 FCFA", provider: "FedaPay", status: "En attente", date: "02 juin 2026" },
];

export const adminRegistrationSeries = [
  { month: "Jan", value: 120 },
  { month: "Fév", value: 180 },
  { month: "Mar", value: 380 },
  { month: "Avr", value: 260 },
  { month: "Mai", value: 480 },
  { month: "Juin", value: 590 },
  { month: "Juil", value: 420 },
  { month: "Août", value: 560 },
  { month: "Sep", value: 760 },
];

export const adminCityShare = [
  { city: "Cotonou", value: 34, color: "#1D6FA5" },
  { city: "Porto-Novo", value: 21, color: "#17445F" },
  { city: "Abomey-Calavi", value: 28, color: "#E4A33D" },
  { city: "Autres", value: 17, color: "#C9553D" },
];

export const adminCategories = serviceCategories.map((category, index) => ({
  name: category,
  artisans: 80 + index * 17,
  offers: 14 + index * 3,
}));
