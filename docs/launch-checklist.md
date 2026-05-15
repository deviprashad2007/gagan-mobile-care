# Launch Checklist — Gagan Mobile Care

## How to use

Before any production deploy, walk through every item. Mark done as you verify each one. **Block deploy on any failure in the Security, SEO, or Data sections.** Performance and UX failures are blocking if they affect the booking flow; non-blocking otherwise.

Run the `deploy-checker` agent to automate what can be automated. The items below requiring manual verification (real phone, incognito browser, view-source) must be done by hand.

---

## Security

- [ ] No secrets in code — search codebase for `sk-`, `key=`, `password=`, `token=` and confirm none are hardcoded
- [ ] `.env.local` is in `.gitignore` and has never been committed
- [ ] All RLS policies tested — run queries as anon role and as authenticated role, confirm each returns only what it should
- [ ] Admin route `/admin` is protected by middleware — confirm redirect to login in an incognito browser
- [ ] Rate limiting in place on the booking form server action — confirm it rejects more than 3 submissions per phone per 24 hours

---

## Performance

- [ ] All images use `next/image` with explicit `width` and `height` — no bare `<img>` tags
- [ ] No client-side data fetching in `page.tsx` files — all data loaded server-side
- [ ] `pnpm build` completes without errors — check route sizes, flag any route over 100 kB first load JS
- [ ] Lighthouse scores on homepage: Performance 85+, SEO 95+, Accessibility 90+
- [ ] Lighthouse scores on a sample repair page: same targets

---

## SEO

- [ ] Every public page has a unique `<title>` and `<meta name="description">` — verify via `generateMetadata()` output
- [ ] Sitemap accessible at `/sitemap.xml` and lists all public pages
- [ ] `robots.txt` allows crawling of all public pages and blocks `/admin`
- [ ] All 195 dynamic repair pages render server-side — `view-source` on a repair URL shows the price and content, not a blank div
- [ ] LocalBusiness JSON-LD schema on homepage validates in Google Rich Results Test
- [ ] FAQPage JSON-LD schema on FAQ section validates
- [ ] BreadcrumbList JSON-LD schema on repair pages validates
- [ ] No `noindex` meta tags left over from staging or development

---

## UX

- [ ] Booking form works end-to-end on mobile — submit a real test booking and confirm it appears in Supabase
- [ ] All WhatsApp buttons open a chat with the correct number (`+91 98112 00410`) — tested on mobile
- [ ] All phone number links open a dialer when tapped on mobile — no phone number is a plain `<button>`
- [ ] Map / address section shows the correct Lajpat Nagar location
- [ ] 404 page exists and is styled (not a blank Next.js default)
- [ ] Loading states are visible on slow connections — test with Chrome DevTools network throttling set to Slow 3G

---

## Data

- [ ] Supabase automated backups configured (requires Pro tier — confirm or document manual backup plan)
- [ ] All test bookings and test repairs removed from the database before go-live
- [ ] Admin user (Gagan's email) created in Supabase Auth and magic link login confirmed working on his phone

---

## Production

- [ ] Custom domain connected to Vercel and SSL certificate active
- [ ] All environment variables set in Vercel project settings — none missing from `.env.local`
- [ ] Sentry is receiving events — trigger a test error and confirm it appears in the Sentry dashboard
- [ ] Plausible is receiving pageviews — open the site and confirm a pageview appears in Plausible dashboard
- [ ] Google Search Console property verified and sitemap submitted
- [ ] Google Business Profile claimed, verified, and website field updated to the new domain

---

## Pre-launch blockers from requirements.md

These are non-negotiable. Nothing ships until every box is checked.

- [ ] Privacy Policy page is live at `/privacy` and linked from the footer
- [ ] All five trust claims verified with Gagan and updated in the codebase: lifetime repair count, current Google rating, current review count, warranty terms, founding year
- [ ] Real GST registration number from Gagan added to the footer, or the placeholder line removed entirely
- [ ] All `/admin` routes return 401 to unauthenticated requests — tested with an incognito browser
- [ ] Booking form writes to Supabase — verified by checking the database after a test submission
- [ ] Admin "New booking" modal saves to the database — verified by checking Supabase after submission
- [ ] Repair status changes in the admin persist across a page reload
- [ ] Every WhatsApp button and every phone number manually clicked on mobile and verified to work

> Note: messaging confirmation (SMS/WhatsApp on booking) is not in v1. Remove this item if it appears in any other checklist copy.
