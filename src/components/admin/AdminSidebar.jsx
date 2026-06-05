import { NavLink } from "react-router-dom";
import {
  BadgeCheck,
  BarChart3,
  CreditCard,
  FileText,
  Flag,
  Home,
  MessageSquareWarning,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";

const navItems = [
  { label: "Tableau de bord", path: "/admin", icon: Home },
  { label: "Utilisateurs", path: "/admin/utilisateurs", icon: Users },
  { label: "Artisans vérifiés", path: "/admin/verifications", icon: BadgeCheck },
  { label: "Appels d'offres", path: "/admin/appels-offres", icon: FileText },
  { label: "Signalements", path: "/admin/signalements", icon: Flag },
  { label: "Paiements", path: "/admin/paiements", icon: CreditCard },
  { label: "Contenus", path: "/admin/contenus", icon: MessageSquareWarning },
  { label: "Statistiques", path: "/admin/statistiques", icon: BarChart3 },
  { label: "Paramètres", path: "/admin/parametres", icon: Settings },
];

export default function AdminSidebar({ mobile = false, onNavigate }) {
  return (
    <aside className={`${mobile ? "block" : "sticky top-0 hidden lg:block"} h-screen w-72 shrink-0 bg-[#102D42] px-5 py-7 text-white`}>
      <div className="mb-10">
        <p className="text-5xl font-black tracking-normal text-white">FYA</p>
        <p className="text-sm font-semibold text-white/75">Find Your Artisans</p>
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
            {label === "Paramètres" && (
              <span className="ml-auto h-2.5 w-2.5 rounded-full bg-[#D96822]" />
            )}
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-7 left-5 right-5 rounded-lg border border-white/10 bg-white/7 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#D96822]">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-sm font-bold">Console admin</p>
            <p className="text-xs text-white/65">Mode démonstration</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
