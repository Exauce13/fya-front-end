const statusStyles = {
  Actif: "bg-[#E8F6EC] text-[#237847]",
  Suspendu: "bg-[#FDECEC] text-[#B42318]",
  Surveillance: "bg-[#FFF4DF] text-[#A15C00]",
  "En attente": "bg-[#FFF4DF] text-[#A15C00]",
  "A revoir": "bg-[#F1EEFB] text-[#6049B5]",
  Validé: "bg-[#E8F6EC] text-[#237847]",
  Ouvert: "bg-[#E8F6EC] text-[#237847]",
  Terminé: "bg-[#F1F5F9] text-[#475569]",
  Nouveau: "bg-[#FDECEC] text-[#B42318]",
  "En cours": "bg-[#EFF6FF] text-[#1F5B87]",
  Payé: "bg-[#E8F6EC] text-[#237847]",
  Publié: "bg-[#E8F6EC] text-[#237847]",
  Masqué: "bg-[#FDECEC] text-[#B42318]",
};

export function StatusPill({ status }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${statusStyles[status] || "bg-slate-100 text-slate-700"}`}>
      {status}
    </span>
  );
}

export default function AdminTable({ columns, rows, actions }) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#E8DED2] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead className="bg-[#FBF7F2] text-xs uppercase text-[#75695F]">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-5 py-4 font-black">
                  {column.label}
                </th>
              ))}
              {actions && <th className="px-5 py-4 font-black">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFE6DD]">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-[#FBF7F2]">
                {columns.map((column) => (
                  <td key={column.key} className="px-5 py-4 text-sm font-semibold text-[#2F3742]">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
                {actions && <td className="px-5 py-4">{actions(row)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
