import Link from "next/link";

const menu = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Enterprise GPT", href: "/chat" },
  { name: "Upload", href: "/upload" },
  { name: "Analytics", href: "/analytics" },
  { name: "Admin", href: "/admin" },
];

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="border-b p-6">
        <h2 className="text-xl font-bold">Workspace</h2>
      </div>

      <nav className="flex flex-col gap-2 p-4">
        {menu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-lg px-4 py-3 text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}