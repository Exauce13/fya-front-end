import "react-phone-number-input/style.css";
import { Navigate, useLocation } from "react-router-dom";

import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/Navbar";
import RealtimeProvider from "./components/realtime/RealtimeProvider.jsx";
import ScrollManager from "./components/routes/ScrollManager.jsx";
import { UserModeProvider } from "./context/UserModeContext";
import { useUserMode } from "./context/useUserMode";
import AppRoutes from "./routes/AppRoutes.jsx";
import { authPaths } from "./routes/AuthRoutes.jsx";

const noFooterPaths = ["/explorer", "/offres", "/messages", "/mes-services"];

function AppShell() {
  const location = useLocation();
  const { user } = useUserMode();
  const isAuthPage = authPaths.includes(location.pathname);
  const isAdminPage = location.pathname.startsWith("/admin");
  const shouldShowFooter =
    !isAuthPage &&
    !isAdminPage &&
    !noFooterPaths.some((path) => location.pathname.startsWith(path));

  if (user?.role === "admin" && !isAdminPage && !isAuthPage) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F8F5F1]">
      <ScrollManager />
      <RealtimeProvider user={user} />
      {!isAuthPage && !isAdminPage && <Navbar user={user} />}
      <main>
        <AppRoutes />
      </main>
      {shouldShowFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <UserModeProvider>
      <AppShell />
    </UserModeProvider>
  );
}
