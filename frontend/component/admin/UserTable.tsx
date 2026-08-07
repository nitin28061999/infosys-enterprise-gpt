"use client";

import { useEffect, useState } from "react";
import { adminApi, ApiError, type AdminUser } from "@/lib/api";

export default function UserTable() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .getUsers()
      .then(setUsers)
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Failed to load users.")
      )
      .finally(() => setLoading(false));
  }, []);

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
          {loading && (
            <tr>
              <td className="px-6 py-4 text-slate-400" colSpan={3}>
                Loading users...
              </td>
            </tr>
          )}

          {error && (
            <tr>
              <td className="px-6 py-4 text-red-600" colSpan={3} role="alert">
                {error}
              </td>
            </tr>
          )}

          {!loading && !error && users.length === 0 && (
            <tr>
              <td className="px-6 py-4 text-slate-400" colSpan={3}>
                No users found.
              </td>
            </tr>
          )}

          {users.map((user) => (
            <tr key={user.id} className="border-t hover:bg-slate-50">
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
