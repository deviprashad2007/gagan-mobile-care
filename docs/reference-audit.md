# Reference Prototype Audit — Gagan Mobile Care

> Read-only audit of the `reference/` folder. Do not modify reference files.
> This document is the input for all planning and architecture decisions.

---

## 1. Business Context

Gagan Mobile Care is a small, owner-operated mobile phone repair shop run by **Gagan Singh**, located at **Shop 14, Lajpat Nagar Central Market, New Delhi 110024**. The business has been operating since at least 2014 and claims to have repaired **50,000+ phones** with a **4.8/5 rating across 2,143 Google reviews**. Contact phone: **+91 98112 00410**.

The site serves two audiences: **customers** (public homepage) and **the shop owner** (admin dashboard). The core customer value proposition is two service modes — walk in to the Lajpat Nagar store (90-min turnaround) or ship the phone by India Post Speed Post from anywhere in India (4–6 days, cash on delivery return). The business competes on trust signals: locked pricing (quote on call, never higher), genuine OEM-grade parts, 6-month warranty, no advance payment required, and free return courier.

---

## 2. Data Structures

### `data.js` — Public domain data (exposed as `window.GAGAN_DATA`)

**`BRANDS`** — Array of 15 brand objects.
```js
{ id: 'apple', name: 'Apple', glyph: 'A', tone: '#0E0E10' }
```
- `id`: slug used as key into MODELS
- `glyph`: 1–2 char abbreviation used in the brand "logo" tile
- `tone`: brand color hex used for the glyph text

Brands: Apple, Samsung, OnePlus, Xiaomi, Realme, Vivo, Oppo, Google Pixel, Motorola, Nothing, iQOO, Poco, Honor, Asus, Infinix.

**`MODELS`** — Object keyed by brand `id`, value is array of series objects:
```js
apple: [
  { series: 'iPhone 15 Series', items: [
    { id: 'i15pm', name: 'iPhone 15 Pro Max', year: 2023 },
    ...
  ]}
]
```
Coverage varies: Apple has 4 series (12–15), Samsung has 3 series, most others have 1 series with 2–3 models. Newest models go to iPhone 15 / Galaxy S24 / OnePlus 12 (2024 era). **No iPhone 16 / Galaxy S25** — data is ~1 year out of date.

**`ISSUES`** — Array of 13 repair issue objects:
```js
{ id: 'screen', name: 'Screen / Display', desc: 'Cracked, black, lines, touch issues', range: [1499, 12999], common: true }
```
- `range`: `[minPrice, maxPrice]` in INR — used to show estimate range in booking flow
- `common: true` marks Screen, Battery, Back Camera as flagged "Common" in the UI

Full list: Screen, Battery, Charging Port, Front Camera, Back Camera, Speaker, Mic, Water Damage, Back Glass, Software, Power Button, Volume Button, Other.

**`formatINR`** — Helper: `(n) => '₹' + n.toLocaleString('en-IN')`

---

### `admin-data.js` — Admin mock data (exposed as `window.GMC_ADMIN`)

**`LEAD_STATUSES`** — 4 booking pipeline stages:
```js
{ id: 'new', label: 'New', tone: '#E63329' }
```
Stages: `new` (red), `called` (blue), `booked` (green), `lost` (grey)

**`REPAIR_STATUSES`** — 4 repair pipeline stages:
```js
{ id: 'received', label: 'Received', tone: '#A8A8A8' }
```
Stages: `received` (grey) → `working` (red) → `ready` (green) → `picked` (black)

**`LEADS`** — 8 sample booking records:
```js
{ id: 'B-1023', name: 'Aarav Sharma', phone: '98765 43210', model: 'iPhone 14 Pro',
  issue: 'Cracked screen', price: 8499, status: 'new', method: 'walkin', time: '10:24 AM' }
```
Fields: id (B-XXXX), name, phone, model (free text), issue (free text), price (INR), status, method (`walkin`|`post`), time (relative string)

**`REPAIRS`** — 11 sample in-progress repair records:
```js
{ id: 'R-2041', cust: 'Anita R.', phone: '98201 13456', model: 'iPhone 13 Pro',
  issue: 'Screen', status: 'working', amount: 7499, intake: 'Today, 8:30 AM', eta: 'Today, 11:30 AM' }
```
Note: `cust` is truncated (first name + last initial), unlike `LEADS` which has full names. `eta` is a free-text string, not a timestamp.

