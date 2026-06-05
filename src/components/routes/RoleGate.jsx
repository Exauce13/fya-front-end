import { Navigate } from "react-router-dom";

import { useUserMode } from "../../context/useUserMode";

export default function RoleGate({ children, allow = ["artisan", "client"], fallback = "/login" }) {
  const { role } = useUserMode();

  if (!allow.includes(role)) {
    return <Navigate to={fallback} replace />;
  }

  return children;
}
