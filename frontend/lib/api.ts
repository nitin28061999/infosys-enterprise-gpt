"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import apiRequest from "@/lib/api";
import type {
  DashboardResponse,
} from "@/types/dashboard";

export default function DashboardPage() {
  const [dashboard, setDashboard] =
    useState<DashboardResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
// sourcery skip: avoid-function-declarations-in-blocks
    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);

        const data = await apiRequest<DashboardResponse>(
          "/dashboard"
        );

        setDashboard(data);
      } catch (err) {
        console.error("Dashboard error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 p-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-slate-900">
            Dashboard
          </h1>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-xl bg-white shadow"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 p-8">
        <div className="w-full max-w-lg rounded-xl bg-white p-8 text-center shadow">
          <h1 className="text-2xl font-bold text-red-600">
            Unable to load dashboard
          </h1>

          <p className="mt-3 text-slate-600">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (!dashboard) {
    return null;
  }

  const {
    stats,
    recent_documents,
    recent_queries,
  } = dashboard;

  return (
    <main className="min-h-screen bg-slate-100 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Dashboard
            </h1>

            <p className="mt-1 text-slate-600">
              Enterprise Knowledge Assistant overview
            </p>
          </div>

          <Link
            href="/upload"
            className="rounded-lg bg-blue-600 px-5 py-3 text-center font-medium text-white hover:bg-blue-700"
          >
            Upload Document
          </Link>
        </div>

        {/* Statistics */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            title="Total Documents"
            value={stats.total_documents}
          />

          <StatCard
            title="Total Queries"
            value={stats.total_queries}
          />

          <StatCard
            title="Total Users"
            value={stats.total_users}
          />

          <StatCard
            title="Successful Queries"
            value={stats.successful_queries}
          />

        </section>

        {/* Recent activity */}
        <section className="mt-8 grid gap-6 lg:grid-cols-2">

          {/* Documents */}
          <div className="rounded-xl bg-white p-6 shadow">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                Recent Documents
              </h2>

              <Link
                href="/upload"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                Upload
              </Link>
            </div>

            {recent_documents.length === 0 ? (
              <p className="text-slate-500">
                No documents available.
              </p>
            ) : (
              <div className="space-y-4">
                {recent_documents.map((document) => (
                  <div
                    key={document.id}
                    className="rounded-lg border border-slate-200 p-4"
                  >
                    <p className="font-medium text-slate-900">
                      {document.name}
                    </p>

                    {document.department && (
                      <p className="mt-1 text-sm text-slate-500">
                        {document.department}
                      </p>
                    )}

                    <p className="mt-1 text-xs text-slate-400">
                      {formatDate(document.uploaded_at)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Queries */}
          <div className="rounded-xl bg-white p-6 shadow">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                Recent Queries
              </h2>

              <Link
                href="/chat"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                Open Chat
              </Link>
            </div>

            {recent_queries.length === 0 ? (
              <p className="text-slate-500">
                No queries available.
              </p>
            ) : (
              <div className="space-y-4">
                {recent_queries.map((query) => (
                  <div
                    key={query.id}
                    className="rounded-lg border border-slate-200 p-4"
                  >
                    <p className="font-medium text-slate-900">
                      {query.query}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {formatDate(query.created_at)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </section>

      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-3 text-3xl font-bold text-slate-900">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleString();
}