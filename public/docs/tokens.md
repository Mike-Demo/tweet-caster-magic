---
title: "Tokens and keys — Crosspost docs"
description: "Which X developer keys Crosspost needs, why the Bearer Token is not one of them, how the tweet.app access token works, and how both are stored."
canonical: "https://tweet.mikedemo.dev/docs/tokens"
last-updated: "2026-10-03"
---

# Tokens and keys

Crosspost holds two secrets on your behalf: a tweet.app access token for reading, and four X values for publishing.

## The four X values you need

- **API Key** (also shown as Consumer Key) — identifies your X app.
- **API Key Secret** — the matching secret for that app.
- **Access Token** — identifies your X account within your app.
- **Access Token Secret** — the matching secret for that token.

All four together are OAuth 1.0a user-context credentials, which is the only kind that can publish a post as you.

The **Bearer Token** is not used by Crosspost. It is app-only and read-only — it can never publish on your behalf, so there is no need to paste it anywhere.

## Creating them in your X developer account

1. Sign up for an X developer account and create a project and an app.
2. In the app's **User authentication settings**, set permissions to **Read and Write**, choose **Web App, Automated App or Bot**, and fill in a website URL, terms URL and privacy URL.
3. Add a callback URL. Crosspost does not send you through X to sign in, so this is only a required field — any of these is fine:
   - `https://tweet.mikedemo.dev/x-callback`
   - `https://tweet-caster-magic.lovable.app/x-callback`
4. Open **Keys and tokens**. Generate the Access Token and Secret *after* permissions are set to Read and Write — a token made under read-only permissions cannot post, even once the setting changes.
5. Copy all four values into the Setup tab and press Check and save.

Secrets are shown once. If you missed one, regenerate the pair in X and save the new values here — regenerating invalidates the old pair immediately.

## Development, Staging or Production

X organises keys by environment. Crosspost stores one set at a time and simply records which environment you took them from, so the dashboard can label them and warn you before a mismatch causes a confusing failure. Test with Development keys first, then replace them with Production keys once a real post has gone out correctly.

## The tweet.app access token

Since tweet.app closed its public API, reading your posts requires a token from your own signed-in session, copied from the `Authorization: Bearer` header in your browser's developer tools. Step-by-step instructions are in the [setup guide](https://tweet.mikedemo.dev/docs/setup). These tokens expire on tweet.app's schedule, so expect to refresh yours from time to time.

## How they are stored

- Everything is encrypted before it is written down.
- No browser can read them back — not yours, not anyone's. Only trusted server code that publishes on your behalf can decrypt them.
- The dashboard shows a short hint and a connected badge, never the values themselves.
- **Clear keys** and **Clear token** delete them at once and stop all posting and reading. Revoking or regenerating in X or tweet.app also cuts access instantly, whatever Crosspost holds.
