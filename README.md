# GDPR-cookie-consent
GDPR cookie consent in Javascript. It effectively prevents setting cookies by third party scripts like ad or analytics snippets until an explicit consent is given.

# cm-head.js
Include this file before any other JS if possible, on your page(s). It will work even if you add it after some other scripts but won't be as effective as it could.

If you want to make script active for all visitors regardless of geolocation set activeForAll to true. Othervise it will try to detect visitors from EU countries.

# cm-body.js
Include this file before closing body tag.

If you need more details read this blog post: http://www.inforepublic.org/gdpr-cookie-consent-script-open-source/
