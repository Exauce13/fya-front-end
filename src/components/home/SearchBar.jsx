import { ChevronDown, Search } from "lucide-react";

export default function SearchBar() {
  return (
    <form className="mt-7 flex max-w-3xl flex-col overflow-hidden rounded-lg bg-white shadow-lg shadow-black/20 sm:flex-row">
      <label className="flex min-h-14 flex-1 items-center gap-3 px-5 text-sm text-gray-500">
        <Search size={18} className="text-gray-400" />
        <span>Que cherchez-vous ? ex: Peintre, Maçon...</span>
      </label>
      <button
        type="button"
        className="flex min-h-14 items-center justify-between border-t border-gray-100 px-5 text-sm font-semibold text-gray-600 sm:w-48 sm:border-l sm:border-t-0"
      >
        Toutes les villes
        <ChevronDown size={16} />
      </button>
      <button
        type="submit"
        className="min-h-14 bg-[#C96B2C] px-8 text-sm font-bold text-white transition hover:bg-[#b65e23]"
      >
        Rechercher
      </button>
    </form>
  );
}
