"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.status >= 500) {
        setError("Something went wrong on our end. Try again.");
        return;
      }
      if (!res.ok) {
        setError("Incorrect access code.");
        return;
      }
      window.location.href = "/admin";
    } catch {
      setError("Network error. Check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-headline text-primary text-center uppercase tracking-[0.3em] text-lg mb-8">
          Admin Access
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block font-label text-on-surface-variant text-xs uppercase tracking-widest mb-2"
            >
              Access Code
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 bg-surface-container-low border border-white/10 text-on-surface font-body text-sm focus:outline-none focus:border-primary/50 transition-colors duration-200"
              placeholder="Enter access code"
            />
          </div>

          {error && (
            <p className="font-body text-error text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-primary text-on-primary font-label text-sm uppercase tracking-[0.4em] hover:bg-white transition-all duration-500 font-bold disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Signing in…" : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}
