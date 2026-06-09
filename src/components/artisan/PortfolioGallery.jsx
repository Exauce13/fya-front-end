import { ChevronLeft, ChevronRight, Download, ImagePlus, X } from "lucide-react";
import { useState } from "react";

const previewLimit = 6;

export default function PortfolioGallery({
  items,
  visitorMode,
  onAddItems,
  loading = false,
  uploading = false,
}) {
  const [showAll, setShowAll] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const visibleItems = items.slice(0, previewLimit);
  const hasMoreItems = items.length > previewLimit;
  const activeItem = activeIndex === null ? null : items[activeIndex];

  const openImage = (item) => {
    const index = items.findIndex((current) => current.src === item.src);
    setActiveIndex(index >= 0 ? index : 0);
  };

  const showPrevious = () => {
    setActiveIndex((current) => (current === 0 ? items.length - 1 : current - 1));
  };

  const showNext = () => {
    setActiveIndex((current) => (current === items.length - 1 ? 0 : current + 1));
  };

  return (
    <>
      <section className="rounded-lg border border-[#eadfd3] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-extrabold text-[#182433]">Réalisations</h2>
          <div className="flex flex-wrap items-center justify-end gap-2">
            {hasMoreItems && (
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="inline-flex min-h-10 items-center rounded-md border border-[#d7e3f1] px-4 text-sm font-extrabold text-[#145DA0] transition hover:bg-[#eef6ff]"
              >
                Voir plus
              </button>
            )}
            {!visitorMode && (
              <label className={`inline-flex min-h-10 items-center gap-2 rounded-md px-4 text-sm font-extrabold text-white transition ${
                uploading
                  ? "cursor-not-allowed bg-[#145DA0]/60"
                  : "cursor-pointer bg-[#145DA0] hover:bg-[#0f4b82]"
              }`}>
                <ImagePlus size={17} />
                {uploading ? "Envoi..." : "Ajouter"}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={uploading}
                  className="hidden"
                  onChange={(event) => {
                    onAddItems(event.target.files);
                    event.target.value = "";
                  }}
                />
              </label>
            )}
          </div>
        </div>

        {loading ? (
          <p className="mt-5 rounded-lg bg-[#fbfaf8] p-4 text-sm font-bold text-gray-500">
            Chargement des réalisations...
          </p>
        ) : items.length > 0 ? (
          <ImageGrid items={visibleItems} onOpen={openImage} />
        ) : (
          <p className="mt-5 rounded-lg bg-[#fbfaf8] p-4 text-sm font-bold text-gray-500">
            Aucune réalisation ajoutée pour le moment.
          </p>
        )}
      </section>

      {showAll && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#111827]/70 px-0 py-0 sm:px-5 sm:py-6">
          <section className="mx-auto min-h-full max-w-6xl bg-white p-5 text-[#182433] shadow-2xl sm:min-h-0 sm:rounded-xl sm:p-6">
            <header className="flex items-center justify-between gap-4 border-b border-[#eadfd3] pb-4">
              <div>
                <h2 className="text-2xl font-extrabold">Toutes les réalisations</h2>
                <p className="mt-1 text-sm font-semibold text-gray-500">
                  {items.length} photo(s)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAll(false)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-[#eadfd3] text-gray-600 transition hover:bg-[#fbfaf8]"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
            </header>

            <ImageGrid items={items} onOpen={openImage} compact />
          </section>
        </div>
      )}

      {activeItem && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-[#111827]/85 p-3 sm:p-6">
          <div className="relative flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-[#fbfaf8] shadow-2xl">
            <header className="flex items-center justify-between gap-3 border-b border-[#eadfd3] bg-white px-4 py-3">
              <p className="truncate text-sm font-extrabold text-[#182433]">
                {activeIndex + 1} / {items.length} • {activeItem.name}
              </p>
              <div className="flex items-center gap-2">
                <a
                  href={activeItem.src}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-10 w-10 place-items-center rounded-lg border border-[#d7e3f1] text-[#145DA0] transition hover:bg-[#eef6ff]"
                  aria-label="Télécharger"
                >
                  <Download size={17} />
                </a>
                <button
                  type="button"
                  onClick={() => setActiveIndex(null)}
                  className="grid h-10 w-10 place-items-center rounded-lg border border-[#eadfd3] text-gray-600 transition hover:bg-[#fbfaf8]"
                  aria-label="Fermer"
                >
                  <X size={18} />
                </button>
              </div>
            </header>

            <div className="relative grid min-h-0 flex-1 place-items-center bg-[#f6f2ed] p-3 sm:p-5">
              <img
                src={activeItem.src}
                alt={activeItem.name}
                className="max-h-full max-w-full rounded-lg bg-white object-contain shadow-sm"
              />

              {items.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={showPrevious}
                    className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-[#182433] shadow-md transition hover:bg-white"
                    aria-label="Image précédente"
                  >
                    <ChevronLeft size={21} />
                  </button>
                  <button
                    type="button"
                    onClick={showNext}
                    className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-[#182433] shadow-md transition hover:bg-white"
                    aria-label="Image suivante"
                  >
                    <ChevronRight size={21} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ImageGrid({ items, onOpen, compact = false }) {
  return (
    <div className={`mt-5 grid gap-4 ${compact ? "sm:grid-cols-3 lg:grid-cols-4" : "sm:grid-cols-3"}`}>
      {items.map((item) => (
        <button
          key={item.src}
          type="button"
          onClick={() => onOpen(item)}
          className="group overflow-hidden rounded-lg border border-[#eadfd3] bg-[#f6f2ed] text-left transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <img
            src={item.src}
            alt={item.name}
            className="h-44 w-full object-cover transition group-hover:scale-[1.02]"
          />
        </button>
      ))}
    </div>
  );
}
