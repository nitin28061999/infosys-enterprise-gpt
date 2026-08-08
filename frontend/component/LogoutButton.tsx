"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export function LogoutButton({ className }: { className?: string }) {
  const { logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <button
      onClick={handleLogout}
      className={
        className ??
        "text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
      }
    >
      Log out
    </button>
  );
}