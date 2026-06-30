import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

function toRfc4180Field(val: string | boolean | null | undefined): string {
  if (val == null || val === "") return '""';
  return '"' + String(val).replace(/"/g, '""') + '"';
}

export async function GET(request: NextRequest) {
  const adminSession = request.cookies.get("admin_session")?.value;
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [rsvpsResult, guestsResult] = await Promise.all([
    supabaseAdmin
      .from("rsvps")
      .select("guest_id, household_id, attending, meal_choice, dietary_restrictions")
      .order("household_id"),
    supabaseAdmin
      .from("guests")
      .select("id, full_name"),
  ]);

  if (rsvpsResult.error || guestsResult.error) {
    console.error(
      "RSVP CSV export error:",
      rsvpsResult.error ?? guestsResult.error
    );
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  const rsvps = rsvpsResult.data ?? [];
  const guests = guestsResult.data ?? [];

  // Build guest id -> full_name lookup
  const guestMap = new Map<string, string>();
  for (const g of guests) {
    guestMap.set(g.id, g.full_name);
  }

  const header = "name,household_id,attending,meal_choice,dietary_restrictions\n";
  const rows = rsvps
    .map((r) => {
      const name = guestMap.get(r.guest_id) ?? r.guest_id;
      return [
        toRfc4180Field(name),
        toRfc4180Field(r.household_id),
        toRfc4180Field(r.attending),
        toRfc4180Field(r.meal_choice),
        toRfc4180Field(r.dietary_restrictions),
      ].join(",");
    })
    .join("\n");

  return new Response(header + rows, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="rsvps.csv"',
    },
  });
}
