# Requirements — Gagan Mobile Care

---

## What we're building

A public website and owner dashboard for Gagan Mobile Care, a phone repair shop at Lajpat Nagar Central Market, New Delhi. Customers book repairs online or by phone; Gagan manages bookings and tracks repairs through a private admin dashboard. The site replaces a non-functional prototype with a real, production system that writes to a database and ranks on Google for repair searches across India.

---

## Who uses it

### Customer

Someone with a cracked screen or dead battery — in Delhi or anywhere else in India. They find the site through Google, check the price in 60 seconds, and either decide to walk in or send the phone by post. They are on a phone themselves, probably Android, probably mobile data. They do not want to fill a long form. They want to know the price, know the shop is real, and get a callback quickly. If nothing earns their trust in the first scroll, they close the tab.

### Owner (Gagan)

Gagan opens his shop at 10am and immediately needs to know: who called overnight, which phones are ready for pickup, and what he earned yesterday. Today he manages this on paper and WhatsApp. He misses callbacks because he forgets who called. He loses track of which repairs are done. The admin dashboard gives him one screen that shows exactly what needs his attention — new bookings to call back, phones on the bench, phones ready for pickup — and lets him update statuses from his phone between customers.

---

## Core jobs (ranked by business value)

1. **Book a repair**
   Every rupee of revenue starts here. A customer who books is 10x more likely to show up than one who just reads the site.
   Success: Booking form submits, writes to Supabase, and shows the customer a confirmation screen with their booking ID and price estimate. The booking appears in Gagan's admin dashboard immediately. Gagan calls the customer back manually.

