import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/images/logo.webp";

import NavLinks from "./NavLinks";
import ProfileDropdown from "./ProfileDropdown";
import MobileMenu from "./MobileMenu";

export default function Navbar({ user }) {
  const location = useLocation();
  const isAuthenticated = !!user;
  const isHome = location.pathname === "/";
  const theme = isHome ? "dark" : "light";

  return (
    <header
      className={`absolute left-0 top-0 z-50 w-full border-b backdrop-blur-md ${
        isHome
          ? "border-white/10 bg-[#102437]/45"
          : "border-[#eadfd3] bg-[#F8F5F1]/95 shadow-sm"
      }`}
    >
      <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 md:h-20 lg:px-10">

        {/* Logo */}
        <Link to="/">
          <img
            src={logo}
            alt="FYA Logo"
            className="h-12 w-auto md:h-20"
          />
        </Link>

        {/* Navigation Desktop */}
        <NavLinks theme={theme} />

        {/* Actions */}
        <div className="flex items-center gap-4">

          <div className="hidden items-center gap-4 md:flex">
            {isAuthenticated ? (
              <ProfileDropdown user={user} theme={theme} />
            ) : (
              <>
              <Link
                to="/login"
                className={`rounded-xl border px-5 py-2 transition ${
                  isHome
                    ? "border-white/45 text-white hover:bg-white/10"
                    : "border-[#C96B2C]/35 text-[#C96B2C] hover:bg-[#fff3ea]"
                }`}
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
          </div>

          <MobileMenu user={user} theme={theme} />
        </div>

      </div>
    </header>
  );
}
