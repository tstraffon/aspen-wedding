// Decisions implemented: D-01, D-02, D-03, D-04, D-05, D-06, L-01..L-07, F-01..F-05.
//
// RESEARCH deviation (Q6): Entrance animation for form-stage rows uses the
// `hero-fade-up` keyframe (time-based) via inline `animation` style. The
// scroll-driven CSS utility (animation-timeline: view()) is intentionally
// NOT used — elements mounting already in-viewport never trigger its entry
// range, leaving them permanently at opacity: 0. Plan 05-01 prepares no
// animation hook on the lookup stage itself. Plan 05-02 implements the staggered
// entrance on member rows using the pattern documented in RESEARCH Q6 lines 670-685.
//
// FormState.submissions.attending is a `"yes" | "no" | null` UI string union
// per D-02. Phase 6 transforms `"yes" → true`, `"no" → false` before POSTing
// to /api/rsvp/submit (the Phase 4 endpoint expects `attending: boolean`).
// Documented per RESEARCH Q12-tail.

"use client";

import { useEffect, useRef, useState } from "react";
import { MEAL_OPTIONS } from "@/lib/rsvp/meal-options";
import { CONTACT_EMAIL, CONTACT_MAILTO } from "@/lib/site";

// Hand-tuned positions for the success-stage gold-diamond drift. Fixed (not
// random) so server and client render identically; the variety comes from the
// spread of left offsets, horizontal drift, delays, and durations.
const CONFETTI = [
  { left: "6%", drift: "24px", delay: "0ms", duration: "3200ms" },
  { left: "15%", drift: "-28px", delay: "280ms", duration: "2800ms" },
  { left: "24%", drift: "16px", delay: "120ms", duration: "3400ms" },
  { left: "33%", drift: "-18px", delay: "520ms", duration: "2600ms" },
  { left: "42%", drift: "30px", delay: "60ms", duration: "3000ms" },
  { left: "51%", drift: "-34px", delay: "700ms", duration: "3300ms" },
  { left: "60%", drift: "20px", delay: "200ms", duration: "2700ms" },
  { left: "68%", drift: "-22px", delay: "880ms", duration: "3100ms" },
  { left: "77%", drift: "34px", delay: "360ms", duration: "2900ms" },
  { left: "85%", drift: "-16px", delay: "620ms", duration: "3400ms" },
  { left: "92%", drift: "26px", delay: "440ms", duration: "2800ms" },
  { left: "48%", drift: "-30px", delay: "980ms", duration: "3000ms" },
] as const;

// ── v0.2 FormState types (D-02 — locked shape, Phase 6 consumes without refactor) ──

type Stage = "lookup" | "form" | "success";
type ErrorKind = "network" | "server" | "validation" | "miss";

type Submission = {
  guest_id: string;
  full_name: string;
  attending: "yes" | "no" | null; // "yes"|"no" UI value. Phase 6 maps to boolean for POST /api/rsvp/submit.
  meal_choice: string | null;
  dietary_restrictions: string;
};

type FormState = {
  stage: Stage;
  lookupName: string;
  household: { id: string; members: { guest_id: string; full_name: string }[] } | null;
  submissions: Submission[];
  // True when the matched household already has at least one saved response —
  // drives the "already responded" note and the prefilled inputs.
  hasExisting: boolean;
  // Ranked "Did you mean?" names returned on a miss (last-name matches).
  suggestions: string[];
  errorKind: ErrorKind | null;
};

