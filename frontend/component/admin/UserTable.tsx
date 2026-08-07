"use client";

import { useEffect, useState } from "react";
import { adminApi, ApiError, type UserResponse } from "@/lib/api";

export default function UserTable() {
  const [users, setUsers] = useState<UserResponse[]>([]);
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
            <th className="px-6 py-3 text-left">Department</th>
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

          {users.map((u) => (
            <tr key={u.id} className="border-t hover:bg-slate-50">
              <td className="px-6 py-4">{u.name}</td>
              <td className="px-6 py-4">{u.email}</td>
              <td className="px-6 py-4">{u.department}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
