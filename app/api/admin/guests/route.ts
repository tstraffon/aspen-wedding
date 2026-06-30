import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest) {
  // PRIMARY authz — proxy.ts does NOT cover /api/admin/* (falls to guest gate)
  const adminSession = request.cookies.get("admin_session")?.value;
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { household_id, full_name } = body as {
    household_id?: unknown;
    full_name?: unknown;
  };

  if (
    !household_id ||
    typeof household_id !== "string" ||
    !UUID_RE.test(household_id)
  ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (
    !full_name ||
    typeof full_name !== "string" ||
    full_name.trim().length === 0
  ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("guests")
    .insert({ household_id, full_name: full_name.trim() })
    .select()
    .single();

  if (error) {
    console.error("Guest insert error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, guest: data });
}
