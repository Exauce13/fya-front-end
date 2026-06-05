import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import {
  User,
  LogOut,
  ChevronDown
} from "lucide-react";
import { useUserMode } from "../../context/useUserMode";

export default function ProfileDropdown({ user, theme = "dark" }) {
  const dropdownRef = useRef(null);
  const { setRole } = useUserMode();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
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

  const handleLogout = () => {
    setRole("visitor");
    setOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">

      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-3 ${theme === "light" ? "text-[#182433]" : "text-white"}`}
      >
        <img
          src={user.avatar}
          alt={user.name}
          className={`w-10 h-10 rounded-full object-cover border ${
            theme === "light" ? "border-[#eadfd3]" : "border-white/40"
          }`}
        />

        <ChevronDown size={18} />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-lg border">

          <div className="p-4 border-b">
            <h3 className="font-semibold">
              {user.name}
            </h3>

            <p className="text-sm text-gray-500">
              {user.email}
            </p>
          </div>

          <div className="p-2">

            <Link
              to="/profile"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
            >
              <User size={18} />
              Profil
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-red-600"
            >
              <LogOut size={18} />
              Déconnexion
            </button>

          </div>

        </div>
      )}
    </div>
  );
}
