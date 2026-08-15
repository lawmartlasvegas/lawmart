# Formspree lead delivery

The consultation forms are connected to:

    https://formspree.io/f/xkodalqz

## What happens

- English LawMart and Portuguese Imigração Brasileira forms submit directly to Formspree.
- Phone and email are required.
- Successful submissions redirect to `/thank-you/`.
- GA4 records `generate_lead` only after Formspree accepts the submission.
- If Formspree is unavailable, the existing email-app fallback remains available.

## Formspree dashboard

Confirm the endpoint notification email and complete any Formspree verification email. One endpoint receives both brands; the `_subject` field identifies LawMart versus Imigração Brasileira leads.
