# Build Roadmap — Gagan Mobile Care

> Sequence of work from project init to production launch.
> Each phase is a shippable checkpoint — nothing moves forward until the phase gate passes.

---

## Phase 0 — Project Init (Day 1–2)

**Goal:** Runnable Next.js app connected to local Supabase. Zero features, zero bugs.

- [ ] `pnpm create next-app` with TypeScript strict, App Router, Tailwind
- [ ] Install shadcn/ui, React Hook Form, Zod, Sentry, Plausible
- [ ] Port design tokens from `docs/design-tokens.md` into `tailwind.config.ts`
- [ ] Set up `next/font/google` with Inter + Instrument Serif + JetBrains Mono in `app/layout.tsx`
- [ ] Create `globals.css` with `map-bg` class and `font-feature-settings`
- [ ] `supabase init` + `supabase start` — confirm Studio at localhost:54323
- [ ] Run all 15 migrations from `db/migrations/` — confirm all tables exist in Studio
- [ ] `.env.local` with local Supabase keys — confirm app boots without errors
- [ ] Sentry SDK wired up — trigger a test error, confirm it appears in dashboard
- [ ] `pnpm build` passes clean — no type errors, no missing modules

**Gate:** `pnpm dev` runs, `supabase start` runs, all 15 tables exist, build passes.

---

## Phase 1 — Marketing Site Shell (Day 3–5)

**Goal:** Public pages render server-side with correct metadata. No booking logic yet.

- [ ] `app/layout.tsx` — global shell, nav, footer
- [ ] `app/page.tsx` — homepage with `generateMetadata()` and LocalBusiness JSON-LD
- [ ] Hero section (static copy, no form yet)
- [ ] TrustBar section
- [ ] Services grid (static, links to repair pages)
- [ ] Testimonials section (hardcoded in v1 — no DB reads)
- [ ] PostFlow section (5-step post-repair explainer)
- [ ] FAQ section with FAQPage JSON-LD
- [ ] Map / address section
- [ ] Footer with WhatsApp button, phone link, Privacy Policy link
- [ ] `app/privacy/page.tsx` — Privacy Policy (DPDP Act 2023 compliant)
- [ ] `app/not-found.tsx` — styled 404 page
- [ ] `public/robots.txt` — allows public, blocks `/admin`
- [ ] `app/sitemap.ts` — generates sitemap with all static pages

**Gate:** `view-source` on homepage shows full content. `robots.txt` and `/sitemap.xml` return correct output. Lighthouse SEO 95+ on homepage.

---

## Phase 2 — Repair Pages (Day 6–7)

**Goal:** All 195 dynamic repair pages render server-side with real prices from DB.

- [ ] Seed `brands` table (15 brands) and `issues` table (13 issues) via migration
- [ ] `app/repairs/[brand]/[issue]/page.tsx` — dynamic route with `generateMetadata()` and BreadcrumbList JSON-LD
- [ ] Pricing query: `LEFT JOIN prices` — show real price or "Starting from ₹{range_min}" fallback
- [ ] `generateStaticParams()` for all 195 brand/issue combinations
- [ ] Repair page layout: price, description, booking CTA, breadcrumb
- [ ] `app/repairs/page.tsx` — brand index page
- [ ] `app/repairs/[brand]/page.tsx` — brand detail page listing all issues
- [ ] Sitemap updated to include all 195 repair URLs

**Gate:** `view-source` on `/repairs/samsung/screen-replacement` shows price and content. All 195 URLs return 200. Sitemap lists all repair pages.

---

## Phase 3 — Booking Flow (Day 8–10)

**Goal:** Customer can submit a booking. Record writes to Supabase. Confirmation screen shows booking ID.

- [ ] `BookingForm` component — 4-step flow (brand → issue → details → confirm)
- [ ] Zod schema in `lib/validations/booking.ts` — shared client + server
- [ ] `createBooking` server action — auth check (anon allowed), Zod validation, insert to `bookings` table
- [ ] `generate_booking_ref()` Postgres function (migration 015) called server-side
- [ ] Rate limiting: max 3 submissions per phone per 24 hours
- [ ] Confirmation screen: shows `booking_ref`, issue, price estimate, "Gagan will call you back" message
- [ ] "Send by post" option available at Step 4 (`service_type = 'post'`)
- [ ] Booking form wired into homepage Hero CTA and repair pages

