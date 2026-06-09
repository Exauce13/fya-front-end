import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ArtisanVerification from "../pages/admin/ArtisanVerification";
import OffersModeration from "../pages/admin/OffersModeration";
import PaymentsManagement from "../pages/admin/PaymentsManagement";
import ReportsManagement from "../pages/admin/ReportsManagement";
import UsersManagement from "../pages/admin/UsersManagement";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="utilisateurs" element={<UsersManagement />} />
        <Route path="verifications" element={<ArtisanVerification />} />
        <Route path="appels-offres" element={<OffersModeration />} />
        <Route path="signalements" element={<ReportsManagement />} />
        <Route path="paiements" element={<PaymentsManagement />} />
        <Route path="contenus" element={<Navigate to="/admin" replace />} />
        <Route path="statistiques" element={<Navigate to="/admin" replace />} />
        <Route path="parametres" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
}
