// Phase 06 Plan 03 — Task 1: Households Server Component
// Reads all guests via service-role client (no "use client" — this is a Server Component).
// Groups guests by household_id in JS (RESEARCH Open Question 3).
// Passes grouped data to the HouseholdsTable client island.

import { supabaseAdmin } from "@/lib/supabase/admin";
import HouseholdsTable, { type HouseholdGroup } from "./HouseholdsTable";

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
    ([household_id, members]) => ({ household_id, members })
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
