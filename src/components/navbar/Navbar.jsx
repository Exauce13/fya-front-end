import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.webp";

import NavLinks from "./NavLinks";
import ProfileDropdown from "./ProfileDropdown";
import MobileMenu from "./MobileMenu";

export default function Navbar({ user }) {
  const isAuthenticated = !!user;

  return (
    <header className="absolute top-0 left-0 z-50 w-full border-b border-white/10 bg-[#102437]/35 backdrop-blur-md">
      <div className="flex h-20 w-full items-center justify-between px-6 sm:px-8 lg:px-10">

        {/* Logo */}
        <Link to="/">
          <img
            src={logo}
            alt="FYA Logo"
            className="h-20 w-auto"
          />
        </Link>

        {/* Navigation Desktop */}
        <NavLinks />

        {/* Actions */}
        <div className="flex items-center gap-4">

          {isAuthenticated ? (
            <ProfileDropdown user={user} />
          ) : (
            <>
              <Link
                to="/login"
                className="px-5 py-2 rounded-xl border border-white/45 text-white hover:bg-white/10 transition"
              >
                Se connecter
              </Link>

              <Link
                to="/register"
                className="px-5 py-2 rounded-xl bg-[#C96B2C] text-white hover:bg-[#b65e23] transition"
              >
                S'inscrire
              </Link>
            </>
          )}

          <MobileMenu />
        </div>

      </div>
    </header>
  );
}
