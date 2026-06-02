import { useState } from "react";
import { Link } from "react-router-dom";

import {
  User,
  LogOut,
  ChevronDown
} from "lucide-react";

export default function ProfileDropdown({ user }) {
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    console.log("Déconnexion");
  };

  return (
    <div className="relative">

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3"
      >
        <img
          src={user.avatar}
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover border"
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