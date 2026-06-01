/**
 * POST /api/rsvp/submit
 *
 * v0.2 RSVP write endpoint — accepts a household_id + array of per-guest
 * submissions, validates them, runs a pre-flight cross-household authz check,
 * then writes them atomically to public.rsvps via a single batched upsert
 * keyed on guest_id.
 *
 * Decision IDs implemented:
 *   - D-04: no FK to guests; the pre-flight `SELECT id FROM guests WHERE household_id = $1`
 *           + `submissions.every(s => validIds.has(s.guest_id))` is the substitute defense.
 *   - D-13: sanitized 5xx response vocabulary. PostgREST/Postgres error fragments
 *           never reach the response body; they are logged via console.error only.
 *   - D-14: POST verb, body shape `{ household_id, submissions: [{ guest_id, attending,
 *           meal_choice?, dietary_restrictions? }] }`, app-layer meal enum.
 *   - D-15: single batched `.upsert(rows, { onConflict: "guest_id" })` — PostgREST
 *           translates this into ONE SQL statement (`INSERT ... ON CONFLICT (guest_id)
 *           DO UPDATE ... RETURNING ...`). Postgres guarantees statement-level
 *           atomicity: the entire statement either commits or rolls back.
 *           Smoke #9 in Plan 04-03 Task 2 proves zero partial writes by submitting
 *           an intra-payload duplicate guest_id (which ON CONFLICT cannot resolve
 *           within a single statement).
 *   - D-16: analog `app/(main)/api/rsvp/route.ts` left unmodified.
 *
 * The meal enum below is a placeholder per CONTEXT Claude's Discretion.
 * Phase 6 / MEAL-02 swaps it for the real menu in a one-line change.
 */
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Placeholder meal enum — Phase 6 / MEAL-02 swaps this with the real menu (one-line change).
const MEAL_ENUM = ["chicken", "fish", "vegetarian"] as const;
type MealChoice = (typeof MEAL_ENUM)[number];

type Submission = {
  guest_id: string;
  attending: boolean;
  meal_choice?: string;
  dietary_restrictions?: string;
};

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { household_id, submissions } = body as {
    household_id?: unknown;
    submissions?: unknown;
  };

  // (a) household_id must be a uuid
  if (
    !household_id ||
    typeof household_id !== "string" ||
    !UUID_RE.test(household_id)
  ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // (b) submissions must be a non-empty array
  if (!Array.isArray(submissions) || submissions.length === 0) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // (c) every submission has guest_id (uuid) + attending (boolean)
  // (d) attending=true requires meal_choice from MEAL_ENUM
  for (const raw of submissions) {
    if (!raw || typeof raw !== "object") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const s = raw as Submission;
    if (
      !s.guest_id ||
      typeof s.guest_id !== "string" ||
      !UUID_RE.test(s.guest_id)
    ) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    if (typeof s.attending !== "boolean") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    if (s.attending) {
      if (
        typeof s.meal_choice !== "string" ||
        !MEAL_ENUM.includes(s.meal_choice as MealChoice)
      ) {
        return NextResponse.json(
          { error: "Invalid request" },
          { status: 400 }
        );
      }
    }
  }

  // Env-var read + fail-fast (Phase 1 pattern; module-call-time, sanitized 500).
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase env vars not configured");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Pre-flight authz (D-04 substitute defense for absent FK):
  // every submitted guest_id must belong to the claimed household_id.
  const { data: householdGuests, error: authErr } = await supabase
    .from("guests")
    .select("id")
    .eq("household_id", household_id);

  if (authErr) {
    console.error("Household authz lookup error:", authErr);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  const validIds = new Set((householdGuests ?? []).map((g) => g.id));

  // Empty set means bogus household_id OR an emptied guest list — either way,
  // the submission cannot be authorized.
  if (validIds.size === 0) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const typedSubmissions = submissions as Submission[];
  const allBelong = typedSubmissions.every((s) => validIds.has(s.guest_id));
  if (!allBelong) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Build upsert rows. v0.1-only columns are intentionally omitted from the
  // payload — D-05 documents that v0.2 upsert rows leave the legacy columns
  // (name, email, note) NULL; v0.1 rows (with NULL guest_id) are not touched
  // because the partial unique index `rsvps_guest_id_uniq` is
  // `WHERE guest_id IS NOT NULL`.
  const rows = typedSubmissions.map((s) => ({
    household_id,
    guest_id: s.guest_id,
    attending: s.attending,
    meal_choice: s.attending ? s.meal_choice ?? null : null,
    dietary_restrictions: s.dietary_restrictions ?? null,
  }));

  // D-15 / B-1: single batched upsert — ONE SQL statement, statement-level atomic.
  // The `onConflict: "guest_id"` clause engages the `rsvps_guest_id_uniq` partial
  // unique index from Plan 04-01. If any row in the batch violates a constraint
  // (e.g. intra-payload duplicate guest_id), the entire statement rolls back and
  // zero rows are written. Smoke #9 verifies.
  // Why .rpc() instead of .upsert():
  //   Postgres requires SELECT permission on the conflict-target column for
  //   INSERT ... ON CONFLICT DO UPDATE. Anon has only INSERT + UPDATE on
  //   rsvps (D-07) — direct .upsert() fails with PG error 42501. The
  //   submit_rsvps(jsonb) function in SCHEMA.sql is SECURITY DEFINER, so it
  //   runs as the table owner; anon only gets EXECUTE on the function.
  //   Statement-level atomicity is preserved (the function does one INSERT
  //   ... ON CONFLICT statement and lets Postgres errors propagate).
  const { error: rpcErr } = await supabase.rpc("submit_rsvps", {
    p_rows: rows,
  });

  if (rpcErr) {
    console.error(
      "RSVP submit_rsvps error:",
      JSON.stringify({
        code: (rpcErr as { code?: string }).code,
        message: rpcErr.message,
      })
    );
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, count: rows.length });
}