**`CUSTOMERS`** — 7 sample customer records:
```js
{ id: 'C-091', name: 'Aarav Sharma', phone: '98765 43210', visits: 3, spend: 14299, last: 'Today' }
```
Fields: id (C-XXX), name, phone, visits (count), spend (lifetime INR), last (relative string)

### Pricing Strategy Decision

The reference prototype shows per-issue ranges (same range for all models). This is insufficient for SEO — dynamic `/repairs/[brand]/[issue]` pages need specific prices to rank against competitors.

**Decision for v1: REAL per-model prices, supplied by the shop owner.**
- This is a freelance engagement — the developer has direct access to Gagan's real pricing.
- Pricing survey: Top 30 phones × top 5 issues = ~150 rows, sourced from Gagan via a shared Google Sheet.
- For model×issue combos not in the survey, fall back to the brand's `issue.range` from `data.js` as "Starting from ₹X" with a price-on-call CTA.
- Admin catalog editor lets Gagan update prices as parts costs change.

**Database schema:** `prices` table — rows that exist = real prices; rows that don't = fallback to `issues.range`.

This becomes the `prices` table in [docs/data-model.md](data-model.md).

---

## 3. Public Pages Found

### Nav (`home-sections-1.jsx`)
Sticky top navbar with blur/glassmorphism on scroll. Logo = inline SVG phone icon + red dot. Links: How it works, Pricing, Send by post, Stories, FAQ. Desktop: nav pill bar + phone number + "Book repair" CTA. Mobile: hamburger → full-screen black overlay menu with large serif link labels.
- Key copy: `"Open · Lajpat Nagar"` (green dot live indicator)
- Phone: `+91 98112 00410` (hardcoded)

### Hero (`home-sections-1.jsx`)
Full-width card with a CSS map grid background + SVG road paths. Two-column layout desktop: left copy, right floating cards.
- Key headline: `"Cracked phone? Walk in, or just send it by post."`
- Subtext: `"Free quote in 60 seconds. Genuine parts. 6-month warranty. We're a small Delhi shop that's quietly fixed 50,000+ phones since 2014 — for everyone, anywhere in India."`
- Brand quick-pick row: first 8 brands as pill buttons that jump straight to Step 2 of booking
- Right column (desktop only): 3 floating cards — a repair photo placeholder, a "Courier picked up" status chip, a technician chip ("Rakesh K., 9 yrs · 4,200 repairs")
- Stats strip (4 cells): `50,000+ phones repaired`, `4.8/5 · 2,100 Google reviews`, `6 months warranty`, `90 mins avg walk-in turnaround`

### HowItWorks (`home-sections-1.jsx`)
Two-column card layout. Left card (white): Walk-in flow (3 steps). Right card (black): Post flow (3 steps).
- Section headline: `"Come to us, or your phone comes to us."`
- Walk-in steps: Book a slot → Walk in → Pay & leave
- Post steps: We send a label → Drop at any post office → Repaired & returned
- Walk-in badge: `"⌀ 90 min"`. Post badge: `"4–6 days"`

### TrustBar (`home-sections-1.jsx`)
6-cell grid card, each cell: icon + title + subtitle.
- Cells: `6-month warranty`, `Genuine parts` (OEM-grade, never refurbished), `Same-day fix` (90 min), `No advance` (Pay only when satisfied), `Pan-India post` (Free return courier), `Locked price` (Quote on call, never higher)

### PopularRepairs (`home-sections-2.jsx`)
3-column card grid of 6 featured repair types with icon, "From ₹X" pricing, and Book button.
- Headline: `"Real prices for the things that actually break."`
- "See all 50+ repairs" button (not linked anywhere)

