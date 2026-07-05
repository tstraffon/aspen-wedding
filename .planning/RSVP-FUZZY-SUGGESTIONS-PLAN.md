# RSVP Fuzzy Name Suggestions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** When RSVP name lookup finds no exact match, offer a ranked "Did you mean?" list of guests who share the entered last name, so guests with typos or alternate first names can still find their invitation.

**Architecture:** Additive fallback only — the strict `lower(trim(full_name))` matcher (`lookup_guest_by_name`) is untouched and still runs first. On a miss, the lookup route calls a new `suggest_guests_by_name` Postgres function that anchors on an exact last-name match and ranks candidates by trigram similarity (`pg_trgm`) on the full name. The route returns those names in the existing `{ found: false }` response; the UI renders them as clickable buttons inside the current "miss" banner, and a click re-runs the normal exact lookup with the chosen name.

**Tech Stack:** Postgres (Supabase) with the `pg_trgm` extension, Next.js 16 App Router route handler (`@supabase/supabase-js` anon client), React 19 client component.

## Global Constraints

- **No RLS.** Access is GRANT-based only (D-06). New function gets `GRANT EXECUTE ... TO anon`; no RLS policies. (SCHEMA.sql lines 104-136.)
- **Anon client only.** No service-role-key fallback. Env reads at call time, fail-fast with a sanitized 500 (existing route pattern).
- **D-10 preserved.** The strict matcher must remain the only path that auto-selects a household. Suggestions never auto-submit — they only prefill the lookup box and re-run the *exact* matcher. "Sarah Else" and "Sarah Horan" have different last names, so the last-name anchor keeps them from appearing in each other's suggestions.
- **Sanitized errors (D-13).** No PostgREST fragments echoed to the client. A failed suggestion query degrades to an empty list, never a 500 — the miss response must still succeed.
- **Suggestion cap: 5.** `LIMIT 5` in SQL. A large family cannot dump the whole household list.
- **No new npm dependencies.** Trigram matching lives in Postgres, not JS.
- **Verification gates (this repo has no JS test runner):** `npm run typecheck`, `npm run lint`, SQL smoke queries in Supabase Studio, and manual browser verification. There is no Jest/Vitest harness (package.json defines only `dev`/`build`/`start`/`lint`/`typecheck`), so the standard TDD "write a failing test" step is replaced by these gates. This is a deliberate deviation from the writing-plans default, matching the Phase 4 smoke-test convention.

---

## File Structure

- **Create:** `.planning/RSVP-FUZZY-SUGGESTIONS.sql` — the migration (extension + function + grant), applied in Studio. Idempotent, matching the sibling `RSVP-PREFILL.sql` / `RSVP-S1-SECURITY-FIX.sql` convention.
- **Modify:** `app/(main)/api/rsvp/lookup/route.ts` — extend the miss branch (around line 78) to fetch and return suggestions.
- **Modify:** `app/(main)/rsvp/page.tsx` — add `suggestions` to `FormState`, refactor `handleLookup` into a reusable `runLookup(name)`, add a suggestion click handler, and render the suggestion buttons in the miss banner.

---

## Task 1: SQL — `suggest_guests_by_name` function

**Files:**
- Create: `.planning/RSVP-FUZZY-SUGGESTIONS.sql`

**Interfaces:**
- Produces: `public.suggest_guests_by_name(p_name text) RETURNS TABLE (full_name text, sim real)`, `EXECUTE` granted to `anon`. Called from the route via `supabase.rpc("suggest_guests_by_name", { p_name })`.

**Design notes:**
- Last-name anchor is an **exact** match on the final whitespace-delimited token (guests are confident about last names; this keeps results tight and keeps the two Sarahs separate). A last-name typo therefore yields no suggestions — an accepted tradeoff.
- Ranking is `similarity()` on the whole normalized name, so "Emliy Veeck" ranks "Emily Veeck" above other Veecks.
- Normalization (`lower` + collapse internal whitespace + trim) is applied symmetrically to input and stored names.
- Exact full-name matches are excluded (`<> norm`) because the strict matcher already handles those.
- No similarity threshold: every same-last-name guest is a plausible household member, so all (up to 5) are shown, best-ranked first. At guest-list scale (hundreds of rows) the sequential scan is negligible; no trigram index is needed.

- [ ] **Step 1: Write the SQL migration file**

