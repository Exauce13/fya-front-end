import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const search = query.trim();
    navigate(search ? `/explorer?q=${encodeURIComponent(search)}` : "/explorer");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 flex max-w-3xl overflow-hidden rounded-lg bg-white shadow-lg shadow-black/20 sm:mt-7"
    >
      <label className="flex min-h-12 min-w-0 flex-1 items-center gap-2 px-3 text-sm text-gray-500 sm:min-h-14 sm:gap-3 sm:px-5">
        <Search size={18} className="shrink-0 text-gray-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="min-w-0 w-full bg-transparent text-[#182433] outline-none placeholder:text-gray-500"
          placeholder="Que cherchez-vous ? ex: Peintre, Maçon..."
        />
      </label>
      <button
        type="submit"
        className="min-h-12 shrink-0 bg-[#C96B2C] px-3 text-sm font-bold text-white transition hover:bg-[#b65e23] sm:min-h-14 sm:px-8"
      >
        <span className="hidden min-[420px]:inline">Rechercher</span>
        <Search size={18} className="min-[420px]:hidden" />
      </button>
    </form>
  );
}
