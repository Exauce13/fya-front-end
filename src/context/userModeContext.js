import { createContext } from "react";
import profileAvatar from "../assets/images/profile-avatar.svg";

export const users = {
  visitor: null,
  artisan: {
    role: "artisan",
    name: "Artisan FYA",
    email: "",
    avatar: profileAvatar,
    trade: "",
  },
  client: {
    role: "client",
    name: "Client FYA",
    email: "",
    avatar: profileAvatar,
  },
  admin: {
    role: "admin",
    name: "Administrateur",
    email: "",
    avatar: profileAvatar,
  },
};

export const labels = {
  visitor: "Visiteur",
  artisan: "Artisan",
  client: "Client",
  admin: "Admin",
};

export const UserModeContext = createContext(null);
