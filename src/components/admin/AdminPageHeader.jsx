export default function AdminPageHeader({ title, description, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-black text-[#111827] sm:text-3xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm font-semibold text-[#75695F]">{description}</p>}
      </div>
      {action}
    </div>
  );
}
