-- Allow phone-less invoices for misc/other income entries
-- (e.g. accessory sales) that aren't tied to a customer record.
ALTER TABLE invoices ALTER COLUMN customer_phone DROP NOT NULL;
