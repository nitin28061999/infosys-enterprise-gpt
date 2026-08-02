export default function DashboardChart() {
  const weekly = [45, 60, 70, 85, 90, 75, 100];
  const max = Math.max(...weekly);

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">
        Weekly AI Queries
      </h2>

      <div className="flex h-60 items-end justify-between gap-3">
        {weekly.map((value, index) => (
          <div
            key={index}
            className="flex-1 rounded-t-lg bg-blue-600"
            style={{
              height: `${(value / max) * 180}px`,
            }}
          />
        ))}
      </div>

      <div className="mt-3 flex justify-between text-sm text-slate-500">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span>Sun</span>
      </div>
    </div>
  );
}