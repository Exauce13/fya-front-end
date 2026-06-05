import AdminCards from "../../components/admin/AdminCards";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { CityShareChart, RegistrationChart } from "../../components/admin/StatisticsCharts";
import { StatusPill } from "../../components/admin/AdminTable";
import { adminOverview, adminReports } from "../../data/adminData";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <AdminPageHeader title="Vue d'ensemble" />
      <div className="grid gap-4 xl:grid-cols-[1fr_280px]">
        <AdminCards />
        <article className="rounded-lg border border-[#E8DED2] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <img src={adminOverview.support.avatar} alt="" className="h-16 w-16 rounded-full object-cover" />
            <div>
              <p className="text-lg font-black">{adminOverview.support.name}</p>
              <p className="text-sm font-bold text-[#75695F]">{adminOverview.support.role}</p>
              <p className="text-sm text-[#75695F]">{adminOverview.support.scope}</p>
            </div>
          </div>
        </article>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.3fr_1fr_280px]">
        <RegistrationChart />
        <CityShareChart />
        <article className="rounded-lg border border-[#E8DED2] bg-white p-5 shadow-sm">
          <h2 className="mb-5 text-xl font-black">Signalements récents</h2>
          <div className="space-y-4">
            {adminReports.map((report) => (
              <div key={report.id} className="rounded-lg border border-[#EFE6DD] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-black">{report.user}</p>
                    <p className="mt-1 text-sm font-semibold text-[#75695F]">{report.reason}</p>
                  </div>
                  <StatusPill status={report.status} />
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
