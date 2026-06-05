import { useEffect, useMemo, useState } from "react";

import { labels, UserModeContext, users } from "./userModeContext";

export function UserModeProvider({ children }) {
  const [role, setRole] = useState(() => {
    const savedRole = localStorage.getItem("fya-user-mode");
    return users[savedRole] !== undefined ? savedRole : "artisan";
  });

  useEffect(() => {
    localStorage.setItem("fya-user-mode", role);
  }, [role]);

  const value = useMemo(
    () => ({
      role,
      user: users[role],
      labels,
      setRole,
      isVisitor: role === "visitor",
      isArtisan: role === "artisan",
      isClient: role === "client",
      isAdmin: role === "admin",
    }),
    [role]
  );

  return (
    <UserModeContext.Provider value={value}>
      {children}
    </UserModeContext.Provider>
  );
}
