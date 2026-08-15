# LawMart 2.0 Phase 3 - Conversion Measurement & Ads Readiness

This release adds GA4/Google Ads-ready measurement without treating ordinary clicks as completed conversions.

## Events
- `generate_lead`: fires only after Formspree confirms a successful website form submission.
- `appointment_start`: visitor opens a Cal.com scheduler. Secondary/diagnostic event.
- `appointment_booked`: Cal.com embed reports `bookingSuccessful`. Intended primary conversion after live verification.
- `begin_checkout`: visitor leaves for a $500 Stripe Payment Link. Secondary/diagnostic event.
- `purchase`: fires on the LawMart payment-success page when a recognized service query parameter is present. Intended primary/value conversion after Stripe redirect setup and live verification.
- `phone_click`: phone-number click. Keep secondary initially unless call-quality measurement is added.

No form names, emails, phone numbers, appointment attendee data, or other PII are intentionally sent to GA4.

## Stripe: one remaining dashboard step
After uploading this release, edit each Stripe Payment Link's after-payment behavior to redirect to:
- Divorce: https://lawmartlasvegas.com/payment-success/?service=divorce
- Wills & Trusts: https://lawmartlasvegas.com/payment-success/?service=estate_planning
- Record sealing: https://lawmartlasvegas.com/payment-success/?service=record_sealing

Do not mark `begin_checkout` as a primary Google Ads conversion. A click is not a sale.

## GA4 verification
After deployment, use GA4 Realtime/DebugView to test:
1. successful Formspree submission -> `generate_lead`
2. opening a Cal.com event -> `appointment_start`
3. completing a Cal.com booking -> `appointment_booked`
4. clicking a $500 Stripe link -> `begin_checkout`
5. completing a Stripe payment with the redirect configured -> `purchase`

Only after each completed event is verified should `generate_lead`, `appointment_booked`, and `purchase` be marked as key events / imported as Google Ads conversions. Keep intent/click events secondary.
