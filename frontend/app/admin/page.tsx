"use client";

import { useEffect, useState } from "react";
import Navbar from "@/component/layout/Navbar";
import Sidebar from "@/component/layout/Sidebar";
import Footer from "@/component/layout/Footer";
import PageHeader from "@/component/common/Pageheader";
import RoleCard from "@/component/admin/Rolecard";
import ConnectorCard from "@/component/admin/ConnectorCard";
import UserTable from "@/component/admin/UserTable";
import AuditTable from "@/component/admin/AuditTable";
import {
  adminApi,
  ApiError,
  type RoleSummary,
  type ConnectorStatus,
} from "@/lib/api";

export default function AdminPage() {
  const [roles, setRoles] = useState<RoleSummary[]>([]);
  const [connectors, setConnectors] = useState<ConnectorStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([adminApi.getRoles(), adminApi.getConnectors()])
      .then(([r, c]) => {
        setRoles(r);
        setConnectors(c);
      })
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Failed to load admin data.")
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
            title="Admin Panel"
            description="Manage users, enterprise roles, connectors, and audit logs."
          />

          {error && (
            <p className="mb-6 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          {/* Role Cards */}
          <section className="mb-10">
            <h2 className="mb-4 text-xl font-semibold text-slate-800">
              User Roles
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-40 animate-pulse rounded-xl border border-slate-200 bg-white"
                    />
                  ))
                : roles.map((role) => (
                    <RoleCard
                      key={role.title}
                      title={role.title}
                      users={role.users}
                      description={role.description}
                    />
                  ))}
            </div>
          </section>

          {/* Connector Cards */}
          <section className="mb-10">
            <h2 className="mb-4 text-xl font-semibold text-slate-800">
              Enterprise Connectors
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-40 animate-pulse rounded-xl border border-slate-200 bg-white"
                    />
                  ))
                : connectors.map((connector) => (
                    <ConnectorCard
                      key={connector.name}
                      name={connector.name}
                      status={connector.status}
                      description={connector.description}
                    />
                  ))}
            </div>
          </section>

          {/* Users */}
          <section className="mb-10">
            <h2 className="mb-4 text-xl font-semibold text-slate-800">
              User Management
            </h2>

            <UserTable />
          </section>

          {/* Audit Logs */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-slate-800">
              Audit Logs
            </h2>

            <AuditTable />
          </section>
        </main>
      </div>

      <Footer />
    </>
  );
}
