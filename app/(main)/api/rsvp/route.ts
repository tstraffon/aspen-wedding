import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { fullName, email, attending, guestCount, dietaryRestrictions, note } =
    body;

  if (!fullName || !email || !attending) {
    return NextResponse.json(
      { error: "Missing required fields" },
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

  const { error } = await supabase.from("rsvps").insert({
    full_name: fullName,
    email,
    attending: attending === "accept",
    guest_count: parseInt(guestCount),
    dietary_restrictions: dietaryRestrictions || null,
    note: note || null,
  });

  if (error) {
    console.error("Supabase insert error:", error);
    return NextResponse.json(
      { error: "Could not save RSVP" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
