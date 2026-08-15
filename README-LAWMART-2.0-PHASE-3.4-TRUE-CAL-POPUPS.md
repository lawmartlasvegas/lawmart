# LawMart 2.0 Phase 3.4 — True Cal.com Popup Embeds

- Consultation links no longer navigate away from LawMart during normal operation.
- Existing `data-cal-link`/`data-cal-namespace` triggers open Cal.com modal embeds.
- Direct Cal.com URLs are retained as fallback metadata if the embed script fails to load.
- Each Cal namespace is preloaded for faster popup opening.
- `bookingSuccessfulV2` is now listened for on the matching Cal.com namespace, as required by Cal.com for namespaced embeds.
- Successful bookings send `appointment_booked` to GA4 without attendee PII.
- Phase 3.3 diagnostics remain available with `?cal_debug=1`.
