"use client";

import { useState } from "react";
import Link from "next/link";
import { UserCircle } from "lucide-react";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="rounded-full p-1 hover:bg-gray-100"
      >
        <UserCircle size={34} />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border bg-white shadow-lg">
          <Link
            href="/settings"
            className="block px-5 py-3 hover:bg-gray-100"
          >
            👤 My Profile
          </Link>

          <Link
            href="/dashboard"
            className="block px-5 py-3 hover:bg-gray-100"
          >
            📊 Dashboard
          </Link>

          <Link
            href="/settings"
            className="block px-5 py-3 hover:bg-gray-100"
          >
            ⚙ Settings
          </Link>

          <button
            className="w-full px-5 py-3 text-left text-red-600 hover:bg-red-50"
          >
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  );
}