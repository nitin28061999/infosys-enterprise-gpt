"use client";

import { useState } from "react";
import { settingsApi, ApiError } from "@/lib/api";

export default function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleChangePassword() {
    setStatus("saving");
    setError(null);
    try {
      await settingsApi.changePassword(currentPassword, newPassword);
      setStatus("saved");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof ApiError ? err.message : "Failed to change password.");
    }
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="mb-6 text-2xl font-bold">Security</h2>

      <div className="space-y-4">
        <input
          type="password"
          placeholder="Current Password"
          className="w-full rounded-lg border p-3"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="New Password"
          className="w-full rounded-lg border p-3"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          onClick={handleChangePassword}
          disabled={status === "saving" || !currentPassword || !newPassword}
          className="rounded-lg bg-red-600 px-6 py-3 text-white disabled:opacity-60"
        >
          {status === "saving"
            ? "Updating..."
            : status === "saved"
            ? "Password Updated"
            : "Change Password"}
        </button>
      </div>
    </div>
  );
}