2. **Show a real price before asking for a phone number**
   Customers who see a specific price convert better than customers who see "call for quote." It also lets repair pages rank for searches like "iPhone 14 screen repair price Delhi."
   Success: Every repair page shows either a real per-model price (from Gagan's pricing sheet) or a "Starting from ₹X" fallback — never a blank or a range so wide it's useless.

3. **Earn trust in the first scroll**
   Lajpat Nagar has dozens of repair shops. Customers comparing options decide on trust signals — reviews, warranty, parts quality — before they decide on price.
   Success: Hero section, TrustBar, and Testimonials load above the fold on mobile within 2.5 seconds. All trust claims (ratings, review count, warranty) match verified reality.

4. **Reach customers who are not in Delhi**
   The post-repair service is a genuine differentiator. A customer in Guwahati or Kanyakumari has no equivalent option locally.
   Success: PostFlow section explains the 5-step process clearly. "Send by post" option is available at Step 4 of the booking flow. Pan-India reach mentioned in SEO metadata.

5. **Let Gagan see today's work at a glance**
   He should not need to check three places or scroll through old records to know what to do next.
   Success: Admin Today page shows new bookings, phones on bench, phones ready to pick up, and earnings — all live from the database, correct on page load.

6. **Let Gagan update a repair status from his phone**
   He moves between customers all day. He cannot sit at a desktop to mark a phone as ready.
   Success: Repair status can be changed from the admin Repairs page on a mobile browser in under 3 taps. Status change saves instantly to Supabase.

7. **Protect the admin from the public**
   Currently the admin URL is linked in the footer and has no login. Any customer who finds it sees every booking and every customer phone number.
   Success: All `/admin` routes return 401 to unauthenticated requests. Gagan logs in with a magic link sent to his email. Session persists for 7 days.

8. **Rank on Google for repair searches**
   The site earns revenue by being found. "iPhone screen repair Delhi," "battery replacement near me," and similar searches should surface the site within 90 days.
   Success: All 195 repair pages (15 brands × 13 issues) render server-side with unique titles, descriptions, and prices. LocalBusiness schema validates. Sitemap submitted to Google Search Console on launch day.

---

## What we are NOT building in v1

- Automated SMS or WhatsApp confirmation on booking — customer sees a confirmation screen instead; Gagan calls back manually (v2)
- Customer-facing repair status lookup (v2)
- Online payment / Razorpay integration — bookings are quote-first, payment happens at the shop (v2)
- Multi-language versions — Hindi, Marathi, or other regional languages (v2)
- Newsletter or email marketing (v2)
- Blog or content publishing (post-launch)
- Reviews submission flow — we display Google reviews, we do not collect our own (post-launch)
- Inventory management for spare parts (v2)
- Multi-shop or franchise support (post-launch)
- Customer accounts or login — all flows are anonymous and phone-number based (v2)
- Pickup and drop service booking — mentioned in FAQ copy, no UI for it (v2)
- Packing guide PDF download — referenced in PostFlow section (v2)

---

## Success criteria for v1

These are testable on launch day. Each one is either pass or fail.

1. Homepage loads under 2.5 seconds on a 4G connection (tested via WebPageTest with an Indian server node)
2. Booking form submits and the record appears in Supabase within 1 second
3. Customer sees a confirmation screen with their booking ID and price estimate immediately after submitting
4. Gagan can log in to the admin dashboard from his phone using a magic link
5. Gagan can see new bookings, change a repair status, and add a manual booking — all from a mobile browser
6. All 195 repair pages (`/repairs/[brand]/[issue]`) render server-side — `view-source` shows the price and content, not a blank shell
7. Sitemap at `/sitemap.xml` lists all public pages and is submitted to Google Search Console on launch day
8. `robots.txt` allows crawling of all public pages and blocks `/admin`
9. Privacy Policy is live, linked from the footer, and covers data collected by the booking form
10. All trust claim numbers on the site match what Gagan has verified (repairs count, rating, review count, warranty, founding year)
11. Admin dashboard is inaccessible without login — direct URL to `/admin` redirects to login
12. Every WhatsApp button on the site opens a chat with the correct number (`+91 98112 00410`)
13. Every phone number on the site opens a dialer when tapped on mobile

---

## SEO success criteria (validated post-launch)

These cannot be tested on launch day — they are 30–90 day outcomes.

- Google PageSpeed Insights mobile score: 85 or above on the homepage and one sample repair page
- Lighthouse SEO score: 95 or above on all public pages
- All public pages indexed in Google Search Console within 30 days of launch
- LocalBusiness schema validates without errors in Google Rich Results Test
- FAQPage schema on the FAQ section validates in Rich Results Test
- BreadcrumbList schema on repair pages validates in Rich Results Test
- Stretch goal: "iPhone screen repair Lajpat Nagar" appears in Google top 10 within 90 days — dependent on competition and Google Business Profile strength, not solely on the site

---

## Pre-launch blockers

Nothing ships until these are done. Each is binary — done or not done.

- [ ] Privacy Policy page is live at `/privacy` and linked from the footer
- [ ] All five trust claims verified with Gagan and updated in the codebase: repair count, current Google rating, current review count, warranty terms, founding year
- [ ] Real GST number from Gagan added to the footer, or the placeholder line removed entirely
- [ ] All `/admin` routes return 401 to unauthenticated requests — tested with an incognito browser
- [ ] Booking form writes to Supabase — verified by checking the database after a test submission
- [ ] Every WhatsApp button and every phone number manually clicked on mobile and verified to work
- [ ] Admin "New booking" modal saves to the database — verified by checking Supabase after submission
- [ ] Repair status changes in the admin persist across a page reload

---

## Future — v2 candidates

These are not forgotten. They are deliberately deferred so v1 ships on time.

- Customer-facing repair status lookup (customer types booking ID or phone number to see current status)
- Online payment via Razorpay at the time of booking
- Hindi and regional language versions of the site
- Packing guide PDF download for post customers
- Delhi NCR pickup and drop booking option
- Blog for repair tips and phone guides (long-term SEO)
- Reviews collection flow
- Inventory management — track spare parts stock
- Customer accounts with repair history
- Multi-shop support if Gagan opens a second location

---

## Sign-off

This document describes exactly what is being built in v1. Before the first line of code is written, Gagan Singh should read and confirm the following:

---

*I, Gagan Singh, confirm this is what I want built in v1. I understand what is NOT included in v1 (see "What we are NOT building" and "Future" sections above) and agree those items are deferred to after launch.*

*I will provide the following before or during the build:*
- *Shop photos (exterior, interior, technician at work)*
- *Real repair prices for the top 30 phones, via the shared Google Sheet*
- *Exact business hours (current hours shown are 10am–9pm — confirm or correct)*
- *Verified trust claim numbers (repairs count, current Google rating, current review count)*
- *Real GST registration number for the footer*
- *My Google Business Profile URL for schema markup*

*I will be available on WhatsApp to answer questions during the build (estimated 10 working days). I understand that delays in providing content will delay the launch date.*

*Signed: _______________________   Date: ______________*
