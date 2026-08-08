"use client";

import { useAuth } from "@/lib/auth-context";

// PATCH /api/user/{user_id} exists but is admin-only -- a user can't edit
// their own profile via the backend yet. Showing real info read-only.
export default function AccountSettings() {
  const { user } = useAuth();
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="mb-6 text-2xl font-bold">Account Settings</h2>
      <div className="space-y-4 text-sm">
        <div><p className="text-slate-500">Name</p><p className="font-medium">{user?.name ?? "—"}</p></div>
        <div><p className="text-slate-500">Email</p><p className="font-medium">{user?.email ?? "—"}</p></div>
        <div><p className="text-slate-500">Department</p><p className="font-medium">{user?.department ?? "—"}</p></div>
      </div>
      <p className="mt-6 text-xs text-slate-400">
        Self-service profile editing isn&apos;t available yet — the backend only allows admins to update user records.
      </p>
    </div>
  );
}
