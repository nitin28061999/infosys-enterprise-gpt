"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/component/ui/Input";
import Button from "@/component/ui/Button";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await signup(form.fullName, form.email, form.password);
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Unable to create account."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-lg">

        <h1 className="mb-2 text-center text-3xl font-bold">
          Create Account
        </h1>

        <p className="mb-8 text-center text-slate-500">
          Register to use Enterprise GPT
        </p>

        <form onSubmit={handleSignup} className="space-y-5">

          <Input
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            required
          />

          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Creating account..." : "Sign Up"}
          </Button>

        </form>

        <p className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-blue-600"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}
