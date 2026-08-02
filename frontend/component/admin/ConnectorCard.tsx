interface ConnectorCardProps {
  name: string;
  status: "Connected" | "Disconnected";
  description: string;
}

export default function ConnectorCard({
  name,
  status,
  description,
}: ConnectorCardProps) {
  const connected = status === "Connected";

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">{name}</h2>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            connected
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status}
        </span>
      </div>

      <p className="mt-3 text-sm text-slate-600">
        {description}
      </p>

      <button className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
        Configure
      </button>
    </div>
  );
}