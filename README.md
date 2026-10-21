# Custom design system (TanStack Start)

A deliberately bare [TanStack Start](https://tanstack.com/start) + React starter
for building a design system from scratch. No CSS framework, no component
library, no theme tokens — just a router, a blank page, and a plain-CSS reset.
Bring your own styling approach.

## What's (intentionally) not here

- No Tailwind, no PostCSS, no `components.json`
- No shadcn/ui or Radix primitives
- No theme tokens or design system — `src/styles.css` is a minimal reset

## Stack

- TanStack Start + TanStack Router (file-based routing under `src/routes/`)
- React 19 + TypeScript
- TanStack Query, Zod, Recharts, date-fns

## Develop

```sh
bun install
bun run dev
```

## Security audit triage — 2026-10-21

Parent: [Mike-Demo/tweet-caster-magic#1](https://github.com/Mike-Demo/tweet-caster-magic/issues/1).

The supplied audit used static source inspection only: no code was executed
and no deployed endpoint was probed. It reports **0 confirmed findings,
3 needs-validation leads, and 1 rejected candidate**. There are therefore no
confirmed findings to rank by severity, lower-trust reachability, or fix safety,
no confirmed root-cause groups, and no remediation issues to file.

Issue creation is unavailable in this session. The following Markdown is the
exact title and body for the single validation issue, ready to file in this
repository. No application fixes or deployment validation were performed.

### Issue title

`[security][needs-validation] Audit leads to validate`

### Issue body

Parent audit: [Mike-Demo/tweet-caster-magic#1](https://github.com/Mike-Demo/tweet-caster-magic/issues/1).

These are unconfirmed leads from the 2026-10-21 static-source audit, not
confirmed vulnerabilities. No severity is assigned. The checklist follows the
audit's order, not a risk ranking. Record deployment facts without disclosing
keys, tokens, or other credentials.

- [ ] **hCaptcha check is a standalone client-side gate not bound to Supabase Auth**
  - Fingerprint: `captcha-verification-not-bound-to-supabase-auth`
  - Audit evidence / claimed root cause: `verifyCaptcha` issues no token or
    server-side state consumed by `supabase.auth.signUp` or
    `signInWithPassword`, so the client-side gate alone does not enforce the
    anti-abuse control.
  - Exact missing fact: Whether the deployed Supabase project (project_id
    `xiniywqounmojcmprwxj` in `supabase/config.toml`) has CAPTCHA protection
    enabled in its Auth settings (Lovable-managed, not in repo). If enabled,
    Supabase itself defeats the bypass; if disabled, the standalone
    `verifyCaptcha` gate is fully bypassable as claimed.
- [ ] **hCaptcha falls back to the official always-pass test keys when HCAPTCHA environment variables are unset**
  - Fingerprint: `hcaptcha-official-test-key-fallback`
  - Audit evidence / claimed root cause: When `HCAPTCHA_SITE_KEY` or
    `HCAPTCHA_SECRET_KEY` is unset, the code substitutes the published
    always-pass hCaptcha test key pair instead of failing closed.
  - Exact missing fact: Whether the deployed environment actually sets
    `HCAPTCHA_SITE_KEY` and `HCAPTCHA_SECRET_KEY`. If either or both are unset
    in deployment, the corresponding always-pass test key is used; if
    production keys are set, the fallback never fires.
- [ ] **saveThemeDefaults server function has no authentication and writes caller-supplied CSS to a server file path**
  - Fingerprint: `save-theme-defaults-unauthenticated-server-file-write`
  - Audit evidence / claimed root cause: `saveThemeDefaults` lacks
    authentication middleware and relies solely on a
    `NODE_ENV !== 'production'` check in `writeBrandCss` before writing
    caller-supplied CSS to a server file path.
  - Exact missing fact: Two decisive deployment facts, both outside the repo:
    (1) the deployed worker's actual `NODE_ENV` value (the write proceeds
    whenever it is not exactly `'production'`), and (2) whether
    `saveThemeDefaults` is actually included and reachable as a server-function
    endpoint in the deployed bundle, given no app route/component imports it
    in the reviewed source.

The two hCaptcha leads concern related anti-abuse controls but assert distinct
root causes and require separate deployment facts; neither establishes the
other. After validation, record the disposition and supporting evidence for
each lead. Only for confirmed findings, prioritize by real-world severity and
lower-trust reachability, then by fix size and safety; group shared root causes
and file one `[security][<severity>] <short title>` remediation issue per group,
with evidence, root cause, smallest fix, and a link to the parent audit.

Excluded: `crosspost-any-tweetapp-account-without-ownership-proof` was rejected
during independent verification. Do not reopen it without new evidence.
