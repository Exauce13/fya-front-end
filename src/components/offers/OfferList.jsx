import OfferCard from "./OfferCard";

export default function OfferList({
  offers,
  mode,
  appliedOfferIds = [],
  onApply,
  onSelect,
  onPreviewMedia,
}) {
  return (
    <div>
      {offers.map((offer) => (
        <OfferCard
          key={offer.id}
          offer={offer}
          mode={mode}
          applied={appliedOfferIds.some((id) => String(id) === String(offer.id))}
          onApply={onApply}
          onSelect={onSelect}
          onPreviewMedia={onPreviewMedia}
        />
      ))}
    </div>
  );
}
