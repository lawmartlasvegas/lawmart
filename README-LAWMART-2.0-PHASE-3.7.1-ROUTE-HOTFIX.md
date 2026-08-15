# LawMart 2.0 Phase 3.7.1 - Route Hotfix

This hotfix preserves Phase 3.7 and adds an explicit `.nojekyll` marker so GitHub Pages serves the static directory structure exactly as packaged.

Verified clean routes:
- `/divorce/` -> `divorce/index.html`
- `/wills-trusts/` -> `wills-trusts/index.html`

Compatibility routes remain:
- `/divorce-document-preparation/`
- `/estate-planning/`

No analytics, Cal.com, Stripe, Formspree, favicon, styling, or pricing behavior was changed.
