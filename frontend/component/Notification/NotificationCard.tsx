interface NotificationCardProps {
  title: string;
  message: string;
  time: string;
}

export default function NotificationCard({
  title,
  message,
  time,
}: NotificationCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <h3 className="font-semibold text-slate-800">
        {title}
      </h3>

      <p className="mt-1 text-sm text-gray-600">
        {message}
      </p>

      <p className="mt-3 text-xs text-gray-400">
        {time}
      </p>
    </div>
  );
}