# Service-Provider Booking Platform — Features & Market Study

A multi-tenant booking platform where **service providers (prestataires)** subscribe
to a plan on the web, get an **admin dashboard** to spin up a **branded mini-site**,
configure their **services, prices, staff, and schedule**, and where **end-users**
discover and book appointments via **iOS, Android, or web**.

Target markets: **France** and **Tunisia** (with multi-language EN / FR / AR-Tunisian).

---

## 1. Market Study — what's already out there

### France (mature, crowded, premium-priced)
| Player | Model | Strength | Weakness we can exploit |
|---|---|---|---|
| **Planity** | Fixed SaaS subscription **20–60 €/mo** + optional POS at +20 €/mo. 60k+ pros, 15M users, 10M bookings/mo, raised $48M in 2024. | No commission, integrated agenda, POS, marketing, "turnkey website" add-on. | Targets almost exclusively beauty/hair/barber; site templates are limited; expensive for solo pros. |
| **Treatwell** | **Commission-based** (% per booking) marketplace. | Big consumer marketplace, no fixed cost. | Commission is painful on returning clients; pros lose ownership of the customer relationship. |
| **Booksy** (also in FR) | Subscription **~30 €/mo** + €20 per extra team member. | Strong consumer marketplace, excellent client app. | Per-seat pricing punishes growing salons. |
| **Fresha** | Free SaaS, monetised by **20 %** commission on *new* clients + payments fees. | Free entry, modern UI. | Pros lose 20 % on the lead — quickly painful. |

### Tunisia (early, fragmented, mostly free)
| Player | Model | Notes |
|---|---|---|
| **Mar7be** | 100 % free for pros, iOS + Android | Generalist appointment platform — beauty, health, services. |
| **Rezervy** | Free-ish, beauty-focused | Tunis, Sousse, Sfax — beauty / barber / massage. |
| **BeautyZayn** | Directory + booking | Geo-located beauty providers. |

**Key gap to exploit:**
1. None of the Tunisian players offer a real **white-label branded mini-site** per provider.
2. France leaders (Planity, Treatwell) are **beauty-only**; broader verticals (coach, garage, training center, healthcare, home services) are under-served by a single horizontal tool.
3. **Hybrid pricing** (low fixed sub + small commission on *new* leads from marketplace, never on returning clients) is a clear positioning angle vs. Planity (sub-only) and Fresha (commission-only).
4. Tunisia needs **local payment rails** (Flouci, D17, Konnect, Paymee) — Western platforms don't integrate these.

---

## 2. Personas

- **Pro-Solo** — independent barber / nail tech / personal coach. Wants: cheap, fast setup, branded link to share on Instagram, SMS reminders.
- **Pro-Salon (2–10 staff)** — hair salon, beauty institute. Wants: shared agenda, per-employee calendar, commissions, stock.
- **Pro-Multi-site** — chain of 3+ locations. Wants: multi-location dashboard, consolidated reporting, role-based access.
- **End-User** — books a haircut for Saturday. Wants: see availability in one tap, reschedule easily, pay or pre-deposit.
- **Platform Admin (us)** — onboard pros, moderate listings, run the marketplace, push featured listings.

---

## 3. Verticals supported at launch
Start with **beauty & wellness** (proven demand) but design the data model so we can add:

- Coiffeur / barber / institut de beauté / spa / ongles
- Coach sportif, yoga, pilates (séance individuelle ou groupée)
- Santé & paramédical (kiné, ostéo, psy, nutritionniste) — *attention RGPD/secret médical*
- Auto (garage, lavage, contrôle technique, location)
- Cours particuliers / centres de formation
- Services à domicile (ménage, plomberie, réparation)
- Photographe / DJ / animation événementielle

Each vertical = a **service template pack** with default service names, durations, icons.

---

## 4. B2B — Web Admin Dashboard (the core)

