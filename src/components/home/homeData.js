import {
  Award,
  BriefcaseBusiness,
  Camera,
  Gem,
  Hammer,
  Paintbrush,
  Shirt,
  Wrench,
} from "lucide-react";

import heroImage from "../../assets/images/home-hero-carpenter.png";

export const homeAssets = {
  heroImage,
};

export const categories = [
  { name: "Maçonnerie", artisans: "120 artisans", icon: Hammer },
  { name: "Plomberie", artisans: "84 artisans", icon: Wrench },
  { name: "Electricité", artisans: "118 artisans", icon: Award },
  { name: "Menuiserie", artisans: "140 artisans", icon: BriefcaseBusiness },
  { name: "Couture", artisans: "97 artisans", icon: Shirt },
  { name: "Soudure", artisans: "66 artisans", icon: Gem },
  { name: "Peinture", artisans: "46 artisans", icon: Paintbrush },
  { name: "Tapisserie", artisans: "43 artisans", icon: Camera },
];

export const artisans = [
  {
    name: "Hervé A.",
    job: "Menuisier bois",
    city: "Cotonou",
    rating: "4.8",
    reviews: "103 avis",
    image:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Grace C.",
    job: "Couturière",
    city: "Porto-Novo",
    rating: "4.9",
    reviews: "96 avis",
    image:
      "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Arnaud S.",
    job: "Electricien",
    city: "Abomey-Calavi",
    rating: "4.7",
    reviews: "74 avis",
    image:
      "https://images.unsplash.com/photo-1601055283742-8b27e81b5553?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Yao M.",
    job: "Plombier",
    city: "Cotonou",
    rating: "4.6",
    reviews: "113 avis",
    image:
      "https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Moudjibou K.",
    job: "Tapissier",
    city: "Parakou",
    rating: "4.8",
    reviews: "57 avis",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
  },
];

export const feedImages = [
  "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1595514535215-51a0789f1613?auto=format&fit=crop&w=500&q=80",
];
