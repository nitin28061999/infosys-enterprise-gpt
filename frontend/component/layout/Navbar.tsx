import Link from "next/link";
import Logo from "../common/Logo";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Logo />

        <nav className="flex items-center gap-6">
          <Link href="/" className="text-slate-700 hover:text-blue-600">
            Home
          </Link>

          <Link href="/dashboard" className="text-slate-700 hover:text-blue-600">
            Dashboard
          </Link>

          <Link href="/chat" className="text-slate-700 hover:text-blue-600">
            AI Chat
          </Link>

          <Link href="/upload" className="text-slate-700 hover:text-blue-600">
            Upload
          </Link>

          <Link
            href="/login"
            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}