"use client";

// Phase 06 Plan 03 — Task 2: HouseholdsTable client island
// Inline rename, add, remove (with confirm, D-09), move (merge/split, D-10).
// Change 3/4 (06-05): GuestRow extended with RSVP fields; inline RSVP editing.
// All mutations go to /api/admin/guests, /api/admin/guests/[id], /api/admin/rsvps — no
// supabaseAdmin import here (T-06-09 mitigate: service-role key stays server-only).

import { useState } from "react";
import { MEAL_OPTIONS } from "@/lib/rsvp/meal-options";

export type GuestRow = {
  id: string;
  household_id: string;
  full_name: string;
  // RSVP state — null means no response on file.
  attending: boolean | null;
  meal_choice: string | null;
  dietary_restrictions: string | null;
};

export type HouseholdGroup = {
  household_id: string;
  members: GuestRow[];
};

// Per-row interaction mode.
type RowMode =
  | { type: "rename"; value: string }
  | { type: "move"; value: string }
  | { type: "rsvp"; attending: boolean | null; meal_choice: string; dietary_restrictions: string }
  | null;

// Fetch error ordering mirrors app/(main)/rsvp/page.tsx: >=500 first, then !res.ok.
async function adminFetch(
  url: string,
  options: RequestInit
): Promise<{ ok: true } | { ok: false; msg: string }> {
  try {
    const res = await fetch(url, options);
    if (res.status >= 500) {
      return { ok: false, msg: "Server error. Try again." };
    }
    if (!res.ok) {
      return { ok: false, msg: "Invalid request." };
    }
    return { ok: true };
  } catch {
    return { ok: false, msg: "Network error. Check your connection." };
  }
}

async function adminFetchJson<T>(
  url: string,
  options: RequestInit
): Promise<{ ok: true; data: T } | { ok: false; msg: string }> {
  try {
    const res = await fetch(url, options);
    if (res.status >= 500) {
      return { ok: false, msg: "Server error. Try again." };
    }
    if (!res.ok) {
      return { ok: false, msg: "Invalid request." };
    }
    const data = (await res.json()) as T;
    return { ok: true, data };
  } catch {
    return { ok: false, msg: "Network error. Check your connection." };
  }
}

