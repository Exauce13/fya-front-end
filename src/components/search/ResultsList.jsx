import { CheckCircle2, MapPin, Star } from "lucide-react";

export default function ResultsList({ artisans }) {
  return (
    <section>
      <div className="mb-4">
        <h1 className="text-2xl font-extrabold text-[#182433]">
          {artisans.length} artisan{artisans.length > 1 ? "s" : ""} trouvé{artisans.length > 1 ? "s" : ""}
        </h1>
      </div>

      {artisans.length === 0 ? (
        <div className="rounded-lg border border-[#eadfd3] bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-extrabold text-[#182433]">Aucun artisan trouvé</p>
          <p className="mt-2 text-sm font-semibold text-gray-500">
            Modifiez les filtres pour élargir la recherche.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
        {artisans.map((artisan) => (
          <article
            key={artisan.name}
            className="rounded-lg border border-[#eadfd3] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex gap-5">
              <img
                src={artisan.image}
                alt={artisan.name}
                className="h-24 w-24 shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-extrabold text-[#182433]">
                  {artisan.name} <span className="text-[#145DA0]">{artisan.job}</span>
                </h2>
                <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold text-gray-600">
                  {artisan.category}
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={14} />
                    {artisan.city}
                    {artisan.district ? `, ${artisan.district}` : ""}
                  </span>
                  <span>•</span>
                  {artisan.experience}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-5 text-sm font-bold">
                  <span className="inline-flex items-center gap-1 text-[#182433]">
                    <Star size={16} className="fill-[#F5A623] text-[#F5A623]" />
                    {artisan.rating} <span className="font-medium text-gray-500">({artisan.reviews} avis)</span>
                  </span>
                  {artisan.verified && (
                    <span className="inline-flex items-center gap-1 text-[#145DA0]">
                      <CheckCircle2 size={16} />
                      vérifié
                    </span>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
        </div>
      )}
    </section>
  );
}
