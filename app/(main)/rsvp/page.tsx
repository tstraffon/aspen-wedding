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
  errorKind: ErrorKind | null;
};

export default function RSVPPage() {
  const [form, setForm] = useState<FormState>({
    stage: "lookup",
    lookupName: "",
    household: null,
    submissions: [],
    errorKind: null,
  });
  const [isSearching, setIsSearching] = useState(false);

  // Refs: errorBannerRef + formHeadingRef + lookupInputRef (RESEARCH Q3 + Q4)
  const errorBannerRef = useRef<HTMLParagraphElement>(null);
  const formHeadingRef = useRef<HTMLHeadingElement>(null);
  const lookupInputRef = useRef<HTMLInputElement>(null);

  // ── handleLookup (L-05 flow, RESEARCH Q2 + Q10) ──────────────────────────
  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setForm((f) => ({ ...f, errorKind: null }));
    const trimmed = form.lookupName.trim();
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
        members?: { guest_id: string; full_name: string }[];
      } = await res.json();
      if (!data.found) {
        setForm((f) => ({ ...f, errorKind: "miss" }));
        return;
      }
      const members = data.members ?? [];
      // Atomic setForm — sets stage + household + submissions in ONE call to
      // avoid an intermediate render with `stage: 'form'` but empty `submissions`
      // (RESEARCH Q10, Pitfall 3).
      setForm({
        stage: "form",
        lookupName: trimmed,
        household: { id: data.household_id!, members },
        submissions: members.map((m) => ({
          guest_id: m.guest_id,
          full_name: m.full_name,
          attending: null,
          meal_choice: null,
          dietary_restrictions: "",
        })),
        errorKind: null,
      });
    } catch {
      setForm((f) => ({ ...f, errorKind: "network" }));
    } finally {
      setIsSearching(false);
    }
  }

  // ── handleTryAgain (L-03, GUEST-03) ──────────────────────────────────────
  function handleTryAgain() {
    setForm((f) => ({ ...f, lookupName: "", errorKind: null }));
    lookupInputRef.current?.focus();
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
          <a href="mailto:hello@emilyandtyler.com" className="underline underline-offset-2">
            hello@emilyandtyler.com
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
          <a href="mailto:hello@emilyandtyler.com" className="underline underline-offset-2">
            hello@emilyandtyler.com
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
          <a href="mailto:hello@emilyandtyler.com" className="underline underline-offset-2">
            hello@emilyandtyler.com
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

  // ── Success stage (F-05 — Phase 6 owns the entire success view) ──────────
  if (form.stage === "success") {
    // Plan 05-02 / Phase 6: success view + edit-response link (GROUP-03)
    return null;
  }

  // ── Editorial left column — shared across all stages (D-05) ──────────────
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
      <p className="font-body text-lg text-on-surface-variant max-w-md leading-relaxed mb-12">
        We look forward to celebrating this new chapter with our closest
        family and friends. Please confirm your attendance by{" "}
        <span className="font-bold text-primary">September 1st</span>.
      </p>
      <div className="aspect-[4/5] relative rounded-lg overflow-hidden bg-surface-container-highest ring-1 ring-white/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="object-cover w-full h-full opacity-80"
          alt="Panoramic view of the Maroon Bells peaks in Aspen"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSFj0oU-OqYeYgIdZGz479vEvTJLubdqcyGdcrMGTs6TcsvepaRtRzjlhQIk8mYo7DfqFLcMOHleS27HvqFlcIeDE3KUohZCvIEjGFo37TYxb-N9bMoQmFnLvBhbtIXRzT1vuslQdXmEoP5hC67glOtQ8nMkOydppL9QTjnmB3XR6y1cZX3yJfJ4h22HBPnITsmiAj3ly2OrsKS8iiDh2Oh7RAbAhnLdg81eWJ0xtr_qjBlZ5qRbKI7ZkLc33ZmIi3J1RRHHbeebE"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
      </div>
    </div>
  );

  // ── Form stage (placeholder — Plan 05-02 fills this branch) ─────────────
  if (form.stage === "form") {
    return (
      <main className="pt-32 min-h-screen">
        <div className="max-w-screen-2xl mx-auto px-8 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          {leftColumn}
          <div className="lg:col-span-7 bg-surface-container-lowest p-8 md:p-16 lg:p-24 shadow-2xl border border-white/5">
            {/* Plan 05-02 fills this: "Your Group" heading + submissions.map(...) member rows + disabled "Confirm Group RSVP" button. */}
            <h2
              ref={formHeadingRef}
              tabIndex={-1}
              className="font-headline text-4xl md:text-5xl text-on-surface mb-12 outline-none"
            >
              Your Group
            </h2>
            <p className="font-body text-sm text-on-surface-variant">
              Plan 05-02 renders {form.submissions.length} member row(s) here.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ── Lookup stage render (form.stage === "lookup") ─────────────────────────
  return (
    <main className="pt-32 min-h-screen">
      <div className="max-w-screen-2xl mx-auto px-8 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
        {leftColumn}

        {/* Right: Lookup form card (L-01 — reuse v0.1 chrome verbatim) */}
        <div className="lg:col-span-7 bg-surface-container-lowest p-8 md:p-16 lg:p-24 shadow-2xl border border-white/5">
          <form
            noValidate
            aria-labelledby="rsvp-heading"
            aria-busy={isSearching}
            onSubmit={handleLookup}
            className="space-y-12"
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
                placeholder="E.g. Tyler Straffon"
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
                </div>
              </div>
            )}

            {/* Submit button (L-06, verbatim styling from v0.1 line 430-444) */}
            <button
              type="submit"
              disabled={isSearching}
              className="w-full py-6 bg-primary text-on-primary font-label text-sm uppercase tracking-[0.4em] hover:bg-white transition-all duration-500 group flex items-center justify-center space-x-4 font-bold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span>{isSearching ? "Searching…" : "Find My Invitation"}</span>
              <span aria-hidden="true" className="material-symbols-outlined text-sm group-hover:translate-x-2 transition-transform">
                east
              </span>
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
