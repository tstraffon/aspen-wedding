"use client";

import { useState } from "react";

type FormState = {
  fullName: string;
  email: string;
  attending: "accept" | "decline" | null;
  guestCount: string;
  dietaryRestrictions: string;
  note: string;
};

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Submission failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background px-8">
        <div className="text-center max-w-md">
          <span
            className="material-symbols-outlined text-primary mb-8 block"
            style={{ fontSize: "64px" }}
          >
            favorite
          </span>
          <h1 className="font-headline text-5xl text-on-surface mb-6">
            Thank You
          </h1>
          <p className="font-body text-on-surface-variant text-lg leading-relaxed">
            Your response has been received. We can&apos;t wait to celebrate
            with you in Aspen.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-32 min-h-screen">
      <div className="max-w-screen-2xl mx-auto px-8 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
        {/* Left: Editorial Content */}
        <div className="lg:col-span-5 sticky top-40">
          <span className="font-label text-xs uppercase tracking-[0.3em] text-primary mb-6 block font-semibold">
            Join Us in Aspen
          </span>
          <h1 className="font-headline text-6xl md:text-8xl text-on-surface leading-[1.1] mb-8">
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
          <form className="space-y-12" onSubmit={handleSubmit}>
            {/* Identity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative">
                <label className="font-label text-[11px] uppercase tracking-widest text-primary block mb-2 opacity-80">
                  Full Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="E.g. Julianne Moore"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fullName: e.target.value }))
                  }
                  className="w-full bg-surface-container-low border-none border-b border-white/10 focus:ring-0 focus:border-primary transition-all duration-300 py-4 px-4 font-body text-on-surface placeholder:text-on-surface-variant/40"
                />
              </div>
              <div className="relative">
                <label className="font-label text-[11px] uppercase tracking-widest text-primary block mb-2 opacity-80">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  placeholder="hello@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  className="w-full bg-surface-container-low border-none border-b border-white/10 focus:ring-0 focus:border-primary transition-all duration-300 py-4 px-4 font-body text-on-surface placeholder:text-on-surface-variant/40"
                />
              </div>
            </div>

            {/* Attendance + Guest Count */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
              <div>
                <label className="font-label text-[11px] uppercase tracking-widest text-primary block mb-4 opacity-80">
                  Will you be attending?
                </label>
                <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-6">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="attending"
                      required
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
              </div>
              <div>
                <label className="font-label text-[11px] uppercase tracking-widest text-primary block mb-2 opacity-80">
                  Number of Guests
                </label>
                <select
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
            </div>

            {/* Dietary + Note */}
            <div className="space-y-8 pt-4">
              <div>
                <label className="font-label text-[11px] uppercase tracking-widest text-primary block mb-2 opacity-80">
                  Dietary Restrictions
                </label>
                <input
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
              <div>
                <label className="font-label text-[11px] uppercase tracking-widest text-primary block mb-2 opacity-80">
                  A Personal Note for the Couple
                </label>
                <textarea
                  placeholder="Share a memory or a wish..."
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
                <p className="text-error text-sm font-label mb-4 uppercase tracking-widest">
                  Something went wrong. Please try again.
                </p>
              )}
              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full py-6 bg-primary text-on-primary font-label text-sm uppercase tracking-[0.4em] hover:bg-white transition-all duration-500 group flex items-center justify-center space-x-4 font-bold disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span>
                  {status === "submitting" ? "Sending…" : "Submit Response"}
                </span>
                <span className="material-symbols-outlined text-sm group-hover:translate-x-2 transition-transform">
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
