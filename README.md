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
