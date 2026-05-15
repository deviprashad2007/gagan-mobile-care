# Tech Plan — Gagan Mobile Care

---

## Stack

| Layer | Choice | Why |
|---|---|---|
| **Framework** | Next.js 15 (App Router, TypeScript strict) | SSR for all repair pages — critical for SEO. App Router enables server actions for form submissions without API routes. |
| **Language** | TypeScript strict mode | No `any`. Catches data shape mismatches between DB and UI at compile time, not at 2am. |
| **Database** | Supabase (Postgres) | Managed Postgres with built-in RLS, real-time, and auth. Free tier covers launch. |
| **Auth** | Supabase Auth (magic link) | Gagan logs in via email link — no password to forget or leak. Single user, no role complexity needed in v1. |
| **File storage** | Supabase Storage | Shop photos and any uploaded assets. Consistent with the DB provider — one less service. |
| **Styling** | Tailwind CSS + shadcn/ui | Tailwind for utility classes (tokens map directly from design-tokens.md). shadcn/ui for admin form components — accessible, unstyled primitives we own in the codebase. |
| **Forms** | React Hook Form + Zod | Hook Form for client-side UX (controlled inputs, error states). Zod schema validates the same shape server-side inside the server action. One schema, two validation points. |
| **SMS / WhatsApp** | None in v1 | No automated messaging. Customer sees a confirmation screen with booking ID after submitting. Gagan calls them back manually from the admin dashboard. (v2 candidate.) |
| **Hosting** | Vercel | Zero-config Next.js deploys. Preview URLs on every push. Edge network with Indian PoPs. |
| **Error tracking** | Sentry | Free under 5K errors/month. Catches server action failures and client errors with stack traces. |
| **Analytics** | Plausible | Privacy-first, GDPR/DPDP-compliant. No cookie banner required. Simple dashboard Gagan can read without training. |
| **SEO / Schema** | Built-in via `generateMetadata()` + JSON-LD | Every page exports metadata. JSON-LD schema (LocalBusiness, BreadcrumbList, FAQPage, Product) injected server-side — not client-rendered, so Google sees it on first crawl. |
| **Images** | `next/image` | Automatic WebP conversion, lazy loading, correct `width`/`height` attributes. Required for Lighthouse scores. |
| **DNS / CDN** | Cloudflare (free) | Free DNS, DDoS protection, and caching layer in front of Vercel. |
| **Domain** | Custom domain (to confirm with Gagan) | Connected via Cloudflare → Vercel. SSL automatic. |

---

## Rejected alternatives

- **WordPress** — Plugin sprawl, security surface area, no type safety, slow SSR for dynamic pricing pages. Gagan would need a developer for every change.
- **Webflow / Framer** — No server actions, no real database, can't do the admin dashboard or booking logic without heavy external integrations. Pricing pages would be static.
- **Plain Astro** — Great for static sites, wrong for this. The admin dashboard requires React interactivity. The booking form requires server-side mutation with auth.
- **Firebase** — NoSQL makes relational pricing queries (LEFT JOIN prices to issues) awkward. Firestore security rules are harder to audit than Postgres RLS. No SQL migrations.
- **Twilio / MSG91 / any messaging provider** — No automated messaging in v1. Gagan calls customers back manually. Adding a messaging layer before the core booking flow is proven would add cost and integration complexity for no validated return.
- **Razorpay** — Correct choice for v2 online payments. Not needed in v1 — all bookings are quote-first, payment at the shop. Adding payment flow would double the booking complexity for launch.

---

## Local dev workflow

```
Terminal 1: pnpm dev          # Next.js on localhost:3000
Terminal 2: supabase start    # Local Postgres on localhost:54321
```

Both must be running simultaneously during development.

Local Supabase provides:
- Postgres on `localhost:54321`
- Studio UI on `localhost:54323`
- Inbucket (email capture) on `localhost:54324` — catches magic link emails locally without sending real email

Environment variables needed in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<local anon key from supabase start output>
SUPABASE_SERVICE_ROLE_KEY=<local service role key>
SENTRY_DSN=<from Sentry project>
```

Migrations run with: `supabase db reset` (local) — runs all `/db/migrations/` files in order from scratch.

---

## Deployment workflow

1. Push to `main` branch → Vercel auto-builds and deploys a **preview URL**
2. Preview URL is tested manually (golden path: submit a booking, confirm record in Supabase, confirm confirmation screen shows correct booking ID)
3. Run deploy-checker agent before promoting to production
4. Promote to production in Vercel dashboard — or configure `main` as production branch directly
5. Production environment variables are set in Vercel project settings (never in the repo)

**Supabase migrations in production:** Run via `supabase db push` or the Supabase dashboard SQL editor. Migrations are one-way — no rollback scripts, but every migration has a rollback comment at the top per CLAUDE.md rules.

---

## Estimated monthly cost at launch (single shop)

| Service | Cost |
|---|---|
| Vercel | Free (under 100 GB bandwidth) |
| Supabase | Free tier (under 500 MB DB, 2 GB storage) — upgrade to Pro (₹2,100/mo) when needed |
| Messaging | None in v1 — ₹0 |
| Plausible | ~₹800/mo (after 30-day trial) |
| Sentry | Free (under 5,000 errors/month) |
| Cloudflare DNS | Free |
| Domain | ~₹800/yr (~₹70/mo amortised) |

**Total estimate: ₹1,500 – ₹3,000/mo at launch.**

Costs scale only when the business grows past free tiers. Supabase Pro is the first likely upgrade — triggered by DB size or needing daily backups.
