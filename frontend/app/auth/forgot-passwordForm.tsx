"use client";

import { ReactNode } from "react";

interface ForgotPasswordFormProps {
  children: ReactNode;
}

export default function ForgotPasswordForm({
  children,
}: ForgotPasswordFormProps) {
  return (
    <div className="rounded-xl bg-white p-8 shadow-lg">
      {children}
    </div>
  );
}