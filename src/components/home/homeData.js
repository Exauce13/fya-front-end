import {
  Award,
  BriefcaseBusiness,
  Camera,
  Gem,
  Hammer,
  Laptop,
  Paintbrush,
  PartyPopper,
  Scissors,
  Shirt,
  Snowflake,
  Sparkles,
  Utensils,
  Wrench,
} from "lucide-react";

import heroImage from "../../assets/images/home-hero-carpenter.png";
import { popularServiceCategories, serviceCategories } from "../../data/serviceCategories";

export const homeAssets = {
  heroImage,
};

const categoryIcons = {
  Maçonnerie: Hammer,
  Plomberie: Wrench,
  Électricité: Award,
  Menuiserie: BriefcaseBusiness,
  Couture: Shirt,
  Soudure: Gem,
  Peinture: Paintbrush,
  Tapisserie: Camera,
  Mécanique: Wrench,
  "Climatisation et Froid": Snowflake,
  "Coiffure et Esthétique": Scissors,
  "Informatique et Réparation électronique": Laptop,
  "Décoration et Événementiel": PartyPopper,
  "Artisanat d'art": Sparkles,
  "Transformation agroalimentaire": Utensils,
};

export const allCategories = serviceCategories.map((name) => ({
  name,
  icon: categoryIcons[name] || BriefcaseBusiness,
}));

export const categories = allCategories.filter((category) =>
  popularServiceCategories.includes(category.name)
);

export const artisans = [
  {
    slug: "herve-a",
    name: "Hervé A.",
    firstName: "Hervé",
    lastName: "A.",
    job: "Menuisier bois",
    city: "Cotonou",
    district: "Fidjrossè",
    workshop: "Atelier Bois Hervé",
    startYear: 2019,
    bio: "Menuisier spécialisé dans la fabrication de meubles intérieurs et extérieurs sur mesure.",
    rating: "4.8",
    reviews: "103 avis",
    services: 185,
    image:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80",
  },
  {
    slug: "grace-c",
    name: "Grace C.",
    firstName: "Grace",
    lastName: "C.",
    job: "Couturière",
    city: "Porto-Novo",
    district: "Jéricho",
    workshop: "Maison Grace Couture",
    startYear: 2020,
    bio: "Couturière spécialisée dans les tenues sur mesure, retouches et créations événementielles.",
    rating: "4.9",
    reviews: "96 avis",
    services: 142,
    image:
      "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&w=600&q=80",
  },
  {
    slug: "arnaud-s",
    name: "Arnaud S.",
    firstName: "Arnaud",
    lastName: "S.",
    job: "Electricien",
    city: "Abomey-Calavi",
    district: "Godomey",
    workshop: "Arnaud Services Électriques",
    startYear: 2018,
    bio: "Électricien pour installations domestiques, diagnostics, rénovations et mises aux normes.",
    rating: "4.7",
    reviews: "74 avis",
    services: 126,
    image:
      "https://images.unsplash.com/photo-1601055283742-8b27e81b5553?auto=format&fit=crop&w=600&q=80",
  },
  {
    slug: "yao-m",
    name: "Yao M.",
    firstName: "Yao",
    lastName: "M.",
    job: "Plombier",
    city: "Cotonou",
    district: "Akpakpa",
    workshop: "Yao Plomberie",
    startYear: 2014,
    bio: "Plombier sanitaire pour dépannage, installation complète et rénovation de réseaux d'eau.",
    rating: "4.6",
    reviews: "113 avis",
    services: 168,
    image:
      "https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&w=600&q=80",
  },
  {
    slug: "moudjibou-k",
    name: "Moudjibou K.",
    firstName: "Moudjibou",
    lastName: "K.",
    job: "Tapissier",
    city: "Parakou",
    district: "Guéma",
    workshop: "MK Tapisserie",
    startYear: 2017,
    bio: "Tapissier spécialisé dans la restauration de fauteuils, canapés et habillages muraux.",
    rating: "4.8",
    reviews: "57 avis",
    services: 88,
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
  },
  {
    slug: "sessi-b",
    name: "Sessi B.",
    firstName: "Sessi",
    lastName: "B.",
    job: "Peintre",
    city: "Cotonou",
    district: "Cadjehoun",
    workshop: "Sessi Décor",
    startYear: 2016,
    bio: "Peintre bâtiment pour finitions intérieures, effets décoratifs et rafraîchissement de façades.",
    rating: "4.7",
    reviews: "82 avis",
    services: 134,
    image:
      "https://images.unsplash.com/photo-1560439514-4e9645039924?auto=format&fit=crop&w=600&q=80",
  },
  {
    slug: "nadia-f",
    name: "Nadia F.",
    firstName: "Nadia",
    lastName: "F.",
    job: "Coiffeuse",
    city: "Porto-Novo",
    district: "Ouando",
    workshop: "Nadia Beauty",
    startYear: 2021,
    bio: "Coiffeuse et esthéticienne pour soins, tresses, coiffures de cérémonie et mise en beauté.",
    rating: "4.9",
    reviews: "68 avis",
    services: 97,
    image:
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80",
  },
  {
    slug: "komi-d",
    name: "Komi D.",
    firstName: "Komi",
    lastName: "D.",
    job: "Mécanicien",
    city: "Bohicon",
    district: "Sodohomey",
    workshop: "Garage Komi",
    startYear: 2015,
    bio: "Mécanicien auto pour entretien, diagnostic, freinage et réparation courante.",
    rating: "4.6",
    reviews: "91 avis",
    services: 152,
    image:
      "https://images.unsplash.com/photo-1599256872237-5dcc0fbe9668?auto=format&fit=crop&w=600&q=80",
  },
  {
    slug: "odette-l",
    name: "Odette L.",
    firstName: "Odette",
    lastName: "L.",
    job: "Transformatrice agroalimentaire",
    city: "Abomey-Calavi",
    district: "Calavi Centre",
    workshop: "Saveurs Odette",
    startYear: 2018,
    bio: "Transformation agroalimentaire locale, conditionnement de produits et petites commandes professionnelles.",
    rating: "4.8",
    reviews: "64 avis",
    services: 109,
    image:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80",
  },
];

export const feedImages = [
  "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&w=500&q=80",
];
