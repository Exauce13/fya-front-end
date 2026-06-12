import { NavLink } from "react-router-dom";
import { Home, Search, Briefcase, MessageCircle } from "lucide-react";

const links = [
  { to: "/", label: "Accueil", icon: Home },
  { to: "/explorer", label: "Explorer", icon: Search },
  { to: "/offres", label: "Appels d'offres", icon: Briefcase },
  { to: "/messages", label: "Messagerie", icon: MessageCircle },
];

export default function NavLinks({ theme = "dark", indicators = {}, onNavigate }) {
  const navClass = ({ isActive }) => {
    if (theme === "light") {
      return isActive
        ? "text-[#145DA0] font-extrabold flex items-center gap-2"
        : "text-[#182433] hover:text-[#145DA0] transition flex items-center gap-2 font-bold";
    }

    return isActive
      ? "text-white font-semibold flex items-center gap-2"
      : "text-white/85 hover:text-white transition flex items-center gap-2";
  };

  return (
    <nav className="hidden md:flex items-center gap-8">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} onClick={() => onNavigate?.(to)} className={navClass}>
          <Icon size={18} />
          <span className="relative">
            {label}
            {indicators[to] && (
              <span className="absolute -right-2 -top-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
            )}
          </span>
        </NavLink>
      ))}
    </nav>
  );
}
