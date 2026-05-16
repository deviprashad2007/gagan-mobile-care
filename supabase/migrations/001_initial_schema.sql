-- =============================================================================
-- Migration: 001_initial_schema
-- Project:   Gagan Mobile Care
-- Created:   2026-05-16
-- Applied via: supabase db push (remote only — do NOT run supabase db reset)
--
-- TABLE OF CONTENTS
--   1. Extensions
--   2. Tables (dependency order)
--        brands, issues, models, prices,
--        customers, bookings, repairs, messages, audit_log
--   3. Trigger function: set_updated_at
--   4. Triggers (brands → messages)
--   5. Function: generate_booking_ref
--   6. Function: generate_repair_ref
--   7. Row Level Security — enable + policies
--
-- DOWN (rollback)
--   See the -- DOWN section at the bottom of this file.
-- =============================================================================


-- =============================================================================
-- 1. EXTENSIONS
-- =============================================================================
-- gen_random_uuid() is built-in from Postgres 13+; no extension needed.
-- pgcrypto is used for gen_random_bytes() inside generate_booking_ref().
CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- =============================================================================
-- 2. TABLES
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 2.1  brands
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS brands (
    id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    slug        text        NOT NULL UNIQUE,
    name        text        NOT NULL,
    glyph       text        NOT NULL,
    tone        text        NOT NULL,
    sort_order  integer     NOT NULL DEFAULT 0,
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now(),
    deleted_at  timestamptz
);

COMMENT ON TABLE brands IS 'Phone manufacturers (Apple, Samsung, etc.)';

-- ---------------------------------------------------------------------------
-- 2.2  issues
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS issues (
    id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    slug         text        NOT NULL UNIQUE,
    name         text        NOT NULL,
    description  text,
    range_min    integer     NOT NULL,
    range_max    integer     NOT NULL,
    is_common    boolean     NOT NULL DEFAULT false,
    sort_order   integer     NOT NULL DEFAULT 0,
    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now(),
    deleted_at   timestamptz
);

COMMENT ON TABLE issues IS 'Repair problem types (screen crack, battery, charging port, etc.)';

-- ---------------------------------------------------------------------------
-- 2.3  models
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS models (
    id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id      uuid        NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
    slug          text        NOT NULL,
    name          text        NOT NULL,
    series        text,
    release_year  smallint,
    sort_order    integer     NOT NULL DEFAULT 0,
    created_at    timestamptz NOT NULL DEFAULT now(),
    updated_at    timestamptz NOT NULL DEFAULT now(),
    deleted_at    timestamptz,

    CONSTRAINT models_brand_slug_unique UNIQUE (brand_id, slug)
);

COMMENT ON TABLE models IS 'Individual phone models belonging to a brand';

-- Indexes for models
CREATE INDEX IF NOT EXISTS idx_models_brand_id
    ON models (brand_id);

-- The composite UNIQUE constraint already covers (brand_id, slug) lookups,
-- but we add a supporting index for brand_id-only filtering.
-- The UNIQUE constraint index is usable for prefix scans so a separate
-- (brand_id, slug) index would be redundant — the constraint handles it.

-- ---------------------------------------------------------------------------
-- 2.4  prices
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS prices (
    id        uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id  uuid        NOT NULL REFERENCES models(id) ON DELETE CASCADE,
    issue_id  uuid        NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    price     integer     NOT NULL,
    notes     text,
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now(),
    deleted_at  timestamptz
);

COMMENT ON TABLE prices IS 'Repair price for a specific (model, issue) pair; soft-delete compatible';

-- Partial unique index — enforces one active price per (model, issue) pair
-- while allowing multiple soft-deleted rows to coexist.
CREATE UNIQUE INDEX IF NOT EXISTS uidx_prices_model_issue_active
    ON prices (model_id, issue_id)
    WHERE deleted_at IS NULL;

-- Supporting indexes
CREATE INDEX IF NOT EXISTS idx_prices_model_id
    ON prices (model_id);

CREATE INDEX IF NOT EXISTS idx_prices_model_issue
    ON prices (model_id, issue_id);

-- ---------------------------------------------------------------------------
-- 2.5  customers
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS customers (
    id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    name          text        NOT NULL,
    phone         text        NOT NULL UNIQUE,
    total_visits  integer     NOT NULL DEFAULT 0,
    total_spend   integer     NOT NULL DEFAULT 0,
    last_visit_at timestamptz,
    notes         text,
    created_at    timestamptz NOT NULL DEFAULT now(),
    updated_at    timestamptz NOT NULL DEFAULT now(),
    deleted_at    timestamptz
);

COMMENT ON TABLE customers IS 'De-duplicated customer records keyed on phone number';

