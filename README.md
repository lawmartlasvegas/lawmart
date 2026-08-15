# LawMart website — production deployment

Current production package for lawmartlasvegas.com.

## Clean URLs
- `/divorce/` — divorce document preparation
- `/wills-trusts/` — wills and trusts document preparation
- `/record-sealing/`
- `/immigration-document-preparation/`
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
