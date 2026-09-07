# Fix "tweet.app feed request failed (401)"

## What's happening

A status notice goes on the homepage too: a short banner saying posting may not be working right now because tweet.app changed its API, so visitors aren't left guessing.


tweet.app's API used to answer public requests. It doesn't any more. Checked just now:

- `GET https://api.tweet.app/healthz` → `{"ok":true,"role":"gateway","upstreamAuth":"oidc",...}`
- `GET https://api.tweet.app/api/users/by-username/demo` → `401 {"error":"Missing or malformed Authorization header."}`
- `GET https://api.tweet.app/api/posts` → `401`

So this is not a bug in Crosspost. The gateway now demands an `Authorization` header on every `/api/*` call, and it validates it against an OIDC identity provider. Nothing in Crosspost can read your posts until it can present a token from your own signed-in tweet.app session.

## What I propose to build

1. **A new "Connect tweet.app" step** on the setup screen, next to the X keys: a field where you paste your own tweet.app access token, stored encrypted the same way the X keys are, never returned to the browser.
2. **Every tweet.app call sends that token** as `Authorization: Bearer …`, with a "Test connection" button that fetches your profile and confirms it worked.
3. **Plain-language errors instead of a raw code.** 401 becomes "Your tweet.app connection expired — reconnect it", 403 "your tweet.app account can't read this", 429 "tweet.app is rate limiting us, trying again later". Auto-posting pauses and flags the account rather than failing silently every hour.
4. **A short in-app guide** with exactly the steps below for getting the token out of your own browser session.

## How to capture your token (do this first, so we know what shape it is)

This is inspection of your own signed-in session — no bypassing anything.

1. Sign in at tweet.app in Chrome. Open DevTools (F12) → **Network**, tick **Preserve log**, filter to **Fetch/XHR**.
2. Reload the feed. Click any request going to `api.tweet.app/api/...` (look for `posts`, `me`, `session`, `viewer`, `users/by-username/...`, `notifications`).
3. In **Headers → Request Headers**, look for `Authorization: Bearer eyJ…`.
   - **Present** → bearer-token auth. That value is what Crosspost needs. Note whether it's a JWT (three dot-separated parts) and paste the middle part into jwt.io to read its `exp` (expiry) and `iss` (issuer) — that tells us how often it must be refreshed.
   - **Absent** → cookie auth. Check **Application → Cookies → api.tweet.app / tweet.app** for a session cookie, and note `SameSite`/`Secure`/`HttpOnly`. HttpOnly + SameSite=Lax means a server-side integration can't reuse it, and we'd need a different approach (see fallback).
4. Also check **Application → Local Storage / Session Storage** on tweet.app for keys like `oidc.user:…`, `access_token`, `id_token`, `refresh_token` — OIDC libraries usually park the token there.
5. Look for a CSRF header (`X-CSRF-Token`, `X-XSRF-Token`) on any POST. Reads normally don't need one.
6. Right-click the working request → **Copy → Copy as cURL**, run it in a terminal, confirm it returns 200. Then delete headers one at a time and re-run: the last header you can't remove without getting a 401 is the one that actually authenticates. Redact the token before sharing anything.
7. Find the login request itself (filter the log for `token`, `auth`, `callback`, `oidc`) — its response shows whether there's a refresh token and a refresh endpoint we can use so you don't have to re-paste weekly.

CORS/origin checks only affect browsers, not our server, so if cURL works from your terminal, Crosspost can do the same call.

## What I need from you

Run steps 1–3 and tell me which case you land in: a bearer token in the header, or only cookies. That decides whether we build the token field or the fallback.

**Fallback if it's HttpOnly cookies only:** Crosspost can't hold a browser session, so instead we'd watch your public tweet.app profile page (or an RSS/embed feed if one exists) rather than the gated API, and I'd confirm what's reachable before building it.

## Technical notes

- `src/lib/tweetApp.server.ts`: both fetch calls take a token argument and send `Authorization: Bearer`; a typed `TweetAppAuthError` distinguishes 401/403/429 from transport failures.
- New encrypted store for the token — reuse `src/lib/crypto.server.ts` and the existing service-role-only pattern used by `x_credentials` (deny-all RLS, no anon/authenticated grants).
- `src/lib/sync.server.ts` catches the auth error, marks the profile as needing reconnection, and skips that user in the scheduled run instead of throwing.
- `src/lib/app.functions.ts`: add `saveTweetAppToken`, `clearTweetAppToken`, `testTweetAppConnection` server functions behind the existing auth + MFA middleware.
- Token expiry: if the JWT is short-lived and there's a refresh endpoint, store the refresh token and renew on demand; otherwise show "reconnect" when it expires.
