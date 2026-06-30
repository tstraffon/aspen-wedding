"use client";

// Placeholder — replaced in Task 2 with full inline-edit implementation.
// Present here so page.tsx can build in Task 1.

export type GuestRow = {
  id: string;
  household_id: string;
  full_name: string;
};

export type HouseholdGroup = {
  household_id: string;
  members: GuestRow[];
};

export default function HouseholdsTable({
  households,
}: {
  households: HouseholdGroup[];
}) {
  return (
    <div className="text-on-surface-variant font-body text-sm">
      {households.length} household{households.length !== 1 ? "s" : ""} loaded —
      full inline editing coming in Task 2.
    </div>
  );
}
