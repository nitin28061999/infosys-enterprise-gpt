import { redirect } from "next/navigation";

// Canonical login route is /auth/login. This exists purely so a stray
// /login link (bookmark, external doc, muscle memory) doesn't 404.
export default function LoginRedirect() {
  redirect("/auth/login");
}
