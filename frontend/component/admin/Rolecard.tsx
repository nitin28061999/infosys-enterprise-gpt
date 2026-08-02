interface RoleCardProps {
  title: string;
  users: number;
  description: string;
}

export default function RoleCard({
  title,
  users,
  description,
}: RoleCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>

      <p className="mt-2 text-sm text-slate-600">{description}</p>

      <div className="mt-5">
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
          {users} Users
        </span>
      </div>
    </div>
  );
}