### 4.1 Onboarding & subscription
- Sign-up with email / phone OTP / Google.
- **Choose a plan** (Free / Starter / Pro / Business — see §10).
- Pick vertical → app pre-fills service templates.
- Stripe (FR/EU) + Konnect/Flouci (TN) for subscription billing.
- 14-day free trial on paid plans.

### 4.2 Branded mini-site builder
- **Custom subdomain**: `monsalon.app.com` + optional custom domain (`monsalon.fr`).
- **Theme picker** (5–8 templates by vertical) + colour palette + logo + cover photo.
- Photo gallery (before/after, salon interior).
- About / team / opening hours / address with embedded map.
- "Book now" CTA → integrated booking flow on the same site.
- SEO basics: meta tags, OpenGraph, sitemap, schema.org `LocalBusiness`.
- Multi-language toggle per site (FR / EN / AR).

### 4.3 Services catalog
- Service: name, description, duration, buffer time, price, photo, category.
- Variants (e.g. "coupe homme courte / mi-long / long").
- Add-ons (e.g. "shampoing premium +5 €").
- Required staff / skill tag (so booking only matches qualified employees).
- Per-service deposit % (anti-no-show).

### 4.4 Staff (employees / praticiens)
- Profile (photo, bio, languages, specialities).
- Weekly schedule + exceptions + vacations.
- Services they perform + per-service price override.
- Commission rate (% or fixed) for payout reports.
- Per-employee booking link (`monsalon.app.com/maria`).
- Role: owner / manager / employee / read-only.

### 4.5 Agenda / calendar
- Day / week / month / staff-grouped views.
- Drag-and-drop reschedule, resize for duration change.
- Colour-coded by service / staff / status.
- Walk-in / phone booking (manual entry).
- Blocked slots (lunch, training, personal).
- Conflicts and overlap warnings.
- iCal / Google Calendar 2-way sync.

### 4.6 Clients / CRM
- Client card: contact, history, notes, allergies, photos, "VIP" tag.
- Loyalty points / stamp card.
- Tags & segments → targeted SMS / email campaigns.
- No-show & late-cancel counter; auto-block if > N.
- Birthday automation.
- GDPR data export & delete.

### 4.7 Payments & cashbox
- Online pre-payment or deposit at booking time.
- In-store checkout (POS-lite): cart, discounts, tips, split payment, receipt printer.
- Methods: card (Stripe FR), Apple/Google Pay, **Flouci, D17, Konnect, Paymee** (TN), cash.
- End-of-day Z report; export accounting (CSV, FEC for France).
- Staff commissions auto-computed from sales.

### 4.8 Inventory (Pro plan and above)
- Resale products vs. technical products.
- Low-stock alerts, supplier orders, barcode scan from phone.

### 4.9 Marketing
- Promo codes (% / fixed / first-booking only).
- Happy-hour pricing (auto-discount on off-peak slots).
- Re-engagement campaigns ("you haven't booked in 3 months — 10 % off").
- Gift cards (digital, with QR).
- Google Reviews invite after appointment.
- Referral codes ("bring a friend, both get 5 €").

### 4.10 Reporting
- Revenue / bookings / new vs. returning clients / fill rate / avg ticket.
- Per-staff, per-service, per-channel (marketplace vs. own site vs. walk-in).
- Forecast next 7 / 30 days.
- Export PDF / Excel.

### 4.11 Notifications & comms
- Auto SMS / email / WhatsApp / push: confirmation, reminder T-24h, T-2h, post-visit "thanks + review".
- Custom templates per language.
- In-app inbox to message clients.
- **SMS bundles included** per plan; top-ups available (TN SMS routing via local aggregator).

### 4.12 Multi-location
- Switch between locations from a top bar.
- Roll-up KPIs at the chain level.
- Inter-location booking ("book client at our 3rd-arrondissement branch").

---

## 5. B2B — Mobile App for the provider (companion)

