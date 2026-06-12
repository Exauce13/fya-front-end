import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";

import {
  Briefcase,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  Search,
  User,
  X,
} from "lucide-react";
import { logout } from "../../services/authService";

const links = [
  { to: "/", label: "Accueil", icon: Home },
  { to: "/explorer", label: "Explorer", icon: Search },
  { to: "/offres", label: "Appels d'offres", icon: Briefcase },
  { to: "/messages", label: "Messagerie", icon: MessageCircle },
];

export default function MobileMenu({ user, theme = "dark", indicators = {}, onNavigate }) {
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("touchstart", closeOnOutsideClick);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("touchstart", closeOnOutsideClick);
    };
  }, [open]);

  return (
    <div ref={menuRef} className="md:hidden">
      <button
        className={`grid h-11 w-11 place-items-center rounded-xl border transition ${
          theme === "light"
            ? "border-[#eadfd3] bg-white text-[#182433] shadow-sm hover:bg-[#fbfaf8]"
            : "border-white/25 bg-white/10 text-white hover:bg-white/15"
        }`}
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
      >
        {open ? <X size={23} /> : <Menu size={24} />}
      </button>

      {open && (
        <div className="fixed right-4 top-[72px] z-[70] w-[min(330px,calc(100vw-32px))] md:hidden">
          <div className="overflow-hidden rounded-xl border border-[#eadfd3] bg-white shadow-sm">
            {user && (
              <div className="border-b border-[#eadfd3] p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-extrabold text-[#182433]">{user.name}</p>
                    <p className="truncate text-sm font-semibold text-gray-500">
                      {user.email || "Compte utilisateur"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <nav>
              {links.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => {
                    onNavigate?.(to);
                    close();
                  }}
                  className={({ isActive }) =>
                    `flex min-h-[52px] items-center gap-3 border-b border-[#eadfd3] px-4 py-3 text-sm font-extrabold transition ${
                      isActive
                        ? "bg-[#102437] text-white"
                        : "bg-white text-[#182433] hover:bg-[#fff3ea]"
                    }`
                  }
                >
                  <Icon size={19} />
                  <span className="relative">
                    {label}
                    {indicators[to] && (
                      <span className="absolute -right-3 top-0 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
                    )}
                  </span>
                </NavLink>
              ))}
            </nav>

            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={close}
                  className="flex min-h-[52px] items-center gap-3 border-b border-[#eadfd3] bg-white px-4 py-3 text-sm font-extrabold text-[#182433] transition hover:bg-[#fff3ea]"
                >
                  <User size={18} />
                  Profil
                </Link>
                <button
                  onClick={async () => {
                    try {
                      await logout();
                    } catch {
                      // Le nettoyage local est deja effectue dans le service.
                    }
                    close();
                  }}
                  className="flex min-h-[52px] w-full items-center gap-3 bg-red-50 px-4 py-3 text-sm font-extrabold text-red-600 transition hover:bg-red-100"
                >
                  <LogOut size={18} />
                  Déconnexion
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 p-4">
                <Link
                  to="/login"
                  onClick={close}
                  className="grid min-h-11 place-items-center rounded-lg border border-[#C96B2C]/35 text-sm font-extrabold text-[#C96B2C]"
                >
                  Se connecter
                </Link>
                <Link
                  to="/register"
                  onClick={close}
                  className="grid min-h-11 place-items-center rounded-lg bg-[#C96B2C] text-sm font-extrabold text-white"
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
