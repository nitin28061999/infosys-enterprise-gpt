"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { settingsApi, ApiError } from "@/lib/api";

export default function AccountSettings() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  async function handleSave() {
    setStatus("saving");
    setError(null);
    try {
      await settingsApi.updateProfile(name, email);
      setStatus("saved");
    } catch (err) {
      setStatus("error");
      setError(err instanceof ApiError ? err.message : "Failed to save changes.");
    }
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="mb-6 text-2xl font-bold">Account Settings</h2>

      <div className="space-y-4">
        <input
          className="w-full rounded-lg border p-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full rounded-lg border p-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          onClick={handleSave}
          disabled={status === "saving"}
          className="rounded-lg bg-blue-600 px-6 py-3 text-white disabled:opacity-60"
        >
          {status === "saving" ? "Saving..." : status === "saved" ? "Saved" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
