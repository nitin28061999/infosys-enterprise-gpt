import Navbar from "@/component/layout/Navbar";
import Sidebar from "@/component/layout/Sidebar";
import Footer from "@/component/layout/Footer";

import PageHeader from "@/component/common/Pageheader";

import RoleCard from "@/component/admin/Rolecard";
import ConnectorCard from "@/component/admin/ConnectorCard";
import UserTable from "@/component/admin/UserTable";
import AuditTable from "@/component/admin/AuditTable";

export default function AdminPage() {
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

          {/* Role Cards */}
          <section className="mb-10">
            <h2 className="mb-4 text-xl font-semibold text-slate-800">
              User Roles
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <RoleCard
                title="Administrator"
                users={4}
                description="Full access to platform configuration and user management."
              />

              <RoleCard
                title="Knowledge Owner"
                users={12}
                description="Manage enterprise documents and knowledge repositories."
              />

              <RoleCard
                title="Employee"
                users={156}
                description="Search enterprise knowledge and interact with Enterprise GPT."
              />
            </div>
          </section>

          {/* Connector Cards */}
          <section className="mb-10">
            <h2 className="mb-4 text-xl font-semibold text-slate-800">
              Enterprise Connectors
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <ConnectorCard
                name="SharePoint"
                status="Connected"
                description="Enterprise document repository."
              />

              <ConnectorCard
                name="GitHub"
                status="Disconnected"
                description="Engineering repositories."
              />

              <ConnectorCard
                name="Jira"
                status="Connected"
                description="Project and issue tracking."
              />

              <ConnectorCard
                name="Confluence"
                status="Disconnected"
                description="Knowledge base and documentation."
              />
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