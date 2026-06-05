import { serviceCategories } from "./serviceCategories";

export const adminOverview = {
  users: "12 458",
  artisans: "3 245",
  visitors: "1 245",
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
  { id: "USR-4814", name: "John Doe", role: "Client", city: "Cotonou", status: "Surveillance", joined: "24 févr. 2026", avatar: "https://i.pravatar.cc/160?img=3" },
  { id: "USR-4815", name: "Yao M.", role: "Artisan", city: "Abomey-Calavi", status: "Suspendu", joined: "03 mars 2026", avatar: "https://images.unsplash.com/photo-1618077360395-f3068be8e001?auto=format&fit=crop&w=160&q=80" },
];

export const adminVerifications = [
  { id: "VER-203", name: "Moudjibou K.", trade: "Tapisserie", city: "Cotonou", documents: "CNI, atelier, références", status: "En attente", avatar: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=160&q=80" },
  { id: "VER-204", name: "Arnaud S.", trade: "Électricité", city: "Abomey-Calavi", documents: "CNI, diplôme, facture", status: "A revoir", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&q=80" },
  { id: "VER-205", name: "Grace C.", trade: "Couture", city: "Porto-Novo", documents: "CNI, atelier, portfolio", status: "Validé", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&q=80" },
];

export const adminOffers = [
  { id: "OFF-1208", title: "Construction d'une clôture", category: "Maçonnerie", owner: "John Doe", budget: "850 000 FCFA", proposals: 5, status: "Ouvert", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=320&q=80" },
  { id: "OFF-1209", title: "Réhabilitation plomberie maison", category: "Plomberie", owner: "Awa S.", budget: "220 000 FCFA", proposals: 3, status: "Ouvert", image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=320&q=80" },
  { id: "OFF-1210", title: "Installation électrique complète", category: "Électricité", owner: "Daniel K.", budget: "500 000 FCFA", proposals: 7, status: "Terminé", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=320&q=80" },
];

export const adminReports = [
  { id: "REP-331", user: "User #2317", reason: "Annonce inappropriée", target: "Publication #882", priority: "Haute", status: "Nouveau" },
  { id: "REP-332", user: "User #2136", reason: "Faux profil", target: "Artisan Yao M.", priority: "Moyenne", status: "En cours" },
  { id: "REP-333", user: "User #1805", reason: "Comportement abusif", target: "Conversation #118", priority: "Haute", status: "Nouveau" },
];

export const adminPayments = [
  { id: "PAY-908", user: "Hervé A.", label: "Commission prestation", amount: "45 000 FCFA", method: "Mobile Money", status: "Payé" },
  { id: "PAY-909", user: "Grace C.", label: "Mise en avant profil", amount: "12 000 FCFA", method: "Carte", status: "Payé" },
  { id: "PAY-910", user: "Yao M.", label: "Commission prestation", amount: "38 500 FCFA", method: "Mobile Money", status: "En attente" },
];

export const adminPosts = [
  { id: "POST-778", author: "Hervé A.", type: "Publication", title: "Meuble TV sur mesure", status: "Publié", reports: 0 },
  { id: "POST-779", author: "Grace C.", type: "Réalisation", title: "Uniformes scolaires", status: "Publié", reports: 1 },
  { id: "POST-780", author: "Arnaud S.", type: "Commentaire", title: "Avis client contesté", status: "Masqué", reports: 3 },
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
