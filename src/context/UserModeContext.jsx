import { useEffect, useMemo, useState } from "react";

import { labels, UserModeContext, users } from "./userModeContext";
import { API_BASE_URL, authStorage } from "../services/apiClient";

const apiOrigin = API_BASE_URL.replace(/\/api\/?$/, "");

const normalizeRole = (status) => {
  const value = String(status || "").toLowerCase();

  if (["artisans", "artisan"].includes(value)) return "artisan";
  if (["clients", "client"].includes(value)) return "client";
  if (["admin", "admins", "administrateur", "administrateurs"].includes(value)) return "admin";
  return "visitor";
};

const resolvePhoto = (photo) => {
  if (!photo) return null;
  if (/^https?:\/\//i.test(photo)) return photo;
  return `${apiOrigin}/storage/${String(photo).replace(/^\/?storage\/?/, "")}`;
};

const normalizeUser = (rawUser) => {
  if (!rawUser) return null;

  const role = normalizeRole(rawUser.statut || rawUser.role);
  const fallback = users[role] || users.client;
  const avatar = resolvePhoto(rawUser.photo || rawUser.avatar) || fallback?.avatar;

  return {
    ...fallback,
    ...rawUser,
    role,
    name: rawUser.name || rawUser.nom || fallback?.name || "Utilisateur FYA",
    email: rawUser.email || fallback?.email || "",
    avatar,
  };
};

export function UserModeProvider({ children }) {
  const [sessionUser, setSessionUser] = useState(() =>
    normalizeUser(authStorage.getUser())
  );

  useEffect(() => {
    const syncAuth = () => {
      setSessionUser(normalizeUser(authStorage.getUser()));
    };

    window.addEventListener(authStorage.eventName, syncAuth);
    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener(authStorage.eventName, syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  const role = sessionUser?.role || "visitor";

  const setRole = (nextRole) => {
    if (nextRole === "visitor") {
      authStorage.clear();
    }
  };

  const value = useMemo(
    () => ({
      role,
      user: sessionUser,
      labels,
      setRole,
      isVisitor: role === "visitor",
      isArtisan: role === "artisan",
      isClient: role === "client",
      isAdmin: role === "admin",
    }),
    [role, sessionUser]
  );

  return (
    <UserModeContext.Provider value={value}>
      {children}
    </UserModeContext.Provider>
  );
}
