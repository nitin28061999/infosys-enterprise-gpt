import Navbar from "@/component/layout/Navbar";
import Sidebar from "@/component/layout/Sidebar";
import Footer from "@/component/layout/Footer";

import PageHeader from "@/component/common/Pageheader";

import StatCard from "@/component/dashboard/StateCard";
import ActivityCard from "@/component/dashboard/ActivityCar";
import DashboardChart from "@/component/dashboard/DashBoardCharts";
import QuickAction from "@/component/dashboard/QuickAction";

export default function DashboardPage() {
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

          <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Documents"
              value="2,156"
              change="+24 this week"
            />

            <StatCard
              title="AI Queries"
              value="18,240"
              change="+12%"
            />

            <StatCard
              title="Active Users"
              value="486"
              change="+8%"
            />

            <StatCard
              title="Departments"
              value="12"
              change="All Connected"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <DashboardChart />
            <ActivityCard />
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