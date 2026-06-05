import OfferCard from "./OfferCard";

export default function OfferList({
  offers,
  mode,
  appliedOfferIds = [],
  onApply,
  onSelect,
}) {
  return (
    <div>
      {offers.map((offer) => (
        <OfferCard
          key={offer.id}
          offer={offer}
          mode={mode}
          applied={appliedOfferIds.includes(offer.id)}
          onApply={onApply}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
