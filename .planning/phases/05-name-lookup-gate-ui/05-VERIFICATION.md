---
phase: 05-name-lookup-gate-ui
verified: 2026-06-01T00:00:00Z
status: human_needed
score: 10/10 must-haves verified
overrides_applied: 0
human_verification:
  - test: "Load /rsvp — confirm single name field visible, no form visible"
    expected: "Only lookup input + Find My Invitation button render in right column"
    why_human: "Visual layout requires browser rendering"
  - test: "Submit empty input"
    expected: "validation banner appears, input is refocused (cursor returns to field)"
    why_human: "Focus behavior requires interactive browser session"
  - test: "Submit a name not on the list"
    expected: "Neutral-palette miss banner appears (no red/error colors), Try again button visible"
    why_human: "Visual palette and color rendering requires browser"
  - test: "Click Try again in miss banner"
    expected: "Input cleared, cursor returns to name field"
    why_human: "Focus movement requires interactive browser session"
  - test: "Submit a known guest name (e.g. Tyler Straffon)"
    expected: "Form scaffold appears with correct household member rows, focus moves to Your Group heading"
    why_human: "Requires live Supabase connection and interactive focus observation"
  - test: "Verify form-stage submit button is disabled with Confirm Group RSVP copy"
    expected: "Button is non-interactive, shows disabled styling (opacity-60 cursor-not-allowed)"
    why_human: "Visual and interaction state requires browser"
  - test: "Verify meal selects on form scaffold show Option A / Option B / Option C"
    expected: "Exactly three options with those labels, no chicken/fish/vegetarian"
    why_human: "Visual rendering requires browser"
  - test: "Toggle network offline in devtools, submit name"
    expected: "network banner appears: We couldn't search the list"
    why_human: "Requires browser devtools to simulate offline"
  - test: "Mobile viewport at 375px"
    expected: "Form fits viewport, no horizontal scroll, touch targets >= 44px"
    why_human: "Responsive layout requires browser rendering"
  - test: "Member row entrance animation on stage transition lookup -> form"
    expected: "Rows fade up with staggered delay; motion is absent with prefers-reduced-motion"
    why_human: "Animation timing and reduced-motion behavior require interactive browser session"
---

# Phase 5: Name-Lookup Gate UI — Verification Report

**Phase Goal:** A guest landing on `/rsvp` first sees a single name-lookup screen and gets a clear hit-or-miss response before any form appears.

