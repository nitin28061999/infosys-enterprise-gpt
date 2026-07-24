interface ProgressBarProps {
  value: number;
  label?: string;
}

export default function ProgressBar({
  value,
  label,
}: ProgressBarProps) {
  return (
    <div className="w-full">
      {label && (
        <div className="mb-2 flex justify-between text-sm">
          <span>{label}</span>
          <span>{value}%</span>
        </div>
      )}

      <div className="h-3 rounded-full bg-gray-200">
        <div
          className="h-3 rounded-full bg-blue-600 transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}