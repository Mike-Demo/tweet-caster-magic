# Make Crosspost faster, plus a server-rendering option

Right now every page downloads one large component file (about 800 KB) before the buttons, cards and icons take their final shape. That is the single biggest slowdown, and it is what makes the page flicker on first load. This plan cuts that down, speeds up first paint, and adds a switch for the Web Awesome server-rendering mode.

## What changes for visitors

- Pages appear styled sooner and shift less while loading.
- The public pages (terms, privacy, licences, changelog) are pre-built at release time, so they arrive as finished pages instead of being assembled on each visit.
- Fonts, icons and the design-system stylesheets start loading earlier because the browser is told about those servers up front.
- The sign-in page keeps working exactly as today; nothing about typing, two-factor codes or the dashboard changes.

## One switch for how the design system loads

A single app setting picks one of three modes, so this is easy to change later without touching page code:

1. **Bundle** (today's behaviour) — everything ships with the app, works offline, largest first download.
2. **On demand** — the design system loads only the pieces a page actually uses, from its pinned official source. Much smaller first download; adds a dependency on that external source. Proposed default for the public pages.
3. **Server-rendered** — the pre-built markup already contains each component's finished shape, and the browser only wakes it up. Best appearance on first paint, but experimental: it needs extra packages, only works on pages built ahead of time, and icons still fill in once the browser connects.

Mode 3 is included and documented but stays off unless turned on, because the underlying support is marked experimental by the design system itself and cannot run on the live request path of the hosting we use.

## What I need from you

Nothing — I'll ship "on demand" as the default and leave the switch in place. Say the word if you'd rather keep everything bundled for offline reliability.

## Technical notes

- New `src/lib/webawesome-delivery.ts` exporting a `WA_DELIVERY` mode (`"bundle" | "cdn" | "ssr"`) plus a small `<DesignSystemLoader />` wrapper that maps the mode onto `<WebAwesomeLoader source hydrate />`. Every route swaps its bare `<WebAwesomeLoader />` for that wrapper; the design-system folder itself is not edited.
- `__root.tsx` head gains `preconnect`/`dns-prefetch` for the Web Awesome and Font Awesome CDNs and the backend origin, plus `rel="preload"` for the two design-system stylesheets already linked there.
- `vite.config.ts`: pass `pages: [{ path: "/terms" }, { path: "/privacy" }, { path: "/licenses" }, { path: "/changelog" }]` and `prerender: { enabled: true, autoStaticPathsDiscovery: false }` to `tanstackStart()`. `/` is excluded because its loader reads the captcha key at request time, and `/app` is per-user; `autoStaticPathsDiscovery: false` keeps them out.
- Route-level trimming: import Web Awesome wrappers from their direct module paths in the heaviest routes instead of the barrel, so the theme editor and unused patterns stay out of those chunks.
- `ssr` mode additionally sets `hydrate`, which flips the design system's own FOUC rule; producing declarative shadow DOM requires `webawesome/ssr/render.server` and the `@awesome.me/webawesome` + Lit SSR packages, so the mode is wired and documented but not enabled by default.
- Verification: typecheck, production build, confirm one static HTML file per prerendered route, and load `/` and `/changelog` to confirm no hydration warnings in the console.
