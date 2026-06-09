import { ChevronLeft, ChevronRight, Download, X } from "lucide-react";
import { useState } from "react";

export default function OfferMediaViewer({ offer, onClose }) {
  const media = offer?.photos || [];
  const [activeIndex, setActiveIndex] = useState(0);

  if (!offer || media.length === 0) return null;

  const safeActiveIndex = Math.min(activeIndex, media.length - 1);
  const activeMedia = media[safeActiveIndex];
  const hasSeveralMedia = media.length > 1;

  const showPrevious = () => {
    setActiveIndex((current) => (current === 0 ? media.length - 1 : current - 1));
  };

  const showNext = () => {
    setActiveIndex((current) => (current === media.length - 1 ? 0 : current + 1));
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#111827]/75 px-0 py-0 text-white sm:px-5 sm:py-6">
      <div className="mx-auto flex h-full max-w-6xl flex-col overflow-hidden bg-[#fbfaf8] text-[#182433] shadow-2xl sm:rounded-xl">
        <header className="flex items-center justify-between gap-4 border-b border-[#eadfd3] bg-white px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-extrabold">{offer.title}</h2>
            <p className="mt-0.5 truncate text-xs font-semibold text-gray-500">
              {offer.category} • {offer.location}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-[#eadfd3] bg-white text-gray-600 transition hover:bg-[#fbfaf8]"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </header>

        <div className="grid min-h-0 flex-1 bg-[#f6f2ed] lg:grid-cols-[minmax(0,1fr)_280px]">
          <section className="relative grid min-h-[360px] place-items-center p-3 sm:p-5">
            {activeMedia.type === "video" ? (
              <video
                src={activeMedia.src}
                controls
                className="max-h-full max-w-full rounded-lg bg-black object-contain shadow-sm"
              />
            ) : (
              <img
                src={activeMedia.src}
                alt={activeMedia.name}
                className="max-h-full max-w-full rounded-lg bg-white object-contain shadow-sm"
              />
            )}

            {hasSeveralMedia && (
              <>
                <button
                  type="button"
                  onClick={showPrevious}
                  className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-[#182433] shadow-md transition hover:bg-white"
                  aria-label="Média précédent"
                >
                  <ChevronLeft size={21} />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-[#182433] shadow-md transition hover:bg-white"
                  aria-label="Média suivant"
                >
                  <ChevronRight size={21} />
                </button>
              </>
            )}
          </section>

          <aside className="border-t border-[#eadfd3] bg-white p-4 lg:border-l lg:border-t-0">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-extrabold">
                {safeActiveIndex + 1} / {media.length}
              </p>
              <a
                href={activeMedia.src}
                download
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#145DA0] px-3 text-xs font-extrabold text-white transition hover:bg-[#104f88]"
              >
                <Download size={15} />
                Télécharger
              </a>
            </div>

            <p className="mt-3 break-all text-sm font-semibold leading-6 text-gray-600">
              {activeMedia.name}
            </p>

            <div className="mt-4 grid grid-cols-4 gap-2 lg:grid-cols-3">
              {media.map((item, index) => (
                <button
                  key={`${item.src}-${index}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`aspect-square overflow-hidden rounded-lg border bg-[#f6f2ed] transition ${
                    index === safeActiveIndex ? "border-[#145DA0] ring-2 ring-[#145DA0]/20" : "border-[#eadfd3]"
                  }`}
                  aria-label={`Afficher le média ${index + 1}`}
                >
                  {item.type === "video" ? (
                    <video src={item.src} className="h-full w-full object-cover" />
                  ) : (
                    <img src={item.src} alt={item.name} className="h-full w-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