export default function RSVPPage() {
  const [form, setForm] = useState<FormState>({
    stage: "lookup",
    lookupName: "",
    household: null,
    submissions: [],
    hasExisting: false,
    suggestions: [],
    errorKind: null,
  });
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs: errorBannerRef + formHeadingRef + lookupInputRef (RESEARCH Q3 + Q4)
  const errorBannerRef = useRef<HTMLParagraphElement>(null);
  const formHeadingRef = useRef<HTMLHeadingElement>(null);
  const lookupInputRef = useRef<HTMLInputElement>(null);

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
    // updates the input immediately; runLookup uses `name` (the arg), not form.lookupName
    void runLookup(name);
  }

  // ── handleTryAgain (L-03, GUEST-03) ──────────────────────────────────────
  function handleTryAgain() {
    setForm((f) => ({ ...f, lookupName: "", errorKind: null, suggestions: [] }));
    lookupInputRef.current?.focus();
  }

  // ── Per-member controlled-input updates (Phase 6) ────────────────────────
  function updateSubmission(guestId: string, patch: Partial<Submission>) {
    setForm((f) => ({
      ...f,
      submissions: f.submissions.map((s) =>
        s.guest_id === guestId ? { ...s, ...patch } : s
      ),
    }));
  }

  // ── handleSubmit (Phase 6 — wires the form to POST /api/rsvp/submit) ──────
  async function handleSubmit() {
    setForm((f) => ({ ...f, errorKind: null }));
    if (!form.household) return;

    // Every member needs a Yes/No; anyone attending needs a meal choice.
    const incomplete = form.submissions.some(
      (s) => s.attending === null || (s.attending === "yes" && !s.meal_choice)
    );
    if (incomplete) {
      setForm((f) => ({ ...f, errorKind: "validation" }));
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/rsvp/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          household_id: form.household.id,
          // Map the "yes"|"no" UI value to the boolean the endpoint expects.
          submissions: form.submissions.map((s) => ({
            guest_id: s.guest_id,
            attending: s.attending === "yes",
            meal_choice:
              s.attending === "yes" ? s.meal_choice ?? undefined : undefined,
            dietary_restrictions: s.dietary_restrictions.trim() || undefined,
          })),
        }),
      });
      if (res.status >= 500) {
        setForm((f) => ({ ...f, errorKind: "server" }));
        return;
      }
      if (!res.ok) {
        setForm((f) => ({ ...f, errorKind: "validation" }));
        return;
      }
      setForm((f) => ({ ...f, stage: "success", errorKind: null }));
    } catch {
      setForm((f) => ({ ...f, errorKind: "network" }));
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Focus effects (RESEARCH Q3 + Q9 + Q11, Pitfall 2) ───────────────────

  // Stage transition: lookup → form moves focus to the form heading.
  useEffect(() => {
    if (form.stage === "form") formHeadingRef.current?.focus();
  }, [form.stage]);

  // Error focus: validation routes back to the INPUT (the user needs to type,
  // not read). All other kinds (network/server/miss) route to the banner heading
  // for SR announcement. Guard against null to avoid misfocus on clear.
  useEffect(() => {
    if (form.errorKind === null) return;
    if (form.errorKind === "validation") {
      lookupInputRef.current?.focus();
    } else {
      errorBannerRef.current?.focus();
    }
  }, [form.errorKind]);

  // ── errorCopy (RESEARCH Q12 — verbatim from UI-SPEC §Copywriting Contract) ─
  const errorCopy: Record<ErrorKind, { heading: string; body: React.ReactNode }> = {
    network: {
      heading: "We couldn't search the list",
      body: (
        <>
          Check your connection and try again. Still stuck? Email us at{" "}
          <a href={CONTACT_MAILTO} className="underline underline-offset-2">
            {CONTACT_EMAIL}
          </a>
          .
        </>
      ),
    },
    server: {
      heading: "Something went wrong on our end",
      body: (
        <>
          Try again in a minute. If it keeps happening, email us at{" "}
          <a href={CONTACT_MAILTO} className="underline underline-offset-2">
            {CONTACT_EMAIL}
          </a>{" "}
          and we&apos;ll sort it out.
        </>
      ),
    },
    validation: {
      heading: "Something didn't look right",
      body: "Try again — make sure you entered your full name.",
    },
    miss: {
      heading: "We couldn't find you on the list",
      body: (
        <>
          Double-check the spelling, or reach out to{" "}
          <a href={CONTACT_MAILTO} className="underline underline-offset-2">
            {CONTACT_EMAIL}
          </a>{" "}
          and we&apos;ll sort it out.{" "}
          <button
            type="button"
            onClick={handleTryAgain}
            className="font-label text-xs uppercase tracking-wider text-on-surface-variant underline underline-offset-2 ml-1"
          >
            Try again
          </button>
        </>
      ),
    },
  };

  // ── Full-page Maroon Bells backdrop ──────────────────────────────────────
  // Fixed and full-bleed, behind the dark editorial palette so the peaks read as
  // ambient texture, not a bright travel photo. A single gradient scrim does two
  // jobs: solid background at top/bottom anchors the navbar and footer, and the
  // dark middle stop (via-background/85) keeps a reliable substrate behind the
  // left-column text instead of going transparent exactly where the copy sits.
  // /85 holds on-surface-variant body copy at ≥5:1 even over the brightest sky
  // region of the photo (WCAG AA). Declared before the success early-return so
  // every stage can reference it.
  const pageBackdrop = (
    <div aria-hidden="true" className="fixed inset-0 -z-10 pointer-events-none">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="object-cover w-full h-full"
        alt=""
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSFj0oU-OqYeYgIdZGz479vEvTJLubdqcyGdcrMGTs6TcsvepaRtRzjlhQIk8mYo7DfqFLcMOHleS27HvqFlcIeDE3KUohZCvIEjGFo37TYxb-N9bMoQmFnLvBhbtIXRzT1vuslQdXmEoP5hC67glOtQ8nMkOydppL9QTjnmB3XR6y1cZX3yJfJ4h22HBPnITsmiAj3ly2OrsKS8iiDh2Oh7RAbAhnLdg81eWJ0xtr_qjBlZ5qRbKI7ZkLc33ZmIi3J1RRHHbeebE"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/85 to-background" />
    </div>
  );

  // ── Shared form-panel chrome (D-05 consistency) ──────────────────────────
  // Both the lookup and form stages render the same panel: identical grid
  // footprint (cols 7–12), fill, padding scale, and edge treatment, so the frame
  // doesn't shift when the stage changes. The opaque surface + shadow + hairline
  // border are what separate the panel from the photographic backdrop (the fill
  // tone equals --color-background). Only the panel's height differs by content.
  const cardClass =
    "lg:col-span-6 lg:col-start-7 bg-surface-container-lowest shadow-2xl border border-white/5 p-8 md:p-12 lg:p-16";

  // ── Success stage (Phase 6) ──────────────────────────────────────────────
  if (form.stage === "success") {
    const attendingCount = form.submissions.filter(
      (s) => s.attending === "yes"
    ).length;
    return (
      <main className="relative overflow-hidden pt-32 pb-24 min-h-screen flex flex-col justify-center">
        {pageBackdrop}
        {/* One-time gold-diamond drift (brand motif) — a celebratory flourish on
            a successful RSVP. Decorative and reduced-motion safe (see globals). */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          {CONFETTI.map((c, i) => (
            <span
              key={i}
              className="confetti-piece"
              style={
                {
                  left: c.left,
                  animationDelay: c.delay,
                  animationDuration: c.duration,
                  ["--drift"]: c.drift,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
        <div className="relative max-w-screen-2xl mx-auto w-full px-8 md:px-12">
          <div className="max-w-2xl mx-auto text-center py-16">
            <span className="hero-reveal-label font-label text-xs uppercase tracking-[0.3em] text-primary mb-6 block font-semibold">
              RSVP Received
            </span>
            <h1 className="hero-reveal-title font-headline text-6xl md:text-8xl text-on-surface leading-[1.1] mb-8">
              Thank <span className="italic text-primary">You</span>
            </h1>
            <p className="hero-reveal-subtitle font-body text-lg text-on-surface-variant leading-relaxed mb-6">
              Your response has been recorded.{" "}
              {attendingCount > 0
                ? "We can't wait to celebrate with you in Aspen."
                : "We're sorry you can't make it — you'll be missed."}
            </p>
            <p
              className="font-body text-on-surface-variant/80 leading-relaxed"
              style={{ animation: "hero-fade-up 800ms ease-out 750ms both" }}
            >
              Need to change something? Just{" "}
              <button
                type="button"
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
                className="font-label text-xs uppercase tracking-wider text-primary underline underline-offset-2"
              >
                look up your name again
              </button>{" "}
              and resubmit — your latest response replaces the previous one.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ── Editorial left column — shared across all stages (D-05) ──────────────
  // The Maroon Bells image moved out to a full-page backdrop (pageBackdrop), so
  // this column stays short and the stages no longer balance against a tall
  // image that opened up dead space.
  const leftColumn = (
    <div className="lg:col-span-5 lg:sticky lg:top-40">
      <span className="font-label text-xs uppercase tracking-[0.3em] text-primary mb-6 block font-semibold">
        Join Us in Aspen
      </span>
      <h1
        id="rsvp-heading"
        className="font-headline text-6xl md:text-8xl text-on-surface leading-[1.1] mb-8"
      >
        Kindly <br />
        <span className="italic text-primary">Respond</span>
      </h1>
      <p className="font-body text-lg text-on-surface-variant max-w-md leading-relaxed">
        We look forward to celebrating this new chapter with our closest
        family and friends. Please confirm your attendance by{" "}
        <span className="font-bold text-primary">July 31st</span>.
      </p>
    </div>
  );

  // ── Form stage (placeholder — Plan 05-02 fills this branch) ─────────────
  if (form.stage === "form") {
    return (
      <main className="pt-32 pb-24 min-h-screen">
        {pageBackdrop}
        <div className="max-w-screen-2xl mx-auto px-8 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          {leftColumn}
          <div className={cardClass}>
            {/* Plan 05-02 fills this: "Your Group" heading + submissions.map(...) member rows + disabled "Confirm Group RSVP" button. */}
            <h2
              ref={formHeadingRef}
              tabIndex={-1}
              className="font-headline text-4xl md:text-5xl text-on-surface mb-12 outline-none"
            >
              Your Group
            </h2>

            {/* Prefill note — neutral palette (not destructive), shown only when
                this household already has a saved response. */}
            {form.hasExisting && (
              <div
                role="status"
                className="flex items-start gap-3 p-4 bg-surface-container-low border border-white/10 rounded-lg mb-12"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-primary text-lg shrink-0 mt-0.5">
                  info
                </span>
                <div>
                  <p className="text-on-surface text-sm font-body font-medium mb-1">
                    Your group has already responded
                  </p>
                  <p className="text-on-surface-variant/80 text-sm font-body font-light">
                    Your previous answers are filled in below. Change anything
                    you&apos;d like and resubmit; your latest response replaces
                    the earlier one.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-12">
              {form.submissions.map((sub, i) => (
                <div
                  key={sub.guest_id}
                  className="space-y-6"
                  style={{ animation: `hero-fade-up 700ms ease-out ${100 + i * 120}ms both` }}
                >
                  {/* Member identity: warm-gold eyebrow + headline full_name */}
                  <div>
                    <span className="font-label text-[11px] uppercase tracking-widest text-primary block opacity-80 mb-2">Guest {i + 1}</span>
                    <h3 className="font-headline text-2xl text-on-surface">{sub.full_name}</h3>
                  </div>

                  {/* Attending Y/N radios — per-member name namespace per RESEARCH Q5 */}
                  <fieldset>
                    <legend className="sr-only">Will {sub.full_name} be attending?</legend>
                    <span aria-hidden="true" className="font-label text-[11px] uppercase tracking-widest text-primary block opacity-80 mb-3">Will you be attending?</span>
                    <div className="flex gap-6">
                      <label className="flex items-center space-x-3 cursor-pointer group">
                        <input
                          type="radio"
                          name={`attending-${sub.guest_id}`}
                          value="yes"
                          checked={sub.attending === "yes"}
                          onChange={() =>
                            updateSubmission(sub.guest_id, { attending: "yes" })
                          }
                          className="w-4 h-4 text-primary border-white/20 bg-transparent focus:ring-primary peer"
                        />
                        <span className="font-label text-xs uppercase tracking-wider text-on-surface-variant transition-colors group-hover:text-primary peer-checked:text-primary peer-checked:font-semibold">Yes</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer group">
                        <input
                          type="radio"
                          name={`attending-${sub.guest_id}`}
                          value="no"
                          checked={sub.attending === "no"}
                          onChange={() =>
                            updateSubmission(sub.guest_id, {
                              attending: "no",
                              meal_choice: null,
                            })
                          }
                          className="w-4 h-4 text-primary border-white/20 bg-transparent focus:ring-primary peer"
                        />
                        <span className="font-label text-xs uppercase tracking-wider text-on-surface-variant transition-colors group-hover:text-primary peer-checked:text-primary peer-checked:font-semibold">No</span>
                      </label>
                    </div>
                  </fieldset>

                  {/* Meal + dietary — only for attendees. Meal options come from the
                      shared MEAL_OPTIONS constant (audit B2), so form and server agree. */}
                  {sub.attending === "yes" && (
                    <div
                      className="space-y-6"
                      style={{ animation: "hero-fade-up 450ms ease-out both" }}
                    >
                      <div>
                        <label htmlFor={`meal-${sub.guest_id}`} className="font-label text-[11px] uppercase tracking-widest text-primary block opacity-80 mb-2">Meal Choice</label>
                        <select
                          id={`meal-${sub.guest_id}`}
                          value={sub.meal_choice ?? ""}
                          onChange={(e) =>
                            updateSubmission(sub.guest_id, {
                              meal_choice: e.target.value || null,
                            })
                          }
                          className="w-full bg-surface-container-low border-none border-b border-white/10 focus:ring-0 focus:border-primary transition-all duration-300 py-4 px-4 font-body text-on-surface appearance-none"
                        >
                          <option value="" disabled>Select a meal…</option>
                          {MEAL_OPTIONS.map((meal) => (
                            <option key={meal} value={meal}>
                              {meal}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor={`dietary-${sub.guest_id}`} className="font-label text-[11px] uppercase tracking-widest text-primary block opacity-80 mb-2">Dietary Restrictions</label>
                        <input
                          id={`dietary-${sub.guest_id}`}
                          type="text"
                          value={sub.dietary_restrictions}
                          onChange={(e) =>
                            updateSubmission(sub.guest_id, {
                              dietary_restrictions: e.target.value,
                            })
                          }
                          placeholder="Gluten-free, Vegan, Allergies..."
                          className="w-full bg-surface-container-low border-none border-b border-white/10 focus:ring-0 focus:border-primary transition-all duration-300 py-4 px-4 font-body text-on-surface placeholder:text-on-surface-variant/40"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Submit error banner (network / server / validation) */}
            {form.errorKind !== null && (
              <div
                role="alert"
                aria-live="assertive"
                className="flex items-start gap-3 p-4 bg-error/10 border border-error/20 rounded-lg mt-12"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-error text-lg shrink-0 mt-0.5">
                  error
                </span>
                <div>
                  <p
                    ref={errorBannerRef}
                    tabIndex={-1}
                    className="text-error text-sm font-body font-medium mb-1 outline-none"
                  >
                    {form.errorKind === "validation"
                      ? "Please complete every guest"
                      : errorCopy[form.errorKind].heading}
                  </p>
                  <p className="text-error/80 text-sm font-body font-light">
                    {form.errorKind === "validation"
                      ? "Each guest needs a Yes or No, and anyone attending needs a meal choice."
                      : errorCopy[form.errorKind].body}
                  </p>
                </div>
              </div>
            )}

            {/* Submit — Phase 6: wired handler + double-submit guard */}
            <div className="pt-12">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                className="w-full py-6 bg-primary text-on-primary font-label text-sm uppercase tracking-[0.4em] hover:bg-white transition-all duration-500 group flex items-center justify-center space-x-4 font-bold btn-press disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span>{isSubmitting ? "Sending…" : "Confirm Group RSVP"}</span>
                <span aria-hidden="true" className="material-symbols-outlined text-sm group-hover:translate-x-2 transition-transform">east</span>
              </button>
              <p className="text-on-surface-variant/70 text-sm font-body font-light text-center mt-6">
                Plans change, and that&apos;s okay. You can come back and update
                your RSVP anytime until{" "}
                <span className="text-primary font-medium">July 31st</span>.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── Lookup stage render (form.stage === "lookup") ─────────────────────────
  return (
    <main className="pt-32 pb-24 min-h-screen flex flex-col justify-center">
      {pageBackdrop}
      <div className="max-w-screen-2xl mx-auto w-full px-8 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
        {leftColumn}

        {/* Right: Lookup form card. Shares cardClass with the form stage so the
            panel keeps the same grid footprint and chrome across stages; only its
            height differs (a single field here vs. the group form). items-center
            on the grid balances this short panel against the editorial column. */}
        <div className={cardClass}>
          <form
            noValidate
            aria-labelledby="rsvp-heading"
            aria-busy={isSearching}
            onSubmit={handleLookup}
            className="space-y-10"
          >
            {/* Label + input block (L-02, L-07) */}
            <div>
              <label
                htmlFor="rsvp-lookup-name"
                className="font-label text-[11px] uppercase tracking-widest text-primary block mb-2 opacity-80"
              >
                Your Full Name
              </label>
              <input
                ref={lookupInputRef}
                id="rsvp-lookup-name"
                type="text"
                autoFocus
                autoComplete="name"
                aria-required="true"
                aria-describedby="rsvp-lookup-help"
                placeholder="E.g. Emily Veeck"
                value={form.lookupName}
                onChange={(e) => setForm((f) => ({ ...f, lookupName: e.target.value }))}
                className="w-full bg-surface-container-low border-none border-b border-white/10 focus:ring-0 focus:border-primary transition-all duration-300 py-4 px-4 font-body text-on-surface placeholder:text-on-surface-variant/40"
              />
            </div>

            {/* Banner slot — Option A from RESEARCH Pitfall 5: two separate conditional
                renders, one per palette family. Avoids accidental token bleed on miss. */}

            {/* Destructive palette: network / server / validation */}
            {form.errorKind !== null && form.errorKind !== "miss" && (
              <div
                role="alert"
                aria-live="assertive"
                className="flex items-start gap-3 p-4 bg-error/10 border border-error/20 rounded-lg mb-6"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-error text-lg shrink-0 mt-0.5">
                  error
                </span>
                <div>
                  <p
                    ref={errorBannerRef}
                    tabIndex={-1}
                    className="text-error text-sm font-body font-medium mb-1 outline-none"
                  >
                    {errorCopy[form.errorKind].heading}
                  </p>
                  <p className="text-error/80 text-sm font-body font-light">
                    {errorCopy[form.errorKind].body}
                  </p>
                </div>
              </div>
            )}

            {/* Neutral palette: miss (D-03 — NOT destructive) */}
            {form.errorKind === "miss" && (
              <div
                role="alert"
                aria-live="assertive"
                className="flex items-start gap-3 p-4 bg-surface-container-low border border-white/10 rounded-lg mb-6"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant text-lg shrink-0 mt-0.5">
                  info
                </span>
                <div>
                  <p
                    ref={errorBannerRef}
                    tabIndex={-1}
                    className="text-on-surface-variant text-sm font-body font-medium mb-1 outline-none"
                  >
                    {errorCopy.miss.heading}
                  </p>
                  <p className="text-on-surface-variant/80 text-sm font-body font-light">
                    {errorCopy.miss.body}
                  </p>
                  {form.suggestions.length > 0 && (
                    <div className="mt-4">
                      <span id="rsvp-suggestions-label" className="font-label text-[11px] uppercase tracking-widest text-primary block opacity-80 mb-2">
                        Did you mean?
                      </span>
                      <ul className="flex flex-wrap gap-2" aria-labelledby="rsvp-suggestions-label">
                        {form.suggestions.map((name, i) => (
                          // index-suffixed key: the server de-dupes names, but a
                          // collision-proof key guards against any duplicate slipping through
                          <li key={`${name}-${i}`}>
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
                </div>
              </div>
            )}

            {/* Submit button (L-06, verbatim styling from v0.1 line 430-444) */}
            <button
              type="submit"
              disabled={isSearching}
              className="w-full py-6 bg-primary text-on-primary font-label text-sm uppercase tracking-[0.4em] hover:bg-white transition-all duration-500 group flex items-center justify-center space-x-4 font-bold btn-press disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span>{isSearching ? "Searching…" : "Find My Invitation"}</span>
              <span aria-hidden="true" className="material-symbols-outlined text-sm group-hover:translate-x-2 transition-transform">
                east
              </span>
            </button>

            {/* Reassurance helper (P2 — /clarify). Answers the two unspoken
                questions at the first action: what the search uses, and that one
                name surfaces the whole household. Linked to the input via
                aria-describedby so it's announced on focus. */}
            <p
              id="rsvp-lookup-help"
              className="font-body text-sm text-on-surface-variant/70 leading-relaxed"
            >
              Search by the name on your invitation — we&apos;ll pull up your
              whole party.
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
