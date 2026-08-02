const users = [
  {
    id: 1,
    name: "John Smith",
    email: "john@infosys.com",
    role: "Admin",
  },
  {
    id: 2,
    name: "Emily Johnson",
    email: "emily@infosys.com",
    role: "Knowledge Owner",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael@infosys.com",
    role: "Employee",
  },
];

export default function UserTable() {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <table className="w-full">
        <thead className="bg-slate-100">
          <tr>
            <th className="px-6 py-3 text-left">Name</th>
            <th className="px-6 py-3 text-left">Email</th>
            <th className="px-6 py-3 text-left">Role</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-t hover:bg-slate-50"
            >
              <td className="px-6 py-4">{user.name}</td>
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}