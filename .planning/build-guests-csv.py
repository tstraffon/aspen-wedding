#!/usr/bin/env python3
"""
Build the RSVP guests import file from the address-book export.

Input : .planning/address-book.csv  (the contacts/envelope export — one row per
        household, with structured First/Last/Partner columns)
Output: .planning/guests-import.csv  (household_id,full_name — one row per PERSON)
        .planning/guests-review.md    (only the rows that need a human decision)

Run:    python3 .planning/build-guests-csv.py

The guests table only needs (household_id, full_name); `id` auto-generates on
import. Lookup is an EXACT name match, so full_name must be how each guest will
type their own name. Heuristic splits are best-effort — the review file lists
every row that the script could not resolve cleanly so you can correct it.
"""
import csv
import re
import sys
import uuid
from pathlib import Path

HERE = Path(__file__).resolve().parent
SRC = HERE / "address-book.csv"
OUT = HERE / "guests-import.csv"
REVIEW = HERE / "guests-review.md"

# Split a "First" cell on the conjunctions the export uses between two people.
SPLIT_RE = re.compile(r"\s*(?:\bAnd\b|&|\+)\s*", re.IGNORECASE)


def col(row, *names):
    """First non-empty value among the given column names (trimmed)."""
    for n in names:
        v = (row.get(n) or "").strip()
        if v:
            return v
    return ""


def is_generic_family(first, last, names_family):
    name = (first or names_family).strip()
    return bool(re.match(r"^The\b.*\bFamily$", name, re.IGNORECASE)) and not last


def split_household(row):
    """Return (people: list[str], flags: list[str]) for one spreadsheet row."""
    first = col(row, "First Name")
    last = col(row, "Last Name")
    pfirst = col(row, "Partner First Name")
    plast = col(row, "Partner Last Name")
    names_family = col(row, "Names Family")
    names_together = col(row, "Names Together")

    people, flags = [], []

    # Generic "The X Family" with no individuals broken out — needs manual entry.
    if is_generic_family(first, last, names_family):
        people.append(names_family or first or names_together)
        flags.append("generic-family: replace with the real individual guests")
        return people, flags

    parts = SPLIT_RE.split(first) if first else []
    parts = [p.strip() for p in parts if p.strip()]

    if not parts:
        # Nothing in First — fall back to a combined name column for review.
        if names_together:
            people.append(names_together)
            flags.append("no-first-name: parsed from Names Together")
        return people, flags

    if len(parts) == 1:
        # Single first name (may include a suffix in Last, e.g. "Furman III").
        people.append(f"{parts[0]} {last}".strip())
    else:
        # Two names joined by And/&/+.
        if last:
            # Shared surname: each part is a first name.
            for p in parts:
                people.append(f"{p} {last}".strip())
        else:
            # No shared surname: each part is already a full name.
            people.extend(parts)
            flags.append("split-fullnames: no shared surname — verify the split")

    # Partner columns = an additional person (e.g. a third household member).
    if pfirst:
        people.append(f"{pfirst} {plast}".strip())
        flags.append("3+ people: partner columns added a third member")

    # Plus-ones invited as "And Guest" — primary fills this in after lookup.
    for i, person in enumerate(people):
        if re.fullmatch(r"guest", person, re.IGNORECASE):
            flags.append("plus-one: 'Guest' placeholder — primary RSVPs for them")

    return people, flags


def main():
    if not SRC.exists():
        sys.exit(
            f"Missing {SRC}\n"
            "Export the spreadsheet as CSV (keep the structured columns) and "
            "save it there, then re-run."
        )

    with SRC.open(newline="", encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f))

    out_rows = []  # (household_id, full_name)
    review = []    # (household_id, raw_name, people, flags)

    for row in rows:
        hid = str(uuid.uuid4())
        people, flags = split_household(row)
        raw = col(row, "Names Together", "Names Family", "First Name")
        if not people:
            review.append((hid, raw, [], ["EMPTY: no people parsed"]))
            continue
        for person in people:
            out_rows.append((hid, person))
        if flags:
            review.append((hid, raw, people, flags))

    with OUT.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["household_id", "full_name"])
        w.writerows(out_rows)

    lines = [
        "# Guests import — rows needing review",
        "",
        f"- Households parsed: {len(rows)}",
        f"- Guests written: {len(out_rows)}",
        f"- Households flagged below: {len(review)}",
        "",
        "Fix these directly in `guests-import.csv` (match by household_id), then import.",
        "",
    ]
    for hid, raw, people, flags in review:
        lines.append(f"## {raw or '(no name)'}")
        lines.append(f"`{hid}`")
        lines.append(f"- proposed: {', '.join(people) if people else '(none)'}")
        for fl in flags:
            lines.append(f"- ⚠ {fl}")
        lines.append("")
    REVIEW.write_text("\n".join(lines), encoding="utf-8")

    print(f"Wrote {len(out_rows)} guests across {len(rows)} households -> {OUT.name}")
    print(f"Flagged {len(review)} households for review -> {REVIEW.name}")


if __name__ == "__main__":
    main()
