// PUT /api/admin/rsvps
// Admin-only: upsert a single guest's RSVP on their behalf.
// Mirrors validation/response style of app/(main)/api/rsvp/submit/route.ts.
// Uses supabaseAdmin (service-role) — server-only, never imported in client code.

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isMealChoice } from "@/lib/rsvp/meal-options";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function PUT(request: NextRequest) {
  // PRIMARY authz — every /api/admin/* Route Handler must gate on admin_session.
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

  const { guest_id, household_id, attending, meal_choice, dietary_restrictions } =
    body as {
      guest_id?: unknown;
      household_id?: unknown;
      attending?: unknown;
      meal_choice?: unknown;
      dietary_restrictions?: unknown;
    };

  // Validate guest_id
  if (
    !guest_id ||
    typeof guest_id !== "string" ||
    !UUID_RE.test(guest_id)
  ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Validate household_id
  if (
    !household_id ||
    typeof household_id !== "string" ||
    !UUID_RE.test(household_id)
  ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Validate attending is boolean
  if (typeof attending !== "boolean") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // When attending, meal_choice must be a valid option.
  // When not attending, force meal_choice and dietary_restrictions to null.
  if (attending) {
    if (!isMealChoice(meal_choice)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
  }

  const row = {
    guest_id,
    household_id,
    attending,
    meal_choice: attending ? (meal_choice as string) : null,
    dietary_restrictions: attending
      ? typeof dietary_restrictions === "string"
        ? dietary_restrictions || null
        : null
      : null,
  };

  const { error } = await supabaseAdmin
    .from("rsvps")
    .upsert(row, { onConflict: "guest_id" });

  if (error) {
    console.error("Admin RSVP upsert error:", JSON.stringify({ code: (error as { code?: string }).code, message: error.message }));
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
