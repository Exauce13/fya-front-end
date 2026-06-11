import { LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import { logout } from "../services/authService";

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const disconnect = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

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
            <div className="mb-4 flex justify-end lg:mb-6">
              <button
                type="button"
                onClick={disconnect}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#E1D7CC] bg-white px-4 text-sm font-black text-[#B42318] shadow-sm transition hover:bg-[#FDECEC]"
              >
                <LogOut size={17} />
                Déconnecter
              </button>
            </div>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
