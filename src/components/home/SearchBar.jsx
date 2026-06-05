import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useUserMode } from "../../context/useUserMode";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { isVisitor } = useUserMode();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isVisitor) {
      navigate("/login");
      return;
    }
    const search = query.trim();
    navigate(search ? `/explorer?q=${encodeURIComponent(search)}` : "/explorer");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-7 flex max-w-3xl flex-col overflow-hidden rounded-lg bg-white shadow-lg shadow-black/20 sm:flex-row"
    >
      <label className="flex min-h-14 flex-1 items-center gap-3 px-5 text-sm text-gray-500">
        <Search size={18} className="text-gray-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full bg-transparent text-[#182433] outline-none placeholder:text-gray-500"
          placeholder="Que cherchez-vous ? ex: Peintre, Maçon..."
        />
      </label>
      <button
        type="submit"
        className="min-h-14 bg-[#C96B2C] px-8 text-sm font-bold text-white transition hover:bg-[#b65e23]"
      >
        Rechercher
      </button>
    </form>
  );
}
