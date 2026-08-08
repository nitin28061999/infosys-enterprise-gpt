"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { analyticsApi, ApiError, type AnalyticsMetrics } from "@/lib/api";

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useAuth();
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    if (!isAdmin) { setLoading(false); return; }
    analyticsApi.getMetrics()
      .then(setMetrics)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load analytics."))
      .finally(() => setLoading(false));
  }, [isAdmin]);

  if (authLoading) return null;

  return (
    <main className="min-h-screen bg-slate-100 p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="mt-1 text-slate-600">Live counts from the backend.</p>
          </div>
          <Link href="/dashboard" className="text-sm font-medium text-blue-700 hover:underline">Dashboard</Link>
        </header>

        {!isAdmin ? (
          <div className="mt-8 rounded-xl bg-white p-8 text-center shadow-sm">
            <p className="text-slate-600">
              Analytics are restricted to Admins. Your account role is{" "}
              <span className="font-semibold">{user?.role ?? "unknown"}</span>.
            </p>
          </div>
        ) : error ? (
          <p className="mt-6 text-sm text-red-600" role="alert">{error}</p>
        ) : loading || !metrics ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-white shadow-sm" />
            ))}
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="Documents" value={metrics.total_documents} />
            <Metric label="Queries" value={metrics.total_queries} />
            <Metric label="Feedback" value={metrics.total_feedback} />
            <Metric label="Avg Response Time" value={`${metrics.average_response_time} ms`} />
          </div>
        )}
      </div>
    </main>
  );
}
