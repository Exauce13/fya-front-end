import { useEffect, useState } from "react";
import AdminCards from "../../components/admin/AdminCards";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { CityShareChart, RegistrationChart } from "../../components/admin/StatisticsCharts";
import { getAdminOverview } from "../../services/adminService";
import { getApiMessage } from "../../services/apiClient";

export default function AdminDashboard() {
  const [overview, setOverview] = useState({
    stats: {},
    registrations: [],
    city_share: [],
    category_activity: [],
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadOverview() {
      try {
        const payload = await getAdminOverview();
        if (active) {
          setOverview({
            stats: payload?.stats || payload?.overview || {},
            registrations: payload?.registrations || payload?.registration_series || [],
            city_share: payload?.city_share || payload?.cities || [],
            category_activity: payload?.category_activity || payload?.categories || [],
          });
          setMessage("");
        }
      } catch (error) {
        if (active) setMessage(getApiMessage(error, "Impossible de charger les statistiques admin."));
      }
    }

    loadOverview();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Vue d'ensemble" />
      {message && <p className="rounded-lg border border-[#F0C5C0] bg-white p-4 text-sm font-bold text-[#B42318]">{message}</p>}
      <AdminCards stats={overview.stats} />

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <RegistrationChart series={overview.registrations} />
        <CityShareChart shares={overview.city_share} />
      </div>

      <article className="rounded-lg border border-[#E8DED2] bg-white p-5 shadow-sm">
        <h2 className="mb-5 text-xl font-black">Activité par métier</h2>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {overview.category_activity.map((category) => (
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
