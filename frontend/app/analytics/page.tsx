"use client";

import { useEffect, useState } from "react";
import Navbar from "@/component/layout/Navbar";
import Sidebar from "@/component/layout/Sidebar";
import Footer from "@/component/layout/Footer";
import PageHeader from "@/component/common/Pageheader";
import AnalyticsCard from "@/component/analytics/AnalyticsCard";
import { useAuth } from "@/lib/auth-context";
import { analyticsApi, ApiError, type AnalyticsMetrics } from "@/lib/api";

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useAuth();
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }
    analyticsApi
      .getMetrics()
      .then(setMetrics)
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Failed to load analytics.")
      )
      .finally(() => setLoading(false));
  }, [isAdmin]);

  if (authLoading) return null;

  return (
    <>
      <Navbar />

      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />

        <main className="flex-1 p-8">
          <PageHeader
            title="Analytics Dashboard"
            description="Monitor enterprise AI usage, document activity, and feedback."
          />

          {!isAdmin ? (
            <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 text-center shadow">
              <p className="text-slate-600">
                Analytics are restricted to Admins. Your account role is{" "}
                <span className="font-semibold">{user?.role ?? "unknown"}</span>.
              </p>
            </div>
          ) : (
            <>
              {error && (
                <p className="mb-6 text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}

              {loading || !metrics ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-32 animate-pulse rounded-xl border border-slate-200 bg-white"
                    />
                  ))}
                </div>
              ) : (
                <>
                  <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <AnalyticsCard
                      title="Documents"
                      value={String(metrics.total_documents)}
                      subtitle={`${metrics.completed_documents} indexed · ${metrics.failed_documents} failed`}
                    />
                    <AnalyticsCard
                      title="Queries"
                      value={String(metrics.total_queries)}
                      subtitle={`${metrics.successful_answers} answered · ${metrics.no_answer} no answer`}
                    />
                    <AnalyticsCard
                      title="Feedback"
                      value={String(metrics.total_feedback)}
                      subtitle={`${metrics.helpful_feedback} helpful · ${metrics.not_helpful_feedback} not helpful`}
                    />
                    <AnalyticsCard
                      title="Avg Response Time"
                      value={`${metrics.average_response_time} ms`}
                      subtitle="Across all queries"
                    />
                  </div>
                </>
              )}
            </>
          )}
        </main>
      </div>

      <Footer />
    </>
  );
}
