"use client";

import { useEffect, useRef, useState } from "react";

type FormState = {
  fullName: string;
  email: string;
  attending: "accept" | "decline" | null;
  guestCount: string;
  dietaryRestrictions: string;
  note: string;
};

type FormErrors = Partial<Record<"fullName" | "email" | "attending", string>>;
type ErrorKind = "network" | "server" | "validation";

export default function RSVPPage() {
  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    attending: null,
    guestCount: "1 Guest",
    dietaryRestrictions: "",
    note: "",
  });
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errors, setErrors] = useState<FormErrors>({});
  const [errorKind, setErrorKind] = useState<ErrorKind | null>(null);
  const errorBannerRef = useRef<HTMLParagraphElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!form.fullName.trim()) {
      next.fullName = "We need your name to find your invitation.";
    }
    if (!form.email.trim()) {
      next.email = "Where should we reach you with details?";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "That email doesn't look right — double-check the spelling.";
    }
    if (!form.attending) {
      next.attending = "Let us know if you can make it.";
    }
    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorKind(null);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      queueMicrotask(() => {
        const firstInvalid = (
          Object.keys(validationErrors) as Array<keyof FormErrors>
        )[0];
        const fieldId =
          firstInvalid === "attending"
            ? "rsvp-attending-accept"
            : firstInvalid === "fullName"
              ? "rsvp-full-name"
              : "rsvp-email";
        document.getElementById(fieldId)?.focus();
      });
      return;
    }
    setErrors({});
    setStatus("submitting");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        setErrorKind(res.status >= 500 ? "server" : "validation");
        throw new Error("Submission failed");
      }
      setStatus("success");
    } catch {
      setErrorKind((prev) => prev ?? "network");
      setStatus("error");
    }
  }

  useEffect(() => {
    if (status === "success") successHeadingRef.current?.focus();
    if (status === "error") errorBannerRef.current?.focus();
  }, [status]);

  if (status === "success") {
    const successBody =
      form.attending === "decline"
        ? "We'll miss you in Aspen, but thank you for letting us know. We're holding good thoughts for you."
        : "We can't wait to celebrate with you in Aspen. We'll send venue and timing details closer to the wedding.";
    return (
      <main className="min-h-screen flex items-center justify-center bg-background px-8">
        <div className="text-center max-w-md">
          <span
            aria-hidden="true"
            className="material-symbols-outlined text-primary mb-8 block"
            style={{ fontSize: "64px" }}
          >
            favorite
          </span>
          <h1
            ref={successHeadingRef}
            tabIndex={-1}
            className="font-headline text-5xl text-on-surface mb-6"
          >
            Thank You
          </h1>
          <p className="font-body text-on-surface-variant text-lg leading-relaxed">
            {successBody}
          </p>
        </div>
      </main>
    );
  }

  const errorCopy = {
    network: {
      heading: "We couldn't send your RSVP",
      body: (
        <>
          Check your connection and try again. Still stuck? Email us at{" "}
          <a
            href="mailto:hello@emilyandtyler.com"
            className="underline underline-offset-2"
          >
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
          <a
            href="mailto:hello@emilyandtyler.com"
            className="underline underline-offset-2"
          >
            hello@emilyandtyler.com
          </a>{" "}
          and we&apos;ll add you manually.
        </>
      ),
    },
    validation: {
      heading: "One of your answers needs a tweak",
      body: "Scroll up and check the highlighted field, then try again.",
    },
  }[errorKind ?? "network"];

  return (
    <main className="pt-32 min-h-screen">
      <div className="max-w-screen-2xl mx-auto px-8 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
        {/* Left: Editorial Content */}
        <div className="lg:col-span-5 sticky top-40">
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

        {/* Right: Form */}
        <div className="lg:col-span-7 bg-surface-container-lowest p-8 md:p-16 lg:p-24 shadow-2xl border border-white/5">
          <form
            noValidate
            aria-labelledby="rsvp-heading"
            aria-busy={status === "submitting"}
            className="space-y-12"
            onSubmit={handleSubmit}
          >
            {/* Identity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative">
                <label
                  htmlFor="rsvp-full-name"
                  className="font-label text-[11px] uppercase tracking-widest text-primary block mb-2 opacity-80"
                >
                  Full Name
                </label>
                <input
                  id="rsvp-full-name"
                  aria-required="true"
                  aria-invalid={errors.fullName ? "true" : undefined}
                  aria-describedby={
                    errors.fullName ? "rsvp-full-name-error" : undefined
                  }
                  type="text"
                  placeholder="E.g. Julianne Moore"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fullName: e.target.value }))
                  }
                  className="w-full bg-surface-container-low border-none border-b border-white/10 focus:ring-0 focus:border-primary transition-all duration-300 py-4 px-4 font-body text-on-surface placeholder:text-on-surface-variant/40"
                />
                {errors.fullName && (
                  <p
                    id="rsvp-full-name-error"
                    role="alert"
                    className="mt-2 text-error text-xs font-body"
                  >
                    {errors.fullName}
                  </p>
                )}
              </div>
              <div className="relative">
                <label
                  htmlFor="rsvp-email"
                  className="font-label text-[11px] uppercase tracking-widest text-primary block mb-2 opacity-80"
                >
                  Email Address
                </label>
                <input
                  id="rsvp-email"
                  aria-required="true"
                  aria-invalid={errors.email ? "true" : undefined}
                  aria-describedby={
                    errors.email ? "rsvp-email-error" : undefined
                  }
                  type="email"
                  placeholder="hello@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  className="w-full bg-surface-container-low border-none border-b border-white/10 focus:ring-0 focus:border-primary transition-all duration-300 py-4 px-4 font-body text-on-surface placeholder:text-on-surface-variant/40"
                />
                {errors.email && (
                  <p
                    id="rsvp-email-error"
                    role="alert"
                    className="mt-2 text-error text-xs font-body"
                  >
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Attendance */}
            <div>
              <label
                id="rsvp-attending-label"
                htmlFor="rsvp-attending-accept"
                className="font-label text-[11px] uppercase tracking-widest text-primary block mb-4 opacity-80"
              >
                Will you be attending?
              </label>
              <fieldset
                aria-labelledby="rsvp-attending-label"
                aria-required="true"
                aria-invalid={errors.attending ? "true" : undefined}
                aria-describedby={
                  errors.attending ? "rsvp-attending-error" : undefined
                }
              >
                <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-6">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      id="rsvp-attending-accept"
                      type="radio"
                      name="attending"
                      checked={form.attending === "accept"}
                      onChange={() =>
                        setForm((f) => ({ ...f, attending: "accept" }))
                      }
                      className="w-4 h-4 text-primary border-white/20 bg-transparent focus:ring-primary"
                    />
                    <span className="font-label text-xs uppercase tracking-wider group-hover:text-primary transition-colors text-on-surface-variant">
                      Delightfully Accept
                    </span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      id="rsvp-attending-decline"
                      type="radio"
                      name="attending"
                      checked={form.attending === "decline"}
                      onChange={() =>
                        setForm((f) => ({ ...f, attending: "decline" }))
                      }
                      className="w-4 h-4 text-primary border-white/20 bg-transparent focus:ring-primary"
                    />
                    <span className="font-label text-xs uppercase tracking-wider group-hover:text-primary transition-colors text-on-surface-variant">
                      Regretfully Decline
                    </span>
                  </label>
                </div>
              </fieldset>
              {errors.attending && (
                <p
                  id="rsvp-attending-error"
                  role="alert"
                  className="mt-2 text-error text-xs font-body"
                >
                  {errors.attending}
                </p>
              )}
            </div>

            {/* Guest details — only shown when accepting */}
            <div aria-live="polite">
              {form.attending !== "decline" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                  <div>
                    <label
                      htmlFor="rsvp-guest-count"
                      className="font-label text-[11px] uppercase tracking-widest text-primary block mb-2 opacity-80"
                    >
                      Number of Guests
                    </label>
                    <select
                      id="rsvp-guest-count"
                      value={form.guestCount}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, guestCount: e.target.value }))
                      }
                      className="w-full bg-surface-container-low border-none border-b border-white/10 focus:ring-0 focus:border-primary py-4 px-4 font-body text-on-surface appearance-none"
                    >
                      <option>1 Guest</option>
                      <option>2 Guests</option>
                      <option>3 Guests</option>
                      <option>4 Guests</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="rsvp-dietary-restrictions"
                      className="font-label text-[11px] uppercase tracking-widest text-primary block mb-2 opacity-80"
                    >
                      Dietary Restrictions
                    </label>
                    <input
                      id="rsvp-dietary-restrictions"
                      type="text"
                      placeholder="Gluten-free, Vegan, Allergies..."
                      value={form.dietaryRestrictions}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          dietaryRestrictions: e.target.value,
                        }))
                      }
                      className="w-full bg-surface-container-low border-none border-b border-white/10 focus:ring-0 focus:border-primary transition-all duration-300 py-4 px-4 font-body text-on-surface placeholder:text-on-surface-variant/40"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Note */}
            <div className="space-y-8 pt-4">
              <div>
                <label
                  htmlFor="rsvp-note"
                  className="font-label text-[11px] uppercase tracking-widest text-primary block mb-2 opacity-80"
                >
                  A Personal Note for the Couple
                </label>
                <textarea
                  id="rsvp-note"
                  placeholder={form.attending === "decline" ? "We'll miss you! Leave a note if you'd like..." : "Share a memory or a wish..."}
                  rows={4}
                  value={form.note}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, note: e.target.value }))
                  }
                  className="w-full bg-surface-container-low border-none border-b border-white/10 focus:ring-0 focus:border-primary transition-all duration-300 py-4 px-4 font-body text-on-surface placeholder:text-on-surface-variant/40 resize-none"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-8">
              {status === "error" && (
                <div
                  aria-live="assertive"
                  className="flex items-start gap-3 p-4 bg-error/10 border border-error/20 rounded-lg mb-6"
                  role="alert"
                >
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-error text-lg shrink-0 mt-0.5"
                  >
                    error
                  </span>
                  <div>
                    <p
                      ref={errorBannerRef}
                      tabIndex={-1}
                      className="text-error text-sm font-body font-medium mb-1"
                    >
                      {errorCopy.heading}
                    </p>
                    <p className="text-error/80 text-sm font-body font-light">
                      {errorCopy.body}
                    </p>
                  </div>
                </div>
              )}
              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full py-6 bg-primary text-on-primary font-label text-sm uppercase tracking-[0.4em] hover:bg-white transition-all duration-500 group flex items-center justify-center space-x-4 font-bold disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span>
                  {status === "submitting" ? "Sending…" : "Submit Response"}
                </span>
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined text-sm group-hover:translate-x-2 transition-transform"
                >
                  east
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Quote Section */}
      <section className="mt-48 px-8 md:px-12 max-w-7xl mx-auto text-center pb-24">
        <div className="inline-block relative">
          <span
            aria-hidden="true"
            className="material-symbols-outlined text-5xl text-primary absolute -top-12 -left-16 opacity-60"
          >
            format_quote
          </span>
          <h2 className="font-headline text-3xl md:text-5xl text-on-surface max-w-2xl leading-relaxed italic">
            &ldquo;In the silence of the mountains, we found our forever.&rdquo;
          </h2>
        </div>
      </section>
    </main>
  );
}