-- UNIQUE constraint on phone already creates an index; no extra index needed.

-- ---------------------------------------------------------------------------
-- 2.6  bookings
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bookings (
    id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_ref           text        NOT NULL UNIQUE,
    customer_id           uuid        REFERENCES customers(id) ON DELETE SET NULL,
    customer_name         text        NOT NULL,
    customer_phone        text        NOT NULL,
    model_id              uuid        REFERENCES models(id) ON DELETE SET NULL,
    model_text            text,
    issue_ids             uuid[]      NOT NULL,
    issue_text            text,
    service_type          text        NOT NULL
                              CHECK (service_type IN ('walkin', 'post')),
    estimated_price_min   integer,
    estimated_price_max   integer,
    confirmed_price       integer,
    status                text        NOT NULL DEFAULT 'new'
                              CHECK (status IN ('new', 'called', 'booked', 'lost')),
    source                text        NOT NULL DEFAULT 'web'
                              CHECK (source IN ('web', 'admin', 'walkin')),
    notes                 text,
    created_at            timestamptz NOT NULL DEFAULT now(),
    updated_at            timestamptz NOT NULL DEFAULT now(),
    deleted_at            timestamptz
);

COMMENT ON TABLE bookings IS 'Incoming repair enquiries submitted via web form or admin';

-- Partial index — active booking pipeline filter
CREATE INDEX IF NOT EXISTS idx_bookings_status_active
    ON bookings (status)
    WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_bookings_customer_phone
    ON bookings (customer_phone);

CREATE INDEX IF NOT EXISTS idx_bookings_created_at_desc
    ON bookings (created_at DESC);

-- UNIQUE constraint on booking_ref already creates an index.

-- ---------------------------------------------------------------------------
-- 2.7  repairs
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS repairs (
    id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    repair_ref      text        NOT NULL UNIQUE,
    booking_id      uuid        REFERENCES bookings(id) ON DELETE SET NULL,
    customer_id     uuid        REFERENCES customers(id) ON DELETE SET NULL,
    customer_name   text        NOT NULL,
    customer_phone  text        NOT NULL,
    model_id        uuid        REFERENCES models(id) ON DELETE SET NULL,
    model_text      text,
    issue_text      text        NOT NULL,
    status          text        NOT NULL DEFAULT 'received'
                        CHECK (status IN ('received', 'working', 'ready', 'picked')),
    amount          integer,
    intake_at       timestamptz NOT NULL DEFAULT now(),
    eta_at          timestamptz,
    completed_at    timestamptz,
    notes           text,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now(),
    deleted_at      timestamptz
);

COMMENT ON TABLE repairs IS 'Active repair jobs tracked on the workshop floor';

-- Partial index — active repair pipeline filter
CREATE INDEX IF NOT EXISTS idx_repairs_status_active
    ON repairs (status)
    WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_repairs_customer_phone
    ON repairs (customer_phone);

CREATE INDEX IF NOT EXISTS idx_repairs_intake_at_desc
    ON repairs (intake_at DESC);

-- ---------------------------------------------------------------------------
-- 2.8  messages
-- (v1: MSG91 not enabled. Table present for schema completeness.)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS messages (
    id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id        uuid        REFERENCES bookings(id) ON DELETE SET NULL,
    repair_id         uuid        REFERENCES repairs(id) ON DELETE SET NULL,
    recipient_phone   text        NOT NULL,
    channel           text        NOT NULL
                          CHECK (channel IN ('sms', 'whatsapp')),
    template_id       text,
    body_snapshot     text,
    status            text        NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending', 'sent', 'failed')),
    msg91_request_id  text,
    error             text,
    sent_at           timestamptz,
    created_at        timestamptz NOT NULL DEFAULT now(),
    updated_at        timestamptz NOT NULL DEFAULT now(),
    deleted_at        timestamptz
);

COMMENT ON TABLE messages IS 'Outbound SMS/WhatsApp log (MSG91). v1: schema only, not active.';

CREATE INDEX IF NOT EXISTS idx_messages_booking_id
    ON messages (booking_id);

CREATE INDEX IF NOT EXISTS idx_messages_status_created
    ON messages (status, created_at);

