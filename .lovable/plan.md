# App info for the X developer console

That screen is X asking for details about *your* app before it will let you turn on "Read and write". Four of the fields are required, and two of them (Terms of Service, Privacy Policy) become required the moment "Request email from users" is ticked. Crosspost doesn't have those pages yet, so this adds them and then tells each person exactly what to paste.

## What to enter today

- App permissions: **Read and write**
- Type of App: **Web App, Automated App or Bot**
- Callback URI / Redirect URL: `https://tweet.mikedemo.dev/x-callback`
- Website URL: `https://tweet.mikedemo.dev`
- Terms of Service: `https://tweet.mikedemo.dev/terms`
- Privacy Policy: `https://tweet.mikedemo.dev/privacy`

Note: Crosspost never runs X's sign-in redirect — it posts with the Access Token and Secret you generate yourself — so the callback address is only there to satisfy the form. You can also untick "Request email from users"; Crosspost doesn't use it.

## What gets built

**Two new pages**

- `/terms` — plain-language terms for Crosspost: what the service does, that you bring your own X developer account and your own tweet.app account, that you stay responsible for the X Developer Terms, the X Terms of Service and the tweet.app Terms of Service, no warranty, and that either side can stop at any time.
- `/privacy` — what's stored (your email, the tweet.app handle you watch, your posting settings, a record of posts already sent) and that your four X keys are encrypted and never sent back to a browser, plus who it's shared with (the backend host, X itself when a post goes out, hCaptcha on the sign-in form), how to delete keys and the account, and a contact address.

Both carry the same footer and disclaimer as the rest of the site, get their own page titles and descriptions, and join the sitemap. The licenses page stays as it is.

**A copy-and-paste panel on the keys screen**

Under "2. Your X developer keys", a short "What X asks you for" section listing the six values above, each with a one-tap copy button, and a line explaining the callback address is unused. It links straight to X's authentication-settings docs.

## What I need from you

Send me the Termageddon embed codes (or the policy URLs) for your other project's terms of service and privacy policy, and I'll use those exact policies on these two pages instead of writing new wording.

## Technical notes

- New routes `src/routes/terms.tsx` and `src/routes/privacy.tsx`, each with `head()` (title, description, `og:*`, self-referencing canonical + `og:url`) and a `WebPage` + `BreadcrumbList` JSON-LD builder added to `src/lib/structured-data.ts`.
- Add both URLs to `src/routes/sitemap[.]xml.ts`.
- Keys panel additions in `src/routes/_authenticated/app.tsx` using `WaCallout`/`WaCopyButton` from the design system; values sourced from `SITE_URL` so they can't drift.
- No `/x-callback` route is needed — X never redirects there — but the URL must be a valid absolute https address for X to accept the form.
