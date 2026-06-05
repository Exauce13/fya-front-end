export const myOffersSeed = [
  {
    id: 1,
    title: "Construction d'une étagère",
    category: "Menuiserie",
    location: "Cotonou",
    budget: "500 000 FCFA",
    proposals: 5,
    publishedAgo: "2 jours",
    status: "open",
    description: "Fabrication et pose d'une étagère sur mesure.",
    owner: true,
    photos: [],
    applicants: [
      { name: "Hervé A.", trade: "Menuisier", city: "Cotonou", rating: "4.8" },
      { name: "Arnaud S.", trade: "Menuisier agenceur", city: "Abomey-Calavi", rating: "4.6" },
      { name: "Boris T.", trade: "Ebéniste", city: "Cotonou", rating: "4.7" },
    ],
  },
  {
    id: 2,
    title: "Réhabilitation plomberie maison",
    category: "Plomberie",
    location: "Abomey-Calavi",
    budget: "220 000 FCFA",
    proposals: 2,
    publishedAgo: "1 jour",
    status: "open",
    description: "Révision complète de la plomberie d'une maison.",
    owner: true,
    photos: [],
    applicants: [
      { name: "Yao M.", trade: "Plombier", city: "Cotonou", rating: "4.6" },
      { name: "Didier K.", trade: "Plombier sanitaire", city: "Abomey-Calavi", rating: "4.5" },
    ],
  },
];

const STORAGE_KEY = "fya_my_offers";

export function readStoredOffers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveStoredOffer(offer) {
  const current = readStoredOffers();
  const exists = current.some((item) => item.id === offer.id);
  const next = exists
    ? current.map((item) => (item.id === offer.id ? offer : item))
    : [offer, ...current];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
