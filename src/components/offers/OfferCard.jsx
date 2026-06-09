import { Bell, BriefcaseBusiness, Images } from "lucide-react";

import OfferStatusBadge from "./OfferStatusBadge";

export default function OfferCard({
  offer,
  mode = "mine",
  applied = false,
  onApply,
  onSelect,
  onPreviewMedia,
}) {
  const isMine = mode === "mine";
  const hasNewApplications = isMine && offer.status === "open" && Boolean(offer.hasNewApplications);
  const visiblePreviewMedia = offer.photos?.slice(0, 3) || [];
  const remainingMediaCount = Math.max(Number(offer.photos?.length || 0) - visiblePreviewMedia.length, 0);

  return (
    <article
      onClick={() => isMine && onSelect?.(offer)}
      className={`grid gap-4 border-b border-[#eadfd3] px-1 py-6 last:border-b-0 lg:items-center ${
        isMine
          ? "cursor-pointer lg:grid-cols-[76px_minmax(0,1fr)_190px_120px] hover:bg-[#fbfaf8]"
          : "lg:grid-cols-[76px_minmax(0,1fr)_190px_150px]"
      }`}
    >
      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg bg-[#fff3ea] text-[#C96B2C]">
        {offer.photos?.[0]?.src ? (
          offer.photos[0].type === "video" ? (
            <video src={offer.photos[0].src} className="h-full w-full bg-[#f6f2ed] object-cover" />
          ) : (
            <img src={offer.photos[0].src} alt={offer.title} className="h-full w-full bg-[#f6f2ed] object-cover" />
          )
        ) : (
          <BriefcaseBusiness size={26} />
        )}
      </div>

      <div className="min-w-0">
        <h2 className="text-lg font-extrabold text-[#182433]">{offer.title}</h2>
        <p className="mt-2 text-sm font-semibold text-gray-600">
          {offer.category} <span className="mx-1">•</span> {offer.location}
          <span className="mx-1">•</span> Budget: {offer.budget}
        </p>
        {offer.photos?.length > 0 && (
          <div className="mt-3">
            {onPreviewMedia ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onPreviewMedia(offer);
                }}
                className="inline-flex items-center gap-1 text-xs font-extrabold text-[#145DA0] transition hover:text-[#104f88]"
              >
                <Images size={14} />
                Voir {offer.photos.length} pièce(s) jointe(s)
              </button>
            ) : (
              <p className="inline-flex items-center gap-1 text-xs font-extrabold text-[#145DA0]">
                <Images size={14} />
                {offer.photos.length} pièce(s) jointe(s)
              </p>
            )}

            {!isMine && onPreviewMedia && (
              <div className="mt-2 flex max-w-sm gap-2">
                {visiblePreviewMedia.map((item, index) => (
                  <button
                    key={`${item.src}-${index}`}
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onPreviewMedia?.(offer);
                    }}
                    className="relative h-16 w-20 overflow-hidden rounded-lg border border-[#eadfd3] bg-[#f6f2ed]"
                    aria-label="Afficher les pièces jointes"
                  >
                    {item.type === "video" ? (
                      <video src={item.src} className="h-full w-full object-cover" />
                    ) : (
                      <img src={item.src} alt={item.name} className="h-full w-full object-cover" />
                    )}
                    {index === visiblePreviewMedia.length - 1 && remainingMediaCount > 0 && (
                      <span className="absolute inset-0 grid place-items-center bg-[#182433]/60 text-xs font-extrabold text-white">
                        +{remainingMediaCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        {hasNewApplications && (
          <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#FFF4DF] px-3 py-1 text-xs font-extrabold text-[#B95724]">
            <Bell size={13} />
            Nouvelle candidature
          </p>
        )}
      </div>

      <div className="text-sm font-semibold text-gray-600">
        <p className="font-extrabold text-[#182433]">{offer.proposals} propositions</p>
        <p className="mt-1">Publié il y a {offer.publishedAgo}</p>
      </div>

      <div className="sm:text-right">
        {isMine ? (
          <OfferStatusBadge status={offer.status} />
        ) : (
          <button
            onClick={(event) => {
              event.stopPropagation();
              onApply?.(offer);
            }}
            disabled={applied}
            className={`rounded-lg px-5 py-2 text-sm font-extrabold transition ${
              applied
                ? "bg-[#E8F7E9] text-[#267A39]"
                : "bg-[#145DA0] text-white hover:bg-[#104f88]"
            }`}
          >
            {applied ? "Candidature envoyée" : "Postuler"}
          </button>
        )}
      </div>
    </article>
  );
}
