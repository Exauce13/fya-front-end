import { useLocation, useNavigate } from "react-router-dom";
import { useUserMode } from "../../context/useUserMode";

const roles = ["visitor", "artisan", "client", "admin"];

export default function UserModeSwitcher() {
  const { role, labels, setRole } = useUserMode();
  const navigate = useNavigate();
  const location = useLocation();

  const handleRoleChange = (item) => {
    setRole(item);

    if (item === "admin") {
      navigate("/admin");
      return;
    }

    if (location.pathname.startsWith("/admin")) {
      navigate("/");
    }
  };

  return (
    <div className="fixed bottom-3 left-1/2 z-[90] w-[min(720px,calc(100vw-24px))] -translate-x-1/2 rounded-xl border border-[#eadfd3] bg-white/95 p-2 shadow-2xl backdrop-blur">
      <div className="grid grid-cols-4 gap-1">
        {roles.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => handleRoleChange(item)}
            className={`min-h-10 rounded-lg px-2 text-xs font-extrabold transition sm:text-sm ${
              role === item
                ? "bg-[#102437] text-white"
                : "text-[#182433] hover:bg-[#fff3ea]"
            }`}
          >
            {labels[item]}
          </button>
        ))}
      </div>
    </div>
  );
}
