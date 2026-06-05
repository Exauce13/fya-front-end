import { ShieldCheck } from "lucide-react";

export default function VerificationBadge({ verified }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-extrabold ${
        verified
          ? "bg-[#145DA0] text-white"
          : "bg-[#fff3e9] text-[#C96B2C]"
      }`}
    >
      <ShieldCheck size={14} />
      {verified ? "Vérifié" : "Non vérifié"}
    </span>
  );
}
