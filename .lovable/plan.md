# Crosspost mark: repeat arrows with a bird

Rebuild the site mark to match the icon you made in the Icon Wizard: the square "repeat" arrows with a small bird centred inside. Use it in the header next to the Crosspost name, and as the browser tab icon.

## What changes

- A small reusable brand mark that layers the two Font Awesome Free icons the wizard used — the repeat arrows and the dove — with the bird centred and scaled down inside the loop, matching the attached screenshot.
- The header replaces the plain repeat arrow with this mark, at the same size as today.
- The browser tab icon is regenerated from the same composed shape, so the tab and the header match.

## What I need from you

Nothing — the wizard's download is paywalled, so I'll recreate the composition from the same two free Font Awesome icons. Visually equivalent, since both pieces come from the same library.

## Technical notes

- New `src/components/brand-mark.tsx`: a positioned wrapper around two `WaIcon`s (`repeat`, `dove`) using design-system spacing/size tokens only; the mark inherits `currentColor` and `font-size`, so no colour values are introduced.
- `src/components/site-nav.tsx` swaps its single `<WaIcon name="repeat" />` for `<BrandMark />`.
- `public/favicon.png` is regenerated at 64x64 from the pinned Font Awesome Free SVGs composed the same way; the existing `<link rel="icon">` in `src/routes/__root.tsx` already points at it, so no route change is needed.
- No design-system files are edited.
