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
