const logs = [
  {
    id: 1,
    user: "Admin",
    action: "Uploaded HR Policy.pdf",
    time: "2 mins ago",
  },
  {
    id: 2,
    user: "Knowledge Owner",
    action: "Updated Engineering Guide",
    time: "15 mins ago",
  },
  {
    id: 3,
    user: "Employee",
    action: "Asked AI about Leave Policy",
    time: "30 mins ago",
  },
];

export default function AuditTable() {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <table className="w-full">
        <thead className="bg-slate-100">
          <tr>
            <th className="px-6 py-3 text-left">User</th>
            <th className="px-6 py-3 text-left">Activity</th>
            <th className="px-6 py-3 text-left">Time</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log) => (
            <tr
              key={log.id}
              className="border-t hover:bg-slate-50"
            >
              <td className="px-6 py-4">{log.user}</td>
              <td className="px-6 py-4">{log.action}</td>
              <td className="px-6 py-4">{log.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}