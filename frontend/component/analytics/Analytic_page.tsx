import Navbar from "@/component/layout/Navbar";
import Sidebar from "@/component/layout/Sidebar";
import Footer from "@/component/layout/Footer";

import PageHeader from "@/component/common/Pageheader";

import AnalyticsCard from "@/component/analytics/AnalyticsCard";
import QueryChart from "@/component/analytics/QueryChart";
import UsageChart from "@/component/analytics/UsageChart";
import FeedbackChart from "@/component/analytics/FeedbackChart";

export default function AnalyticsPage() {
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

          <div className="mb-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <AnalyticsCard
              title="Total Queries"
              value="18,240"
              subtitle="This month"
            />

            <AnalyticsCard
              title="Documents Indexed"
              value="2,156"
              subtitle="Knowledge base"
            />

            <AnalyticsCard
              title="Active Users"
              value="486"
              subtitle="Last 30 days"
            />

            <AnalyticsCard
              title="Average Accuracy"
              value="96.8%"
              subtitle="AI responses"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <QueryChart />
            <UsageChart />
          </div>

          <div className="mt-6">
            <FeedbackChart />
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}