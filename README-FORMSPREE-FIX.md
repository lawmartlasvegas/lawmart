# Formspree Spam Fix

This release removes the `_gotcha` honeypot field that caused legitimate submissions to be classified as spam by Formspree.

## Included improvements

- Removed `_gotcha` from all seven consultation forms.
- Preserved the Formspree endpoint: `https://formspree.io/f/xkodalqz`.
- Added the originating page URL, page title, service/brand, referrer, submission timestamp, and available UTM / Google Ads click identifiers to each submission.
- Disabled the submit button while a request is being sent to reduce duplicate submissions.
- Added clearer English and Portuguese submission-status messages.
- Preserved the email-app fallback if Formspree is temporarily unavailable.
- GA4 `generate_lead` fires only after Formspree accepts the submission.

## Deploy

Upload every file and folder in this package to the root of the GitHub Pages repository, replacing the current website files.

After deployment, submit one English and one Portuguese test lead. Both should appear under Formspree **Submissions**, not **Spam**.
