# Structured data for search engines

Right now no page carries machine-readable "schema" markup, so search engines have to guess what Crosspost is, who runs it, and what the licenses page contains. Adding it helps Google and AI answer engines describe the site correctly — and it's also the standard way to state, in machine-readable form, that the service is independent and what terms apply.

## What gets added

**Home page**
- A schema.org `WebApplication` entry: name Crosspost, what it does, that it runs in any modern web browser, its price (free to use, people bring their own accounts), and a link to the licenses page.
- An organisation/publisher entry for MikeDemo with the site's social profiles, matching the footer links.
- Explicit "not affiliated with" wording carried into the description, plus links out to the X Developer Terms, X Terms of Service and tweet.app Terms of Service as the governing terms.

**Licenses page**
- A page entry describing it as the open-source credits and license page, with the license names it lists.

**Every page**
- A breadcrumb trail so search results can show Home › Licenses instead of a bare URL.

## Honest limits

Schema markup is a description, not a legal notice — it does not replace the visible disclaimer, and search engines may or may not display any of it. There is no schema.org type that means "disclaimer"; the closest honest options are the terms-of-service links and a plain-language description, which is what this plan uses. Rich results are never guaranteed.

## Technical notes

- Add JSON-LD via each route's `head()` `scripts` entry (TanStack Router), never a client-side injection: `scripts: [{ type: "application/ld+json", children: JSON.stringify(...) }]`.
- Home (`src/routes/index.tsx`): `@graph` with `SoftwareApplication` (applicationCategory `BusinessApplication`, `offers` price 0), `Organization` with `sameAs` for LinkedIn / X / Threads / tweet.app, `WebSite`, and `termsOfService` URLs.
- Licenses (`src/routes/licenses.tsx`): `WebPage` + `BreadcrumbList`.
- Absolute URLs use `https://tweet.mikedemo.dev` (the live custom domain) so the markup validates.
- The dashboard (`/app`) is disallowed in robots.txt and gets no markup.
- No visible UI changes; the existing footer disclaimer stays exactly as it is.
