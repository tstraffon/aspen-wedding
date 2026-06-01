// POST /api/rsvp/lookup
//
// Phase 4 (v0.2 RSVP) read-side endpoint. Matches a guest name against
// public.guests via the `lookup_guest_by_name(p_name text)` SQL function
// (Plan 04-01, W-2: single implementation path), and on hit returns the
// full household so Phase 6's group form can render every member's row.
//
// Decisions implemented:
//   D-09: case-and-whitespace insensitive trim match (handled inside the
//         RPC function so the `guests_full_name_lower_idx` index engages
//         symmetrically — `lower(trim(stored)) = lower(trim(input))`).
//   D-10: no fuzzy match — `Sarah Else` and `Sarah Horan` must NOT collapse.
//   D-11: HTTP 200 on miss with `{ found: false }`. Miss is a business
//         outcome, not an error. Hit returns the full household, not just
//         the matched person.
//   D-13: sanitized 5xx vocabulary — no PostgREST error fragments echoed.
//   D-14: POST (not GET) so the name lives in the body, not in the
//         query-string proxy logs.
//   D-16: v0.1 `app/(main)/api/rsvp/route.ts` is NOT modified by this file.
//
// Carry-forward Phase 1 patterns:
//   - anon Supabase client only; no service-role-key fallback
//   - env reads at module-call time, fail-fast with sanitized 500
//   - SITE_ACCESS_CODE proxy gate (proxy.ts) fronts this route
//
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name } = body;

  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }

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

  const trimmedName = name.trim();

  // Match query via the SQL function (W-2: single implementation path).
  // The function applies `lower(trim(...))` symmetrically and is LIMIT 1.
  const { data: matches, error: lookupErr } = await supabase
    .rpc("lookup_guest_by_name", { p_name: trimmedName });

  if (lookupErr) {
    console.error("Guest lookup error:", lookupErr);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  // Miss (D-11): HTTP 200, not 404.
  if (!matches || matches.length === 0) {
    return NextResponse.json({ found: false });
  }

  // Hit: fetch full household so the group form can render every member.
  const matched = matches[0];

  const { data: householdRows, error: householdErr } = await supabase
    .from("guests")
    .select("id, full_name")
    .eq("household_id", matched.household_id)
    .order("full_name");

  if (householdErr) {
    console.error("Household fetch error:", householdErr);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  const members = (householdRows ?? []).map((row) => ({
    guest_id: row.id,
    full_name: row.full_name,
  }));

  return NextResponse.json({
    found: true,
    household_id: matched.household_id,
    members,
  });
}