Create `.planning/RSVP-FUZZY-SUGGESTIONS.sql`:

```sql
-- =============================================================================
-- RSVP Fuzzy Name Suggestions — additive migration
-- =============================================================================
-- Adds a "Did you mean?" fallback for the RSVP name lookup. Does NOT modify the
-- strict matcher lookup_guest_by_name() — that still runs first (D-10 intact).
--
-- How to apply:
--   1. Supabase Studio -> SQL Editor -> "+ New query"
--   2. Paste this entire file
--   3. Run (Cmd+Enter)
--
-- Idempotent: CREATE EXTENSION IF NOT EXISTS / CREATE OR REPLACE. Safe to re-run.
-- Security: GRANT-based, no RLS (matches SCHEMA.sql). anon gets EXECUTE only.
-- =============================================================================

-- Trigram similarity for ranking near-miss first names.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- suggest_guests_by_name(p_name):
--   Returns up to 5 guests whose LAST name exactly matches the input's last
--   name, ranked by full-name trigram similarity to the input. Exact full-name
--   matches are excluded (the strict matcher handles those). Runs as caller
--   (anon already has SELECT on guests); STABLE so it can inline.
CREATE OR REPLACE FUNCTION public.suggest_guests_by_name(p_name text)
RETURNS TABLE (full_name text, sim real)
LANGUAGE sql STABLE
AS $$
  WITH qi AS (
    SELECT
      lower(regexp_replace(trim(p_name), '\s+', ' ', 'g')) AS norm
  ),
  q AS (
    SELECT
      norm,
      split_part(norm, ' ', array_length(string_to_array(norm, ' '), 1)) AS last_tok
    FROM qi
  )
  SELECT
    g.full_name,
    similarity(
      lower(regexp_replace(trim(g.full_name), '\s+', ' ', 'g')),
      q.norm
    ) AS sim
  FROM public.guests g, q
  WHERE
    -- last-name anchor: stored last token == input last token
    split_part(
      lower(regexp_replace(trim(g.full_name), '\s+', ' ', 'g')),
      ' ',
      array_length(
        string_to_array(lower(regexp_replace(trim(g.full_name), '\s+', ' ', 'g')), ' '),
        1
      )
    ) = q.last_tok
    -- exclude exact matches (strict matcher already covers those)
    AND lower(regexp_replace(trim(g.full_name), '\s+', ' ', 'g')) <> q.norm
  ORDER BY sim DESC, g.full_name
  LIMIT 5;
$$;

REVOKE ALL    ON FUNCTION public.suggest_guests_by_name(text) FROM public;
GRANT EXECUTE ON FUNCTION public.suggest_guests_by_name(text) TO anon;
GRANT EXECUTE ON FUNCTION public.suggest_guests_by_name(text) TO authenticated;

-- =============================================================================
-- SMOKE SEED (Studio only — DO NOT COMMIT UNCOMMENTED, remove after testing)
-- =============================================================================
-- INSERT INTO public.guests (household_id, full_name) VALUES
--   ('44444444-4444-4444-4444-444444444444', 'Emily Veeck'),
--   ('44444444-4444-4444-4444-444444444444', 'Ella Veeck');
```

- [ ] **Step 2: Apply the migration in Supabase Studio**

Open Supabase Studio -> SQL Editor -> "+ New query" -> paste the file contents -> Run (Cmd+Enter).
Expected: "Success. No rows returned."

- [ ] **Step 3: Seed smoke data**

In the same SQL Editor, run the two `INSERT` lines from the SMOKE SEED block (uncommented, Studio only):

```sql
INSERT INTO public.guests (household_id, full_name) VALUES
  ('44444444-4444-4444-4444-444444444444', 'Emily Veeck'),
  ('44444444-4444-4444-4444-444444444444', 'Ella Veeck');
```

Expected: "Success. 2 rows."

- [ ] **Step 4: Smoke test — first-name typo ranks correctly**

Run:

```sql
SELECT * FROM public.suggest_guests_by_name('Emliy Veeck');
```

Expected: two rows, `Emily Veeck` first (higher `sim`), then `Ella Veeck`. `Emily Veeck` is NOT excluded here because the input `Emliy Veeck` is not an exact match.

- [ ] **Step 5: Smoke test — last-name-only input returns the whole surname group**

Run:

