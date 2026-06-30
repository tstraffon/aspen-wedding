import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin gate: /admin/* (login page + auth API are excluded from matcher below)
  if (pathname.startsWith("/admin")) {
    const adminSession = request.cookies.get("admin_session")?.value;
    if (!adminSession) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Guest gate (existing behavior — unchanged)
  const session = request.cookies.get("session")?.value;

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except /login, admin/login, static files, and Next.js internals
    "/((?!login|admin/login|api/auth|api/admin/auth|_next/static|_next/image|favicon\\.ico|.*\\.jpg$|.*\\.png$|.*\\.svg$|.*\\.webp$).*)",
  ],
};
