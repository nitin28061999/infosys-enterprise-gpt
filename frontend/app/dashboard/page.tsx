"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { analyticsApi, type AnalyticsMetrics } from "@/lib/api";

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    if (!isAdmin) return;
    analyticsApi.getMetrics().then(setMetrics).catch(() => {});
  }, [isAdmin]);

  if (authLoading) return null;

  return (
    <main className="min-h-screen bg-slate-100 p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-medium text-blue-700">Infosys AI Knowledge Assistant</p>
            <h1 className="text-3xl font-bold text-slate-900">
              Welcome{user ? `, ${user.name}` : ""}
            </h1>
            <p className="mt-1 text-slate-600">
              Role: {user?.role ?? "—"} · Department: {user?.department ?? "—"}
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/upload" className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
              Upload documents
            </Link>
            <Link href="/chat" className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium hover:bg-slate-50">
              Open AI chat
            </Link>
          </div>
        </header>

        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Role" value={user?.role ?? "—"} />
          {isAdmin && metrics && (
            <>
              <Stat label="Documents" value={metrics.total_documents} />
              <Stat label="Queries" value={metrics.total_queries} />
              <Stat label="Feedback" value={metrics.total_feedback} />
            </>
          )}
        </section>

        {!isAdmin && (
          <p className="mt-6 text-sm text-slate-500">
            Workspace-wide stats are visible to Admins. Head to{" "}
            <Link href="/chat" className="text-blue-700 hover:underline">AI Chat</Link> to get started.
          </p>
        )}
      </div>
    </main>
  );
}
