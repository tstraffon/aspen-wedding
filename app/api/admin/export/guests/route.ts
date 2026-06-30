import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

function toRfc4180Field(val: string | null | undefined): string {
  if (val == null || val === "") return '""';
  return '"' + String(val).replace(/"/g, '""') + '"';
}

export async function GET(request: NextRequest) {
  const adminSession = request.cookies.get("admin_session")?.value;
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("guests")
    .select("household_id, full_name")
    .order("household_id")
    .order("full_name");

  if (error || !data) {
    console.error("Guest CSV export error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  const header = "household_id,full_name\n";
  const rows = data
    .map((r) => `${toRfc4180Field(r.household_id)},${toRfc4180Field(r.full_name)}`)
    .join("\n");

  return new Response(header + rows, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="guests.csv"',
    },
  });
}
