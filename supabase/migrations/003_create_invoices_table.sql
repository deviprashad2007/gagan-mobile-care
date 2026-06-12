-- =============================================================================
-- Migration: 003_create_invoices_table
-- Project:   Gagan Mobile Care
--
-- Adds the invoices table for the admin billing feature. Invoices are
-- created from a repair record (repair_id optional, SET NULL on delete)
-- and store a snapshot of customer/model details + line items so the
-- printed bill remains stable even if the repair record changes later.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS invoices (
    id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number  text        NOT NULL UNIQUE,
    repair_id       uuid        REFERENCES repairs(id) ON DELETE SET NULL,
    customer_name   text        NOT NULL,
    customer_phone  text        NOT NULL,
    model_text      text,
    items           jsonb       NOT NULL,
    subtotal        integer     NOT NULL,
    discount        integer     NOT NULL DEFAULT 0,
    total           integer     NOT NULL,
    payment_method  text        NOT NULL DEFAULT 'cash'
                        CHECK (payment_method IN ('cash', 'upi', 'card', 'other')),
    notes           text,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now(),
    deleted_at      timestamptz
);

COMMENT ON TABLE invoices IS 'Printable bills generated for customers, optionally linked to a repair';

CREATE INDEX IF NOT EXISTS idx_invoices_repair_id
    ON invoices (repair_id);

CREATE INDEX IF NOT EXISTS idx_invoices_created_at_desc
    ON invoices (created_at DESC);

-- ---------------------------------------------------------------------------
-- Trigger: keep updated_at fresh (reuses set_updated_at from 001)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE TRIGGER trg_invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- Function: generate_invoice_ref
-- Returns 'INV-NNNN' zero-padded sequential number based on total invoices
-- count. Simple sequential — not collision-safe at high concurrency
-- (acceptable for this shop's volume; internal reference only).
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION generate_invoice_ref()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
    next_seq integer;
BEGIN
    SELECT COUNT(*) + 1
    INTO next_seq
    FROM invoices;

    RETURN 'INV-' || lpad(next_seq::text, 4, '0');
END;
$$;

COMMENT ON FUNCTION generate_invoice_ref() IS
    'Returns INV-NNNN sequential invoice reference. Internal use; not collision-safe under concurrency.';

-- ---------------------------------------------------------------------------
-- Row Level Security — authenticated only, no anon access, no DELETE policy
-- ---------------------------------------------------------------------------
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY invoices_select_admin
    ON invoices FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY invoices_insert_admin
    ON invoices FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY invoices_update_admin
    ON invoices FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);
