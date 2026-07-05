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

-- suggest_guests_by_name(p_name):
--   Returns up to 5 guests whose LAST name exactly matches the input's last
--   name, ranked by full-name trigram similarity to the input. Exact full-name
--   matches are excluded (the strict matcher handles those). Runs as caller
--   (anon already has SELECT on guests); STABLE so it can inline.
CREATE OR REPLACE FUNCTION public.suggest_guests_by_name(p_name text)
RETURNS TABLE (full_name text, sim real)
LANGUAGE sql STABLE
AS $$
  WITH qi AS (
    SELECT
      lower(regexp_replace(trim(p_name), '\s+', ' ', 'g')) AS norm
  ),
  q AS (
    SELECT
      norm,
      split_part(norm, ' ', array_length(string_to_array(norm, ' '), 1)) AS last_tok
    FROM qi
  )
  SELECT
    g.full_name,
    similarity(
      lower(regexp_replace(trim(g.full_name), '\s+', ' ', 'g')),
      q.norm
    ) AS sim
  FROM public.guests g, q
  WHERE
    -- last-name anchor: stored last token == input last token
    split_part(
      lower(regexp_replace(trim(g.full_name), '\s+', ' ', 'g')),
      ' ',
      array_length(
        string_to_array(lower(regexp_replace(trim(g.full_name), '\s+', ' ', 'g')), ' '),
        1
      )
    ) = q.last_tok
    -- exclude exact matches (strict matcher already covers those)
    AND lower(regexp_replace(trim(g.full_name), '\s+', ' ', 'g')) <> q.norm
  ORDER BY sim DESC, g.full_name
  LIMIT 5;
$$;

REVOKE ALL    ON FUNCTION public.suggest_guests_by_name(text) FROM public;
GRANT EXECUTE ON FUNCTION public.suggest_guests_by_name(text) TO anon;
GRANT EXECUTE ON FUNCTION public.suggest_guests_by_name(text) TO authenticated;

-- =============================================================================
-- SMOKE SEED (Studio only — DO NOT COMMIT UNCOMMENTED, remove after testing)
-- =============================================================================
-- INSERT INTO public.guests (household_id, full_name) VALUES
--   ('44444444-4444-4444-4444-444444444444', 'Emily Veeck'),
--   ('44444444-4444-4444-4444-444444444444', 'Ella Veeck');
