import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // PRIMARY authz — proxy.ts does NOT cover /api/admin/* (falls to guest gate)
  const adminSession = request.cookies.get("admin_session")?.value;
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params; // Must await — params is a Promise in Next.js 16

  if (!id || !UUID_RE.test(id)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
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

  const { full_name, household_id } = body as {
    full_name?: unknown;
    household_id?: unknown;
  };

  const fields: Record<string, string> = {};

  if (full_name !== undefined) {
    if (
      typeof full_name !== "string" ||
      full_name.trim().length === 0
    ) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    fields.full_name = full_name.trim();
  }

  if (household_id !== undefined) {
    if (
      typeof household_id !== "string" ||
      !UUID_RE.test(household_id)
    ) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    fields.household_id = household_id;
  }

  if (Object.keys(fields).length === 0) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("guests")
    .update(fields)
    .eq("id", id);

  if (error) {
    console.error("Guest update error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // PRIMARY authz — proxy.ts does NOT cover /api/admin/* (falls to guest gate)
  const adminSession = request.cookies.get("admin_session")?.value;
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params; // Must await — params is a Promise in Next.js 16

  if (!id || !UUID_RE.test(id)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // D-09: delete rsvps row FIRST (no DB FK cascade — Phase 4 D-04).
  // A missing rsvps row (guest never RSVP'd) is harmless — proceed regardless.
  const { error: rsvpDeleteError } = await supabaseAdmin
    .from("rsvps")
    .delete()
    .eq("guest_id", id);

  if (rsvpDeleteError) {
    // Log but do not fail — the rsvps row may not exist (guest never RSVP'd).
    // Only a failure to delete the guest itself is fatal.
    console.error("RSVP delete error (non-fatal):", rsvpDeleteError);
  }

  const { error: guestDeleteError } = await supabaseAdmin
    .from("guests")
    .delete()
    .eq("id", id);

  if (guestDeleteError) {
    console.error("Guest delete error:", guestDeleteError);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
