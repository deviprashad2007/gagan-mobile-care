# Data Model — Gagan Mobile Care

> All tables follow CLAUDE.md rules:
> - `id uuid PRIMARY KEY DEFAULT gen_random_uuid()`
> - `created_at`, `updated_at`, `deleted_at` on every table
> - snake_case, plural names
> - Soft delete only — never `DELETE FROM`
> - RLS enabled on every table

---

## Tables

---

### `brands`

The 15 phone brands (Apple, Samsung, OnePlus, etc.). Seeded from `data.js`. Gagan can add new brands via admin.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `slug` | `text` | NOT NULL, UNIQUE | URL-safe identifier — e.g. `apple`, `samsung` |
| `name` | `text` | NOT NULL | Display name — e.g. `Apple`, `Google Pixel` |
| `glyph` | `text` | NOT NULL | 1–2 char abbreviation for brand tile — e.g. `A`, `1+` |
| `tone` | `text` | NOT NULL | Brand hex color for glyph text — e.g. `#0E0E10` |
| `sort_order` | `integer` | NOT NULL, default `0` | Controls display order on homepage brand picker |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | |
| `deleted_at` | `timestamptz` | | Soft delete |

**Indexes:** `brands(slug)` (unique, used in URL routing)

**RLS:** Public read (anon SELECT all where `deleted_at IS NULL`); admin write only.

---

### `models`

Individual phone models (iPhone 15 Pro Max, Galaxy S24, etc.). Each belongs to a brand. Has a `series` label for grouping in the UI.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `brand_id` | `uuid` | NOT NULL, FK → `brands(id)` ON DELETE RESTRICT | |
| `slug` | `text` | NOT NULL | URL-safe — e.g. `iphone-15-pro-max` |
| `name` | `text` | NOT NULL | Display name — e.g. `iPhone 15 Pro Max` |
| `series` | `text` | | Grouping label — e.g. `iPhone 15 Series`. NULL = ungrouped |
| `release_year` | `smallint` | | Used to show year in booking UI |
| `sort_order` | `integer` | NOT NULL, default `0` | Display order within brand |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | |
| `deleted_at` | `timestamptz` | | Soft delete |

**Unique constraint:** `(brand_id, slug)` — slug is unique per brand, not globally.

**Indexes:**
- `models(brand_id)` — fetch all models for a brand
- `models(brand_id, slug)` — URL routing: `/repairs/[brand]/[model]`

**RLS:** Public read (anon SELECT where `deleted_at IS NULL`); admin write only.

---

### `issues`

The 13 repair issue types (Screen, Battery, Charging Port, etc.). Seeded from `data.js`. Range columns are the fallback pricing used when no row exists in `prices`.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `slug` | `text` | NOT NULL, UNIQUE | e.g. `screen`, `battery`, `water` |
| `name` | `text` | NOT NULL | Display name — e.g. `Screen / Display` |
| `description` | `text` | | Short description shown on issue cards — e.g. `Cracked, black, lines, touch issues` |
| `range_min` | `integer` | NOT NULL | Fallback price floor in INR — used when no `prices` row exists |
| `range_max` | `integer` | NOT NULL | Fallback price ceiling in INR |
| `is_common` | `boolean` | NOT NULL, default `false` | Shows "Common" badge in booking UI |
| `sort_order` | `integer` | NOT NULL, default `0` | Display order on issue selection step |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | |
| `deleted_at` | `timestamptz` | | Soft delete |

**Indexes:** `issues(slug)` (unique)

**RLS:** Public read; admin write only.

---

### `prices`

**The hybrid pricing table.** A row here means Gagan has provided a real price for that exact model×issue combination. No row means the app falls back to `issues.range_min`/`range_max` and shows "Starting from ₹X."

Seeded initially with ~150 rows from Gagan's Google Sheet (top 30 phones × top 5 issues). Gagan extends it via the admin catalog editor over time.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `model_id` | `uuid` | NOT NULL, FK → `models(id)` ON DELETE CASCADE | |
| `issue_id` | `uuid` | NOT NULL, FK → `issues(id)` ON DELETE CASCADE | |
| `price` | `integer` | NOT NULL | Real price in INR — e.g. `8499` |
| `notes` | `text` | | Optional internal note — e.g. `OEM grade only`, `parts on order` |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | |
| `deleted_at` | `timestamptz` | | Soft delete — soft-deleted row is treated as no row (fallback to range) |

**Unique constraint:** `(model_id, issue_id)` where `deleted_at IS NULL` — one live price per model×issue combo.

**Indexes:**
- `prices(model_id)` — fetch all prices for a model (admin catalog page)
- `prices(model_id, issue_id)` — single lookup during booking flow and repair page render

**RLS:** Public read (anon SELECT where `deleted_at IS NULL`); admin write only.

