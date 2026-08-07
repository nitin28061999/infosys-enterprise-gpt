import type { WeeklyPoint } from "@/lib/api";

interface DashboardChartProps {
  data: WeeklyPoint[];
}

export default function DashboardChart({ data }: DashboardChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">Weekly AI Queries</h2>

      <div className="flex h-60 items-end justify-between gap-3">
        {data.map((point) => (
          <div
            key={point.label}
            className="flex-1 rounded-t-lg bg-blue-600"
            style={{ height: `${(point.value / max) * 180}px` }}
          />
        ))}
      </div>

      <div className="mt-3 flex justify-between text-sm text-slate-500">
        {data.map((point) => (
          <span key={point.label}>{point.label}</span>
        ))}
      </div>
    </div>
  );
}
