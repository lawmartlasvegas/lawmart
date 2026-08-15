# LawMart Google Ads Launch Package

## Installed
- Google Analytics 4: `G-43CBCXFRX3`
- Campaign attribution capture for UTM parameters, `gclid`, `gbraid`, and `wbraid`
- GA4 events for phone, email, WhatsApp, CTA, outbound-link, form-start, form-error, lead-submit, online lead completion, and scroll depth
- Service attribution for Divorce, Immigration, Wills & Trusts, and Record Sealing pages
- Existing service-specific pages retained as Google Ads landing pages
- English and Portuguese lead tracking
- Optional future Google Ads direct conversion hook

## Recommended landing-page URLs
- Divorce: `https://lawmartlasvegas.com/divorce/`
- Immigration: `https://lawmartlasvegas.com/immigration-document-preparation/`
- Wills & Trusts: `https://lawmartlasvegas.com/wills-trusts/`
- Record sealing: `https://lawmartlasvegas.com/record-sealing/`
- Brazilian immigration: `https://lawmartlasvegas.com/imigracao-brasileira/`

## GA4 events to mark as key events
In Google Analytics, go to Admin > Events / Key events and mark these as appropriate:
- `phone_click`
- `lead_submit`
- `email_lead_intent`
- `generate_lead` (only fires after successful online form delivery)
- `whatsapp_click` (primarily Portuguese pages)

Because the current form opens the visitor's email program when no form endpoint is configured, `email_lead_intent` and `lead_submit` represent intent, not confirmed email delivery. For confirmed online submissions, add a Formspree or other form endpoint to `FORM_ENDPOINT` in `site-config.js`.

## Connecting Google Ads
1. In GA4, link the Google Ads account under Admin > Product links > Google Ads Links.
2. In Google Ads, import the chosen GA4 key events under Goals > Conversions.
3. Use one primary conversion for bidding at first, preferably confirmed `generate_lead` after an online form endpoint is configured. Phone clicks can be a secondary conversion until call reporting is configured.
4. Do not fill `GOOGLE_ADS_SEND_TO` unless Google Ads gives you a conversion value in the format `AW-XXXXXXXXX/label`. GA4 import is simpler for the initial launch.

## Upload
Extract the ZIP and upload all files and folders to the root of the GitHub repository, replacing existing files. Keep the `CNAME` file.
