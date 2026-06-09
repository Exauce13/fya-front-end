import { BadgeCheck, Users, Wallet } from "lucide-react";
import { adminOverview } from "../../data/adminData";

const cards = [
  { label: "Utilisateurs", value: adminOverview.users, icon: Users, bg: "bg-white" },
  { label: "Artisans", value: adminOverview.artisans, icon: BadgeCheck, bg: "bg-[#EFF8F0]" },
  { label: "Chiffre d'Affaire", value: `${adminOverview.turnover} FCFA`, icon: Wallet, bg: "bg-[#F1EEFB]" },
];

export default function AdminCards() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map(({ label, value, icon: Icon, bg }) => (
        <article key={label} className={`${bg} rounded-lg border border-[#E8DED2] p-6 shadow-sm`}>
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-[#102D42]/8 text-[#102D42]">
            <Icon size={22} />
          </div>
          <p className="text-3xl font-black tracking-normal text-[#111827]">{value}</p>
          <p className="mt-2 text-sm font-bold text-[#4B5563]">{label}</p>
        </article>
      ))}
    </section>
  );
}