A lighter version of the dashboard, optimised for the chair / on the go:
- Today's agenda + next client.
- Quick reschedule / no-show / mark paid.
- Walk-in capture.
- Client card with last visit + notes.
- Push when a new booking comes in (with accept/decline if "request" mode is on).
- Camera shortcut for before/after photo on client profile.
- Offline read with sync.

---

## 6. End-User Mobile App (iOS + Android) + Web

### 6.1 Discovery
- Geolocated home feed: "near me", "open now", "available today", "top rated".
- Filter: vertical, service, price range, distance, language spoken, accessibility, parking.
- Search bar with autocomplete (provider name, service, city, neighbourhood).
- Map view with pins + cluster.
- Featured / sponsored slots (platform revenue lever).

### 6.2 Provider profile
- Photos, services with prices, staff, reviews, opening hours, location, "people also booked".
- "Book" CTA → calendar picker.
- Share button (deep link to native app + web fallback).

### 6.3 Booking flow
- Pick service → staff (optional, "no preference" allowed) → date/time → confirm.
- Sign in / sign up at this step (phone OTP or social).
- Deposit prompt if required by provider.
- Add to calendar (.ics).
- Confirmation push + email + SMS.

### 6.4 My bookings
- Upcoming + past tabs.
- Reschedule / cancel (respecting provider's policy).
- Re-book in one tap from past visits.
- Add to Apple/Google Wallet pass.

### 6.5 Profile
- Personal info, payment methods, preferences (language, notification channels).
- Favourite providers; follow for promo alerts.
- Loyalty points per provider.

### 6.6 Reviews
- Post-visit prompt (1–5 stars + photo + text).
- Provider can respond.
- Anti-fake: review only after a completed appointment.

### 6.7 Payments & wallet
- Saved cards (Stripe), Apple/Google Pay.
- Tunisia: **Flouci, D17, Konnect, Paymee**.
- In-app wallet balance from gift cards / refunds.
- Tip at checkout.

### 6.8 Social / extras (v2)
- Stories from providers (new look, promo of the day).
- Group booking (book for friend, e.g. wedding party at the salon).
- Waitlist: "alert me if a slot opens before X".

---

## 7. Cross-cutting platform features

- **Multi-language**: FR (primary), EN, AR (RTL).
- **Multi-currency**: EUR, TND, MAD, plus fallback.
- **Time zones** per location.
- **Roles & permissions**: owner / manager / employee / accountant.
- **Audit log** for sensitive actions (refund, client delete).
- **GDPR / CNIL & INPDP (TN)** compliance: consent log, export, right to delete.
- **2FA** for admin accounts.
- **PCI scope**: never store card PAN; tokenise via Stripe / Konnect.

---

## 8. Platform-admin (us, internal)

- Provider onboarding queue + KYC verification.
- Plan/subscription management, refunds.
- Marketplace moderation: hide listings, edit cover photos, flag fake reviews.
- Featured-slot scheduling.
- Global revenue dashboard (MRR, churn, GMV, take rate).
- Support inbox (tickets from pros and from users).
- Push announcement to all pros / all users.

---

## 9. Notifications matrix

| Event | User | Pro | Channel |
|---|---|---|---|
| New booking | confirm | new-booking alert | push + email + SMS |
| Reminder T-24h | yes | optional | push + SMS |
| Reminder T-2h | yes | — | push |
| Reschedule | yes | yes | push + email |
| Cancel | yes | yes | push + email |
| Post-visit | review request | summary | push (user) / email (pro) |
| Promo | opt-in | — | push |

---

## 10. Monetisation — proposed plans

| Plan | Target | Monthly (FR) | Monthly (TN) | Includes |
|---|---|---|---|---|
| **Free / Découverte** | Solo, low volume | 0 € | 0 TND | Up to 40 bookings/mo, agenda, mini-site (sub-domain only), 50 SMS, marketplace listing with **commission 8 % on new clients only** |
| **Starter** | Solo pro | 19 € | 39 TND | Unlimited bookings, **no commission**, 200 SMS, online payments |
| **Pro** | 2–5 staff | 39 € | 79 TND | Multi-staff, CRM, marketing automations, stock, custom domain, 500 SMS |
| **Business** | 5+ staff / multi-site | 79 € + 10 €/extra location | 149 TND | Multi-location, advanced reporting, API access, priority support, 1500 SMS |

Extras: SMS top-ups, payment processing fee (~1.4 % + 0.25 € EU, local rate TN), featured-listing boosts, gift-card commission 0 %.

> **Positioning**: cheaper than Planity Premium, less punishing than Treatwell/Fresha commission, with the white-label mini-site as the differentiator.

---

## 11. MVP scope (3–4 month build)

**In:**
- One vertical (coiffeur / barber) with templates.
- Provider sign-up + Starter plan only.
- Branded mini-site (1 theme, colour + logo + photos).
- Services + staff + agenda + manual & online booking.
- End-user iOS + Android + responsive web (no native marketplace yet — just direct booking links).
- Card payments + deposits (Stripe).
- SMS + email reminders.
- Reviews.
- Basic dashboard reporting.
- FR + EN.

**Phase 2 (months 5–8):**
- Marketplace discovery feed + map.
- Tunisia launch: Flouci / Konnect / D17 + AR locale.
- Free plan with commission model.
- CRM segments + marketing automations.
- POS / cashbox + accounting export.
- Provider mobile companion app.

**Phase 3 (months 9–12):**
- Multi-location.
- New verticals (coach, auto, healthcare).
- Loyalty + gift cards + referrals.
- API & webhooks.
- Waitlist, stories, group booking.

---

## 12. Proposed tech stack

- **Mobile**: React Native + Expo (single iOS+Android codebase) — share UI primitives with the web booking flow via React Native Web where it makes sense.
- **Web (mini-sites + admin dashboard)**: Next.js 14, App Router, server components for SEO of mini-sites; per-tenant routing on subdomain.
- **Backend**: Node.js (NestJS) or Go, REST + GraphQL for admin. Postgres (multi-tenant via `tenant_id` column with row-level security). Redis for caching + queues (BullMQ).
- **Auth**: Clerk or Supabase Auth (phone OTP, social), JWT to backend.
- **Storage**: S3 / Cloudflare R2 for photos, with image CDN.
- **Notifications**: Expo push, Twilio (FR) + local SMS aggregator (TN), SendGrid for email.
- **Payments**: Stripe Connect (FR/EU), Konnect + Flouci API (TN).
- **Infra**: Vercel for Next.js, Fly.io or AWS ECS for API, Postgres managed (Neon / Supabase / RDS).
- **Observability**: Sentry, PostHog (product analytics), Grafana for infra.
- **i18n**: i18next, ICU messages, RTL support.

---

## 13. Risks & open questions

1. **Regulatory** — healthcare bookings imply medical-secret rules (HDS hosting in FR). Defer healthcare to phase 3, or partner.
2. **Two-sided cold-start** — without pros, no users; without users, no pros. Plan: launch one city at a time (e.g. Tunis-Lac, then Paris-11e), sign 30 anchor salons, then push consumer acquisition.
3. **Trust in Tunisia online payment** — many users still prefer cash on arrival. Make pre-payment optional except for high no-show services.
4. **Localisation of SMS senders** — Tunisian aggregator + sender-ID registration takes weeks; start early.
5. **App-store review** — Apple is strict on payments in-app: bookings paid externally are fine, but in-app purchases would require IAP. Keep payment flow web-based or Stripe-redirect for v1.

---

## 14. Decisions needed before building

- [ ] Confirm **vertical for MVP** (coiffeur/barber, or beauty-broad, or generalist).
- [ ] Confirm **first city** (Tunis? Paris? Both in parallel?).
- [ ] Confirm **pricing tiers** (numbers above are placeholders).
- [ ] **Commission vs. sub-only** — which mix?
- [ ] Brand name + custom-domain strategy.
- [ ] Native marketplace at MVP, or "mini-sites only" first?
