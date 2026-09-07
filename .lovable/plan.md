# Nicer menu using Web Awesome dropdown items

Rebuild the header menu so it uses the design system's dropdown the way Web Awesome intends: real links with icons, grouped sections, and dividers — instead of the current flat value-based list.

## What changes for visitors

- The Menu button becomes a proper menu with three grouped sections:
  - Account: Log in, Register
  - Site: Home, Changelog
  - Legal: Terms of Service, Privacy Policy, Licenses
- Each item shows its icon and is a real link (right-click, open-in-new-tab, and keyboard use all work).
- Thin dividers separate the groups; a small label heads each group.
- Pages still load instantly (no full page reload) and still preload when the menu opens.
- Everything else on the page stays the same.

## Technical notes

Rewrite `src/components/site-nav.tsx`:

- Items become `<WaDropdownItem href="/changelog">` with `<WaIcon slot="icon" ...>`, matching the documented Web Awesome pattern. Auth items keep their `?mode=signin` / `?mode=signup` hrefs.
- Keep the existing `wa-select` listener, but read the item's `href` instead of a `value`, call `event.preventDefault()`, and route through `navigate({ to, search })` so navigation stays client-side. The `href` remains for accessibility and middle-click.
- Insert `<wa-divider>` between the three groups and small group headings rendered with design-system typography tokens only.
- Keep the existing `wa-show` preload behavior, extended to all listed routes.
- Trigger button stays `<WaButton slot="trigger" appearance="outlined" size="s" with-caret>`; no new styling values, tokens only.

No other files change.
