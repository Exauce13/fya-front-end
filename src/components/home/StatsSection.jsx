import { BriefcaseBusiness, Heart, UserCheck } from "lucide-react";

const stats = [
  { icon: UserCheck, value: "+5 000", label: "Artisans" },
  { icon: Heart, value: "+12 000", label: "Clients satisfaits" },
  { icon: BriefcaseBusiness, value: "+8 000", label: "Projets réalisés" },
];

export default function StatsSection() {
  return (
    <div className="mt-6 grid max-w-2xl grid-cols-1 gap-4 text-white sm:grid-cols-3">
      {stats.map(({ icon: Icon, value, label }) => (
        <div key={label} className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/12 text-[#F59D52]">
            <Icon size={20} />
          </span>
          <span>
            <strong className="block text-lg leading-none">{value}</strong>
            <span className="text-xs font-semibold text-white/78">{label}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
