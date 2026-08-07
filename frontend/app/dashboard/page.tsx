"use client";

import { useEffect, useState } from "react";
import Navbar from "@/component/layout/Navbar";
import Sidebar from "@/component/layout/Sidebar";
import Footer from "@/component/layout/Footer";
import PageHeader from "@/component/common/Pageheader";
import StatCard from "@/component/dashboard/StateCard";
import ActivityCard from "@/component/dashboard/ActivityCar";
import DashboardChart from "@/component/dashboard/DashBoardCharts";
import QuickAction from "@/component/dashboard/QuickAction";
import {
  dashboardApi,
  ApiError,
  type StatCardData,
  type WeeklyPoint,
  type ActivityItem,
} from "@/lib/api";

export default function DashboardPage() {
  const [cards, setCards] = useState<StatCardData[]>([]);
  const [weeklyQueries, setWeeklyQueries] = useState<WeeklyPoint[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([dashboardApi.getStats(), dashboardApi.getActivity()])
      .then(([stats, activity]) => {
        setCards(stats.cards);
        setWeeklyQueries(stats.weeklyQueries);
        setActivities(activity);
      })
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Failed to load dashboard.")
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
            title="Dashboard"
            description="Welcome to the Infosys AI Knowledge Assistant."
          />

          {error && (
            <p className="mb-6 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-32 animate-pulse rounded-xl border border-slate-200 bg-white"
                  />
                ))
              : cards.map((card) => (
                  <StatCard
                    key={card.title}
                    title={card.title}
                    value={card.value}
                    change={card.change}
                  />
                ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {!loading && <DashboardChart data={weeklyQueries} />}
            {!loading && <ActivityCard activities={activities} />}
          </div>

          <div className="mt-6">
            <QuickAction />
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}
