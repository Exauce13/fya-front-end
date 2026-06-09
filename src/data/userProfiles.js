import { artisans } from "../components/home/homeData";

const clients = [
  {
    slug: "john-doe",
    name: "John Doe",
    role: "Client",
    city: "Cotonou",
    district: "Fidjrossè",
    avatar: "https://i.pravatar.cc/150?img=3",
    rating: "4.7/5",
    reviews: 2,
    offers: 8,
    bio: "Client actif sur FYA, habitué aux projets d'aménagement et de rénovation.",
  },
  {
    slug: "afi-d",
    name: "Afi D.",
    role: "Client",
    city: "Cotonou",
    district: "Haie Vive",
    avatar: "https://i.pravatar.cc/120?img=32",
    rating: "5.0/5",
    reviews: 1,
    offers: 3,
    bio: "Cliente recherchant des prestations soignées et bien suivies.",
  },
  {
    slug: "serge-k",
    name: "Serge K.",
    role: "Client",
    city: "Porto-Novo",
    district: "Jéricho",
    avatar: "https://i.pravatar.cc/120?img=11",
    rating: "4.8/5",
    reviews: 1,
    offers: 5,
    bio: "Client avec plusieurs demandes de travaux résidentiels.",
  },
  {
    slug: "mireille-t",
    name: "Mireille T.",
    role: "Client",
    city: "Abomey-Calavi",
    district: "Godomey",
    avatar: "https://i.pravatar.cc/120?img=25",
    rating: "4.7/5",
    reviews: 1,
    offers: 4,
    bio: "Cliente intéressée par les services de réparation et d'entretien.",
  },
];

const normalize = (value) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const cleanDisplayName = (name) => {
  const normalizedName = normalize(name);
  const artisan = artisans.find((item) => normalizedName.startsWith(normalize(item.name)));
  const client = clients.find((item) => normalizedName.startsWith(normalize(item.name)));

  return artisan?.name || client?.name || name;
};

export const findUserProfile = (name) => {
  const normalizedName = normalize(name);
  const artisan = artisans.find((item) => normalizedName.startsWith(normalize(item.name)));
  if (artisan) {
    return {
      type: "artisan",
      name: artisan.name,
      avatar: artisan.image,
      path: `/artisans/${artisan.slug}`,
      data: artisan,
    };
  }

  const client = clients.find((item) => normalizedName.startsWith(normalize(item.name)));
  if (client) {
    return {
      type: "client",
      name: client.name,
      avatar: client.avatar,
      path: `/clients/${client.slug}`,
      data: client,
    };
  }

  return {
    type: null,
    name: cleanDisplayName(name),
    avatar: null,
    path: null,
    data: null,
  };
};

export const publicClients = clients;
