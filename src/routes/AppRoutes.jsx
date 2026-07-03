import { Route, Routes } from "react-router-dom";

import RoleGate from "../components/routes/RoleGate";
import NotFound from "../pages/public/NotFound";
import AdminRoutes from "./AdminRoutes.jsx";
import { artisanRoutes } from "./ArtisanRoutes.jsx";
import { authRoutes } from "./AuthRoutes.jsx";
import { clientRoutes } from "./ClientRoutes.jsx";
import { publicRoutes } from "./PublicRoutes.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      {publicRoutes}
      {artisanRoutes}
      {clientRoutes}
      {authRoutes}
      <Route
        path="/admin/*"
        element={
          <RoleGate allow={["admin"]}>
            <AdminRoutes />
          </RoleGate>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
