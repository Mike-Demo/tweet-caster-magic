# Be upfront about what the X keys actually do

The "2. Your X developer keys" step currently explains where to find each value, but it doesn't say plainly what kind of access the person is granting or whose account posts. This rewrites that step to be honest about it and points to the official X pages.

## What the step will say

- You need your own X developer account and your own app — Crosspost never posts through a shared or Crosspost-owned account.
- The Access Token and Secret act as **you**: anything Crosspost sends appears as a post from the account that owns the app. This is the "acting as yourself" style of access X describes.
- Set the app's user authentication permission to **Read and write** before generating the token pair; if you change the permission afterwards, regenerate them or posting is refused.
- The Bearer Token is not used — it can only read public data, never post — so there's no need to paste it.
- X shows these values only once. Keep them in a password manager; regenerating replaces the old ones.
- Crosspost stores the four values encrypted, uses them only to publish the posts you approve (or all of them if you turn on automatic posting), and never sends them back to your browser. Removing the keys stops all posting immediately.

## Links out to X

Small link list under the guidance, opening in a new tab:

- Developer Console — https://console.x.com
- Getting access — https://docs.x.com/x-api/getting-started/getting-access
- Authentication overview — https://docs.x.com/resources/fundamentals/authentication/overview
- OAuth 1.0a — https://docs.x.com/resources/fundamentals/authentication/oauth-1-0a/api-key-and-secret

## Technical notes

- Text-and-links only change inside the second card of `src/routes/_authenticated/app.tsx`; no changes to storage, encryption, or posting logic.
- Existing `WaCallout` keeps the walkthrough; links rendered as a `wa-cluster` of anchors with `target="_blank" rel="noreferrer"`.
- Field labels and hints stay as they are, with the Access token hint noting it posts as your own account.
