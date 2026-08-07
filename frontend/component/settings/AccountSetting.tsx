"use client";

import { useAuth } from "@/lib/auth-context";

// The backend's PATCH /api/user/{user_id} is admin-only — a regular user
// can't update their own profile yet. Showing real account info read-only
// rather than a form that would fail for most users.
export default function AccountSettings() {
  const { user } = useAuth();

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="mb-6 text-2xl font-bold">Account Settings</h2>

      <div className="space-y-4 text-sm">
        <div>
          <p className="text-slate-500">Name</p>
          <p className="font-medium text-slate-800">{user?.name ?? "—"}</p>
        </div>
        <div>
          <p className="text-slate-500">Email</p>
          <p className="font-medium text-slate-800">{user?.email ?? "—"}</p>
        </div>
        <div>
          <p className="text-slate-500">Department</p>
          <p className="font-medium text-slate-800">{user?.department ?? "—"}</p>
        </div>
        <div>
          <p className="text-slate-500">Role</p>
          <p className="font-medium text-slate-800">{user?.role ?? "—"}</p>
        </div>
      </div>

      <p className="mt-6 text-xs text-slate-400">
        Self-service profile editing isn&apos;t available yet — the backend
        only allows admins to update user records.
      </p>
    </div>
  );
}
