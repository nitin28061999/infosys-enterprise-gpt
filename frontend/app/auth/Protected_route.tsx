"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  isAuthenticated?: boolean;
  children: ReactNode;
}

export default function ProtectedRoute({
  isAuthenticated = false,
  children,
}: ProtectedRouteProps) {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}