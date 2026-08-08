"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { adminApi, ApiError, type UserResponse } from "@/lib/api";

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    if (!isAdmin) { setLoading(false); return; }
    adminApi.getUsers()
      .then(setUsers)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load users."))
      .finally(() => setLoading(false));
  }, [isAdmin]);

  if (authLoading) return null;

  return (
    <main className="min-h-screen bg-slate-100 p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Admin</h1>
            <p className="mt-1 text-slate-600">Manage users in your enterprise workspace.</p>
          </div>
          <Link href="/dashboard" className="text-sm font-medium text-blue-700 hover:underline">Dashboard</Link>
        </header>

        {!isAdmin ? (
          <div className="mt-8 rounded-xl bg-white p-8 text-center shadow-sm">
            <p className="text-slate-600">
              This page is restricted to Admins. Your account role is{" "}
              <span className="font-semibold">{user?.role ?? "unknown"}</span>.
            </p>
          </div>
        ) : (
          <section className="mt-8 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Users</h2>

            {error && <p className="mt-4 text-sm text-red-600" role="alert">{error}</p>}
            {loading && <p className="mt-4 text-sm text-slate-400">Loading users...</p>}

            {!loading && !error && (
              <table className="mt-4 w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-slate-500">
                    <th className="py-2">Name</th>
                    <th className="py-2">Email</th>
                    <th className="py-2">Department</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b">
                      <td className="py-2">{u.name}</td>
                      <td className="py-2">{u.email}</td>
                      <td className="py-2">{u.department}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <p className="mt-6 text-sm text-slate-400">
              Roles, connectors, and audit-log views aren&apos;t available yet —
              the backend doesn&apos;t expose those endpoints.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
