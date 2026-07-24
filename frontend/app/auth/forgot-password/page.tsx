"use client";

import { useState } from "react";
import Link from "next/link";
import Input from "@/component/ui/Input";
import Button from "@/component/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();

    console.log(email);

    // TODO:
    // Connect Supabase Password Reset
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

        <form onSubmit={handleReset} className="space-y-5">

          <Input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button type="submit" className="w-full">
            Send Reset Link
          </Button>

        </form>

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