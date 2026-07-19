interface StatCardProps {
  title: string;
  value: string;
  change: string;
}

export default function StatCard({
  title,
  value,
  change,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <h3 className="text-sm font-medium text-slate-500">
        {title}
      </h3>

      <h2 className="mt-3 text-4xl font-bold text-slate-900">
        {value}
      </h2>

      <p className="mt-2 text-sm text-green-600">
        {change}
      </p>
    </div>
  );
}