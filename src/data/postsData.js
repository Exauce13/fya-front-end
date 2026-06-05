import { artisans, feedImages } from "../components/home/homeData";

export const defaultPost = {
  id: "realisation-bibliotheque-bois",
  author: "Hervé A. Menuisier",
  avatar: artisans[0].image,
  meta: "Cotonou · il y a 2 h",
  text: "Réalisation d'une bibliothèque en bois massif pour un client à Fidjrossè. Qu'en pensez-vous ?",
  images: feedImages.map((image, index) => ({
    src: image,
    name: `Projet de menuiserie ${index + 1}`,
  })),
  likes: 128,
  comments: 3,
};

export const defaultComments = [
  {
    id: 1,
    author: "Afi D.",
    avatar: "https://i.pravatar.cc/120?img=32",
    date: "il y a 1 h",
    text: "Très belle finition, le bois ressort vraiment bien.",
  },
  {
    id: 2,
    author: "Serge K.",
    avatar: "https://i.pravatar.cc/120?img=11",
    date: "il y a 45 min",
    text: "Le rendu est propre. Vous faites aussi des meubles de cuisine ?",
  },
  {
    id: 3,
    author: "Mireille T.",
    avatar: "https://i.pravatar.cc/120?img=25",
    date: "il y a 12 min",
    text: "J'aime beaucoup les rangements ouverts sur le côté.",
  },
];

export function getPostUrl(post) {
  return `/publications/${post?.id || defaultPost.id}`;
}
