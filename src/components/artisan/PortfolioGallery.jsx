import { ImagePlus } from "lucide-react";

export default function PortfolioGallery({ items, visitorMode, onAddItems }) {
  return (
    <section className="rounded-lg border border-[#eadfd3] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-extrabold text-[#182433]">Réalisations</h2>
        {!visitorMode && (
          <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-md bg-[#145DA0] px-4 text-sm font-extrabold text-white transition hover:bg-[#0f4b82]">
            <ImagePlus size={17} />
            Ajouter
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(event) => onAddItems(event.target.files)}
            />
          </label>
        )}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {items.map((item) => (
          <figure key={item.src} className="overflow-hidden rounded-lg border border-[#eadfd3] bg-[#f6f2ed]">
            <img
              src={item.src}
              alt={item.name}
              className="h-44 w-full object-cover"
            />
          </figure>
        ))}
      </div>
    </section>
  );
}
