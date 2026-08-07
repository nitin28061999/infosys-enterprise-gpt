"use client";

import { useEffect, useState } from "react";
import { settingsApi, ApiError, type UserPreferences } from "@/lib/api";

export default function ThemeSettings() {
  const [theme, setTheme] = useState<UserPreferences["theme"]>("Light");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    settingsApi
      .getPreferences()
      .then((p) => setTheme(p.theme))
      .catch(() => {
        // Fall back to Light if the endpoint isn't available yet.
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleChange(next: UserPreferences["theme"]) {
    const previous = theme;
    setTheme(next);
    try {
      await settingsApi.updateTheme(next);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save theme.");
      setTheme(previous);
    }
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="mb-6 text-2xl font-bold">Theme</h2>

      {error && (
        <p className="mb-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <select
        className="w-full rounded-lg border p-3"
        value={theme}
        disabled={loading}
        onChange={(e) => handleChange(e.target.value as UserPreferences["theme"])}
      >
        <option>Light</option>
        <option>Dark</option>
        <option>System</option>
      </select>
    </div>
  );
}
