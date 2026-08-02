import Link from "next/link";

const actions = [
  { title: "Open AI Chat", href: "/chat" },
  { title: "Upload Documents", href: "/upload" },
  { title: "View Analytics", href: "/analytics" },
  { title: "Manage Admin", href: "/admin" },
];

export default function QuickAction() {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold">
        Quick Actions
      </h2>

      <div className="grid gap-4">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="rounded-lg bg-blue-600 px-5 py-3 text-center font-medium text-white transition hover:bg-blue-700"
          >
            {action.title}
          </Link>
        ))}
      </div>
    </div>
  );
}