-- ---------------------------------------------------------------------------
-- 2.9  audit_log
-- NOTE: intentionally NO updated_at and NO deleted_at — append-only, immutable.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_log (
    id          uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id    uuid,                    -- soft reference to auth.users; no FK
    action      text    NOT NULL,
    table_name  text    NOT NULL,
    record_id   uuid,
    old_values  jsonb,
    new_values  jsonb,
    ip_address  inet,
    created_at  timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE audit_log IS 'Immutable append-only log of admin actions. No updates or deletes.';

CREATE INDEX IF NOT EXISTS idx_audit_log_record
    ON audit_log (record_id, table_name);


-- =============================================================================
-- 3. TRIGGER FUNCTION: set_updated_at
-- =============================================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION set_updated_at() IS
    'Generic trigger function: sets updated_at = now() on every UPDATE.';


-- =============================================================================
-- 4. TRIGGERS
-- =============================================================================

-- brands
CREATE OR REPLACE TRIGGER trg_brands_updated_at
    BEFORE UPDATE ON brands
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- issues
CREATE OR REPLACE TRIGGER trg_issues_updated_at
    BEFORE UPDATE ON issues
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- models
CREATE OR REPLACE TRIGGER trg_models_updated_at
    BEFORE UPDATE ON models
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- prices
CREATE OR REPLACE TRIGGER trg_prices_updated_at
    BEFORE UPDATE ON prices
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- customers
CREATE OR REPLACE TRIGGER trg_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- bookings
CREATE OR REPLACE TRIGGER trg_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- repairs
CREATE OR REPLACE TRIGGER trg_repairs_updated_at
    BEFORE UPDATE ON repairs
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- messages
CREATE OR REPLACE TRIGGER trg_messages_updated_at
    BEFORE UPDATE ON messages
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- =============================================================================
-- 5. FUNCTION: generate_booking_ref
-- Returns 'GMC-XXXXX' (5 uppercase alphanumeric chars).
-- Loops up to 10 times to guarantee uniqueness against bookings.booking_ref.
-- =============================================================================
CREATE OR REPLACE FUNCTION generate_booking_ref()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
    alphabet  text    := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    ref       text;
    attempts  integer := 0;
    taken     boolean;
BEGIN
    LOOP
        attempts := attempts + 1;

        -- Build 5-character random string from alphabet
        ref := 'GMC-' || (
            SELECT string_agg(
                substr(alphabet, (get_byte(gen_random_bytes(1)) % 36) + 1, 1),
                ''
            )
            FROM generate_series(1, 5)
        );

        -- Check uniqueness
        SELECT EXISTS (
            SELECT 1 FROM bookings WHERE booking_ref = ref
        ) INTO taken;

        EXIT WHEN NOT taken;

        IF attempts >= 10 THEN
            RAISE EXCEPTION
                'generate_booking_ref: could not generate a unique ref after % attempts', attempts;
        END IF;
    END LOOP;

    RETURN ref;
END;
$$;

COMMENT ON FUNCTION generate_booking_ref() IS
    'Returns a unique GMC-XXXXX booking reference. Retries up to 10 times.';


-- =============================================================================
-- 6. FUNCTION: generate_repair_ref
-- Returns 'R-NNNN' zero-padded sequential number based on total repairs count.
-- Simple sequential — not collision-safe at high concurrency (acceptable for
-- this shop's volume; internal reference only).
-- =============================================================================
CREATE OR REPLACE FUNCTION generate_repair_ref()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
    next_seq integer;
BEGIN
    SELECT COUNT(*) + 1
    INTO next_seq
    FROM repairs;

    RETURN 'R-' || lpad(next_seq::text, 4, '0');
END;
$$;

COMMENT ON FUNCTION generate_repair_ref() IS
    'Returns R-NNNN sequential repair reference. Internal use; not collision-safe under concurrency.';


-- =============================================================================
-- 7. ROW LEVEL SECURITY
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 7.1  Enable RLS on all tables
-- ---------------------------------------------------------------------------
ALTER TABLE brands     ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues     ENABLE ROW LEVEL SECURITY;
ALTER TABLE models     ENABLE ROW LEVEL SECURITY;
ALTER TABLE prices     ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers  ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings   ENABLE ROW LEVEL SECURITY;
ALTER TABLE repairs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages   ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log  ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- 7.2  CATALOG TABLES: brands, issues, models, prices
--      anon + authenticated: SELECT (active rows only)
--      authenticated: INSERT, UPDATE (soft-delete via UPDATE deleted_at)
--      No DELETE policy — hard deletes are never used
-- ---------------------------------------------------------------------------

-- brands
CREATE POLICY brands_select_public
    ON brands FOR SELECT
    TO anon, authenticated
    USING (deleted_at IS NULL);

CREATE POLICY brands_insert_admin
    ON brands FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY brands_update_admin
    ON brands FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- issues
CREATE POLICY issues_select_public
    ON issues FOR SELECT
    TO anon, authenticated
    USING (deleted_at IS NULL);

CREATE POLICY issues_insert_admin
    ON issues FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY issues_update_admin
    ON issues FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- models
CREATE POLICY models_select_public
    ON models FOR SELECT
    TO anon, authenticated
    USING (deleted_at IS NULL);

CREATE POLICY models_insert_admin
    ON models FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY models_update_admin
    ON models FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- prices
CREATE POLICY prices_select_public
    ON prices FOR SELECT
    TO anon, authenticated
    USING (deleted_at IS NULL);

CREATE POLICY prices_insert_admin
    ON prices FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY prices_update_admin
    ON prices FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- 7.3  BOOKINGS
--      anon: INSERT only (web enquiry form)
--      authenticated: SELECT + UPDATE (admin manages the pipeline)
--      No DELETE policy — soft delete via UPDATE deleted_at
-- ---------------------------------------------------------------------------
CREATE POLICY bookings_insert_anon
    ON bookings FOR INSERT
    TO anon
    WITH CHECK (
        length(trim(customer_name)) BETWEEN 2 AND 100
        AND customer_phone ~ '^\+?[0-9]{10,15}$'
        AND array_length(issue_ids, 1) BETWEEN 1 AND 10
        AND service_type IN ('walkin', 'post')
        AND source = 'web'
        AND status = 'new'
        AND deleted_at IS NULL
        AND booking_ref IS NOT NULL
    );

CREATE POLICY bookings_select_admin
    ON bookings FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY bookings_update_admin
    ON bookings FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- 7.4  REPAIRS + CUSTOMERS
--      authenticated only: SELECT, INSERT, UPDATE
--      No anon access. No DELETE policy.
-- ---------------------------------------------------------------------------

-- repairs
CREATE POLICY repairs_select_admin
    ON repairs FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY repairs_insert_admin
    ON repairs FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY repairs_update_admin
    ON repairs FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- customers
CREATE POLICY customers_select_admin
    ON customers FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY customers_insert_admin
    ON customers FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY customers_update_admin
    ON customers FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- 7.5  MESSAGES
--      authenticated: SELECT only (read audit trail in admin UI)
--      service_role bypasses RLS by default — INSERT handled server-side
--      No anon access.
-- ---------------------------------------------------------------------------
CREATE POLICY messages_select_admin
    ON messages FOR SELECT
    TO authenticated
    USING (true);

-- ---------------------------------------------------------------------------
-- 7.6  AUDIT_LOG
--      authenticated: SELECT + INSERT
--      service_role handles INSERT in practice (bypasses RLS)
--      NO UPDATE policy — row is immutable after creation
--      NO DELETE policy — record must never be erased
-- ---------------------------------------------------------------------------
CREATE POLICY audit_log_select_admin
    ON audit_log FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY audit_log_insert_admin
    ON audit_log FOR INSERT
    TO authenticated
    WITH CHECK (true);


-- =============================================================================
-- DOWN — Rollback script
-- Run these statements manually to undo this migration.
-- Execute in a single transaction: BEGIN; ... COMMIT;
-- =============================================================================
--
-- -- Drop triggers
-- DROP TRIGGER IF EXISTS trg_messages_updated_at  ON messages;
-- DROP TRIGGER IF EXISTS trg_repairs_updated_at   ON repairs;
-- DROP TRIGGER IF EXISTS trg_bookings_updated_at  ON bookings;
-- DROP TRIGGER IF EXISTS trg_customers_updated_at ON customers;
-- DROP TRIGGER IF EXISTS trg_prices_updated_at    ON prices;
-- DROP TRIGGER IF EXISTS trg_models_updated_at    ON models;
-- DROP TRIGGER IF EXISTS trg_issues_updated_at    ON issues;
-- DROP TRIGGER IF EXISTS trg_brands_updated_at    ON brands;
--
-- -- Drop functions
-- DROP FUNCTION IF EXISTS generate_repair_ref();
-- DROP FUNCTION IF EXISTS generate_booking_ref();
-- DROP FUNCTION IF EXISTS set_updated_at();
--
-- -- Drop tables (reverse FK dependency order)
-- DROP TABLE IF EXISTS audit_log  CASCADE;
-- DROP TABLE IF EXISTS messages   CASCADE;
-- DROP TABLE IF EXISTS repairs    CASCADE;
-- DROP TABLE IF EXISTS bookings   CASCADE;
-- DROP TABLE IF EXISTS customers  CASCADE;
-- DROP TABLE IF EXISTS prices     CASCADE;
-- DROP TABLE IF EXISTS models     CASCADE;
-- DROP TABLE IF EXISTS issues     CASCADE;
-- DROP TABLE IF EXISTS brands     CASCADE;
--
-- DROP EXTENSION IF EXISTS pgcrypto;
--
-- =============================================================================
