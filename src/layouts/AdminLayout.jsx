import { Menu } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";

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
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="fixed left-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-lg border border-[#E1D7CC] bg-white text-[#102D42] shadow-lg lg:hidden"
            aria-label="Ouvrir le menu admin"
          >
            <Menu size={22} />
          </button>
          <main className="px-3 py-4 sm:px-6 sm:py-6 lg:px-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
