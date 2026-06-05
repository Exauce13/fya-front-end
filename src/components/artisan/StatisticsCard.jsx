export default function StatisticsCard({ stats }) {
  const items = [
    { label: "Prestations", value: stats.services },
    { label: "Avis clients", value: stats.reviews },
    { label: "Note moyenne", value: stats.rating },
    { label: "Chiffre d'affaires", value: stats.revenue },
  ];

  return (
    <section className="grid overflow-hidden rounded-lg border border-[#eadfd3] bg-white shadow-sm sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <article key={item.label} className="border-b border-[#eadfd3] px-6 py-6 last:border-b-0 sm:border-r sm:last:border-r-0 lg:border-b-0">
          <p className="text-2xl font-extrabold text-[#182433]">{item.value}</p>
          <p className="mt-1 text-xs font-extrabold text-gray-500">{item.label}</p>
        </article>
      ))}
    </section>
  );
}
