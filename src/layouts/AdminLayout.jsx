import { Menu, Search } from "lucide-react";
import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import { adminOverview } from "../data/adminData";

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F3EE] text-[#1F2933]">
      <div className="flex">
        <AdminSidebar />

        {mobileOpen && (
          <div className="fixed inset-0 z-40 bg-black/35 lg:hidden" onClick={() => setMobileOpen(false)}>
            <div className="h-full w-72" onClick={(event) => event.stopPropagation()}>
              <AdminSidebar mobile onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-[#E8DED2] bg-[#FBF8F4]/92 backdrop-blur">
            <div className="flex min-h-20 items-center gap-4 px-4 sm:px-6 lg:px-10">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#E1D7CC] bg-white text-[#102D42] lg:hidden"
                aria-label="Ouvrir le menu admin"
              >
                <Menu size={22} />
              </button>
              <Link to="/admin" className="lg:hidden">
                <p className="text-3xl font-black text-[#102D42]">FYA</p>
              </Link>
              <div className="hidden h-12 max-w-md flex-1 items-center gap-3 rounded-lg border border-[#E4D9CF] bg-white px-4 md:flex">
                <Search size={18} className="text-[#7A6F68]" />
                <input
                  className="w-full bg-transparent text-sm outline-none"
                  placeholder="Rechercher un utilisateur, un appel, un paiement..."
                />
              </div>
              <div className="ml-auto flex items-center gap-3">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-bold text-[#C9553D]">{adminOverview.support.name}</p>
                  <p className="text-xs text-[#746A63]">{adminOverview.support.role}</p>
                </div>
                <img
                  src={adminOverview.support.avatar}
                  alt={adminOverview.support.name}
                  className="h-11 w-11 rounded-full object-cover"
                />
              </div>
            </div>
          </header>
          <main className="px-3 py-4 sm:px-6 sm:py-6 lg:px-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
