interface AnalyticsCardProps {
  title: string;
  value: string;
  subtitle: string;
}

export default function AnalyticsCard({
  title,
  value,
  subtitle,
}: AnalyticsCardProps) {
  return (
    <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition">
      <h3 className="text-sm font-medium text-slate-500">{title}</h3>

      <p className="mt-3 text-4xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-500">
        {subtitle}
      </p>
    </div>
  );
}