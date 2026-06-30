import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { password } = await request.json();
  const accessCode = process.env.ADMIN_ACCESS_CODE;

  if (!accessCode) {
    return NextResponse.json(
      { error: "Access code not configured" },
      { status: 500 }
    );
  }

  if (password !== accessCode) {
    return NextResponse.json(
      { error: "Invalid access code" },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_session", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 90, // 90 days
  });

  return response;
}
