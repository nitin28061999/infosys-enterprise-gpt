"use client";

import { useState } from "react";
import Link from "next/link";
import Input from "@/component/ui/Input";
import Button from "@/component/ui/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    console.log({
      email,
      password,
    });

    // TODO:
    // Connect Supabase Authentication
    // Redirect to Dashboard
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800">
            Enterprise GPT
          </h1>

          <p className="mt-2 text-slate-500">
            Sign in to continue
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="mb-2 block font-medium">
              Email
            </label>

            <Input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Password
            </label>

            <Input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between text-sm">

            <label className="flex items-center gap-2">

              <input type="checkbox" />

              Remember Me

            </label>

            <Link
              href="/auth/forgot-password"
              className="text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>

          </div>

          <Button
            type="submit"
            className="w-full"
          >
            Login
          </Button>

        </form>

        <div className="mt-6 text-center text-sm">

          Don't have an account?{" "}

          <Link
            href="/auth/signup"
            className="font-semibold text-blue-600 hover:underline"
          >
            Sign Up
          </Link>

        </div>

        <div className="mt-8 border-t pt-5 text-center text-xs text-slate-500">
          © 2026 Infosys AI Knowledge Assistant
        </div>

      </div>
    </div>
  );
}