# Wedding & Honeymoon Planner — Features

Mobile-only app (designed for phone screens, portrait, touch-first).
Two top-level sections: **Wedding** and **Honeymoon**, switchable from a bottom tab bar.

---

## 1. Onboarding & Setup
- Couple names, wedding date, ceremony city/venue.
- Total wedding budget (currency).
- Honeymoon destination (optional at start), start/end dates.
- Saves locally on the phone (no account needed for v1).

## 2. Home / Dashboard (per section)
- Countdown to wedding day and to honeymoon departure.
- Budget used vs. remaining (progress bar).
- Next 3 upcoming tasks.
- Quick-add button (floating action button) for task / expense / guest.

## 3. Wedding — Checklist & Timeline
- Pre-built task templates grouped by milestone (12mo / 6mo / 3mo / 1mo / week-of / day-of).
- Add custom tasks, set due date, assign to "me" / "partner" / "both".
- Mark complete, see progress per milestone.
- Reminders / local push notifications before due dates.

## 4. Wedding — Budget
- Categories (venue, catering, attire, photography, flowers, music, rings, transport, other).
- Per category: planned amount, actual paid, remaining.
- Add expense with amount, vendor, date, photo of receipt.
- Total overview with over/under-budget indicator.

## 5. Wedding — Guest List & RSVP
- Add guests with name, side (mine/partner/both), group (family/friends/work), phone/email.
- RSVP status: pending / yes / no / maybe.
- Plus-one and dietary notes per guest.
- Counts: invited / confirmed / declined.
- Share invite link via native share sheet (deep link or text template for v1).

## 6. Wedding — Seating Plan
- Create tables, set capacity.
- Drag guests onto tables (touch-friendly).
- Warnings for over-capacity or unseated guests.

## 7. Wedding — Vendors
- Vendor cards: name, category, contact, contract amount, deposit paid, balance due, next meeting date.
- Tap to call / email / open map.
- Attach photos of contracts.

## 8. Wedding — Inspiration Board
- Save images from camera roll or pasted URLs.
- Tag by category (dress, decor, cake, hair...).
- Pinch-to-zoom gallery.

## 9. Honeymoon — Trip Overview
- Destination(s), dates, traveler count.
- Total trip budget vs. spent.
- Countdown.

## 10. Honeymoon — Itinerary (Day-by-Day)
- Day cards with date and location.
- Add activities with time, title, location, notes, cost.
- Reorder activities within a day (drag handle).
- Day notes (weather expected, dress code, etc.).

## 11. Reservations (Flights, Hotels, Transfers, Tours, Restaurants)
Used by both Wedding (guest hotels, transport) and Honeymoon (trip bookings).

### 11a. Flights ✈️
- Airline, flight number, departure airport + time, arrival airport + time.
- Booking reference (PNR), seat, class, baggage allowance.
- Cost, currency, paid / unpaid.
- Attach e-ticket PDF or boarding pass photo.
- Reminders: check-in opens (24h before), 3h before departure.
- Round-trip linked as one trip with outbound + return legs.

### 11b. Hotels 🏨
- Hotel name, address (map link), check-in / check-out dates and times.
- Confirmation number, room type, number of guests.
- Cost per night and total, currency, paid / unpaid.
- Breakfast included? Free cancellation until date.
- Attach reservation PDF.
- Tap to call hotel / open in Maps.

### 11c. Other reservations
- Transfers (taxi, train, rental car), tours, restaurants, spa, activities.
- Each with date/time, location, confirmation, cost, attachment.

### 11d. Today / Next view
- Surfaces what's happening now and next: "Flight in 3h", "Check-in at 15:00".
- All reservations also appear in the Calendar (section 17).

## 17. Calendar 📅
- Unified calendar across Wedding tasks, vendor meetings, payments due, flights, hotels (check-in/out), reservations, honeymoon activities.
- Views: **Month**, **Week**, **Day** (swipe to switch).
- Color-coded by type (wedding / honeymoon / flight / hotel / reservation / payment).
- Tap a day to see all items for that day.
- Tap an item to open its detail screen.
- Filter chips: show/hide categories.
- "Today" button to jump back.
- Sync to phone's native calendar (iOS Calendar / Google Calendar) — optional, one-way export.

## 12. Honeymoon — Packing List
- Pre-built lists by trip type (beach, city, ski, mixed).
- Check off items; progress bar.
- Add custom items; "needs to buy" flag.

## 13. Honeymoon — Documents
- Passport expiry tracker (warn if <6 months from trip end).
- Visa, vaccination, insurance notes.
- Photo upload for each document, locally stored.

## 14. Honeymoon — Expenses on the Go
- Quick add expense with amount + category + optional photo.
- Multi-currency support: enter local currency, app converts at saved rate.
- Daily / category totals.

