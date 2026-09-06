# Extra callback addresses for the X form

X lets you list more than one callback address. Besides your main one, Crosspost is reachable at two other addresses, so both can be listed as backups.

## The addresses

- Main: `https://tweet.mikedemo.dev/x-callback`
- Published backup: `https://tweet-caster-magic.lovable.app/x-callback`
- Preview backup: `https://id-preview--9af6c804-3537-478f-8b30-c6cbb1e1029e.lovable.app/x-callback`

As before, Crosspost never actually sends anyone through X's sign-in redirect — you paste your own keys — so these addresses only exist to satisfy X's form.

## What changes

On the keys screen, the "What X asks you for" list gains two extra rows under the callback line: "Callback URI (backup)" and "Callback URI (preview)", each with its own one-tap copy button, plus a short note that X accepts several callback addresses and that none of them are used for posting.

Nothing else on the screen changes, and no new page is added — X never sends a visitor to these addresses.

## Technical notes

- Edit the copy-and-paste list in `src/routes/_authenticated/app.tsx`.
- Add `PUBLISHED_URL` and `PREVIEW_URL` constants next to `SITE_URL` in `src/lib/structured-data.ts` so the values live in one place; canonical/OG tags keep using `SITE_URL` only.
- No sitemap, robots, or structured-data changes.
