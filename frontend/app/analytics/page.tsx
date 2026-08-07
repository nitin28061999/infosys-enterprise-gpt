"use client";

import { useEffect, useState } from "react";
import Navbar from "@/component/layout/Navbar";
import Sidebar from "@/component/layout/Sidebar";
import Footer from "@/component/layout/Footer";
import PageHeader from "@/component/common/Pageheader";
import AnalyticsCard from "@/component/analytics/AnalyticsCard";
import QueryChart from "@/component/analytics/QueryChart";
import UsageChart from "@/component/analytics/UsageChart";
import FeedbackChart from "@/component/analytics/FeedbackChart";
import { analyticsApi, ApiError, type AnalyticsSummary } from "@/lib/api";

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    analyticsApi
      .getSummary()
      .then(setSummary)
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Failed to load analytics.")
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />

      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />

        <main className="flex-1 p-8">
          <PageHeader
            title="Analytics Dashboard"
            description="Monitor enterprise AI usage, document activity, and user engagement."
          />

          {error && (
            <p className="mb-6 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <div className="mb-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {loading || !summary
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-32 animate-pulse rounded-xl border border-slate-200 bg-white"
                  />
                ))
              : summary.cards.map((card) => (
                  <AnalyticsCard
                    key={card.title}
                    title={card.title}
                    value={card.value}
                    subtitle={card.subtitle}
                  />
                ))}
          </div>

          {summary && (
            <>
              <div className="grid gap-6 lg:grid-cols-2">
                <QueryChart data={summary.queryVolume} />
                <UsageChart data={summary.usage} />
              </div>

              <div className="mt-6">
                <FeedbackChart data={summary.feedback} />
              </div>
            </>
          )}
        </main>
      </div>

      <Footer />
    </>
  );
}
