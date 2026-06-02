import { Heart, MessageCircle } from "lucide-react";

import { artisans, feedImages } from "./homeData";

export default function PostCard() {
  return (
    <article className="mt-4 rounded-lg border border-[#eadfd3] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            src={artisans[0].image}
            alt="Hervé A."
            className="h-12 w-12 rounded-full object-cover"
          />
          <div>
            <h3 className="text-sm font-extrabold">Hervé A. Menuisier</h3>
            <p className="text-xs text-gray-500">Cotonou · il y a 2 h</p>
          </div>
        </div>
        <button className="text-gray-400">...</button>
      </div>
      <p className="mt-4 text-sm leading-6 text-gray-700">
        Réalisation d'une bibliothèque en bois massif pour un client à Fidjrossè.
        Qu'en pensez-vous ?
      </p>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {feedImages.map((image) => (
          <img
            key={image}
            src={image}
            alt="Projet de menuiserie"
            className="h-36 w-full rounded-md object-cover"
          />
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between border-b border-[#eee3d7] pb-3 text-xs font-semibold text-gray-500">
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-red-500">
            <Heart size={15} className="fill-red-500" /> 128
          </span>
        </span>
        <span>34 commentaires</span>
      </div>
      <div className="grid grid-cols-2 pt-3 text-sm font-semibold text-gray-600">
        <button className="flex items-center justify-center gap-2 py-2">
          <Heart size={16} /> J'aime
        </button>
        <button className="flex items-center justify-center gap-2 py-2">
          <MessageCircle size={16} /> Commenter
        </button>
      </div>
    </article>
  );
}
