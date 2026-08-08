"use client";

import Link from "next/link";

// No password-reset endpoint exists on the backend yet (checked
// backend/src/auth/auth_router.py directly). Saying so plainly instead of
// showing a form that would silently fail.
export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg text-center">
        <h1 className="mb-4 text-3xl font-bold">Forgot Password</h1>
        <p className="text-slate-600">
          Password reset isn&apos;t available yet — this needs a backend
          endpoint that hasn&apos;t been built. Contact your administrator
          directly to reset your password for now.
        </p>
        <Link href="/login" className="mt-6 inline-block font-semibold text-blue-600">
          Back to Login
        </Link>
      </div>
    </div>
  );
}
