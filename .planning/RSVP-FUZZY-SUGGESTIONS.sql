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

-- effective_surname(p_name):
--   The surname used for anchoring — the last whitespace token, skipping a
--   trailing generational suffix (Jr, Sr, II, III, IV, V, with or without a
--   period). Without this, "Alan Veeck Sr" anchors on "sr" and a search for
--   "Veeck" never finds it. Normalizes symmetrically (lowercase, strip periods,
--   collapse whitespace). IMMUTABLE: a pure function of its input.
--     "Alan Veeck Sr." -> "veeck"    "Veeck" -> "veeck"    "Emily Veeck" -> "veeck"
CREATE OR REPLACE FUNCTION public.effective_surname(p_name text)
RETURNS text
LANGUAGE sql IMMUTABLE
AS $$
  WITH t AS (
    SELECT string_to_array(
      regexp_replace(
        regexp_replace(lower(trim(p_name)), '[.]', '', 'g'),
        '\s+', ' ', 'g'
      ),
      ' '
    ) AS toks
  )
  SELECT CASE
    WHEN array_length(toks, 1) > 1
     AND toks[array_length(toks, 1)] IN ('jr', 'sr', 'ii', 'iii', 'iv', 'v')
    THEN toks[array_length(toks, 1) - 1]
    ELSE toks[array_length(toks, 1)]
  END
  FROM t;
$$;

REVOKE ALL    ON FUNCTION public.effective_surname(text) FROM public;
GRANT EXECUTE ON FUNCTION public.effective_surname(text) TO anon;
GRANT EXECUTE ON FUNCTION public.effective_surname(text) TO authenticated;

-- suggest_guests_by_name(p_name):
--   Returns up to 25 DISTINCT guest names whose SURNAME matches the input's
--   surname (via effective_surname, so Jr/Sr/II/III/IV/V suffixes are handled).
--   Listed ALPHABETICALLY so a large same-surname family reads as a scannable
--   roster — with only a bare surname typed, trigram rank is near-arbitrary, so
--   alphabetical is more findable than "top 5 by similarity". (sim is still
--   computed for the return column, just not used for ordering.) Exact full-name
--   matches are excluded (the strict matcher handles those). Names are
--   de-duplicated (GROUP BY full_name): two guests sharing the exact same name
--   would be indistinguishable chips, so the UI shows one and LIMIT counts
--   distinct names. The 25 cap comfortably covers a single family while bounding
--   the payload. Runs as caller (anon already has SELECT on guests); STABLE so
--   it can inline.
CREATE OR REPLACE FUNCTION public.suggest_guests_by_name(p_name text)
RETURNS TABLE (full_name text, sim real)
LANGUAGE sql STABLE
AS $$
  WITH qi AS (
    SELECT
      lower(regexp_replace(trim(p_name), '\s+', ' ', 'g')) AS norm
  ),
  matches AS (
    SELECT
      g.full_name,
      similarity(
        lower(regexp_replace(trim(g.full_name), '\s+', ' ', 'g')),
        qi.norm
      ) AS sim
    FROM public.guests g, qi
    WHERE
      -- surname anchor, suffix-aware (skips a trailing Jr/Sr/II/III/IV/V)
      public.effective_surname(g.full_name) = public.effective_surname(p_name)
      -- exclude exact matches (strict matcher already covers those)
      AND lower(regexp_replace(trim(g.full_name), '\s+', ' ', 'g')) <> qi.norm
  )
  -- collapse duplicate names to one row, keeping the best similarity score
  SELECT full_name, max(sim) AS sim
  FROM matches
  GROUP BY full_name
  ORDER BY full_name
  LIMIT 25;
$$;

REVOKE ALL    ON FUNCTION public.suggest_guests_by_name(text) FROM public;
GRANT EXECUTE ON FUNCTION public.suggest_guests_by_name(text) TO anon;
GRANT EXECUTE ON FUNCTION public.suggest_guests_by_name(text) TO authenticated;

-- =============================================================================
-- SMOKE SEED (Studio only — DO NOT COMMIT UNCOMMENTED, remove after testing)
-- =============================================================================
-- INSERT INTO public.guests (household_id, full_name) VALUES
--   ('44444444-4444-4444-4444-444444444444', 'Emily Veeck'),
--   ('44444444-4444-4444-4444-444444444444', 'Ella Veeck'),
--   ('44444444-4444-4444-4444-444444444444', 'Alan Veeck Sr'),
--   ('44444444-4444-4444-4444-444444444444', 'Alan Veeck Jr');