**Gate:** Submit a test booking → record appears in Supabase → confirmation screen shows correct `booking_ref` and estimate. Rate limit rejects 4th submission from same phone.

---

## Phase 4 — Admin Auth (Day 11)

**Goal:** All `/admin` routes are protected. Gagan logs in via magic link.

- [ ] Next.js middleware at `middleware.ts` — redirect unauthenticated requests from `/admin` to `/admin/login`
- [ ] `app/admin/login/page.tsx` — magic link request form
- [ ] Supabase Auth magic link flow — send to Gagan's email, confirm Inbucket catches it locally
- [ ] Session persists for 7 days (Supabase JWT expiry config)
- [ ] Confirm: incognito browser hitting `/admin` redirects to login

**Gate:** Direct URL to `/admin` in incognito returns redirect to login. Magic link email arrives in Inbucket. Session persists after page reload.

---

## Phase 5 — Admin Dashboard (Day 12–15)

**Goal:** Gagan can see today's work and update repair statuses from his phone.

- [ ] `app/admin/page.tsx` — Today page: new bookings, phones on bench, ready for pickup, earnings
- [ ] `app/admin/bookings/page.tsx` — bookings list with filters (status, date)
- [ ] `app/admin/bookings/[id]/page.tsx` — booking detail, status update, notes
- [ ] `app/admin/repairs/page.tsx` — repairs list (kanban-style or table)
- [ ] `updateRepairStatus` server action — auth check, Zod validation, update `repairs` table
- [ ] `createBooking` admin variant — "New booking" modal for walk-ins (source = 'admin')
- [ ] `app/admin/catalog/page.tsx` — view brands, issues, prices; edit price for a model
- [ ] `updatePrice` server action — upsert to `prices` table
- [ ] All admin pages optimised for mobile (large tap targets, no horizontal scroll)

**Gate:** Gagan can log in, see new bookings, change a repair status (persists on reload), and add a manual booking — all from a mobile browser in under 3 taps per action.

---

## Phase 6 — SEO & Schema Audit (Day 16)

**Goal:** All schema validates. Sitemap complete. No SEO regressions.

- [ ] LocalBusiness JSON-LD on homepage — validate in Google Rich Results Test
- [ ] FAQPage JSON-LD on FAQ section — validate
- [ ] BreadcrumbList JSON-LD on all repair pages — validate
- [ ] All 195 repair pages have unique `<title>` and `<meta name="description">`
- [ ] No `noindex` tags on any public page
- [ ] Final sitemap submitted to Google Search Console

**Gate:** All three JSON-LD types validate. Lighthouse SEO 95+ on homepage and one sample repair page.

---

## Phase 7 — Pre-Launch (Day 17–18)

**Goal:** Every pre-launch blocker from `docs/requirements.md` is cleared.

- [ ] All 5 trust claims verified with Gagan and updated in codebase
- [ ] Real GST number added to footer (or placeholder removed)
- [ ] Privacy Policy live at `/privacy`, linked from footer
- [ ] All WhatsApp buttons and phone links tested on a real Android device
- [ ] All test data removed from Supabase
- [ ] Production environment variables set in Vercel
- [ ] Custom domain connected, SSL active
- [ ] Sentry receiving production events
- [ ] Plausible receiving pageviews
- [ ] Run `deploy-checker` agent — all items PASS
- [ ] Gagan completes magic link login on his own phone

**Gate:** Every checkbox in `docs/launch-checklist.md` is checked. Deploy-checker reports no failures.

---

## Phase 8 — Launch (Day 19)

- [ ] Promote to production in Vercel
- [ ] Submit sitemap in Google Search Console
- [ ] Update Google Business Profile website field
- [ ] Monitor Sentry for first-hour errors
- [ ] Confirm one real booking submits end-to-end on production

---

## v2 Candidates (post-launch)

Not forgotten — deliberately deferred. See `docs/requirements.md` for full list.

- Customer-facing repair status lookup
- Online payment via Razorpay
- Automated WhatsApp/SMS confirmation on booking
- Hindi language version
- Customer accounts with repair history
