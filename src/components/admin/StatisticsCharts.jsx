export function RegistrationChart({ series = [] }) {
  const chartSeries = series.length ? series : [{ month: "", value: 0 }];
  const maxValue = Math.max(...chartSeries.map((item) => Number(item.value || 0)), 1);
  const points = chartSeries.map((item, index) => {
    const x = 12 + index * 11;
    const y = 88 - (Number(item.value || 0) / maxValue) * 72;
    return `${x},${y}`;
  });

  return (
    <article className="rounded-lg border border-[#E8DED2] bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-black">Evolution des inscriptions</h2>
        <span className="text-sm font-bold text-[#1F5B87]">+18 ce mois</span>
      </div>
      <svg viewBox="0 0 100 100" className="h-64 w-full overflow-visible">
        {[20, 40, 60, 80].map((y) => (
          <line key={y} x1="8" x2="98" y1={y} y2={y} stroke="#EFE6DD" strokeWidth="0.8" />
        ))}
        <polyline fill="none" stroke="#1F5B87" strokeWidth="2.5" points={points.join(" ")} />
        {points.map((point, index) => {
          const [x, y] = point.split(",");
          return <circle key={`${chartSeries[index].month}-${index}`} cx={x} cy={y} r="1.8" fill="#1F5B87" />;
        })}
      </svg>
      <div className="grid grid-cols-9 gap-1 text-center text-xs font-semibold text-[#8A7E75]">
        {chartSeries.map((item, index) => (
          <span key={`${item.month}-${index}`}>{item.month}</span>
        ))}
      </div>
    </article>
  );
}

const cityPalette = ["#1D6FA5", "#E4A33D", "#2E9A43", "#C9553D", "#6D5BD0", "#0F766E"];

const getCityLabel = (item, index) =>
  item.city || item.ville || item.name || item.label || `Ville ${index + 1}`;

const getCityValue = (item) =>
  Number(item.value ?? item.percentage ?? item.percent ?? item.total ?? item.count ?? item.users ?? 0);

const normalizeCityShares = (shares) => {
  if (!Array.isArray(shares)) return [];

  return shares
    .map((item, index) => ({
      city: getCityLabel(item, index),
      value: Math.max(0, Math.min(100, getCityValue(item))),
      color: item.color || item.couleur || cityPalette[index % cityPalette.length],
    }))
    .filter((item) => item.city && item.value > 0);
};

export function CityShareChart({ shares = [] }) {
  const normalizedShares = normalizeCityShares(shares);
  const chartShares = normalizedShares.length ? normalizedShares : [{ city: "Aucune", value: 100, color: "#D7CABD" }];
  const circumference = 100;
  const segments = chartShares.reduce((acc, item, index) => {
    const previous = acc[index - 1];
    const strokeDashoffset = index === 0 ? 25 : previous.strokeDashoffset - previous.value;
    return [...acc, { ...item, strokeDashoffset }];
  }, []);

  return (
    <article className="rounded-lg border border-[#E8DED2] bg-white p-5 shadow-sm">
      <h2 className="mb-5 text-xl font-black">Répartition par ville</h2>
      <div className="flex flex-col items-center gap-5 sm:flex-row">
        <svg viewBox="0 0 42 42" className="h-52 w-52 -rotate-90">
          <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#F0E7DF" strokeWidth="8" />
          {segments.map((item) => {
            const strokeDasharray = `${item.value} ${circumference - item.value}`;
            return (
              <circle
                key={item.city}
                cx="21"
                cy="21"
                r="15.915"
                fill="transparent"
                stroke={item.color}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={item.strokeDashoffset}
                strokeWidth="8"
              />
            );
          })}
        </svg>
        <div className="space-y-3">
          {chartShares.map((item) => (
            <div key={item.city} className="flex items-center gap-3 text-sm font-bold">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span>{item.city}</span>
              <span className="text-[#8A7E75]">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
