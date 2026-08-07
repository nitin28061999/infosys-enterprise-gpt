"use client";

import { useEffect, useState } from "react";
import { adminApi, ApiError, type AuditEntry } from "@/lib/api";

export default function AuditTable() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .getAuditLog()
      .then(setLogs)
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Failed to load audit log.")
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <table className="w-full">
        <thead className="bg-slate-100">
          <tr>
            <th className="px-6 py-3 text-left">User</th>
            <th className="px-6 py-3 text-left">Activity</th>
            <th className="px-6 py-3 text-left">Time</th>
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr>
              <td className="px-6 py-4 text-slate-400" colSpan={3}>
                Loading audit log...
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

          {!loading && !error && logs.length === 0 && (
            <tr>
              <td className="px-6 py-4 text-slate-400" colSpan={3}>
                No audit entries yet.
              </td>
            </tr>
          )}

          {logs.map((log) => (
            <tr key={log.id} className="border-t hover:bg-slate-50">
              <td className="px-6 py-4">{log.user}</td>
              <td className="px-6 py-4">{log.action}</td>
              <td className="px-6 py-4">{log.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