export default function HouseholdsTable({
  households: initialHouseholds,
}: {
  households: HouseholdGroup[];
}) {
  const [households, setHouseholds] = useState(initialHouseholds);

  // Row edit/move modes keyed by guest id.
  const [rowModes, setRowModes] = useState<Record<string, RowMode>>({});

  // Add-person form: key = household_id, value = current input text.
  const [addInputs, setAddInputs] = useState<Record<string, string>>({});
  // Whether the add-person form is open for a given household_id.
  const [addOpen, setAddOpen] = useState<Record<string, boolean>>({});

  // Error messages keyed by guest id or "add-{household_id}".
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Busy flags keyed by guest id or "add-{household_id}".
  const [busy, setBusy] = useState<Record<string, boolean>>({});

  function setGuestBusy(key: string, val: boolean) {
    setBusy((b) => ({ ...b, [key]: val }));
  }
  function setGuestError(key: string, msg: string) {
    setErrors((e) => ({ ...e, [key]: msg }));
  }
  function clearGuestError(key: string) {
    setErrors((e) => {
      const n = { ...e };
      delete n[key];
      return n;
    });
  }
  function clearRowMode(guestId: string) {
    setRowModes((rm) => {
      const n = { ...rm };
      delete n[guestId];
      return n;
    });
  }

  // ── RENAME ─────────────────────────────────────────────────────────────────
  async function handleRename(guest: GuestRow, newName: string) {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setGuestBusy(guest.id, true);
    clearGuestError(guest.id);
    const result = await adminFetch(`/api/admin/guests/${guest.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name: trimmed }),
    });
    setGuestBusy(guest.id, false);
    if (!result.ok) {
      setGuestError(guest.id, result.msg);
      return;
    }
    setHouseholds((hs) =>
      hs.map((h) => ({
        ...h,
        members: h.members.map((m) =>
          m.id === guest.id ? { ...m, full_name: trimmed } : m
        ),
      }))
    );
    clearRowMode(guest.id);
  }

  // ── REMOVE (D-09: confirm before delete) ───────────────────────────────────
  async function handleRemove(guest: GuestRow) {
    // D-09: confirmation prompt before DELETE; copy notes RSVP cascade.
    const confirmed = window.confirm(
      `Remove ${guest.full_name}?\n\nTheir RSVP response will also be deleted. This cannot be undone.`
    );
    if (!confirmed) return;
    setGuestBusy(guest.id, true);
    clearGuestError(guest.id);
    const result = await adminFetch(`/api/admin/guests/${guest.id}`, {
      method: "DELETE",
    });
    setGuestBusy(guest.id, false);
    if (!result.ok) {
      setGuestError(guest.id, result.msg);
      return;
    }
    setHouseholds((hs) =>
      hs
        .map((h) => ({
          ...h,
          members: h.members.filter((m) => m.id !== guest.id),
        }))
        .filter((h) => h.members.length > 0) // prune empty households from view
    );
  }

  // ── MOVE (merge = existing household_id; split = crypto.randomUUID(), D-10) ──
  async function handleMove(guest: GuestRow, targetValue: string) {
    if (!targetValue || targetValue === guest.household_id) {
      clearRowMode(guest.id);
      return;
    }
    // D-10: split uses a client-generated UUID.
    const newHouseholdId =
      targetValue === "__new__" ? crypto.randomUUID() : targetValue;

    setGuestBusy(guest.id, true);
    clearGuestError(guest.id);
    const result = await adminFetch(`/api/admin/guests/${guest.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ household_id: newHouseholdId }),
    });
    setGuestBusy(guest.id, false);
    if (!result.ok) {
      setGuestError(guest.id, result.msg);
      return;
    }
    const updatedGuest: GuestRow = { ...guest, household_id: newHouseholdId };
    setHouseholds((hs) => {
      // Remove guest from current household; prune if now empty.
      let updated = hs
        .map((h) => ({
          ...h,
          members: h.members.filter((m) => m.id !== guest.id),
        }))
        .filter((h) => h.members.length > 0);

      // Add to target household or create a new one.
      const targetIdx = updated.findIndex(
        (h) => h.household_id === newHouseholdId
      );
      if (targetIdx >= 0) {
        updated = updated.map((h, i) =>
          i === targetIdx
            ? {
                ...h,
                members: [...h.members, updatedGuest].sort((a, b) =>
                  a.full_name.localeCompare(b.full_name)
                ),
              }
            : h
        );
      } else {
        updated = [
          ...updated,
          { household_id: newHouseholdId, members: [updatedGuest] },
        ];
      }
      return updated;
    });
    clearRowMode(guest.id);
  }

  // ── ADD PERSON ─────────────────────────────────────────────────────────────
  async function handleAdd(householdId: string) {
    const name = (addInputs[householdId] ?? "").trim();
    if (!name) return;
    const key = `add-${householdId}`;
    setGuestBusy(key, true);
    clearGuestError(key);
    const result = await adminFetchJson<{ success: boolean; guest: GuestRow }>(
      "/api/admin/guests",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ household_id: householdId, full_name: name }),
      }
    );
    setGuestBusy(key, false);
    if (!result.ok) {
      setGuestError(key, result.msg);
      return;
    }
    const newGuest: GuestRow = {
      ...result.data.guest,
      attending: null,
      meal_choice: null,
      dietary_restrictions: null,
    };
    setHouseholds((hs) =>
      hs.map((h) =>
        h.household_id === householdId
          ? {
              ...h,
              members: [...h.members, newGuest].sort((a, b) =>
                a.full_name.localeCompare(b.full_name)
              ),
            }
          : h
      )
    );
    setAddInputs((ai) => {
      const n = { ...ai };
      delete n[householdId];
      return n;
    });
    setAddOpen((ao) => ({ ...ao, [householdId]: false }));
  }

  // ── RSVP SAVE ──────────────────────────────────────────────────────────────
  async function handleRsvpSave(
    guest: GuestRow,
    mode: { attending: boolean | null; meal_choice: string; dietary_restrictions: string }
  ) {
    if (mode.attending === null) return; // must pick Yes or No
    setGuestBusy(guest.id, true);
    clearGuestError(guest.id);
    const result = await adminFetch("/api/admin/rsvps", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guest_id: guest.id,
        household_id: guest.household_id,
        attending: mode.attending,
        meal_choice: mode.attending ? mode.meal_choice : null,
        dietary_restrictions: mode.attending ? mode.dietary_restrictions : null,
      }),
    });
    setGuestBusy(guest.id, false);
    if (!result.ok) {
      setGuestError(guest.id, result.msg);
      return;
    }
    setHouseholds((hs) =>
      hs.map((h) => ({
        ...h,
        members: h.members.map((m) =>
          m.id === guest.id
            ? {
                ...m,
                attending: mode.attending,
                meal_choice: mode.attending ? mode.meal_choice || null : null,
                dietary_restrictions: mode.attending
                  ? mode.dietary_restrictions || null
                  : null,
              }
            : m
        ),
      }))
    );
    clearRowMode(guest.id);
  }

  // ── RSVP STATUS HINT ───────────────────────────────────────────────────────
  function rsvpStatusHint(guest: GuestRow) {
    if (guest.attending === null) {
      return (
        <span className="font-body text-xs text-on-surface-variant/50">
          No response
        </span>
      );
    }
    if (!guest.attending) {
      return (
        <span className="font-body text-xs text-on-surface-variant">
          Not attending
        </span>
      );
    }
    return (
      <span className="font-body text-xs text-primary">
        Attending{guest.meal_choice ? ` · ${guest.meal_choice}` : ""}
      </span>
    );
  }

  // ── RENDER ──────────────────────────────────────────────────────────────────

  if (households.length === 0) {
    return (
      <p className="text-on-surface-variant font-body text-sm">
        No households. Import the guest list or add guests to get started.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {households.map((household) => (
        <div
          key={household.household_id}
          className="bg-surface-container-lowest border border-white/10 rounded-lg overflow-hidden"
        >
          {/* Household header */}
          <div className="px-4 py-2.5 bg-surface-container-low border-b border-white/10 flex items-center justify-between gap-4">
            <span className="font-label text-xs uppercase tracking-widest text-primary">
              {household.members.length === 1
                ? "1 guest"
                : `${household.members.length} guests`}
            </span>
            <span className="font-body text-xs text-on-surface-variant truncate">
              {household.members.map((m) => m.full_name).join(", ")}
            </span>
          </div>

          {/* Member rows */}
          <div className="divide-y divide-white/5">
            {household.members.map((guest) => {
              const mode = rowModes[guest.id] ?? null;
              const isBusy = busy[guest.id] ?? false;
              const errMsg = errors[guest.id] ?? null;

              return (
                <div key={guest.id} className="px-4 py-3">
                  {mode?.type === "rename" ? (
                    // ── Rename mode ─────────────────────────────────────────
                    <div className="flex items-center gap-2 flex-wrap">
                      <input
                        type="text"
                        value={mode.value}
                        onChange={(e) =>
                          setRowModes((rm) => ({
                            ...rm,
                            [guest.id]: { type: "rename", value: e.target.value },
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter")
                            handleRename(guest, mode.value);
                          if (e.key === "Escape") clearRowMode(guest.id);
                        }}
                        autoFocus
                        className="flex-1 min-w-0 bg-surface-container-low border border-white/20 px-3 py-1.5 font-body text-sm text-on-surface rounded focus:outline-none focus:border-primary transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => handleRename(guest, mode.value)}
                        disabled={isBusy}
                        className="font-label text-xs uppercase tracking-wider text-primary hover:text-white transition-colors disabled:opacity-40"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => clearRowMode(guest.id)}
                        className="font-label text-xs uppercase tracking-wider text-on-surface-variant hover:text-on-surface transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : mode?.type === "move" ? (
                    // ── Move mode ───────────────────────────────────────────
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-body text-sm text-on-surface flex-1 min-w-0 truncate">
                        {guest.full_name}
                      </span>
                      <select
                        value={mode.value}
                        onChange={(e) =>
                          setRowModes((rm) => ({
                            ...rm,
                            [guest.id]: { type: "move", value: e.target.value },
                          }))
                        }
                        className="bg-surface-container-low border border-white/20 px-2 py-1.5 font-body text-xs text-on-surface rounded focus:outline-none focus:border-primary transition-colors max-w-[220px]"
                      >
                        <option value="">Select household…</option>
                        {households
                          .filter(
                            (h) => h.household_id !== guest.household_id
                          )
                          .map((h) => (
                            <option key={h.household_id} value={h.household_id}>
                              {h.members
                                .map((m) => m.full_name)
                                .join(", ")
                                .slice(0, 60)}
                            </option>
                          ))}
                        <option value="__new__">
                          New household (split)
                        </option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handleMove(guest, mode.value)}
                        disabled={isBusy || !mode.value}
                        className="font-label text-xs uppercase tracking-wider text-primary hover:text-white transition-colors disabled:opacity-40"
                      >
                        Move
                      </button>
                      <button
                        type="button"
                        onClick={() => clearRowMode(guest.id)}
                        className="font-label text-xs uppercase tracking-wider text-on-surface-variant hover:text-on-surface transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : mode?.type === "rsvp" ? (
                    // ── RSVP edit mode ──────────────────────────────────────
                    <div className="space-y-2">
                      <span className="font-body text-sm text-on-surface">
                        {guest.full_name}
                      </span>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-label text-xs uppercase tracking-wider text-on-surface-variant">
                          Attending?
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setRowModes((rm) => ({
                              ...rm,
                              [guest.id]: { ...mode, attending: true },
                            }))
                          }
                          className={`font-label text-xs uppercase tracking-wider px-2 py-1 rounded border transition-colors ${
                            mode.attending === true
                              ? "border-primary text-primary"
                              : "border-white/20 text-on-surface-variant hover:border-primary hover:text-primary"
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setRowModes((rm) => ({
                              ...rm,
                              [guest.id]: { ...mode, attending: false },
                            }))
                          }
                          className={`font-label text-xs uppercase tracking-wider px-2 py-1 rounded border transition-colors ${
                            mode.attending === false
                              ? "border-error text-error"
                              : "border-white/20 text-on-surface-variant hover:border-error hover:text-error"
                          }`}
                        >
                          No
                        </button>
                      </div>
                      {mode.attending === true && (
                        <div className="space-y-2">
                          <select
                            value={mode.meal_choice}
                            onChange={(e) =>
                              setRowModes((rm) => ({
                                ...rm,
                                [guest.id]: { ...mode, meal_choice: e.target.value },
                              }))
                            }
                            className="w-full bg-surface-container-low border border-white/20 px-2 py-1.5 font-body text-xs text-on-surface rounded focus:outline-none focus:border-primary transition-colors"
                          >
                            <option value="">Select meal…</option>
                            {MEAL_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            placeholder="Dietary restrictions (optional)"
                            value={mode.dietary_restrictions}
                            onChange={(e) =>
                              setRowModes((rm) => ({
                                ...rm,
                                [guest.id]: {
                                  ...mode,
                                  dietary_restrictions: e.target.value,
                                },
                              }))
                            }
                            className="w-full bg-surface-container-low border border-white/20 px-3 py-1.5 font-body text-xs text-on-surface rounded focus:outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant/40"
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-3 flex-wrap pt-1">
                        <button
                          type="button"
                          onClick={() => handleRsvpSave(guest, mode)}
                          disabled={
                            isBusy ||
                            mode.attending === null ||
                            (mode.attending === true && !mode.meal_choice)
                          }
                          className="font-label text-xs uppercase tracking-wider text-primary hover:text-white transition-colors disabled:opacity-40"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => clearRowMode(guest.id)}
                          className="font-label text-xs uppercase tracking-wider text-on-surface-variant hover:text-on-surface transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // ── Display mode ────────────────────────────────────────
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-body text-sm text-on-surface flex-1 min-w-0 truncate">
                          {guest.full_name}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setRowModes((rm) => ({
                              ...rm,
                              [guest.id]: {
                                type: "rename",
                                value: guest.full_name,
                              },
                            }))
                          }
                          className="font-label text-xs uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors shrink-0"
                        >
                          Rename
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setRowModes((rm) => ({
                              ...rm,
                              [guest.id]: { type: "move", value: "" },
                            }))
                          }
                          className="font-label text-xs uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors shrink-0"
                        >
                          Move
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setRowModes((rm) => ({
                              ...rm,
                              [guest.id]: {
                                type: "rsvp",
                                attending: guest.attending,
                                meal_choice: guest.meal_choice ?? "",
                                dietary_restrictions:
                                  guest.dietary_restrictions ?? "",
                              },
                            }))
                          }
                          className="font-label text-xs uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors shrink-0"
                        >
                          RSVP
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemove(guest)}
                          disabled={isBusy}
                          className="font-label text-xs uppercase tracking-wider text-on-surface-variant hover:text-error transition-colors disabled:opacity-40 shrink-0"
                        >
                          Remove
                        </button>
                      </div>
                      {/* RSVP status hint */}
                      {rsvpStatusHint(guest)}
                    </div>
                  )}

                  {/* Per-guest error */}
                  {errMsg && (
                    <p className="text-error text-xs font-body mt-1.5">
                      {errMsg}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add-person controls */}
          <div className="px-4 py-3 border-t border-white/5">
            {addOpen[household.household_id] ? (
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="text"
                  placeholder="Full name…"
                  value={addInputs[household.household_id] ?? ""}
                  onChange={(e) =>
                    setAddInputs((ai) => ({
                      ...ai,
                      [household.household_id]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAdd(household.household_id);
                    if (e.key === "Escape")
                      setAddOpen((ao) => ({
                        ...ao,
                        [household.household_id]: false,
                      }));
                  }}
                  autoFocus
                  className="flex-1 min-w-0 bg-surface-container-low border border-white/20 px-3 py-1.5 font-body text-sm text-on-surface rounded focus:outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant/40"
                />
                <button
                  type="button"
                  onClick={() => handleAdd(household.household_id)}
                  disabled={busy[`add-${household.household_id}`] ?? false}
                  className="font-label text-xs uppercase tracking-wider text-primary hover:text-white transition-colors disabled:opacity-40"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setAddOpen((ao) => ({
                      ...ao,
                      [household.household_id]: false,
                    }))
                  }
                  className="font-label text-xs uppercase tracking-wider text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() =>
                  setAddOpen((ao) => ({
                    ...ao,
                    [household.household_id]: true,
                  }))
                }
                className="font-label text-xs uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors"
              >
                + Add person
              </button>
            )}
            {errors[`add-${household.household_id}`] && (
              <p className="text-error text-xs font-body mt-1.5">
                {errors[`add-${household.household_id}`]}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
