-- ---------------------------------------------------------------------------
-- Fix categories RLS: "admins_manage_categories" is an ALL/public policy with
-- qual is_admin(). Postgres must evaluate that qual for every SELECT
-- (including anon), but anon never had EXECUTE on is_admin(), so every
-- anon SELECT on categories (homepage, /repairs pages, build-time
-- prerendering) failed with:
--   "permission denied for function is_admin"
--
-- Fix: grant anon EXECUTE on is_admin(). The function only returns a
-- boolean (true/false based on the caller's JWT email) and exposes no data,
-- so this is safe.
-- ---------------------------------------------------------------------------

GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;
