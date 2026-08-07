"use client";

import { useEffect, useState } from "react";
import { settingsApi, ApiError, type NotificationPreferences } from "@/lib/api";

const defaults: NotificationPreferences = {
  email: true,
  system: true,
  updates: false,
};

export default function NotificationSettings() {
  const [prefs, setPrefs] = useState<NotificationPreferences>(defaults);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    settingsApi
      .getPreferences()
      .then((p) => setPrefs(p.notifications))
      .catch(() => {
        // Fall back to defaults if the endpoint isn't available yet.
      })
      .finally(() => setLoading(false));
  }, []);

  async function toggle(key: keyof NotificationPreferences) {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    try {
      await settingsApi.updateNotifications(next);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save preference.");
      setPrefs(prefs); // revert on failure
    }
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="mb-6 text-2xl font-bold">Notification Settings</h2>

      {error && (
        <p className="mb-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="space-y-4">
        <label className="flex items-center justify-between">
          Email Notifications
          <input
            type="checkbox"
            checked={prefs.email}
            disabled={loading}
            onChange={() => toggle("email")}
          />
        </label>

        <label className="flex items-center justify-between">
          System Alerts
          <input
            type="checkbox"
            checked={prefs.system}
            disabled={loading}
            onChange={() => toggle("system")}
          />
        </label>

        <label className="flex items-center justify-between">
          Product Updates
          <input
            type="checkbox"
            checked={prefs.updates}
            disabled={loading}
            onChange={() => toggle("updates")}
          />
        </label>
      </div>
    </div>
  );
}
