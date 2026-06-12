import { useUserMode } from "../../context/useUserMode";
import NotFound from "../../pages/public/NotFound";

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

export default function RoleGate({ children, allow = ["artisan", "client"] }) {
  const { role, user } = useUserMode();

  if (isSuspended(user)) {
    return (
      <NotFound
        title="Compte suspendu"
        message="Ce compte est suspendu et ne peut pas accéder à cette page."
      />
    );
  }

  if (!allow.includes(role)) {
    return (
      <NotFound
        title="Accès non autorisé"
        message="Vous n'avez pas les droits nécessaires pour accéder à cette page."
      />
    );
  }

  return children;
}