```sql
SELECT * FROM public.suggest_guests_by_name('Veeck');
```

Expected: both `Emily Veeck` and `Ella Veeck`.

- [ ] **Step 6: Smoke test — exact match is excluded**

Run:

```sql
SELECT * FROM public.suggest_guests_by_name('Emily Veeck');
```

Expected: exactly one row, `Ella Veeck`. `Emily Veeck` is excluded because it is an exact match (the strict matcher owns that case).

- [ ] **Step 7: Smoke test — D-10 boundary (different last names never cross)**

Run (assumes the SCHEMA.sql dev seed with the two Sarahs is present; if not, skip):

```sql
SELECT * FROM public.suggest_guests_by_name('Sarah Else');
```

Expected: zero rows for `Sarah Horan` (different last name). If `Sarah Else` is the only "Else", the result is empty. Confirms suggestions never collapse the two Sarahs.

- [ ] **Step 8: Commit**

```bash
git add .planning/RSVP-FUZZY-SUGGESTIONS.sql
git commit -m "feat(rsvp): add suggest_guests_by_name trigram fallback function"
```

---

## Task 2: Route — return suggestions on a miss

**Files:**
- Modify: `app/(main)/api/rsvp/lookup/route.ts:77-80`

**Interfaces:**
- Consumes: `suggest_guests_by_name(p_name)` from Task 1.
- Produces: miss response shape `{ found: false, suggestions: string[] }`. Hit response unchanged.

- [ ] **Step 1: Replace the miss branch**

In `app/(main)/api/rsvp/lookup/route.ts`, replace the current miss block:

```ts
  // Miss (D-11): HTTP 200, not 404.
  if (!matches || matches.length === 0) {
    return NextResponse.json({ found: false });
  }
```

with a version that fetches ranked suggestions. A failed suggestion query degrades to an empty list — the miss response still succeeds (Global Constraint: sanitized errors):

```ts
  // Miss (D-11): HTTP 200, not 404. Offer a ranked "Did you mean?" list of
  // guests sharing the entered last name (additive fallback; the strict
  // matcher above is untouched). Suggestion failure degrades to [], never 500.
  if (!matches || matches.length === 0) {
    const { data: suggestionRows, error: suggestErr } = await supabase.rpc(
      "suggest_guests_by_name",
      { p_name: trimmedName }
    );

    if (suggestErr) {
      console.error("Guest suggestion error:", suggestErr);
    }

    const suggestions = ((suggestionRows ?? []) as { full_name: string }[]).map(
      (r) => r.full_name
    );

    return NextResponse.json({ found: false, suggestions });
  }
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no errors for `app/(main)/api/rsvp/lookup/route.ts`.

- [ ] **Step 4: Smoke test the endpoint**

With `npm run dev` running and the dev SITE_ACCESS_CODE session active, run:

```bash
curl -s -X POST http://localhost:3000/api/rsvp/lookup \
  -H "Content-Type: application/json" \
  -d '{"name":"Emliy Veeck"}'
```

Expected JSON: `{"found":false,"suggestions":["Emily Veeck","Ella Veeck"]}`.

(If the proxy gate blocks the raw curl, verify instead via the browser flow in Task 4.)

- [ ] **Step 5: Commit**

```bash
git add "app/(main)/api/rsvp/lookup/route.ts"
git commit -m "feat(rsvp): return last-name suggestions on lookup miss"
```

---

## Task 3: UI — render suggestions and re-run lookup on click

**Files:**
- Modify: `app/(main)/rsvp/page.tsx`

**Interfaces:**
- Consumes: miss response `{ found: false, suggestions: string[] }` from Task 2.
- Produces: `runLookup(rawName: string)` (shared lookup logic), `handleSuggestionClick(name: string)`, and `FormState.suggestions: string[]`.

- [ ] **Step 1: Add `suggestions` to `FormState`**

In `app/(main)/rsvp/page.tsx`, add the field to the `FormState` type (after `hasExisting`):

```ts
  hasExisting: boolean;
  // Ranked "Did you mean?" names returned on a miss (last-name matches).
  suggestions: string[];
  errorKind: ErrorKind | null;
```

- [ ] **Step 2: Add `suggestions: []` to the initial state**

In the `useState<FormState>` initializer:

```ts
  const [form, setForm] = useState<FormState>({
    stage: "lookup",
    lookupName: "",
    household: null,
    submissions: [],
    hasExisting: false,
    suggestions: [],
    errorKind: null,
  });
