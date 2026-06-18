-- =============================================================================
-- Migration: 008_fix_invoice_number_sequence
-- Project:   Gagan Mobile Care
--
-- Replaces generate_invoice_ref() which used COUNT(*)+1 (breaks when any
-- invoice is soft-deleted — the count drops and the next bill reuses a
-- number that already existed). Uses a Postgres SEQUENCE instead so
-- invoice numbers are always unique, always incrementing, never gap-prone
-- due to deletes.
--
-- Sequence starts after the current highest invoice number so existing
-- bills are not affected.
-- =============================================================================

-- Create sequence starting at 1 (will be set to correct value below)
CREATE SEQUENCE IF NOT EXISTS invoice_number_seq START 1;

-- Advance the sequence past the current highest invoice number
DO $$
DECLARE
    max_num integer;
BEGIN
    SELECT COALESCE(
        MAX(
            CASE
                WHEN invoice_number ~ '^INV-[0-9]+$'
                THEN CAST(substring(invoice_number FROM 5) AS integer)
                ELSE 0
            END
        ), 0
    )
    INTO max_num
    FROM invoices;

    IF max_num > 0 THEN
        PERFORM setval('invoice_number_seq', max_num);
    END IF;
END
$$;

-- Replace the function to use the sequence
CREATE OR REPLACE FUNCTION generate_invoice_ref()
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN 'INV-' || lpad(nextval('invoice_number_seq')::text, 4, '0');
END;
$$;

COMMENT ON FUNCTION generate_invoice_ref() IS
    'Returns INV-NNNN from a dedicated sequence — guaranteed unique even after soft-deletes.';
