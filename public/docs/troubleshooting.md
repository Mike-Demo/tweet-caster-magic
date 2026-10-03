---
title: "Troubleshooting — Crosspost docs"
description: "Fixes for the usual Crosspost problems: tweet.app 401 errors, X keys rejected, posts not appearing, rate limits, duplicate content, and sign-in trouble."
canonical: "https://tweet.mikedemo.dev/docs/troubleshooting"
last-updated: "2026-10-03"
---

# Troubleshooting

Start with History on your dashboard: it records the reason for every skipped or failed item. Then find the matching symptom below.

Current status: tweet.app locked down its public API, so reading only works with your own access token. If posting stopped without warning, a fresh token is the most likely fix — see the [changelog](https://tweet.mikedemo.dev/changelog).

## "tweet.app feed request failed (401)"

Your tweet.app token has expired, been revoked, or was copied incompletely. Sign in at tweet.app again, copy a fresh token as described in the [setup guide](https://tweet.mikedemo.dev/docs/setup), save it, and press **Test connection**. Automatic posting stays paused until the test passes, so nothing is lost while you sort it out.

Copy the token value only — not the word `Bearer`, and no trailing spaces or line breaks.

## X rejects the keys when saving

- All four values must come from the *same* X app and the same environment.
- The app must be set to **Read and Write**, and the Access Token must have been generated *after* that setting was applied. If in doubt, regenerate the Access Token and Secret and save the new pair.
- Check for a stray space at the start or end of a pasted value.
- If you pasted the **Bearer Token** anywhere, remove it — it is not one of the four values. See [tokens and keys](https://tweet.mikedemo.dev/docs/tokens).

## Nothing is being picked up

- Only posts published *after* you connected the account are considered. Publish a new test post rather than waiting on older ones.
- Confirm the watched username is spelled exactly as it appears on tweet.app.
- Replies are skipped by default, and long posts may be skipped depending on your choice — check those switches on the Setup tab.
- Checks run on a schedule, so allow a little time before assuming a failure.

## Items sit in Waiting and never go out

That is review-first mode working as designed. Approve each item, or switch on **Post to X automatically** on the Setup tab once you are happy with what you see.

## X refuses a post

- **403 — not allowed**: Usually permissions: the app is read-only, the tokens predate Read and Write, or X considers the content a duplicate of something you posted recently. Regenerate the tokens after fixing permissions, and vary duplicate text.
- **429 — too many requests**: You have hit X's rate limit for your app. Crosspost backs off and retries later; no action is needed unless it persists for hours, in which case check your app's usage in the X developer portal.
- **401 — unauthorised**: The keys were revoked or regenerated in X. Paste the current values and save again.

## Sign-in and two-factor trouble

- The captcha must be completed before the sign-in button will submit; if it looks stuck, reload the page and try again.
- Two-factor codes are six digits and change every 30 seconds — check that your phone's clock is set automatically.
- New accounts must confirm the email link before signing in for the first time.

## Starting clean

**Clear token** and **Clear keys** remove everything stored for you and stop all activity at once. Reconnect from step 1 of the [setup guide](https://tweet.mikedemo.dev/docs/setup) whenever you are ready.
