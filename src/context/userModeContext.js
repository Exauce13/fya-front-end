import { createContext } from "react";

export const users = {
  visitor: null,
  artisan: {
    role: "artisan",
    name: "Hervé A.",
    email: "herve@fya.bj",
    avatar: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=300&q=80",
    trade: "Menuiserie",
  },
  client: {
    role: "client",
    name: "John Doe",
    email: "john@fya.bj",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  admin: {
    role: "admin",
    name: "Admin FYA",
    email: "admin@fya.bj",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
};

export const labels = {
  visitor: "Visiteur",
  artisan: "Artisan",
  client: "Client",
  admin: "Admin",
};

export const UserModeContext = createContext(null);
