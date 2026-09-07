# Footer controls: appearance and pre-rendered mode

Two small switches in the footer, on every page: light/dark appearance, and the design system's server-rendered ("SSR") mode.

## What you get

**Appearance switch**
- Sun/moon switch in the footer flips the whole site between light and dark.
- The choice is remembered on that device, and first-time visitors follow their system setting.
- Applied before the page paints, so there's no white flash on a dark-mode reload.

**Pre-rendered mode switch**
- A second, clearly-labelled switch turns on the design system's server-rendered mode.
- With it on, page pieces stay hidden until they're fully ready instead of flashing in half-styled — smoother on a slow connection.
- Off by default, remembered per device, with one line of help text next to it saying what it does.

## Honest limits of the "SSR" part

The design system ships two things under that name:

1. A hydration-aware startup mode (`<WebAwesomeLoader hydrate />`), which is what the switch turns on. This works on this site today.
2. True shadow-DOM pre-rendering, which renders component internals into the HTML on the server. That part needs extra packages and a Node server; this app runs on Cloudflare's edge runtime, and the renderer only accepts HTML strings, not the React pages this site is built from. So it is not being switched on, and the plan does not pretend otherwise.

With mode 1 alone, elements that were not pre-rendered are hidden until their code loads — the trade is "briefly blank" instead of "briefly unstyled". That is why it's a switch rather than a silent default.

## Technical notes

- New `src/components/appearance-controls.tsx`: two `WaSwitch` controls in a `wa-cluster`, rendered inside `AppFooter` so they appear on every page that uses it (home, dashboard, changelog, terms, privacy, licenses).
- New `src/lib/client-preferences.ts`: read/write `crosspost:appearance` and `crosspost:wa-ssr` in `localStorage`, plus a `matchMedia` fallback for appearance. All reads happen in `useEffect` (no reads at module scope or in `useState` initializers) to avoid hydration mismatch.
- Appearance toggling swaps `wa-light`/`wa-dark` on `<html>`; the base classes stay from `WEB_AWESOME_HTML_CLASSES` in `src/routes/__root.tsx`. A tiny inline script in the root shell head applies the stored class before first paint.
- The SSR switch sets state that decides `<WebAwesomeLoader hydrate />` vs `<WebAwesomeLoader />`. The loader registers elements once per document, so changing the switch stores the preference and reloads the page to apply it — no attempt to swap bundles live.
- Loader placement stays where it is (inside routed page content, per the design system's own guidance); the pages that render it pass the flag from the stored preference.
- No new dependencies; styling uses only `--wa-*` tokens and `wa-*` utilities.

## Out of scope

- Installing `@awesome.me/webawesome` + Lit SSR to do true declarative-shadow-DOM rendering. If you want that explored, it would mean rendering fixed blocks of markup on the server and would need its own investigation on the edge runtime.