```

- [ ] **Step 3: Refactor `handleLookup` into a reusable `runLookup(name)`**

Replace the existing `handleLookup` function with a shared `runLookup` plus a thin form-submit wrapper. Note the two changed spots: `runLookup` resets `suggestions: []` at the start, and the miss branch now stores `data.suggestions`:

```ts
  // ── Shared lookup (used by the form submit AND suggestion clicks) ─────────
  async function runLookup(rawName: string) {
    setForm((f) => ({ ...f, errorKind: null, suggestions: [] }));
    const trimmed = rawName.trim();
    if (!trimmed) {
      setForm((f) => ({ ...f, errorKind: "validation" }));
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch("/api/rsvp/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      if (res.status >= 500) {
        setForm((f) => ({ ...f, errorKind: "server" }));
        return;
      }
      if (!res.ok) {
        setForm((f) => ({ ...f, errorKind: "validation" }));
        return;
      }
      const data: {
        found: boolean;
        household_id?: string;
        has_existing?: boolean;
        suggestions?: string[];
        members?: {
          guest_id: string;
          full_name: string;
          attending?: boolean | null;
          meal_choice?: string | null;
          dietary_restrictions?: string | null;
        }[];
      } = await res.json();
      if (!data.found) {
        setForm((f) => ({
          ...f,
          lookupName: trimmed,
          errorKind: "miss",
          suggestions: data.suggestions ?? [],
        }));
        return;
      }
      const members = data.members ?? [];
      // Atomic setForm — sets stage + household + submissions in ONE call to
      // avoid an intermediate render with `stage: 'form'` but empty `submissions`
      // (RESEARCH Q10, Pitfall 3). Prefill from any prior response.
      setForm({
        stage: "form",
        lookupName: trimmed,
        household: { id: data.household_id!, members },
        hasExisting: data.has_existing ?? false,
        suggestions: [],
        submissions: members.map((m) => ({
          guest_id: m.guest_id,
          full_name: m.full_name,
          attending:
            m.attending === true ? "yes" : m.attending === false ? "no" : null,
          meal_choice: m.meal_choice ?? null,
          dietary_restrictions: m.dietary_restrictions ?? "",
        })),
        errorKind: null,
      });
    } catch {
      setForm((f) => ({ ...f, errorKind: "network" }));
    } finally {
      setIsSearching(false);
    }
  }

  // ── handleLookup (L-05 flow) — thin wrapper over runLookup ───────────────
  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    await runLookup(form.lookupName);
  }

  // ── handleSuggestionClick — fill the box, re-run the EXACT matcher ────────
  // Clicking a suggestion never auto-submits an RSVP: it just re-runs lookup
  // with the chosen (exact) name, which hits the strict matcher (D-10).
  function handleSuggestionClick(name: string) {
    setForm((f) => ({ ...f, lookupName: name }));
    void runLookup(name);
  }
```

- [ ] **Step 4: Clear suggestions in `handleTryAgain`**

Update `handleTryAgain` so dismissing the miss also clears the suggestion list:

```ts
  function handleTryAgain() {
    setForm((f) => ({ ...f, lookupName: "", errorKind: null, suggestions: [] }));
    lookupInputRef.current?.focus();
  }
```

- [ ] **Step 5: Add `suggestions: []` to the success-stage reset**

In the success stage's "look up your name again" button `onClick` (the full-object `setForm({...})`), add the field:

```ts
                onClick={() =>
                  setForm({
                    stage: "lookup",
                    lookupName: "",
                    household: null,
                    submissions: [],
                    hasExisting: false,
                    suggestions: [],
                    errorKind: null,
                  })
                }
