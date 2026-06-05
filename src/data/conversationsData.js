export const conversations = [
  {
    id: 1,
    name: "Hervé A.",
    avatar: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=200&q=80",
    service: "Construction étagère",
    time: "14:48",
  },
  {
    id: 2,
    name: "Yao M.",
    avatar: "https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&w=200&q=80",
    service: "Réhabilitation plomberie",
    time: "10:10",
  },
  {
    id: 3,
    name: "Arnaud S.",
    avatar: "https://images.unsplash.com/photo-1601055283742-8b27e81b5553?auto=format&fit=crop&w=200&q=80",
    service: "Installation électrique",
    time: "21:14",
  },
  {
    id: 4,
    name: "Grace C.",
    avatar: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&w=200&q=80",
    service: "Confection de rideaux",
    time: "13:31",
  },
];

export const initialMessages = {
  1: [
    { id: 1, sender: "them", text: "Bonjour Koffi, merci pour votre confiance.", time: "10:28", images: [] },
    {
      id: 2,
      sender: "them",
      text: "J'ai bien compris votre projet. Voici quelques photos de références similaires.",
      time: "10:34",
      images: [
        { name: "reference-1", src: "https://images.unsplash.com/photo-1595514535215-51a0789f1613?auto=format&fit=crop&w=500&q=80" },
        { name: "reference-2", src: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&w=500&q=80" },
        { name: "reference-3", src: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=500&q=80" },
      ],
    },
    { id: 3, sender: "me", text: "Super travail ! Quel serait le délai ?", time: "10:45", images: [] },
    { id: 4, sender: "them", text: "7 jours après validation du devis.", time: "10:50", images: [] },
  ],
  2: [
    { id: 1, sender: "them", text: "Je peux passer voir l'installation demain matin.", time: "09:20", images: [] },
  ],
  3: [
    { id: 1, sender: "them", text: "Merci pour les détails, je prépare une estimation.", time: "21:14", images: [] },
  ],
  4: [
    { id: 1, sender: "them", text: "Les mesures sont bien reçues.", time: "13:31", images: [] },
  ],
};

export const initialConversationServices = {
  1: [
    {
      id: "service-1",
      title: "Construction clôture",
      description: "Réalisation d'une clôture solide avec finition propre et nettoyage du chantier.",
      amount: "750 000",
      duration: "7 jours",
      status: "pending",
      createdAt: "12/04/2026",
      acceptedAt: "",
      completedAt: "",
      artisanReview: null,
      clientReview: null,
    },
  ],
  2: [],
  3: [],
  4: [
    {
      id: "service-4",
      title: "Confection de rideaux",
      description: "Confection et pose de rideaux pour salon et chambres.",
      amount: "120 000",
      duration: "5 jours",
      status: "completed",
      createdAt: "08/04/2026",
      acceptedAt: "10/04/2026",
      completedAt: "25/04/2026",
      artisanReview: null,
      clientReview: null,
    },
  ],
};
