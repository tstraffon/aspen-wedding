// Phase 06 Plan 03 — Task 1: Households Server Component
// Reads all guests via service-role client (no "use client" — this is a Server Component).
// Groups guests by household_id in JS (RESEARCH Open Question 3).
// Passes grouped data to the HouseholdsTable client island.
// Change 3 (06-05): also fetches rsvps and attaches RSVP state to each guest.

import { supabaseAdmin } from "@/lib/supabase/admin";
import HouseholdsTable, { type HouseholdGroup } from "./HouseholdsTable";

// Live, auth-gated admin data — never statically prerendered. Without this the
// build tries to render this page (calling the service-role client) with no
// Supabase env present, failing the Vercel build.
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { data: guests, error } = await supabaseAdmin
    .from("guests")
    .select("id, household_id, full_name")
    .order("household_id")
    .order("full_name");

  if (error) {
    // Server Components render error UI; no error boundary fires by default.
    return (
      <div className="p-8">
        <h1 className="font-headline text-2xl text-on-surface mb-4">Households</h1>
        <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
          <p className="text-error font-body text-sm font-medium mb-1">
            Failed to load guests
          </p>
          <p className="text-error/70 font-body text-sm">
            Could not reach the database. Check that{" "}
            <code className="font-mono">SUPABASE_SERVICE_ROLE_KEY</code> is set
            and try refreshing.
          </p>
        </div>
      </div>
    );
  }

  const guestList = guests ?? [];

  // Empty-state branch — zero guests (e.g. before CSV import).
  if (guestList.length === 0) {
    return (
      <div className="p-8">
        <h1 className="font-headline text-2xl text-on-surface mb-4">Households</h1>
        <p className="text-on-surface-variant font-body text-sm">
          No guests found. Import the guest list via Supabase Studio to get
          started.
        </p>
      </div>
    );
  }

  // Change 3: fetch rsvps and build a lookup map by guest_id.
  // Graceful degrade on error — treat as no RSVPs so households view still renders.
  const { data: rsvpRows } = await supabaseAdmin
    .from("rsvps")
    .select("guest_id, attending, meal_choice, dietary_restrictions");

  const rsvpMap = new Map<
    string,
    { attending: boolean | null; meal_choice: string | null; dietary_restrictions: string | null }
  >();
  for (const r of rsvpRows ?? []) {
    rsvpMap.set(r.guest_id, {
      attending: r.attending ?? null,
      meal_choice: r.meal_choice ?? null,
      dietary_restrictions: r.dietary_restrictions ?? null,
    });
  }

  // Group flat rows by household_id in JS.
  // Query ordered by household_id then full_name, so members within each
  // household are already alpha-sorted.
  const householdMap = new Map<string, typeof guestList>();
  for (const g of guestList) {
    if (!householdMap.has(g.household_id)) {
      householdMap.set(g.household_id, []);
    }
    householdMap.get(g.household_id)!.push(g);
  }

  const households: HouseholdGroup[] = Array.from(
    householdMap,
    ([household_id, members]) => ({
      household_id,
      members: members.map((m) => {
        const rsvp = rsvpMap.get(m.id);
        return {
          ...m,
          attending: rsvp?.attending ?? null,
          meal_choice: rsvp?.meal_choice ?? null,
          dietary_restrictions: rsvp?.dietary_restrictions ?? null,
        };
      }),
    })
  );

  const householdCount = households.length;
  const memberCount = guestList.length;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="font-headline text-2xl text-on-surface mb-1">
          Households
        </h1>
        <p className="text-on-surface-variant font-body text-sm">
          {householdCount} household{householdCount !== 1 ? "s" : ""} &middot;{" "}
          {memberCount} guest{memberCount !== 1 ? "s" : ""}
        </p>
      </div>
      <HouseholdsTable households={households} />
    </div>
  );
}