### PostFlow (`home-sections-2.jsx`)
Dark card section with SVG route decoration. Two columns: left pitch, right 5-step numbered list.
- Headline: `"From Kohima to Kanyakumari."` (India's geographic extremes — signals pan-India reach)
- Step 5 CTA: `"Cash on return"` — pay the postman the locked-in amount
- Buttons: "Download packing guide" (not functional), "Chat with us" (WhatsApp button, broken — see Red Flags)

### Testimonials (`home-sections-2.jsx`)
4-column card grid. 4 hardcoded reviews.
- Headline: `"2,143 Google reviews. Most start with 'honest'."`
- Notable review (Priya M., Guwahati): `"Sent my Pixel 7 from Assam. Got it back in 5 days, charging port fixed, paid on delivery. Genuinely surprised this exists."` — validates post service positioning

### FAQ (`home-sections-2.jsx`)
Accordion with 5 questions. Left: headline + WhatsApp CTA. Right: accordion card.
- Headline: `"Quick answers, before you commit."`
- WhatsApp CTA: `"Ask on WhatsApp"` (button not linked)
- Notable answer: "No fix, no fee" — phone returned free with diagnostic report if unfixable

### Footer (`home-sections-2.jsx`)
Dark card. Left: CTA headline + buttons. Right: 3 link columns (Repairs, Brands, Company).
- CTA headline: `"Get your phone fixed. Today, or by Friday."`
- Company links include: About, Track repair, Warranty terms, Privacy, Contact — **none are implemented**
- GST number in footer: `07ABCDE1234F1Z5` (clearly placeholder)
- Admin link in footer: `Admin.html`

### Booking Flow (`booking.jsx`) — 5-step overlay
Full-screen overlay triggered from multiple CTAs. Steps:
1. **Brand** — searchable grid of 15 brands with glyph tiles
2. **Model** — searchable list grouped by series, with year labels
3. **Issues** — multi-select card grid, shows price range per issue, "Common" badge on top issues
4. **Service** — shows running estimate (`₹X–₹Y`), pick Walk-in (map card) or Post (dark card)
5. **Form** — name + 10-digit phone, booking summary sticky card, submit CTA: "Get free callback in 15 minutes"
6. **Confirmation** — booking ID (random), 15-minute countdown timer, WhatsApp + Track repair buttons

---

## 4. Admin Pages Found

### Today (`admin-overview.jsx`)
Landing page of the admin dashboard. Personalised greeting: `"Good morning, Gagan."` Four stat tiles: New bookings, On the bench, Ready to pick up, Earned today. Two panels side-by-side: "New bookings to call" (list with call button) and "Ready to pick up" (list with call button). Below: a table of in-progress repairs.

### Bookings (`admin-leads-repairs.jsx`)
Table view of all leads/enquiries. Filter tabs by status (All / New / Called / Booked / Lost) with counts. Search by name or phone. Status is editable via a styled `<select>` inline. Action buttons per row: call (tel: link) and WhatsApp (`wa.me` link). Help tip at bottom explaining the workflow.

### Repairs (`admin-leads-repairs.jsx`)
Two views: **Board** (kanban) and **List** (table). Board has 4 columns matching `REPAIR_STATUSES`. Each card shows customer, model, issue pill, amount, and a one-click "advance to next status" button. List view: table with status dropdown and call button. Search by customer name.

### Phones & Prices (`admin-catalog.jsx`)
Split layout: sticky brand list on left (with add/remove brand), model table on right. Each model row shows 4 inline-editable price inputs (Screen, Battery, Back glass, Charging port). Prices are seeded deterministically via hash if not manually set. Add model modal: name + year, auto-seeds prices. Help tip: "Changes save automatically and show on your website" — **this is aspirational, not implemented**.

### Customers (`admin-catalog.jsx`)
Simple table: name, phone, visits, total spend, last visit. Search by name or phone. Call button per row. Read-only — no edit or delete.

### New Booking Modal (`admin-misc.jsx`)
Triggered by "New booking" button in every page's TopBar. Fields: name, phone, model (free text), issue (dropdown), method (walk-in / post), price (optional). Saves locally — `onCreate` just calls `console.log('Created booking', data)`.

---

## 5. Design Tokens Observed in `styles.css`

### Colour palette (`:root` CSS variables)
| Token | Hex | Role |
|---|---|---|
| `--bg` | `#FFFFFF` | Page background (60%) |
| `--bg-card` | `#FFFFFF` | Card background |
| `--bg-soft` | `#F5F5F5` | Subtle fills, table headers |
| `--ink` | `#0A0A0A` | Primary text, dark buttons |
| `--ink-2` | `#1A1A1A` | Secondary text |
| `--ink-3` | `#6B6B6B` | Muted text, labels |
| `--ink-4` | `#A8A8A8` | Placeholder, disabled |
| `--line` | `#E5E5E5` | Borders, dividers |
| `--accent` | `#E63329` | CTA buttons, highlights, error states |
| `--accent-soft` | `#FDE3E1` | Accent backgrounds |
| `--good` | `#0A0A0A` | Reuses ink (not green — intentional) |
| `--map-bg` | `#F5F5F5` | Map section fill |

Additional colours used inline (not in `:root`):
- `#22A06B` — "Open" status dot, green success states
- `#25D366` — WhatsApp brand green (button bg)
- `#0A66C2` — "Called" status (LinkedIn blue)
- `rgba(242,92,31,.7)` — route path on map (orange-red, close to accent)

### Typography
| Stack | Usage |
|---|---|
| `Inter` (300–800) | Body, UI — default font |
| `Instrument Serif` (italic) | Display headings, `.serif` class — used for hero H1, section titles, large numbers |
| `JetBrains Mono` (400–500) | Prices, IDs, codes, `.mono` class |

Body: `15px / 1.5`. Mobile: `14px`.

### Named type scales (responsive classes)
| Class | Mobile | Desktop |
|---|---|---|
| `.hero-h1` | 44px | 68px |
| `.h-display` | 32px | 56px |
| `.h-section` | 28px | 48px |
| `.micro` | 11px / uppercase / 0.14em tracking | (same) |

### Spacing
- Section padding (`.sec-pad`): `24px 16px` mobile → `40px 36px` desktop
- Card padding: 16–28px (varies per component)
- Grid gap: 12–48px

### Border radius
- Buttons: `999px` (pill)
- Cards (`.card`): `16px`
- Hero card (`.hero-card`): `20px` mobile → `28px` desktop
- Small UI elements: `6px`–`14px`

### Shadows
```css
.shadow-float { box-shadow: 0 1px 2px rgba(20,20,30,.04), 0 12px 32px -12px rgba(20,20,30,.10); }
.shadow-soft  { box-shadow: 0 1px 2px rgba(20,20,30,.04), 0 6px 18px -8px  rgba(20,20,30,.08); }
```

### Animations
- `.fade-in`: `fadeUp 0.5s` — opacity 0→1, translateY 8px→0
- `.pulse`: radial glow pulse at 1.6s (used on location pins)
- `.spin`: 1s rotation (loading)

### Accent colour — locked
Primary accent: Red (`#E63329`) is locked. Used for CTAs, urgent states, and status badges. Brand consistency with Gagan's existing shop signage. **Do not propose alternatives unless explicitly asked.**

---

## 6. Brand Voice

The tone is **confident, plain-spoken, slightly warm** — not corporate. Short sentences. Occasional em-dash pauses. English throughout (no Hindi-English mix in the prototype), but the customer names in mock data are distinctly Indian.

Selected copy snippets:

1. **Hero H1:** `"Cracked phone? Walk in, or just send it by post."` — conversational, direct, no jargon
2. **Trust copy:** `"We're a small Delhi shop that's quietly fixed 50,000+ phones since 2014 — for everyone, anywhere in India."` — self-deprecating scale claim, builds intimacy
3. **Post section headline:** `"From Kohima to Kanyakumari."` — cultural shorthand for "all of India", no explanation needed
4. **FAQ answer:** `"No fix, no fee. If our technicians can't solve the problem, we ship the phone back to you for free, with a full diagnostic report."` — direct, no asterisks
5. **Callback step:** `"A real human, not a bot. They'll confirm the issue, lock the price, and book your slot."` — addresses a specific customer anxiety about automated systems

---

## 7. Notable Patterns

**Booking flow state machine.** `BookingFlow` holds all state at the container level (`brand`, `model`, `issues[]`, `service`, `booking`). Each step is a pure component that receives data and callbacks. Step 4 auto-advances after 240ms on service pick (`setTimeout(() => setStep(4), 240)`) — avoids an explicit continue button. This is a clean pattern to replicate as a server-component-safe multi-step form.

**Estimate calculation.** Price ranges from `ISSUES` are summed across all selected issues: `issues.reduce(([a, b], i) => [a + i.range[0], b + i.range[1]], [0, 0])`. Shown as `₹lo – ₹hi`. This is range-based, not per-model pricing — the model only matters for which brand/series to display, not for the price.

**Seed pricing in admin.** `admin-catalog.jsx` uses a deterministic hash to generate prices when none are set: `Math.round(base * (0.7 + ((hash % 100) / 100) * 0.6) / 100) * 100`. This means every model always has a displayable price without real data — useful for the prototype but needs to be replaced with a real `prices` table in Supabase.

**Global window namespace pattern.** All components are attached to `window` globals (e.g. `window.BookingFlow`, `window.HomeSections1`, `window.GMC_ADMIN`). This is the CDN Babel workaround for modules — every file must be translated to a proper ES module in Next.js.

**Admin state is local only.** Status changes in Bookings and Repairs (`setLeads`, `setRepairs`) use `useState` — changes survive re-renders within a session but reset on page refresh. There is no persistence layer.

**Inline style everything.** No CSS classes on most components — all layout and styling is inline `style={{}}` objects. One consequence: hover states are handled with `onMouseEnter`/`onMouseLeave` JavaScript, not CSS `:hover`. This is intentional for the CDN prototype but should be migrated to Tailwind classes.

**WhatsApp links are correctly formatted.** The admin Bookings page uses `https://wa.me/91${phone}` — the correct wa.me format. This pattern should be preserved.

---

## 8. What's Missing

| Feature | Where it's mentioned | What's actually there |
|---|---|---|
| **WhatsApp confirmation on booking** | Confirmation screen has "Chat on WhatsApp" button | Button renders but has no `href` — clicking does nothing. V2 — re-evaluate. |
| **Packing guide download** | PostFlow section: "Download packing guide" button | Button is not linked. V2 — re-evaluate. |
| **Repair tracking (customer-facing)** | Confirmation screen: "Track repair" button; footer: "Track repair" link | Neither is implemented. **V2 — DEFERRED. v1 sends WhatsApp/SMS updates instead.** |
| **"See all 50+ repairs"** | PopularRepairs section | Button exists, no destination. V2 — re-evaluate. |
| **Admin price persistence** | Tip text says "Changes save automatically and show on your website" | Prices are in-memory React state only; reset on reload. Fixed in v1 via Supabase. |
| **New Booking save** | `onCreate` handler in admin-app.jsx | `console.log('Created booking', data)` — data is never stored. Fixed in v1 via Supabase. |
| **Pickup/drop within 8km** | FAQ answer mentions it | No UI or booking flow option for it. V2 — re-evaluate. |
| **Admin authentication** | Admin route exists at `Admin.html` | No login, no password, publicly accessible. Fixed in v1 via Supabase Auth + middleware. |
| **Real phone number in footer phone button** | Footer has a phone button `+91 98112 00410` | Button opens booking flow instead of dialing. Fixed in v1 rebuild. |
| **GST number** | Footer: `GST 07ABCDE1234F1Z5` | Placeholder — not a real GST number. Get from Gagan before launch. |
| **"About" page** | Footer links | Not implemented. **V1 — simple content page.** |
| **Warranty terms** | Footer links | Not implemented. **V1 — simple content page.** |
| **Privacy Policy** | Footer links | Not implemented. **V1 BLOCKER — legal requirement under DPDP Act 2023 (India).** |

---

## 9. Red Flags

**1. No admin auth at all.**
`Admin.html` is a plain HTML file. Anyone with the URL can access it. There is no login screen, no session, no protection. The footer even has a direct `<a href="Admin.html">Admin</a>` link. **Do not ship without Supabase Auth + middleware protection.**

**2. Booking confirmation does nothing real.**
On form submit: `const id = 'GMC-' + Math.random().toString(36).slice(2, 7).toUpperCase()`. The booking ID is generated client-side with `Math.random()`. No email, no SMS, no WhatsApp, no database write happens. The 15-minute countdown timer is purely cosmetic.

**3. WhatsApp button in PostFlow is broken.**
```jsx
<button className="btn" style={{ border: '1px solid rgba(255,255,255,.2)', color: "rgb(0, 0, 0)" }}>
  <Icon name="whatsapp" size={14} color="#fff" /> Chat with us
</button>
```
`color: "rgb(0, 0, 0)"` on a dark background — text is black on black, invisible. No `href`. This is a UI bug + non-functional button in the same place.

**4. Footer phone button books a repair instead of calling.**
```jsx
<button className="btn" style={{ ... }} >+91 98112 00410</button>
```
This is a `<button onClick={() => onBook()}>`, not a `tel:` link. Clicking the phone number opens the booking overlay. Should be `<a href="tel:+919811200410">`.

**5. Prices reset on refresh.**
The admin Phones & Prices page uses `useState` for price edits. Any prices entered by the shop owner disappear on page reload. The tip "Changes save automatically" is misleading.

**6. Admin `NewBookingModal` discards all data.**
The `handleCreate` callback in `admin-app.jsx` is:
```js
const handleCreate = (data) => {
  console.log('Created booking', data);
  setActive('bookings');
};
```
Nothing is persisted. The user gets navigated to the Bookings page but the new booking is not there.

**7. `data.js` models are ~1 year stale.**
Newest Apple is iPhone 15 (2023), Samsung is S24 (2024). iPhone 16, Galaxy S25, OnePlus 13 are all missing. The catalog will need updating before launch.

**8. Inline hover handlers will not work with SSR.**
`onMouseEnter`/`onMouseLeave` on buttons directly set `e.currentTarget.style.*`. This pattern works in a CDN React app but would cause hydration mismatches in Next.js if the component is server-rendered. Must be converted to Tailwind hover classes or CSS.

**9. `admin-styles.css` not audited.**
`Admin.html` loads `admin-styles.css` which was not included in the reference files. Admin-specific layout classes (`.admin-layout`, `.admin-sidebar`, `.panel`, `.kanban`, `.tbl`, `.pill`, etc.) are used in admin JSX but defined there. This file needs to be read before building the admin layout.

**Note on UI bugs in §9 red flags 3 and 4 (invisible WhatsApp text, phone number opens booking flow):** These bugs exist only in the legacy CDN prototype. They are NOT carried forward — all components are being rebuilt fresh in Next.js. **Add to deploy-checker QA:** verify on every relevant page that (a) all WhatsApp buttons have visible text on their background colour, and (b) all phone numbers use `<a href="tel:...">` links that open a dialer.

---

## 10. Trust Claims to Verify Before Launch

The reference copy mentions specific numbers. Each must be verified true before launch — Google penalizes inflated claims on sites linked to a Google Business Profile:

| Claim | Where used |
|---|---|
| **"50,000+ lifetime repairs"** | Hero subtext, stats strip — is this accurate or aspirational? |
| **"4.8/5 rating"** | Hero stats strip — verify against actual GBP rating today |
| **"2,143 Google reviews"** | Testimonials headline — verify exact count from GBP |
| **"6-month warranty"** | TrustBar, FAQ, footer — confirm Gagan still offers this |
| **"Operating since 2014"** | Hero subtext — confirm establishment year |

**Action:** WhatsApp Gagan with this list. Update copy to match reality before any launch. Add as CRITICAL item in [docs/launch-checklist.md](launch-checklist.md).

---

## 11. Client / Build Context

- **Build type:** Freelance engagement for the shop owner (paid)
- **Owner:** Gagan Singh, Lajpat Nagar Central Market, New Delhi
- **Developer access:** Has watched the owner work; knows real prices; direct WhatsApp access for questions and content approvals
- **Engagement risks:** Standard freelance risks — scope creep, payment timing, owner availability for content (prices, photos, copy approvals). Mitigated by phased milestones and a pre-built admin dashboard for self-service updates post-launch.

---

## 12. V1 Scope Lock

### In v1

- All 9 public sections (rebuilt fresh in Next.js)
- All 5 admin pages (with real Supabase persistence)
- Booking flow → Supabase → MSG91 SMS/WhatsApp confirmation
- Repair management (admin only — no customer-facing lookup)
- Privacy Policy, About, Warranty static pages
- Sitemap, robots.txt, full SEO schema (LocalBusiness, BreadcrumbList, FAQPage)
- Real prices for top 30 phones (sourced from Gagan via Google Sheet)
- Fallback "Starting from ₹X" for all other model×issue combos

### Out of v1 — deferred to v2

- Customer-facing repair status lookup (WhatsApp/SMS updates cover this in v1)
- Online payment / Razorpay — bookings are quote-first, payment at shop
- Multi-language (Hindi/Marathi versions)
- Newsletter / email marketing
- Blog
- Reviews submission flow (we display Google reviews, not collect our own)
- Inventory management for spare parts
- Multi-shop / franchise support
- Customer accounts / login (all flows are anonymous + phone-number based)