## 15. Shared between Wedding & Honeymoon
- Unified search across tasks, guests, vendors, bookings.
- Dark mode + light mode, follows system.
- Multi-currency settings.
- Export: PDF summary of guest list, budget, itinerary.
- Backup / restore: export a single `.json` file to share between devices.

## 18. Countdown Widget & Lock Screen
- Home-screen widget: days until wedding, days until honeymoon.
- Lock-screen widget (iOS) / glance (Android) with next event.
- Tap widget to open the relevant screen.

## 19. Gift Registry & Money Pool
- Add gift ideas with name, store, price, link, photo.
- Mark as "claimed by" a guest (private to you).
- "Cash fund" pool with goal amount and progress (e.g., honeymoon fund).
- Share a public registry link via native share sheet.

## 20. Music & Playlists 🎵
- Ceremony, cocktail, dinner, first dance, party playlists.
- Add songs with title, artist, duration, link (Spotify / Apple Music / YouTube).
- "Do NOT play" list to send the DJ.
- Total duration per moment vs. needed time.

## 21. Speeches & Vows
- Private notepad for vows, speech drafts.
- Versioning (auto-save history).
- Practice mode: large-text teleprompter with adjustable scroll speed.
- Lockable with Face ID / Touch ID (private from partner).

## 22. Photo & Video Plan
- Shot list for photographer (must-have moments + people groupings).
- Family combination list (e.g., "bride + both parents").
- Timeline of photo sessions with duration estimates.
- Share PDF with photographer.

## 23. Day-Of Timeline
- Minute-by-minute schedule of the wedding day.
- Roles: who needs to be where (bridal party, family, vendors).
- Share read-only link with vendors and party.
- Live "now" cursor that highlights the current item.

## 24. Vendor Payment Schedule
- Per vendor: deposit, milestone payments, final balance, due dates.
- Calendar reminders before each due date.
- Mark paid, attach receipt.
- Roll-up: total due this month / next month.

## 25. Travel Companion (Honeymoon)
- Offline maps for each destination (download before flying).
- Currency converter with daily rate cache.
- Local time + home time clock.
- Tipping guide per country.
- Emergency numbers per country.
- Useful phrases (greetings, allergies, taxi) — offline.

## 26. Trip Journal
- Daily entry while on honeymoon: text, photos, location, mood.
- Auto-generates a shareable trip recap (PDF/photo book layout).
- Private by default.

## 27. Weather
- 10-day forecast for wedding venue (highlights wedding day).
- Forecast per honeymoon day at the right city.
- Sunrise / sunset times (useful for photos).

## 28. Guest Communication
- Bulk message templates: save-the-date, invite, RSVP reminder, week-of info.
- Send via WhatsApp / SMS / email through the native share sheet.
- Personalize with `{firstName}` tokens.
- Track who has been sent what (locally).

## 29. Invite & Website Builder (lite)
- Pre-styled invitation card; fill in names / date / venue / RSVP link.
- Export as image to share on WhatsApp / Instagram.
- Optional: tiny one-page event site (hosted later) for guest info, dress code, map, hotel block.

## 30. Hotel Block for Guests (Wedding)
- Track room blocks at one or more hotels: hotel name, group code, rate, cutoff date.
- Track which guests booked.

## 31. Seat-of-the-Pants Notes & To-Do Capture
- Global "+" button on every screen.
- Quick capture: voice memo, photo, note → triage later into the right list.

## 32. Settings & Privacy
- Currency, language (EN / FR), date format.
- Theme: system / light / dark.
- App lock with Face ID / Touch ID / PIN.
- Backup to iCloud (iOS) / Google Drive (Android) — encrypted.
- Delete all data.

## 33. Localization
- French and English at launch (couple may travel internationally).
- All dates, currency, and number formats follow device locale.

## 16. Mobile-Only UX Principles
- Bottom tab bar: Home · Calendar · Wedding · Honeymoon · Settings.
- Large touch targets (44pt+).
- Swipe-to-complete on tasks; swipe-to-delete on lists.
- Native share sheet, camera, contacts picker.
- Offline-first; works without internet.

---

## Out of scope for v1
- Real-time collaboration with the partner across devices (planned for v2 with sync/account).
- Web/desktop layout.
- Payment processing.
- AI suggestions.

---

## Proposed tech (for after feature approval)
- **React Native + Expo** — single codebase, runs on your phone via Expo Go for testing, easy to ship to App Store / Play Store later.
- **Local storage**: SQLite (via `expo-sqlite`) for structured data, FileSystem for photos.
- **Notifications**: `expo-notifications`.
- **Navigation**: `expo-router` with bottom tabs.
