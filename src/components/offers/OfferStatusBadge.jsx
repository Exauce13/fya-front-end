export default function OfferStatusBadge({ status = "open" }) {
  const config = {
    open: "bg-[#E8F7E9] text-[#267A39]",
    closed: "bg-gray-100 text-gray-500",
    completed: "bg-[#E7EEF8] text-[#145DA0]",
    pending: "bg-[#FFF4DF] text-[#B95724]",
  };

  const label = {
    open: "Ouvert",
    closed: "Fermé",
    completed: "Terminé",
    pending: "En attente",
  };

  return (
    <span className={`inline-flex rounded-lg px-4 py-2 text-sm font-extrabold ${config[status]}`}>
      {label[status]}
    </span>
  );
}
