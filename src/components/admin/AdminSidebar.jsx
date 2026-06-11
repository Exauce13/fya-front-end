import { NavLink } from "react-router-dom";
import {
  BadgeCheck,
  CreditCard,
  FileText,
  Flag,
  Home,
  Users,
} from "lucide-react";
import logo from "../../assets/images/logo.webp";

const navItems = [
  { label: "Tableau de bord", path: "/admin", icon: Home },
  { label: "Utilisateurs", path: "/admin/utilisateurs", icon: Users },
  { label: "Artisans vérifiés", path: "/admin/verifications", icon: BadgeCheck },
  { label: "Appels d'offres", path: "/admin/appels-offres", icon: FileText },
  { label: "Signalements", path: "/admin/signalements", icon: Flag },
  { label: "Paiements", path: "/admin/paiements", icon: CreditCard },
];

export default function AdminSidebar({ mobile = false, onNavigate }) {
  return (
    <aside className={`${mobile ? "block" : "sticky top-0 hidden lg:block"} h-screen w-72 shrink-0 bg-[#102D42] px-5 py-7 text-white`}>
      <div className="mb-10 flex justify-center">
        <img src={logo} alt="FYA" className="h-28 w-auto" />
      </div>

      <nav className="space-y-2">
        {navItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/admin"}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 text-[15px] font-bold transition ${
                isActive
                  ? "bg-[#1F5B87] text-white shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
                  : "text-white/78 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>

    </aside>
  );
}
