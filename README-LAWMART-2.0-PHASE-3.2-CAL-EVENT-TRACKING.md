# LawMart 2.0 Phase 3.2 — Cal.com Event Tracking

Phase 3.2 removes the need for a paid Cal.com redirect feature.

## Change
- LawMart and Imigração Brasileira now listen for Cal.com embed event `bookingSuccessfulV2`.
- A successful embedded booking sends GA4 event `appointment_booked`.
- `appointment_type` is classified as `free_phone`, `in_person`, or `appointment`.
- In-person bookings include USD 50 as the event value.
- No attendee name, email address, phone number, or other attendee PII is sent to GA4.
- The `/booking-success/` page remains only as an optional fallback and is not required.

## Test
1. Upload this release to GitHub Pages.
2. Open LawMart in an incognito/private window.
3. Book a free phone consultation through the embedded Cal.com popup.
4. In GA4 Realtime, confirm `appointment_booked` appears.
5. `appointment_start` should also appear when opening the scheduler.

Stripe `/payment-success/` purchase tracking is unchanged.
