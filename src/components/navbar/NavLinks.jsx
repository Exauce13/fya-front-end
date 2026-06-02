import { NavLink } from "react-router-dom";
import { Home, Search, Briefcase, MessageCircle } from "lucide-react";

export default function NavLinks() {
  const navClass = ({ isActive }) =>
    isActive
      ? "text-white font-semibold flex items-center gap-2"
      : "text-white/85 hover:text-white transition flex items-center gap-2";

  return (
    <nav className="hidden md:flex items-center gap-8">

      <NavLink to="/" className={navClass}>
        <Home size={18} />
        Accueil
      </NavLink>

      <NavLink to="/explorer" className={navClass}>
        <Search size={18} />
        Explorer
      </NavLink>

      <NavLink to="/offres" className={navClass}>
        <Briefcase size={18} />
        Appels d'offres
      </NavLink>

      <NavLink to="/messages" className={navClass}>
        <MessageCircle size={18} />
        Messagerie
      </NavLink>

    </nav>
  );
}
