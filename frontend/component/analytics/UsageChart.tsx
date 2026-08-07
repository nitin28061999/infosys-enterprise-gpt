import type { DepartmentUsage } from "@/lib/api";

interface UsageChartProps {
  data: DepartmentUsage[];
}

export default function UsageChart({ data }: UsageChartProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold">Department Usage</h2>

      {data.map((dept) => (
        <div key={dept.name} className="mb-5">
          <div className="mb-2 flex justify-between">
            <span>{dept.name}</span>
            <span>{dept.usage}%</span>
          </div>

          <div className="h-3 rounded-full bg-slate-200">
            <div
              className="h-3 rounded-full bg-green-600"
              style={{ width: `${dept.usage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
