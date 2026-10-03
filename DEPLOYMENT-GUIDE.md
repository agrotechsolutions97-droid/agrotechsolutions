# Cloudflare Pages launch guide

## Before deployment

1. Purchase or decide your final domain name.
2. Create a Tally form with only Name, Phone, and a required consent checkbox. Configure its email notification to your business email.
3. Open PowerShell in this folder and run this command, replacing the values with your own:

```powershell
.\prepare-release.ps1 -Domain "www.example.in" -LegalBusinessName "Your legal business name" -PrivacyEmail "privacy@example.in" -RetentionPeriod "12 months" -TallyFormUrl "https://tally.so/r/your-form-id"
```

This completes the domain, privacy-policy, sitemap, robots, canonical URLs, and contact-form configuration consistently.

## Deploy

1. Create a Cloudflare account and enable two-factor authentication.
2. Create a Pages project and upload this folder as the deployment root.
3. Connect your custom domain in Pages. Wait until Cloudflare reports HTTPS as active.
4. In Cloudflare DNS, enable DNSSEC only after the domain resolves correctly.
5. Use the Pages deployment URL to test the site, then publish it to the custom domain.

## Required live tests

- Confirm the site opens only on HTTPS.
- Open `/404-test/` and confirm the branded 404 page appears.
- Confirm the enquiry button opens the correct Tally form and a test submission reaches the business email.
- Confirm WhatsApp, phone, email, sitemap, robots, Privacy Policy, and all navigation links work.
- Check the response headers in browser developer tools or an HTTP-header checker.

## Security operations

- Keep the Cloudflare and Tally accounts under business ownership, not a contractor's personal account.
- Give each person their own account; do not share passwords.
- Keep two-factor authentication enabled.
- Review Tally submissions monthly and delete enquiries after the retention period stated in the Privacy Policy.
- Roll back a faulty website update from Cloudflare Pages deployment history.
