# LawMart Phase 3 Release

Complete GitHub Pages replacement package.

## Included
- Phase 1 homepage and Phase 2 service pages
- Resource center and three educational guides
- Privacy and thank-you pages
- Google Business/Profile link integration
- Optional booking, Formspree-style form endpoint, and GA4 configuration
- Event tracking hooks, enhanced schema, sitemap, robots, manifest, 404 page
- Scroll progress, refined motion, and performance/accessibility improvements

## Upload
Upload **all files and folders in this directory** to the root of the GitHub repository. Keep Pages set to `main` and `/(root)`.

## Activate integrations
Edit `site-config.js`:
- `GA4_MEASUREMENT_ID`: add a value such as `G-XXXXXXXXXX`. Leave blank to disable analytics.
- `GOOGLE_BUSINESS_URL`: replace with the exact LawMart Google Business Profile URL when available.
- `BOOKING_URL`: add a Calendly or other scheduling URL. Leave blank to use the on-page contact flow.
- `FORM_ENDPOINT`: add a Formspree or compatible endpoint. Leave blank to retain the email-application fallback.

No fabricated reviews, client counts, awards, or business credentials are included. Add only claims that can be substantiated.

## Imigração Brasileira — Phase 1

This release adds a standalone Portuguese-language landing page at:

`/imigracao-brasileira/`

Included: custom Brazilian DBA branding, Portuguese conversion copy, dedicated CSS/JS, responsive layout, WhatsApp link, lead form, Portuguese FAQ, legal disclaimers, structured data, and sitemap entry.

Before publishing, confirm that `(702) 900-1003` is enabled for WhatsApp. The form currently opens the visitor's email app, matching the existing no-backend deployment approach.
