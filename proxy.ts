import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Admin gate: /admin/* (login page + auth API are excluded from matcher below)
  const adminSession = request.cookies.get("admin_session")?.value;
  if (!adminSession) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Only guard the admin pages — the public site is open. Match the bare
    // /admin dashboard and everything under it, excluding the /admin/login
    // page so visitors can reach the login form. The /api/admin/* routes are
    // not matched here; each one self-gates on admin_session internally.
    "/admin",
    "/admin/((?!login).*)",
  ],
};