**Verified:** 2026-06-01
**Status:** human_needed (all code-verifiable checks PASS; browser-smoke items deferred)
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths (Roadmap Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Guest sees single name field on `/rsvp`, no full form until search | VERIFIED | `page.tsx:326-431` — lookup stage renders label+input+button only; form stage gated behind `form.stage === "form"` check at line 226 |
| 2 | Typing a name that exists transitions to form with full household members | VERIFIED | `handleLookup` at line 93-105: atomic `setForm` sets `stage:"form"` + hydrates `submissions` from `data.members` in one call |
| 3 | Typing a name not found shows miss message with support email and Try again, no page reload | VERIFIED | `errorKind:"miss"` branch at line 85-87; miss banner at lines 392-414; `handleTryAgain` at lines 114-117 stays on same stage |
| 4 | Try again clears input and refocuses it; SR announces hit/miss via live region | VERIFIED | `handleTryAgain` line 115 clears `lookupName:""`; line 116 calls `lookupInputRef.current?.focus()`; banners have `role="alert"` + `aria-live="assertive"` at lines 369/395 |
| 5 | Loading state visible during round-trip; network/server errors render error banner | VERIFIED | `isSearching` state drives button text `Searching…` + `disabled` at line 419-422; catch block at line 107 sets `errorKind:"network"`; 5xx check at line 72-75 sets `errorKind:"server"` |

**Score:** 5/5 roadmap truths verified

---

### Detailed Check Results

#### Check 1: GUEST-02 — Lookup fetch and branch logic

| Sub-check | Status | Evidence |
|-----------|--------|----------|
| `POST /api/rsvp/lookup` called with `{ name: trimmed }` | PASS | `page.tsx:67-71` |
| Branches on `{ found: true }` — hydrates household + sets stage:form | PASS | `page.tsx:85-105` |
| Branches on `{ found: false }` — sets errorKind:miss | PASS | `page.tsx:85-87` |
| HTTP 5xx sets errorKind:server | PASS | `page.tsx:72-75` |
| HTTP 4xx sets errorKind:validation | PASS | `page.tsx:76-79` |
| Thrown exception sets errorKind:network | PASS | `page.tsx:106-108` |
| `setIsSearching(false)` in `finally` — all branches | PASS | `page.tsx:109` |

#### Check 2: GUEST-03 — Miss banner and Try again

| Sub-check | Status | Evidence |
|-----------|--------|----------|
| `errorKind === "miss"` renders neutral-palette banner (not destructive) | PASS | `page.tsx:392-414`: `bg-surface-container-low border-white/10 text-on-surface-variant` |
| Banner has `role="alert"` + `aria-live="assertive"` | PASS | `page.tsx:395-396` |
| `info` icon `aria-hidden="true"` | PASS | `page.tsx:398` |
| Miss heading: `We couldn't find you on the list` | PASS | `page.tsx:169` |
| Miss body with email link and Try again button | PASS | `page.tsx:170-186` |
| `handleTryAgain` clears `lookupName` to `""` | PASS | `page.tsx:115` |
| `handleTryAgain` clears `errorKind` to `null` | PASS | `page.tsx:115` |
| `handleTryAgain` calls `lookupInputRef.current?.focus()` | PASS | `page.tsx:116` |

#### Check 3: State machine types (D-01, D-02)

| Sub-check | Status | Evidence |
|-----------|--------|----------|
| `type Stage = "lookup" \| "form" \| "success"` | PASS | `page.tsx:22` |
| `type ErrorKind = "network" \| "server" \| "validation" \| "miss"` | PASS | `page.tsx:23` |
| `type Submission` with `attending: "yes" \| "no" \| null` | PASS | `page.tsx:25-31` |
| `type FormState` shape matches D-02 spec | PASS | `page.tsx:33-39` |
| Initial state: `stage:"lookup"`, `lookupName:""`, `household:null`, `submissions:[]`, `errorKind:null` | PASS | `page.tsx:42-48` |
| `isSearching` separate from FormState (D-02 pattern) | PASS | `page.tsx:49` |

#### Check 4: Lookup stage rules (L-01..L-07)

| Rule | Sub-check | Status | Evidence |
|------|-----------|--------|----------|
| L-01 | Form-card chrome reused verbatim | PASS | `page.tsx:333`: `bg-surface-container-lowest p-8 md:p-16 lg:p-24 shadow-2xl border border-white/5` |
| L-02 | Card interior = eyebrow label + input + button only (no in-card heading) | PASS | `page.tsx:341-427`: label eyebrow -> input -> banner slot -> button |
| L-03 | All error/miss outcomes in same banner slot | PASS | `page.tsx:363-414`: two conditional renders in same vertical slot |
| L-04 | `autoFocus` on lookup input | PASS | `page.tsx:353` |
| L-05 | Fetch branching: validation/network/server/miss | PASS | `page.tsx:57-111` |
| L-06 | Button copy `Find My Invitation` idle / `Searching…` loading | PASS | `page.tsx:422` |
| L-06 | Button full-width `py-6` | PASS | `page.tsx:420` |
| L-06 | `bg-primary` -> `bg-white` hover | PASS | `page.tsx:420`: `bg-primary ... hover:bg-white` |
| L-07 | Input `type="text"` | PASS | `page.tsx:352` |
| L-07 | Input `autoComplete="name"` | PASS | `page.tsx:354` |
| L-07 | Input `placeholder="E.g. Tyler Straffon"` | PASS | `page.tsx:356` |
| L-07 | Input hairline-border classes | PASS | `page.tsx:359`: `border-none border-b border-white/10 focus:ring-0 focus:border-primary` |

#### Check 5: Form scaffold (F-01..F-05)

| Rule | Sub-check | Status | Evidence |
|------|-----------|--------|----------|
| F-01 | Full form structure on hit: member rows + disabled submit | PASS | `page.tsx:241-319` |
| F-01 | Submit `disabled` with `Confirm Group RSVP` copy | PASS | `page.tsx:310-318` |
| F-02 | Meal options exactly `Option A` / `Option B` / `Option C` | PASS | `page.tsx:287-291` |
| F-03 | Per-member rows use eyebrow + `font-headline text-2xl` headline | PASS | `page.tsx:249-251` |
| F-04 | Focus moves to form-stage heading on hit | PASS | `page.tsx:122-124`: `useEffect` on `form.stage === "form"` calls `formHeadingRef.current?.focus()` |
| F-04 | Heading has `tabIndex={-1}` + ref | PASS | `page.tsx:233-238` |
| F-05 | Success branch is comment placeholder only, no UI | PASS | `page.tsx:190-193`: `return null` with comment |

#### Check 6: Error/miss banner copy (verbatim)

| errorKind | Heading | Status | Body | Status |
|-----------|---------|--------|------|--------|
| `network` | `We couldn't search the list` | PASS (`page.tsx:141`) | Matches spec | PASS (`page.tsx:143-148`) |
| `server` | `Something went wrong on our end` | PASS (`page.tsx:153`) | Matches spec | PASS (`page.tsx:155-161`) |
| `validation` | `Something didn't look right` | PASS (`page.tsx:165`) | `Try again — make sure you entered your full name.` | PASS (`page.tsx:167`) |
| `miss` | `We couldn't find you on the list` | PASS (`page.tsx:169`) | Matches spec with Try again button | PASS (`page.tsx:170-186`) |

#### Check 7: Documented deviations

| Deviation | Status | Evidence |
|-----------|--------|----------|
| `hero-fade-up` keyframe exists in `globals.css` | PASS | `globals.css:335-344` |
| Form-stage member rows use inline `animation` style referencing `hero-fade-up` | PASS | `page.tsx:245`: `style={{ animation: \`hero-fade-up 700ms ease-out ${100 + i * 120}ms both\` }}` |
| `prefers-reduced-motion` block covers `[style*="hero-fade-up"]` | PASS | `globals.css:618` |
| `attending` kept as `"yes" \| "no" \| null` (not boolean) | PASS | `page.tsx:28` |
| Meal options `Option A/B/C` (not chicken/fish/vegetarian) | PASS | `page.tsx:287-291` |

#### Check 8: A11y contract

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Form `aria-labelledby="rsvp-heading"` | PASS | `page.tsx:336` |
| `<h1 id="rsvp-heading">` exists in left column (shared across stages) | PASS | `page.tsx:203` |
| Lookup input `aria-required="true"` | PASS | `page.tsx:355` |
| Lookup input has `<label htmlFor="rsvp-lookup-name">` | PASS | `page.tsx:343-346` |
| Error banner `role="alert"` + `aria-live="assertive"` (destructive palette) | PASS | `page.tsx:369-370` |
| Miss banner `role="alert"` + `aria-live="assertive"` | PASS | `page.tsx:395-396` |
| `errorBannerRef.current?.focus()` on errorKind change (non-validation) | PASS | `page.tsx:129-136` |
| Validation errorKind routes focus back to input (not banner) | PASS | `page.tsx:131-133` |
| `formHeadingRef.current?.focus()` on stage:"form" | PASS | `page.tsx:122-124` |
| `aria-busy={isSearching}` on form | PASS | `page.tsx:337` |
| Form-stage submit `disabled={true}` + `aria-disabled="true"` | PASS | `page.tsx:312-313` |
| Decorative icons `aria-hidden="true"` | PASS | `page.tsx:373`, `page.tsx:398`, `page.tsx:317`, `page.tsx:423` |
| Per-member radios `name="attending-{guest_id}"` | PASS | `page.tsx:261`, `page.tsx:269` |

#### Check 9: Scope discipline

| Check | Status | Evidence |
|-------|--------|----------|
| `app/(main)/api/rsvp/lookup/route.ts` unchanged since Phase 4 | PASS | `git log a387a0e..HEAD` returns empty for that file |
| `app/(main)/api/rsvp/submit/route.ts` unchanged since Phase 4 | PASS | Same git check |
| `app/(main)/api/rsvp/route.ts` unchanged since Phase 4 | PASS | Same git check |
| Single `"use client"` file, no extracted subcomponents | PASS | `page.tsx:16`; no sibling files in `app/(main)/rsvp/` beyond `page.tsx` |
| No new CSS tokens beyond `[style*="hero-fade-up"]` in existing reduced-motion block | PASS | `globals.css:618` — added to existing selector list, not a new rule block |

#### Check 10: Build and lint

| Check | Status | Evidence |
|-------|--------|----------|
| `npx tsc --noEmit` exits 0 | PASS | No output = zero type errors |
| `npm run lint -- app/(main)/rsvp/page.tsx` exits 0 | PASS | No output = zero lint errors |

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `app/(main)/rsvp/page.tsx` | Two-stage lookup/form flow | VERIFIED | 433 lines, substantive, wired, data flows from lookup API response |
| `app/globals.css` (hero-fade-up keyframe) | Time-based entrance animation for form-row mount | VERIFIED | `globals.css:335-344`; `prefers-reduced-motion` covers it at line 618 |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `page.tsx handleLookup` | `POST /api/rsvp/lookup` | `fetch` + `res.json()` | WIRED | `page.tsx:67-84`; response drives state update |
| `form.stage === "form"` | `form.submissions` | atomic `setForm` in handler | WIRED | `page.tsx:93-105`; single setState call, not useEffect |
| `errorKind` change | `errorBannerRef.current.focus()` | `useEffect([form.errorKind])` | WIRED | `page.tsx:129-136` |
| `stage === "form"` | `formHeadingRef.current.focus()` | `useEffect([form.stage])` | WIRED | `page.tsx:122-124` |
| `handleTryAgain` | `lookupInputRef.current.focus()` | direct call | WIRED | `page.tsx:116` |
| `[style*="hero-fade-up"]` | `animation: none !important` | `prefers-reduced-motion` media query | WIRED | `globals.css:618` |

---

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `form.submissions` (member rows) | `submissions` array | `data.members` from `POST /api/rsvp/lookup` response | Yes — lookup route queries Supabase `guests` table (verified Phase 4) | FLOWING |
| `form.household` | `household` object | Same lookup response `household_id` + `members` | Yes | FLOWING |

---

### Behavioral Spot-Checks

Step 7b: SKIPPED — requires a live Supabase connection. `POST /api/rsvp/lookup` is a network-dependent endpoint; cannot be tested without running server + populated DB. Defer to browser smoke.

---

### Requirements Coverage

| Requirement | Description | Status | Evidence |
|-------------|-------------|--------|----------|
| GUEST-02 | Name lookup: hit returns household members, miss returns not-found message | SATISFIED | `handleLookup` fetch + branch logic; `page.tsx:57-111` |
| GUEST-03 | Miss banner: neutral palette, support email, Try again button, no page reload | SATISFIED | Miss banner at `page.tsx:392-414`; `handleTryAgain` at `page.tsx:114-117` |

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `page.tsx` | 192 | `return null` in success branch | Info | Intentional — F-05 explicitly specifies success stage as Phase 6 scope; comment documents this |

No TBD/FIXME/XXX markers found. No unresolved debt markers.

---

### Human Verification Required

The following items cannot be verified by code inspection. Run these against `localhost:3000/rsvp` with the Supabase dev project active.

#### 1. Initial Load

**Test:** Navigate to `http://localhost:3000/rsvp` in a fresh tab.
**Expected:** Right column shows only a single name input labeled "Your Full Name" with placeholder "E.g. Tyler Straffon" and a gold "Find My Invitation" button. No member rows or meal selects visible.
**Why human:** Visual layout requires browser rendering.

#### 2. Empty Submit — Validation Banner

**Test:** Click "Find My Invitation" without typing anything.
**Expected:** "Something didn't look right" banner appears. Cursor is in the name input (not on the banner). No network request fires.
**Why human:** Focus behavior requires interactive session.

#### 3. Miss Flow — Neutral Palette

**Test:** Type a name not in the guest list (e.g., "John Nobody") and submit.
**Expected:** Banner in dark/neutral colors (NOT red) with heading "We couldn't find you on the list", support email link, and "Try again" button. No page reload.
**Why human:** Color palette correctness requires visual inspection.

#### 4. Try Again Button

**Test:** With miss banner visible, click "Try again".
**Expected:** Input clears to empty. Cursor lands in the input field. Banner disappears.
**Why human:** Focus movement and state-clear require interactive observation.

#### 5. Hit Flow — Form Scaffold

**Test:** Type `Tyler Straffon` (or any valid guest name from Supabase) and submit.
**Expected:** Right column transitions to form scaffold with "Your Group" heading, one row per household member, each showing name in large serif font, Yes/No radios, Meal Choice select, Dietary Restrictions input. Focus moves to "Your Group" heading (visible focus ring).
**Why human:** Requires live DB connection; visual + focus observation.

#### 6. Form Stage Submit Button

**Test:** On the form scaffold, observe the submit button.
**Expected:** Button shows "Confirm Group RSVP", is visually muted (opacity-60), cursor is not-allowed on hover, no click response.
**Why human:** Visual disabled state requires browser rendering.

#### 7. Meal Options

**Test:** On the form scaffold, open any meal select dropdown.
**Expected:** Options are exactly "Option A", "Option B", "Option C" (no chicken/fish/vegetarian).
**Why human:** Dropdown rendering requires browser.

#### 8. Network Error Banner

**Test:** Open devtools > Network > set to Offline. Submit any name.
**Expected:** "We couldn't search the list" banner appears with connection advice and hello@emilyandtyler.com email link.
**Why human:** Requires browser devtools to simulate offline state.

#### 9. Mobile Viewport

**Test:** Set browser to 375px width, load `/rsvp`, run through lookup -> miss -> try again flow.
**Expected:** All content fits viewport width, no horizontal scroll, touch targets are comfortably tappable.
**Why human:** Responsive layout requires browser rendering.

#### 10. Member Row Entrance Animation

**Test:** Trigger a successful lookup. Observe the form scaffold appearance.
**Expected:** Member rows fade up with staggered timing (each row slightly after the previous). In `prefers-reduced-motion: reduce` OS setting, rows appear immediately without animation.
**Why human:** Animation timing and reduced-motion behavior require interactive observation.

---

### Gaps Summary

No gaps found. All code-verifiable checks PASS. Phase goal is achieved in code. Status is `human_needed` solely because 10 browser-smoke items cannot be confirmed without an interactive session against the running app.

---

_Verified: 2026-06-01T00:00:00Z_
_Verifier: Claude (gsd-verifier)_