```

- [ ] **Step 6: Render suggestion buttons inside the miss banner**

In the lookup-stage "Neutral palette: miss" block, add a suggestion list after the `errorCopy.miss.body` paragraph, still inside the banner's inner `<div>`. Guard on `form.suggestions.length > 0`:

```tsx
                  <p className="text-on-surface-variant/80 text-sm font-body font-light">
                    {errorCopy.miss.body}
                  </p>
                  {form.suggestions.length > 0 && (
                    <div className="mt-4">
                      <span className="font-label text-[11px] uppercase tracking-widest text-primary block opacity-80 mb-2">
                        Did you mean?
                      </span>
                      <ul className="flex flex-wrap gap-2">
                        {form.suggestions.map((name) => (
                          <li key={name}>
                            <button
                              type="button"
                              onClick={() => handleSuggestionClick(name)}
                              disabled={isSearching}
                              className="font-body text-sm text-on-surface bg-surface-container-low border border-white/10 rounded-full px-4 py-2 hover:border-primary hover:text-primary transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              {name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
```

- [ ] **Step 7: Typecheck**

Run: `npm run typecheck`
Expected: no errors. (Confirms every full-object `setForm` includes `suggestions` and the new handlers type-check.)

- [ ] **Step 8: Lint**

Run: `npm run lint`
Expected: no errors for `app/(main)/rsvp/page.tsx`.

- [ ] **Step 9: Commit**

```bash
git add "app/(main)/rsvp/page.tsx"
git commit -m "feat(rsvp): render did-you-mean suggestions on lookup miss"
```

---

## Task 4: End-to-end verification and seed cleanup

**Files:**
- None modified. Manual browser verification + Studio cleanup.

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Open `http://localhost:3000/rsvp` (enter the SITE_ACCESS_CODE if prompted).
Expected: the "Kindly Respond" lookup stage with the "Your Full Name" field.

- [ ] **Step 2: Verify typo -> suggestion -> success flow**

In "Your Full Name", type `Emliy Veeck` -> click "Find My Invitation".
Expected: the neutral "We couldn't find you on the list" banner appears with a "Did you mean?" row containing `Emily Veeck` and `Ella Veeck`, `Emily Veeck` first.
Click the `Emily Veeck` chip.
Expected: the form advances to the "Your Group" stage showing the Veeck household members (the input box now reads `Emily Veeck`; the exact matcher hit).

- [ ] **Step 3: Verify a true miss shows no suggestions**

Return to lookup (reload `http://localhost:3000/rsvp`). Type `Zzzzz Nobody` -> "Find My Invitation".
Expected: the miss banner appears with NO "Did you mean?" row (empty suggestions), and the existing "Try again" affordance still works.

- [ ] **Step 4: Verify exact match still bypasses suggestions**

Reload `http://localhost:3000/rsvp`. Type `Emily Veeck` (exact) -> "Find My Invitation".
Expected: goes straight to the "Your Group" stage — no miss banner, no suggestions.

- [ ] **Step 5: Remove smoke seed data**

In Supabase Studio SQL Editor:

```sql
DELETE FROM public.guests
WHERE household_id = '44444444-4444-4444-4444-444444444444';
```

Expected: "Success. 2 rows." (Removes `Emily Veeck` / `Ella Veeck`.)

- [ ] **Step 6: Final typecheck + lint sweep**

Run: `npm run typecheck && npm run lint`
Expected: both clean.

- [ ] **Step 7: Commit any remaining changes**

```bash
git status
# if anything is uncommitted from the tasks above:
git add -A && git commit -m "chore(rsvp): finalize fuzzy suggestion feature"
```

---

## Self-Review

**Spec coverage:**
- Ranked "Did you mean?" on miss -> Task 1 (SQL ranking) + Task 2 (route) + Task 3 (UI). ✓
- Anchored on last name -> Task 1 last-name `split_part` anchor. ✓
- Trigram fuzzy on first name -> Task 1 `pg_trgm` + `similarity()` ranking. ✓
- Privacy acceptable behind access gate -> no extra gating added; suggestion cap of 5 is the only limiter. ✓
- Strict matcher / D-10 untouched -> Task 1 does not alter `lookup_guest_by_name`; suggestions never auto-submit (Task 3 Step 3 re-runs the exact matcher). ✓
- Graceful degradation on suggestion error -> Task 2 Step 1 (`suggestErr` logged, empty list returned). ✓

**Placeholder scan:** No TBD/TODO/"handle edge cases" — every code block is complete. ✓

**Type consistency:** `suggest_guests_by_name(p_name text) RETURNS (full_name text, sim real)` in Task 1 matches `{ full_name: string }[]` mapping in Task 2. `runLookup(rawName: string)`, `handleSuggestionClick(name: string)`, and `FormState.suggestions: string[]` are consistent across Task 3 steps. The route's miss shape `{ found: false, suggestions: string[] }` matches the client's `data.suggestions?: string[]`. ✓
