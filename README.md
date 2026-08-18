# LawMart website — production deployment

Current production package for lawmartlasvegas.com.

## Clean URLs
- `/divorce/` — divorce document preparation
- `/wills-trusts/` — wills and trusts document preparation
- `/record-sealing/`
- `/immigration/`
- `/imigracao-brasileira/`
- `/pricing/`
- `/resources/`

Compatibility pages remain for older URLs such as `/divorce-document-preparation/` and `/estate-planning/`.

## Integrations
- GA4 conversion/event tracking
- Cal.com embedded booking popups
- Stripe payment links and success tracking
- Formspree lead forms

## Deployment
Upload the contents of this ZIP to the root of the GitHub Pages repository. Preserve folders exactly, including `wills-trusts/index.html` and `divorce/index.html`.

`.nojekyll` is intentionally included so GitHub Pages serves the site as static files.


## Phase 3.9 updates
- Immigration canonical URL: `/immigration/`; old `/immigration-document-preparation/` route redirects for compatibility.
- Homepage service information areas are now large Learn More targets.
- Divorce, Record Sealing, and Wills & Trusts $500 prices are direct Stripe payment buttons labeled Pay now to get started.
- Immigration remains consultation-first because online checkout has not been enabled for immigration services.

## Phase 3.10 updates
- Reuses the existing GA4 Google tag (`G-43CBCXFRX3`) instead of installing a duplicate base tag.
- Connects the existing Google tag to Google Ads account tag `AW-18347713352`.
- Adds Google Ads website-call forwarding configuration for `(702) 900-1003` using the Google-provided phone conversion configuration.
- Keeps existing GA4 events, Cal.com booking tracking, Stripe success tracking, and Formspree lead tracking intact.


## Phase 3.11 updates

- Expanded the `/divorce/` pricing section into a four-part cost breakdown: LawMart flat fee, court filing fee, optional process-server cost, and publication cost where applicable.
- Clarified that a court fee waiver may be requested from the court and that third-party service/publication costs vary.
- Added the Las Vegas office/location section from the homepage to the divorce landing page.
- Added a $50 in-person appointment option and clarified that the full $50 is credited toward the $500 divorce document-preparation fee if the client proceeds.


## Phase 3.14 updates

- Replaces the divorce pricing summary estimate with the full Ready to Move Forward payment CTA.
- Integrates that CTA into the bottom of the existing divorce pricing shell with the navy/white/gold treatment.
- Removes the duplicate standalone divorce payment section and removes the About $800 estimate.
