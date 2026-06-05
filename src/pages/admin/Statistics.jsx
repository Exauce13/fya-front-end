import AdminCards from "../../components/admin/AdminCards";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { CityShareChart, RegistrationChart } from "../../components/admin/StatisticsCharts";
import { adminCategories } from "../../data/adminData";

export default function Statistics() {
  return (
    <div className="space-y-6">
      <AdminPageHeader title="Statistiques" description="Lecture globale de l'activité de la plateforme par volume, ville et métier." />
      <AdminCards />
      <div className="grid gap-5 xl:grid-cols-2">
        <RegistrationChart />
        <CityShareChart />
      </div>
      <article className="rounded-lg border border-[#E8DED2] bg-white p-5 shadow-sm">
        <h2 className="mb-5 text-xl font-black">Activité par métier</h2>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {adminCategories.map((category) => (
            <div key={category.name} className="rounded-lg border border-[#EFE6DD] p-4">
              <p className="font-black">{category.name}</p>
              <div className="mt-3 h-2 rounded-full bg-[#F0E7DF]">
                <div className="h-2 rounded-full bg-[#1F5B87]" style={{ width: `${Math.min(category.artisans / 5, 100)}%` }} />
              </div>
              <p className="mt-3 text-sm font-semibold text-[#75695F]">{category.artisans} artisans · {category.offers} appels d'offres</p>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}
