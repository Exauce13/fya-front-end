import { Link } from "react-router-dom";

import { findUserProfile } from "../../data/userProfiles";

const normalizeRole = (type) => {
  const value = String(type || "").toLowerCase();
  if (["artisan", "artisans"].includes(value)) return "artisan";
  if (["client", "clients"].includes(value)) return "client";
  return "";
};

export default function UserNameLink({
  name,
  id,
  type,
  path,
  state,
  className = "",
  children,
  onClick,
}) {
  const profile = findUserProfile(name);
  const role = normalizeRole(type || profile.type);
  const targetPath = path || (
    id && role === "artisan"
      ? `/artisans/${id}`
      : id && role === "client"
      ? `/clients/${id}`
      : profile.path
  );
  const targetState = state || (
    id && role === "artisan"
      ? { artisan: { id, name } }
      : id && role === "client"
      ? { client: { id, name } }
      : undefined
  );

  if (!targetPath) {
    return (
      <span className={className}>
        {children || name}
      </span>
    );
  }

  return (
    <Link
      to={targetPath}
      state={targetState}
      onClick={onClick}
      className={`transition hover:text-[#145DA0] hover:underline ${className}`}
    >
      {children || name}
    </Link>
  );
}
