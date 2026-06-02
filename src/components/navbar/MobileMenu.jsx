import { useState } from "react";
import { NavLink, Link } from "react-router-dom";

import {
  Menu,
  X,
  Home,
  Search,
  Briefcase,
  MessageCircle,
  User,
  LogOut
} from "lucide-react";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="md:hidden"
        onClick={() => setOpen(true)}
      >
        <Menu size={28} />
      </button>

      {open && (
        <div className="fixed inset-0 bg-white z-50">

          <div className="flex justify-end p-6">
            <button onClick={() => setOpen(false)}>
              <X size={30} />
            </button>
          </div>

          <nav className="flex flex-col px-8 gap-6 text-lg">

            <NavLink to="/">
              <div className="flex items-center gap-3">
                <Home />
                Accueil
              </div>
            </NavLink>

            <NavLink to="/explorer">
              <div className="flex items-center gap-3">
                <Search />
                Explorer
              </div>
            </NavLink>

            <NavLink to="/offres">
              <div className="flex items-center gap-3">
                <Briefcase />
                Appels d'offres
              </div>
            </NavLink>

            <NavLink to="/messages">
              <div className="flex items-center gap-3">
                <MessageCircle />
                Messagerie
              </div>
            </NavLink>

            <Link to="/profile">
              <div className="flex items-center gap-3">
                <User />
                Profil
              </div>
            </Link>

            <button className="flex items-center gap-3 text-red-600">
              <LogOut />
              Déconnexion
            </button>

          </nav>
        </div>
      )}
    </>
  );
}