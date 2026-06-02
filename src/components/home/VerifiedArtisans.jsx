importVerifiedArtisans() {
  return (
    <section className="mt-7">
      <SectionHeader title="Artisans vérifiés" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {artisans.map((artisan) => (
          <article
            key={artisan.name { Check, MapPin, Star } from "lucide-react";

import { SectionHeader } from "./CategoriesSection";
import { artisans } from "./homeData";

export default function }
            className="overflow-hidden rounded-lg border border-[#eadfd3] bg-white shadow-sm"
          >
            <div className="relative h-32">
              <img src={artisan.image} alt={artisan.name} className="h-full w-full object-cover" />
              <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#2563EB] text-white shadow">
                <Check size={15} strokeWidth={3} />
              </span>
            </div>
            <div className="p-3">
              <h3 className="text-sm font-extrabold">{artisan.name}</h3>
              <p className="text-xs font-medium text-gray-600">{artisan.job}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                <MapPin size={12} />
                {artisan.city}
              </p>
              <p className="mt-3 flex items-center gap-1 text-xs font-bold">
                <Star size={14} className="fill-[#F5A623] text-[#F5A623]" />
                {artisan.rating} <span className="font-medium text-gray-500">({artisan.reviews})</span>
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
