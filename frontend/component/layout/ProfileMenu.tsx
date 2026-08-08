"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    setOpen(false);
    router.push("/");
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 rounded-full p-1 hover:bg-gray-100">
        <UserCircle size={34} />
        {user && <span className="hidden text-sm font-medium text-slate-700 sm:inline">{user.name}</span>}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border bg-white shadow-lg">
          {user && (
            <div className="border-b px-5 py-3">
              <p className="font-medium text-slate-800">{user.name}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
          )}
          <Link href="/settings" className="block px-5 py-3 hover:bg-gray-100">👤 My Profile</Link>
          <Link href="/dashboard" className="block px-5 py-3 hover:bg-gray-100">📊 Dashboard</Link>
          <Link href="/settings" className="block px-5 py-3 hover:bg-gray-100">⚙ Settings</Link>
          <button onClick={handleLogout} className="w-full px-5 py-3 text-left text-red-600 hover:bg-red-50">
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  );
}
