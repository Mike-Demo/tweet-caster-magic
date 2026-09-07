# Share images and app icons from the new mark

The site currently has only a single small tab icon, no home-screen icons, and no picture shown when a link is shared. This adds all of them, built from the same repeat-arrows-with-bird mark used in the header.

## What gets added

- App icons at 192px and 512px (plus a maskable 512px version with padding, so Android doesn't crop the mark), and a 180px Apple home-screen icon.
- A small web app manifest so the site can be added to a phone home screen with the right name ("Crosspost"), icons, and colours.
- A 1200x630 share card: the mark centred with the Crosspost name and a one-line description, on a plain light background, sized to stay well under the limits that stop previews rendering.
- The share card is attached to the Home, Terms, Privacy, and Licenses pages so links to any of them show the card. The private dashboard stays untagged.

All icons are drawn from the same two Font Awesome Free shapes as the header mark, with the bird in #1D9BF0 and the arrows in #000000, so tab, home screen, and share card all match.

## Technical notes

- Compose the mark once as an SVG (retweet + centred, scaled dove), then rasterise with `magick` into `public/icon-192.png`, `public/icon-512.png`, `public/icon-512-maskable.png`, `public/apple-touch-icon.png`, and refresh `public/favicon.png`.
- Render the 1200x630 card as an SVG (mark + "Crosspost" wordmark + tagline) and rasterise to `public/og-cover.png`.
- New `public/manifest.webmanifest`: name, short_name, start_url `/`, display `standalone`, background/theme colour, and the icon entries with `purpose: "maskable"` on the padded one.
- `src/routes/__root.tsx` `head().links`: add `apple-touch-icon`, the manifest link, and the 192/512 icon entries alongside the existing favicon. No og tags at root.
- Add `{ property: "og:image", content: "https://tweet.mikedemo.dev/og-cover.png" }` and the matching `name: "twitter:image"` to the leaf `head()` of `src/routes/index.tsx`, `terms.tsx`, `privacy.tsx`, and `licenses.tsx`, keeping their existing per-page titles and canonicals.
- The share card only reaches the live URL on the next publish.
