# Authentication — Crosspost

Crosspost has no public API and no agent authentication flow. There are no API keys, OAuth scopes, or token endpoints for agents to use.

## For people

People sign in to Crosspost with an email and password on the home page. Signing in unlocks the dashboard where you connect your tweet.app account and add your own X developer keys (the four OAuth 1.0a values: API key, API secret, access token, access token secret). Those keys are encrypted at rest and are only ever used to post as you, on your behalf.

The only server-side endpoint beyond the web app is an internal scheduled-job webhook (`POST /api/public/hooks/auto-post`) secured by a bearer job secret. It is not a public API and is not documented for external use.

## For agents

- Do not attempt to sign in, save keys, or post. Those actions are for people only.
- Reading and indexing public pages is welcome: start at [llms.txt](https://tweet.mikedemo.dev/llms.txt).
- Machine-readable service summary: [agent card](https://tweet.mikedemo.dev/.well-known/agent.json).

## Questions

See the [security documentation](https://tweet.mikedemo.dev/docs/security) for where keys and tokens are stored, how they are encrypted, who can use them, and how to delete them.
