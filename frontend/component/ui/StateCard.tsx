import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  change?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  change,
}: StatCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-md transition hover:shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-gray-600">{title}</h3>
        {icon}
      </div>

      <h2 className="mt-4 text-3xl font-bold text-slate-800">
        {value}
      </h2>

      {change && (
        <p className="mt-2 text-sm text-green-600">
          {change}
        </p>
      )}
    </div>
  );
}