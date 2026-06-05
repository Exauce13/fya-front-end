import { Search } from "lucide-react";

export default function SearchHeader({ value, onChange }) {
  return (
    <section className="rounded-lg border border-[#eadfd3] bg-white p-4 shadow-sm">
      <label className="flex min-h-12 items-center gap-3 rounded-lg border border-[#eadfd3] px-4 text-sm text-gray-500">
        <Search size={18} />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full bg-transparent text-[#182433] outline-none placeholder:text-gray-500"
          placeholder="Que cherchez-vous ? ex: Plombier, Menuiserie..."
        />
      </label>
    </section>
  );
}
