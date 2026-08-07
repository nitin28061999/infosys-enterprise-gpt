import type { FeedbackBreakdown } from "@/lib/api";

interface FeedbackChartProps {
  data: FeedbackBreakdown;
}

export default function FeedbackChart({ data }: FeedbackChartProps) {
  const rows: { label: string; value: number; color: string }[] = [
    { label: "Positive", value: data.positive, color: "bg-green-600" },
    { label: "Neutral", value: data.neutral, color: "bg-yellow-500" },
    { label: "Negative", value: data.negative, color: "bg-red-600" },
  ];

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">AI Feedback</h2>

      <div className="space-y-5">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="mb-2 flex justify-between">
              <span>{row.label}</span>
              <span>{row.value}%</span>
            </div>

            <div className="h-3 rounded-full bg-slate-200">
              <div
                className={`h-3 rounded-full ${row.color}`}
                style={{ width: `${row.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
