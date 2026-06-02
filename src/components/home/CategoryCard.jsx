const iconClass = "h-10 w-10 rounded-full bg-[#fff6ec] p-2.5 text-[#C96B2C]";

export default function CategoryCard({ category }) {
  const Icon = category.icon;

  return (
    <article className="rounded-lg border border-[#efe6dc] bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#fcf3e9]">
        <Icon className={iconClass} />
      </div>
      <h3 className="text-sm font-extrabold text-[#1e2b3a]">{category.name}</h3>
      <p className="mt-1 text-xs font-medium text-gray-500">{category.artisans}</p>
    </article>
  );
}
