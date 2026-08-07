"use client";

import { useEffect, useState } from "react";
import Navbar from "@/component/layout/Navbar";
import Sidebar from "@/component/layout/Sidebar";
import Footer from "@/component/layout/Footer";
import PageHeader from "@/component/common/Pageheader";
import StatCard from "@/component/dashboard/StateCard";
import QuickAction from "@/component/dashboard/QuickAction";
import { useAuth } from "@/lib/auth-context";
import { analyticsApi, type AnalyticsMetrics } from "@/lib/api";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    if (!isAdmin) return;
    analyticsApi.getMetrics().then(setMetrics).catch(() => {
      // Admin-only endpoint — if it fails, just skip the extra stat cards.
    });
  }, [isAdmin]);

  if (authLoading) return null;

  return (
    <>
      <Navbar />

      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />

        <main className="flex-1 p-8">
          <PageHeader
            title={`Welcome${user ? `, ${user.name}` : ""}`}
            description="Infosys AI Knowledge Assistant"
          />

          <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Role"
              value={user?.role ?? "—"}
              change={`Department: ${user?.department ?? "—"}`}
            />

            {isAdmin && metrics && (
              <>
                <StatCard
                  title="Documents"
                  value={String(metrics.total_documents)}
                  change={`${metrics.completed_documents} indexed`}
                />
                <StatCard
                  title="Queries"
                  value={String(metrics.total_queries)}
                  change={`${metrics.successful_answers} answered`}
                />
                <StatCard
                  title="Feedback"
                  value={String(metrics.total_feedback)}
                  change={`${metrics.helpful_feedback} helpful`}
                />
              </>
            )}
          </div>

          <QuickAction />
        </main>
      </div>

      <Footer />
    </>
  );
}
