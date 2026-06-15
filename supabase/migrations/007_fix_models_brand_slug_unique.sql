-- ---------------------------------------------------------------------------
-- 007_fix_models_brand_slug_unique.sql
--
-- models_brand_slug_unique was a plain UNIQUE(brand_id, slug) constraint, so
-- a soft-deleted model (deleted_at set) still occupies its slug forever —
-- recreating a model with the same name after removing it fails with a
-- duplicate-key error ("A model with this name already exists for this
-- brand.") even though it no longer shows up anywhere. Replace it with a
-- partial unique index that only applies to active (non-deleted) rows,
-- matching the pattern already used by prices.uidx_prices_model_issue_active.
-- ---------------------------------------------------------------------------

ALTER TABLE models DROP CONSTRAINT IF EXISTS models_brand_slug_unique;

CREATE UNIQUE INDEX IF NOT EXISTS uidx_models_brand_slug_active
    ON models (brand_id, slug)
    WHERE deleted_at IS NULL;
