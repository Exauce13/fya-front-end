import { Link } from "react-router-dom";

import { useUserMode } from "../../context/useUserMode";
import { findUserProfile } from "../../data/userProfiles";

const normalizeRole = (type) => {
  const value = String(type || "").toLowerCase();
  if (["artisan", "artisans"].includes(value)) return "artisan";
  if (["client", "clients"].includes(value)) return "client";
  return "";
};

const sameId = (first, second) => {
  if (!first || !second) return false;
  return String(first) === String(second);
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
  const { user } = useUserMode();
  const profile = findUserProfile(name);
  const role = normalizeRole(type || profile.type);
  const ownArtisanId = user?.artisan?.id || user?.artisan_p?.id || user?.artisan_id || user?.artisanP?.id;
  const ownClientId = user?.client?.id || user?.client_id;
  const targetUserId = state?.artisan?.userId || state?.client?.userId || state?.userId;
  const isOwnProfile =
    Boolean(user?.id) &&
    (
      sameId(targetUserId, user.id) ||
      (role === "artisan" && sameId(id, ownArtisanId)) ||
      (role === "client" && sameId(id, ownClientId)) ||
      (!role && sameId(id, user.id))
    );
  const targetPath = isOwnProfile
    ? "/profile"
    : path || (
      id && role === "artisan"
      ? `/artisans/${id}`
      : id && role === "client"
      ? `/clients/${id}`
      : profile.path
    );
  const targetState = isOwnProfile ? undefined : state || (
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
