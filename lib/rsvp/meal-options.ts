// Shared meal options — the single source of truth for both the RSVP form
// (app/(main)/rsvp/page.tsx) and the submit endpoint's server-side validation
// (app/(main)/api/rsvp/submit/route.ts). Keeping one list here prevents the two
// layers from drifting apart (audit finding B2).
//
// These are the live menu labels. Edit them in this one place — the form options
// and the server's accepted-value check both update automatically. Whatever
// string is stored here is what lands in rsvps.meal_choice, so write them exactly
// as you want them to read.
export const MEAL_OPTIONS = [
  "Grilled Filet of Angus Beef with Green Peppercorn Sauce",
  "Pan-Roasted Sea Bass with Ginger-Miso Glaze",
  "Vegetarian",
] as const;

export type MealChoice = (typeof MEAL_OPTIONS)[number];

export function isMealChoice(value: unknown): value is MealChoice {
  return (
    typeof value === "string" &&
    (MEAL_OPTIONS as readonly string[]).includes(value)
  );
}
