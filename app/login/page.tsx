"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/");
      } else {
        setError("Invalid access code. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative h-screen w-full flex items-center justify-center">
      {/* Background image + overlays */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center scale-100"
          style={{ backgroundImage: "url('/login-bg.jpg')" }}
        />
        <div className="absolute inset-0 hero-gradient-dark" />
        <div className="absolute inset-0 vignette-overlay-deep" />
      </div>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-xl px-6">
        <div className="bg-surface/80 backdrop-blur-xl border border-outline/20 p-8 md:p-16 shadow-2xl">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-12">
            <div className="size-10 text-primary mb-6">
              <svg
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
                  fill="currentColor"
                  fillRule="evenodd"
                />
              </svg>
            </div>
            <h1 className="font-headline text-4xl md:text-5xl text-on-surface mb-2 tracking-tight">
              Emily{" "}
              <span className="italic font-light text-primary/80">&amp;</span>{" "}
              Tyler
            </h1>
            <p className="font-label text-[10px] uppercase tracking-[0.4em] text-on-surface-variant">
              Wedding Guest Access
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant ml-1"
                htmlFor="password"
              >
                Access Code
              </label>
              <input
                className="w-full bg-surface-variant/50 border border-outline/30 text-on-surface font-body text-sm py-4 px-5 focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-on-surface-variant/30"
                id="password"
                placeholder="Enter your access code"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-error font-body text-sm text-center">
                {error}
              </p>
            )}

            <div className="pt-4">
              <button
                className="w-full bg-primary text-on-primary py-5 font-label text-xs uppercase tracking-[0.3em] hover:brightness-110 shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Enter Site"}
              </button>
            </div>
          </form>

          {/* Date & venue */}
          <div className="mt-12 text-center">
            <p className="text-on-surface-variant/60 font-body text-xs font-light">
              September 19, 2026 &bull; Hotel Jerome &bull; Aspen, CO
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
