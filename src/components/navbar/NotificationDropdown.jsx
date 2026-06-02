import { Bell } from "lucide-react";

export default function NotificationDropdown() {
  return (
    <button className="relative">
      <Bell size={22} />

      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
        3
      </span>
    </button>
  );
}