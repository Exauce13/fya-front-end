import { BadgeCheck, UserRound, Users, Wallet } from "lucide-react";

const formatNumber = (value) =>
  Number(value || 0).toLocaleString("fr-FR");

export default function AdminCards({ stats = {} }) {
  const cards = [
    { label: "Utilisateurs", value: formatNumber(stats.users), icon: Users, bg: "bg-white" },
    { label: "Clients", value: formatNumber(stats.clients), icon: UserRound, bg: "bg-[#F7FBFF]" },
    { label: "Artisans", value: formatNumber(stats.artisans), icon: BadgeCheck, bg: "bg-[#EFF8F0]" },
    { label: "Chiffre d'affaires", value: `${formatNumber(stats.turnover)} FCFA`, icon: Wallet, bg: "bg-[#F1EEFB]" },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
