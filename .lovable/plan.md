# Security section: where your keys live

A plain-English page explaining how Crosspost stores the X keys and the tweet.app token, plus a short summary of the same on the home page. GitHub backup is skipped for now.

## What people will see

**New guide: Security (`/docs/security`)** — a fifth tab alongside Setup, Posting, Tokens & keys and Troubleshooting, covering:

- **What is stored** — the four X values, the tweet.app access token, the watched username and posting preferences, and the record of posts already sent.
- **Where it is stored** — an encrypted database that only Crosspost's own server code can reach, hosted on Lovable Cloud.
- **How it is protected** — each secret is scrambled with a key held only on the server, so even a database copy is unreadable without it. No browser can read the secrets back — not the owner's, not anyone's. The dashboard only ever shows a short hint and a connected badge.
- **Who can use them** — only the server code that publishes on the owner's behalf, and only for that person's own account. Per-account rules block every other path.
- **How they travel** — everything is sent over an encrypted connection; keys never pass through the browser after they are saved.
- **Sign-in protection** — email confirmation, an authenticator app code at sign-in, and a bot check on the sign-in and register forms.
- **How to remove them** — Clear keys and Clear token delete them immediately; revoking or regenerating in X or tweet.app cuts access instantly regardless.
- **What Crosspost does not do** — no sharing or selling data, no shared X account, no reading of anything beyond the watched account's posts.
- **Reporting a problem** — how to get in touch about a suspected issue.
- **Further reading** — links to Lovable's own security and cloud documentation (docs.lovable.dev security, Lovable Cloud, and the Lovable trust page), plus cross-links to Tokens & keys and the Privacy Policy.

**Home page** — a short "Your keys stay yours" block near the existing status area: three or four lines (encrypted, server-only, deletable at any time) with a link through to the full Security page.

## Wiring

- Add "Security" to the docs tab strip and to the Resources group in the menu.
- Add `/docs/security` to the sitemap and to `public/llms.txt`.
- Add a dated changelog entry noting the new security page.

## Technical notes

- New route `src/routes/docs.security.tsx`, matching the structure and metadata pattern of the other docs routes (title, description, og tags, canonical, `pageJsonLd`).
- Content is descriptive only — no changes to `crypto.server.ts`, the credential tables, RLS policies, or any server function. Purely presentational.
- Uses existing Web Awesome components (`WaCard`, `WaCallout`, `WaIcon`) and `--wa-*` tokens only.
- Updated files: `src/routes/docs.tsx` (tab), `src/components/site-nav.tsx` (menu), `src/routes/index.tsx` (summary block), `src/routes/sitemap[.]xml.ts`, `public/llms.txt`, `src/routes/changelog.tsx`.
- No implementation details of the encryption scheme (algorithm names, key variable names, table names) are published — the page describes behaviour, not internals.

## Not included

GitHub backup and the repository link — to be done later from the editor's GitHub connect flow.
