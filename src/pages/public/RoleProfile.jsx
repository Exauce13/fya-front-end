import { Navigate, useLocation } from "react-router-dom";

import ArtisanProfile from "./ArtisanProfile";
import AdminPlaceholder from "../admin/AdminPlaceholder";
import ClientProfile from "../client/ClientProfile";
import { useUserMode } from "../../context/useUserMode";
import NotFound from "./NotFound";

const isSuspended = (user) => {
  const status = String(
    user?.status ||
    user?.statut_compte ||
    user?.account_status ||
    user?.etat ||
    ""
  ).toLowerCase();

  return status.includes("suspend");
};

export default function RoleProfile() {
  const location = useLocation();
  const { user, isVisitor, isClient, isAdmin } = useUserMode();

  if (isVisitor) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (isSuspended(user)) {
    return (
      <NotFound
        title="Compte suspendu"
        message="Votre compte est suspendu et l'accès au profil est temporairement désactivé."
      />
    );
  }

  if (isAdmin) return <AdminPlaceholder />;
  if (isClient) return <ClientProfile />;
  return <ArtisanProfile />;
}
