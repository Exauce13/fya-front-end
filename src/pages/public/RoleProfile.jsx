import { Navigate } from "react-router-dom";

import ArtisanProfile from "./ArtisanProfile";
import AdminPlaceholder from "../admin/AdminPlaceholder";
import ClientProfile from "../client/ClientProfile";
import { useUserMode } from "../../context/useUserMode";

export default function RoleProfile() {
  const { isVisitor, isClient, isAdmin } = useUserMode();

  if (isVisitor) return <Navigate to="/login" replace />;
  if (isAdmin) return <AdminPlaceholder />;
  if (isClient) return <ClientProfile />;
  return <ArtisanProfile />;
}
