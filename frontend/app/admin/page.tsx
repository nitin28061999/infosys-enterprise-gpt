"use client";

import Navbar from "@/component/layout/Navbar";
import Sidebar from "@/component/layout/Sidebar";
import Footer from "@/component/layout/Footer";
import PageHeader from "@/component/common/Pageheader";
import UserTable from "@/component/admin/UserTable";
import { useAuth } from "@/lib/auth-context";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  if (loading) return null;

  return (
    <>
      <Navbar />

      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />

        <main className="flex-1 p-8">
          <PageHeader
            title="Admin Panel"
            description="Manage users in your enterprise workspace."
          />

          {!isAdmin ? (
            <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 text-center shadow">
              <p className="text-slate-600">
                This page is restricted to Admins. Your account role is{" "}
                <span className="font-semibold">{user?.role ?? "unknown"}</span>.
              </p>
            </div>
          ) : (
            <section>
              <h2 className="mb-4 text-xl font-semibold text-slate-800">
                User Management
              </h2>
              <UserTable />

              <p className="mt-4 text-sm text-slate-400">
                Roles, connectors, and audit-log views aren&apos;t available —
                the backend doesn&apos;t expose those endpoints yet.
              </p>
            </section>
          )}
        </main>
      </div>

      <Footer />
    </>
  );
}
