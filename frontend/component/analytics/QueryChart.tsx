export default function QueryChart() {
  const data = [
    { month: "Jan", value: 120 },
    { month: "Feb", value: 210 },
    { month: "Mar", value: 180 },
    { month: "Apr", value: 260 },
    { month: "May", value: 320 },
    { month: "Jun", value: 410 },
  ];

  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">Monthly Queries</h2>

      <div className="flex h-64 items-end justify-between gap-4">
        {data.map((item) => (
          <div key={item.month} className="flex flex-1 flex-col items-center">
            <div
              className="w-full rounded-t-lg bg-blue-600 transition-all"
              style={{
                height: `${(item.value / max) * 180}px`,
              }}
            />

            <span className="mt-2 text-sm">
              {item.month}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}