---
title: "Security — Crosspost docs"
description: "Where Crosspost keeps your X keys and tweet.app token, how they are encrypted, who can use them, and how to delete them at any time."
canonical: "https://tweet.mikedemo.dev/docs/security"
last-updated: "2026-10-03"
---

# Security

Your keys let something post as you, so it matters where they sit. Here is exactly what Crosspost keeps, how it is protected, and how to take it back.

Secrets are encrypted before they are written down and can only be unlocked by Crosspost's own server code. No browser ever reads them back — not yours, not anyone's.

## What Crosspost stores

- Your account: email address and sign-in details.
- The four X values from your own developer app, and which environment they came from.
- Your tweet.app access token.
- The tweet.app username you asked us to watch, and your posting preferences.
- A record of the posts we have seen and sent, so the same post is never published twice.

## Where it lives

Everything sits in a private database hosted on Lovable Cloud, in the same place as the app itself. Nothing is copied to a third party, and nothing is stored in your browser beyond the session that keeps you signed in.

## How it is protected

- Every secret is scrambled with a key held only on the server, so even a stolen copy of the database is unreadable without it.
- The secrets table is closed to browsers entirely. Only trusted server code that publishes on your behalf can unlock a value.
- Every other piece of your data is fenced to your own account, so one person's records can never be read by another.
- The dashboard only ever shows a short hint and a connected badge, never the values themselves.
- Everything travels over an encrypted connection.

## Protecting your Crosspost account

- Registering requires confirming your email address.
- Signing in requires a six-digit code from your authenticator app.
- A bot check guards both the sign-in and register forms.
- Signing in with Google is also available if you prefer it to a password.

## Taking your keys back

- **Clear keys** and **Clear token** in the dashboard delete them immediately and stop all posting and reading.
- Regenerating or revoking the credentials in X or tweet.app cuts access instantly, whatever Crosspost still holds.
- Ask us to delete your account and everything above goes with it. See the [Privacy Policy](https://tweet.mikedemo.dev/privacy).

## What Crosspost never does

- It never posts from a shared account — only from your own X developer app.
- It never shows or sends your keys to a browser after you save them.
- It never sells or shares your data.
- It never reads anything beyond the posts of the tweet.app account you asked it to watch.

## Checked every day

Crosspost is scanned automatically once a day by Lovable. The scan looks for data left open to the public, missing per-account rules, keys accidentally exposed in the app, and known problems in the software libraries it depends on. Anything it finds is reported to us and fixed; dated fixes appear on the [changelog](https://tweet.mikedemo.dev/changelog).

## Other people's policies

Crosspost sits between two services with their own rules on your data:

- [tweet.app Privacy Policy](https://tweet.app/privacy/)
- [X Privacy Policy](https://x.com/en/privacy)

## Reporting a problem

If you think you have found a security issue, please report it privately rather than posting it publicly — a direct message to [@demo on tweet.app](https://app.tweet.app/user/demo) reaches us. Include enough detail to reproduce it, and give us a chance to fix it before sharing it more widely.

## Further reading

- [Lovable — Security](https://docs.lovable.dev/features/security) — how apps built on Lovable are checked and protected.
- [Lovable Cloud](https://docs.lovable.dev/features/cloud) — the hosted database, sign-in and server platform Crosspost runs on.
- [Lovable Trust Center](https://lovable.dev/security) — platform-level security and compliance information.
- [tweet.app Privacy Policy](https://tweet.app/privacy/)
- [X Privacy Policy](https://x.com/en/privacy)
- [Tokens and keys](https://tweet.mikedemo.dev/docs/tokens) — which values are needed and why.
- [Privacy Policy](https://tweet.mikedemo.dev/privacy) — the formal version of this page.
