import { supabaseAdmin } from "@/lib/supabase/admin";
import { MEAL_OPTIONS } from "@/lib/rsvp/meal-options";

export default async function AdminRsvpsPage() {
  const [rsvpsResult, guestsResult] = await Promise.all([
    supabaseAdmin
      .from("rsvps")
      .select("guest_id, household_id, attending, meal_choice, dietary_restrictions")
      .order("household_id"),
    supabaseAdmin
      .from("guests")
      .select("id, household_id, full_name")
      .order("household_id")
      .order("full_name"),
  ]);

  if (rsvpsResult.error || guestsResult.error) {
    return (
      <div className="p-8 text-error">Failed to load RSVPs.</div>
    );
  }

  const rsvps = rsvpsResult.data ?? [];
  const guests = guestsResult.data ?? [];

  // Build guest id -> full_name lookup
  const guestMap = new Map<string, string>();
  for (const g of guests) {
    guestMap.set(g.id, g.full_name);
  }

  // Build household_id -> member names (label for the household, matching the Households view)
  const householdNames = new Map<string, string[]>();
  for (const g of guests) {
    if (!householdNames.has(g.household_id)) householdNames.set(g.household_id, []);
    householdNames.get(g.household_id)!.push(g.full_name);
  }

  const attending = rsvps.filter((r) => r.attending);

  // Meal-count summary — keyed from MEAL_OPTIONS (D-13: single source of truth)
  const mealCounts = Object.fromEntries(MEAL_OPTIONS.map((m) => [m, 0])) as Record<string, number>;
  for (const r of attending) {
    if (r.meal_choice && r.meal_choice in mealCounts) {
      mealCounts[r.meal_choice]++;
    }
  }

  // Dietary notes from attending members with non-empty dietary_restrictions
  const dietaryNotes = attending
    .filter((r) => r.dietary_restrictions && r.dietary_restrictions.trim() !== "")
    .map((r) => ({
      name: guestMap.get(r.guest_id) ?? r.guest_id,
      note: r.dietary_restrictions!,
    }));

  // Group all rsvps by household
  const householdMap = new Map<string, typeof rsvps>();
  for (const r of rsvps) {
    const hid = r.household_id;
    if (!householdMap.has(hid)) householdMap.set(hid, []);
    householdMap.get(hid)!.push(r);
  }
  const households = Array.from(householdMap.entries());

  return (
    <div className="space-y-8">
      {/* Header + export links */}
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-primary text-xl uppercase tracking-[0.3em]">
          RSVPs
        </h1>
        <div className="flex items-center space-x-4">
          <a
            href="/api/admin/export/guests"
            className="font-label text-xs uppercase tracking-widest text-on-surface-variant hover:text-on-surface border border-white/10 px-4 py-2 transition-colors duration-200"
          >
            Export Guest List
          </a>
          <a
            href="/api/admin/export/rsvps"
            className="font-label text-xs uppercase tracking-widest text-on-surface-variant hover:text-on-surface border border-white/10 px-4 py-2 transition-colors duration-200"
          >
            Export RSVPs
          </a>
        </div>
      </div>

      {/* Meal-count summary card */}
      <div className="bg-surface-container-lowest border border-white/10 p-6 space-y-4">
        <h2 className="font-label text-sm uppercase tracking-widest text-on-surface-variant">
          Meal Count Summary
        </h2>
        <div className="space-y-2">
          {MEAL_OPTIONS.map((option) => (
            <div key={option} className="flex items-center justify-between">
              <span className="font-body text-on-surface text-sm">{option}</span>
              <span className="font-label text-primary text-sm font-bold">
                {mealCounts[option]}
              </span>
            </div>
          ))}
        </div>
        <div className="pt-2 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
              Total Attending
            </span>
            <span className="font-label text-primary text-sm font-bold">
              {attending.length}
            </span>
          </div>
        </div>
      </div>

      {/* Dietary notes */}
      {dietaryNotes.length > 0 && (
        <div className="bg-surface-container-lowest border border-white/10 p-6 space-y-3">
          <h2 className="font-label text-sm uppercase tracking-widest text-on-surface-variant">
            Dietary Notes
          </h2>
          <ul className="space-y-2">
            {dietaryNotes.map((n, i) => (
              <li key={i} className="text-sm text-on-surface">
                <span className="text-primary">{n.name}:</span>{" "}
                {n.note}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Household submissions */}
      {households.length === 0 ? (
        <div className="bg-surface-container-lowest border border-white/10 p-8 text-center">
          <p className="font-body text-on-surface-variant text-sm">
            No RSVPs submitted yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="font-label text-sm uppercase tracking-widest text-on-surface-variant">
            Submissions by Household
          </h2>
          {households.map(([householdId, members]) => (
            <div
              key={householdId}
              className="bg-surface-container-lowest border border-white/10 p-6 space-y-3"
            >
              <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
                {householdNames.get(householdId)?.length ? (
                  <span className="text-on-surface font-body normal-case tracking-normal">
                    {householdNames.get(householdId)!.join(", ")}
                  </span>
                ) : (
                  <>
                    Unknown household{" "}
                    <span className="text-on-surface-variant/40 font-mono lowercase">
                      {householdId}
                    </span>
                  </>
                )}
              </p>
              <div className="space-y-2">
                {members.map((r) => (
                  <div
                    key={r.guest_id}
                    className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1"
                  >
                    <div className="space-y-0.5">
                      <p className="font-body text-on-surface text-sm">
                        {guestMap.get(r.guest_id) ?? r.guest_id}
                      </p>
                      {r.dietary_restrictions && (
                        <p className="font-body text-on-surface-variant text-xs">
                          Dietary: {r.dietary_restrictions}
                        </p>
                      )}
                    </div>
                    <div className="text-right space-y-0.5">
                      <p
                        className={`font-label text-xs uppercase tracking-widest ${
                          r.attending ? "text-primary" : "text-on-surface-variant"
                        }`}
                      >
                        {r.attending ? "Attending" : "Not Attending"}
                      </p>
                      {r.attending && r.meal_choice && (
                        <p className="font-body text-on-surface-variant text-xs">
                          {r.meal_choice}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