**Application logic for hybrid pricing:**
```sql
-- In server action / page data fetch:
SELECT p.price, i.range_min, i.range_max
FROM issues i
LEFT JOIN prices p
  ON p.model_id = $model_id
  AND p.issue_id = i.id
  AND p.deleted_at IS NULL
WHERE i.id = $issue_id
```
```ts
// Application layer:
if (price !== null) {
  display(`₹${price}`)
} else {
  display(`Starting from ₹${range_min}`) + price-on-call CTA
}
```

---

### `bookings`

Every repair booking submitted via the public booking form or manually entered by Gagan via the admin modal. This is the primary operational table.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `booking_ref` | `text` | NOT NULL, UNIQUE | Human-readable ID — e.g. `GMC-A3F7K`. Generated server-side, not client-side. |
| `customer_id` | `uuid` | FK → `customers(id)` ON DELETE SET NULL | NULL until customer record is created or matched |
| `customer_name` | `text` | NOT NULL | Captured at booking time; denormalised so admin display survives customer record changes |
| `customer_phone` | `text` | NOT NULL | 10-digit Indian mobile, stored without country code |
| `model_id` | `uuid` | FK → `models(id)` ON DELETE SET NULL | NULL if model was free-typed (walk-in manual entry) |
| `model_text` | `text` | | Raw model text — populated if `model_id` is NULL, or as display cache |
| `issue_ids` | `uuid[]` | NOT NULL | Array of issue IDs — booking can have multiple issues |
| `issue_text` | `text` | | Free-text issue description — used when `issue_ids` is empty or supplementary |
| `service_type` | `text` | NOT NULL, CHECK IN ('walkin','post') | Walk-in or send by post |
| `estimated_price_min` | `integer` | | Calculated from issues at time of booking — snapshot, not recalculated live |
| `estimated_price_max` | `integer` | | Upper bound of estimate snapshot |
| `confirmed_price` | `integer` | | Locked price agreed on callback — NULL until Gagan calls |
| `status` | `text` | NOT NULL, default `'new'`, CHECK IN ('new','called','booked','lost') | Booking pipeline stage |
| `source` | `text` | NOT NULL, default `'web'`, CHECK IN ('web','admin','walkin') | How this booking was created |
| `notes` | `text` | | Internal notes by Gagan |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | |
| `deleted_at` | `timestamptz` | | Soft delete |

**Indexes:**
- `bookings(status)` — admin Today / Bookings page filters by status
- `bookings(customer_phone)` — quick lookup by phone number
- `bookings(created_at DESC)` — default sort for admin table
- `bookings(booking_ref)` (unique) — lookup by reference

**RLS:** Anon INSERT only (booking form); admin SELECT/UPDATE (soft delete only). No anon SELECT — customers cannot read their own bookings in v1.

**Rate limiting:** Applied at the server action layer — limit to 3 bookings per phone number per 24 hours. Not in RLS.

---

### `repairs`

Phones physically in the shop being worked on. Created by Gagan from a booking or entered manually. Separate status lifecycle from bookings.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `repair_ref` | `text` | NOT NULL, UNIQUE | Human-readable — e.g. `R-2041`. Generated server-side. |
| `booking_id` | `uuid` | FK → `bookings(id)` ON DELETE SET NULL | NULL for repairs entered without a prior booking |
| `customer_id` | `uuid` | FK → `customers(id)` ON DELETE SET NULL | |
| `customer_name` | `text` | NOT NULL | Denormalised for admin display |
| `customer_phone` | `text` | NOT NULL | |
| `model_id` | `uuid` | FK → `models(id)` ON DELETE SET NULL | |
| `model_text` | `text` | | Cache / fallback for display |
| `issue_text` | `text` | NOT NULL | Human-readable issue — e.g. `Screen + back glass` |
| `status` | `text` | NOT NULL, default `'received'`, CHECK IN ('received','working','ready','picked') | Repair pipeline stage |
| `amount` | `integer` | | Agreed repair price in INR — NULL until confirmed |
| `intake_at` | `timestamptz` | NOT NULL, default `now()` | When the phone was physically received |
| `eta_at` | `timestamptz` | | Estimated completion — NULL until Gagan sets it |
| `completed_at` | `timestamptz` | | Timestamp when status moved to `picked` |
| `notes` | `text` | | Internal technician notes |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | |
| `deleted_at` | `timestamptz` | | Soft delete |

**Indexes:**
- `repairs(status)` — admin board / Today page group-by
- `repairs(customer_phone)` — quick lookup
- `repairs(intake_at DESC)` — default sort

**RLS:** Admin only — no public access.

---

### `customers`

Created or matched when a booking is confirmed. Identified by phone number — no login, no email required.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `name` | `text` | NOT NULL | |
| `phone` | `text` | NOT NULL, UNIQUE | 10-digit, no country code |
| `total_visits` | `integer` | NOT NULL, default `0` | Incremented when a repair reaches `picked` |
| `total_spend` | `integer` | NOT NULL, default `0` | Running lifetime spend in INR |
| `last_visit_at` | `timestamptz` | | Timestamp of most recent picked-up repair |
| `notes` | `text` | | Internal notes by Gagan |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | |
| `deleted_at` | `timestamptz` | | Soft delete |

