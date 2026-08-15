# LawMart 2.0 Phase 3.5 — Production Analytics Cleanup

Phase 3.5 promotes the working Phase 3.4 Cal.com embed integration to the production tracking configuration.

## Changes

- Removed the visible Cal.com diagnostic panel and wildcard event listeners.
- Preserved the working namespaced `bookingSuccessfulV2` listeners for both appointment types.
- Preserved embedded Cal.com popup scheduling throughout LawMart and Imigração Brasileira.
- Normalized the in-person scheduling intent event to `cal_in_person_consultation`.
- Preserved `appointment_start` for scheduler opens and `appointment_booked` for successfully completed bookings.
- Preserved Formspree `generate_lead`, Stripe `begin_checkout`, and payment-success `purchase` tracking.
- No attendee name, email address, phone number, or other booking PII is sent to GA4 by the appointment completion listener.
- Cache-busted the active production scripts to `script-phase35.js`.

## Google Ads conversion recommendation

Use `generate_lead` and `appointment_booked` as primary conversion candidates after verification in GA4. Use `purchase` after a successful Stripe payment has been observed. Keep `appointment_start` and `begin_checkout` as secondary/diagnostic events rather than primary conversions.
