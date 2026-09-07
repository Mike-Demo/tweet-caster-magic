# Make Crosspost faster for people and search engines

The last search review passed every check — titles, descriptions, share images, structured data, sitemap, crawler rules and Search Console are all in good shape. So this plan is about the remaining wins: speed, small navigation niceties, and a couple of gaps the review doesn't test. Plus a new changelog entry covering it.

## Speed

- Tell the browser up front where the design-system stylesheets and icon fonts come from, so those connections are opened while the page is still parsing instead of after.
- Start loading the next page as soon as someone hovers or taps a menu link, so Terms, Privacy, Changelog and Licenses feel instant.
- Give the icon and share images a long browser cache so repeat visits don't re-download them.

## Small things people will notice

- A "Skip to content" link for keyboard users, hidden until it's focused.
- A friendly page for addresses that don't exist, with links back to the main pages, instead of a bare fallback.
- Each page's main area marked up as the page's main content (one per page), which helps both screen readers and search engines.

## Search-engine gaps the review doesn't cover

- The signed-in dashboard is blocked in the crawler file but carries no "don't index" tag; add one so a stray link can't put it in results.
- Publish a short `/llms.txt` describing the site and listing only the public pages, for AI assistants that look for one.
- Add the changelog's dated entries to its structured data so search engines can read the update history.

## Changelog

A new entry dated today, "Faster pages and a few polish items", covering: system light/dark by default with the logo adapting, the appearance and server-rendered switches in the footer, faster page-to-page navigation, the skip link and not-found page, and the Google sign-in fix.

## Technical notes

- `src/routes/__root.tsx`: add `preconnect`/`dns-prefetch` links for `cdn.jsdelivr.net`; add the skip-link target and skip link in the shell.
- `src/router.tsx`: set `defaultPreload: "intent"` (keeping `defaultPreloadStaleTime`).
- `src/components/site-nav.tsx`: nav links become router `Link`s where they aren't already, so preload-on-intent applies.
- New `src/routes/$.tsx` catch-all not-found route with `noindex` metadata and links to the public pages.
- `src/routes/_authenticated/app.tsx`: add `{ name: "robots", content: "noindex, nofollow" }`.
- New `public/llms.txt` listing `/`, `/changelog`, `/terms`, `/privacy`, `/licenses` only — never `/app` or auth paths.
- `src/routes/changelog.tsx`: extend its JSON-LD with the entry list; add the new entry to `ENTRIES`.
- Caching headers for static assets via the existing Cloudflare config, no new dependencies.

## Not included

- Rewriting page content for keywords, or new marketing pages — the content review found no gaps, and the site's audience is people who already know what tweet.app is.
- Shrinking the design-system JavaScript bundle: it ships as one vendor file by design, and splitting it is the design system's call, not this app's.
