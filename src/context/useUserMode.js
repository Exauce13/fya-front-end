import { useContext } from "react";

import { UserModeContext } from "./userModeContext";

export function useUserMode() {
  const context = useContext(UserModeContext);
  if (!context) {
    throw new Error("useUserMode must be used inside UserModeProvider");
  }
  return context;
}
