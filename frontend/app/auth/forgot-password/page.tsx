"use client";

import { useState } from "react";
import Link from "next/link";
import Input from "@/component/ui/Input";
import Button from "@/component/ui/Button";
import { authApi, ApiError } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Unable to send reset link."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">

        <h1 className="mb-2 text-center text-3xl font-bold">
          Forgot Password
        </h1>

        <p className="mb-8 text-center text-slate-500">
          Enter your email to receive a password reset link.
        </p>

        {sent ? (
          <p className="rounded-lg bg-green-50 p-4 text-center text-green-700">
            If an account exists for {email}, a reset link is on its way.
          </p>
        ) : (
          <form onSubmit={handleReset} className="space-y-5">

            <Input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Sending..." : "Send Reset Link"}
            </Button>

          </form>
        )}

        <p className="mt-6 text-center text-sm">
          <Link
            href="/auth/login"
            className="font-semibold text-blue-600"
          >
            Back to Login
          </Link>
        </p>

      </div>
    </div>
  );
}
