import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const session = request.cookies.get("session")?.value;

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except /login, static files, and Next.js internals
    "/((?!login|api/auth|_next/static|_next/image|favicon\\.ico|.*\\.jpg$|.*\\.png$|.*\\.svg$|.*\\.webp$).*)",
  ],
};