**Indexes:** `customers(phone)` (unique) — primary lookup key

**RLS:** Admin only — phone numbers are PII, never exposed publicly.

---

### `messages`

Log of every outbound SMS or WhatsApp message sent via MSG91. Used for debugging, audit, and preventing duplicate sends.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `booking_id` | `uuid` | FK → `bookings(id)` ON DELETE SET NULL | NULL for non-booking messages |
| `repair_id` | `uuid` | FK → `repairs(id)` ON DELETE SET NULL | |
| `recipient_phone` | `text` | NOT NULL | |
| `channel` | `text` | NOT NULL, CHECK IN ('sms','whatsapp') | |
| `template_id` | `text` | | MSG91 template ID used |
| `body_snapshot` | `text` | | Rendered message text at send time — for audit |
| `status` | `text` | NOT NULL, default `'pending'`, CHECK IN ('pending','sent','failed') | |
| `msg91_request_id` | `text` | | MSG91 response ID for delivery tracking |
| `error` | `text` | | Error detail if status = `failed` |
| `sent_at` | `timestamptz` | | When MSG91 confirmed delivery |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | |
| `deleted_at` | `timestamptz` | | Soft delete |

**Indexes:**
- `messages(booking_id)` — check if confirmation already sent before re-sending
- `messages(status, created_at)` — retry queue for failed sends

**RLS:** Admin read only; service_role INSERT only. Messages are sent server-side.

---

### `audit_log`

Append-only log of all admin mutations. Rows are permanent — no soft delete, no updates.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `actor_id` | `uuid` | | Supabase auth user ID — NULL for system actions |
| `action` | `text` | NOT NULL | e.g. `booking.status_changed`, `repair.created`, `price.updated` |
| `table_name` | `text` | NOT NULL | Target table |
| `record_id` | `uuid` | | Target row ID |
| `old_values` | `jsonb` | | Previous state snapshot |
| `new_values` | `jsonb` | | New state snapshot |
| `ip_address` | `inet` | | Request IP where available |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | |

**Note:** No `updated_at`, no `deleted_at` — this table is immutable.

**Indexes:** `audit_log(record_id, table_name)` — look up full history for any row

**RLS:** Admin read; service_role INSERT only. No UPDATE or DELETE ever.

---

## Relationships

```
brands
  └── models          (brand_id  → brands.id,   ON DELETE RESTRICT)
        └── prices    (model_id  → models.id,   ON DELETE CASCADE)
        |     └── issues (issue_id → issues.id, ON DELETE CASCADE)
        └── bookings  (model_id  → models.id,   ON DELETE SET NULL)
        └── repairs   (model_id  → models.id,   ON DELETE SET NULL)

customers
  ├── bookings        (customer_id → customers.id, ON DELETE SET NULL)
  └── repairs         (customer_id → customers.id, ON DELETE SET NULL)

bookings
  └── repairs         (booking_id  → bookings.id,  ON DELETE SET NULL)

messages
  ├── bookings        (booking_id  → bookings.id,  ON DELETE SET NULL)
  └── repairs         (repair_id   → repairs.id,   ON DELETE SET NULL)

audit_log
  (soft references only — no FK constraints)
```

---

## Migration sequence

Files to create in `/db/migrations/`, run in order:

| File | Contents |
|---|---|
| `001_brands.sql` | Create `brands` table, indexes, RLS policies |
| `002_models.sql` | Create `models` table, indexes, RLS policies |
| `003_issues.sql` | Create `issues` table, indexes, RLS policies |
| `004_prices.sql` | Create `prices` table, unique constraint, indexes, RLS policies |
| `005_customers.sql` | Create `customers` table, indexes, RLS policies |
| `006_bookings.sql` | Create `bookings` table, indexes, RLS policies |
| `007_repairs.sql` | Create `repairs` table, indexes, RLS policies |
| `008_messages.sql` | Create `messages` table, indexes, RLS policies |
| `009_audit_log.sql` | Create `audit_log` table, indexes, RLS policies |
| `010_updated_at_trigger.sql` | Shared trigger function to auto-set `updated_at` on all tables |
| `011_booking_ref_function.sql` | `generate_booking_ref()` function for human-readable IDs |
| `012_seed_brands.sql` | INSERT 15 brands from `data.js` |
| `013_seed_issues.sql` | INSERT 13 issues from `data.js` with `range_min`/`range_max` |
| `014_seed_models.sql` | INSERT all models from `data.js`, updated to include iPhone 16, Galaxy S25, OnePlus 13 etc. |
| `015_seed_prices.sql` | INSERT ~150 real prices from Gagan's Google Sheet — run after sheet is complete |

> Migrations 012–015 are seed data. Run on local dev and staging freely. Run `015_seed_prices.sql` in production only after Gagan's Google Sheet is verified complete.
