-- Track whether a repair came in as a walk-in or a postal send-in,
-- so invoices know whether a return-postage line applies.
ALTER TABLE repairs
  ADD COLUMN service_type text NOT NULL DEFAULT 'walkin'
    CHECK (service_type IN ('walkin', 'post'));
