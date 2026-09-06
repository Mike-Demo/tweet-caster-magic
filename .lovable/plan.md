# Auto-repost tweet.app posts to X

A small tool where someone signs in, points at their tweet.app username, connects their own X developer account, and has their new posts mirrored to X — automatically or after a quick review.

## What people will see

1. **Sign in / sign up** with email and password. Everything below is private per person.
2. **Setup page**
   - tweet.app username to watch (verified live against the public profile endpoint, showing name, avatar and bio so they know it's the right account).
   - Their own X developer keys: API key, API secret, access token, access token secret. Stored encrypted, never shown again after saving (only a masked hint), with a "Test connection" button and a short guide on where to get them.
   - An "Auto-post new posts" switch, plus options: skip replies, skip reposts, and what to do when a post is longer than X allows (truncate with a link, or skip).
3. **Queue** — new posts found on tweet.app, newest first, each with its text and a Post to X / Skip choice. With auto-post on, items publish on their own and appear as already sent.
4. **History** — everything attempted, with status (posted, skipped, failed), the reason on failure, and a link to the live X post. Failures can be retried.

## How it works

- The app polls the public tweet.app feed and keeps the posts written by the watched username. Only posts created after setup are considered, so nothing old floods X.
- Every post is recorded once, so a post is never sent twice even if polling overlaps.
- Publishing to X happens on the server with that person's own keys — keys never reach the browser.
- Auto-posting runs on a schedule; the queue also refreshes while the app is open.

## Technical notes

- Enable Lovable Cloud for auth, database and scheduled work.
- Tables (all row-level-secured to the owner): `profiles`/settings (watched username, auto-post flags, filters), `x_credentials` (four values encrypted at rest with a server-side key, never selectable by the browser), `synced_posts` (tweet.app post id, text, created_at, status, x_post_id, error, unique per user + post id).
- Source: `GET https://api.tweet.app/api/posts` returns a global feed with `nextCursor`; filter on `authorUsername`, page backwards until older than the last seen timestamp. No per-user endpoint exists. `GET /api/users/by-username/{name}` validates the account.
- Publishing: `POST https://api.x.com/2/tweets` signed with OAuth 1.0a user-context (HMAC-SHA1) built server-side from the stored keys — this is what "bring your own X developer account" requires; there is no per-user X connector available in this workspace.
- Server functions handle sync, publish, retry and credential test; a scheduled job drives auto-posting. Rate-limit and auth errors from X are surfaced in plain language in History.
- Errors of note handled explicitly: 401 bad keys, 403 app lacks write permission, 429 rate limited (retry later), duplicate content rejection.

## Not in this version

LinkedIn and other destinations, media/image mirroring, threads, and editing text before posting. Easy to add later.
