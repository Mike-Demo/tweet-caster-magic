# AGENTS.md — Crosspost (tweet-caster-magic)

Instructions for AI coding agents working in this repository.

## What this is

Crosspost watches a tweet.app account and reposts new posts to X, automatically or after a quick review, using each person's own X developer keys. Live at https://tweet.mikedemo.dev. This is a Lovable Cloud project; the production branch is `main`.

## Stack

- TanStack Start + TanStack Router (file-based routing under `src/routes/`)
- React 19 + TypeScript, TanStack Query, Zod
- Supabase (auth + database) via `@/integrations/supabase`
- Deployed on Lovable Cloud (Cloudflare). GitHub pushes do **not** auto-deploy — publishing happens in the Lovable editor.

## Conventions

- Routes live in `src/routes/`; `__root.tsx` owns the document head (meta, CSP, fonts).
- Shared JSON-LD builders live in `src/lib/structured-data.ts` — reuse `pageJsonLd()` for new public pages.
- Public static files live in `public/` (llms.txt, robots.txt, carbon.txt, markdown twins).
- Markdown twins: every content page should have a `.md` twin in `public/` mirroring its path (e.g. `/docs/setup` → `public/docs/setup.md`), with frontmatter (title, description, canonical, last-updated) and a heading-led body. `auth.md` is the exception: it leads with a top-level heading and carries no frontmatter.
- `public/_headers` controls cache headers for static assets.
- Never rewrite published Git history.

## Security rules

- Never log, print, or commit secrets, API keys, tokens, or credentials.
- The `supabase/` directory holds migrations — review carefully; never apply destructive migrations without asking.
- The `/api/public/hooks/auto-post` route is a secured internal cron webhook (bearer job secret). Do not expose it as a public API and do not document it as one.

## Checks before pushing

- `bun run build` must pass.
- `bunx tsc --noEmit` should be clean on changed files.
