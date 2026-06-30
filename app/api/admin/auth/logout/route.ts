import { NextRequest, NextResponse } from "next/server";

// GET /api/admin/auth/logout
// Intentionally outside the admin_session gate (proxy.ts excludes api/admin/auth).
// Clears the admin_session cookie and redirects to the home page.
export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/", request.url));
  // Mirror the cookie attributes from login/route.ts, with maxAge 0 to expire.
  response.cookies.set("admin_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
