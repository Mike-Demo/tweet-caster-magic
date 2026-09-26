# Respond to the agent-readiness report

The report rates Crosspost Level 2. Some of its failures are real, some look like the auditor missed things, and some don't fit this app.

## What the live site shows today

- **Meta tags (marked fail):** the live homepage already has a description and social tags. The auditor probably missed them.
- **Structured data (marked fail):** every public page already includes search-engine structured data. I'll check it's actually in the page the server sends, and fix it if it isn't.
- **`/.well-known/agent.json` (marked 404):** this address now returns the catch-all "not found" page, not a real agent card.
- **Blocking browsing agents:** this was your choice earlier ("not auto action bots like grokbot"). The plan keeps it.

## Changes

1. **Agent card at `/.well-known/agent.json`.** A small public file saying what Crosspost does, linking to the docs, llms.txt, sitemap, terms and privacy, and saying clearly that there is no public API for agents and that sign-in and posting are for people only.
2. **Double-check meta tags and structured data.** Fetch every public page as a crawler would and confirm the description, social tags and structured data are all there. Fix any page that's missing them.
3. **Explain the agent policy in `llms.txt` and robots.txt.** Add a short note that browsing and action agents are blocked on purpose, while reading and indexing are welcome. That turns the report's "accident?" question into a stated policy.
4. **Changelog entry** for the agent card and the policy note.

## Not included, and why

- **Public API, OpenAPI spec, MCP server, webhooks, streaming and the rest of Levels 3–5.** Crosspost posts to X with each person's own keys, and tweet.app has locked its own API. A public API that agents can write to would go against your ban on action bots and add risk around the stored keys. I can plan it separately if you change your mind.
- **Unblocking ChatGPT-User, Claude-User and similar agents.** This stays blocked unless you tell me otherwise.

## Technical notes

- New server route `src/routes/[.]well-known.agent[.]json.ts` returns JSON with `Content-Type: application/json` and a cache header. It's a route rather than a file in `public/` because the catch-all route currently answers that address.
- Check with `curl` against `/`, `/docs/*`, `/changelog`, `/terms`, `/privacy`, `/licenses` for `meta[name=description]`, `og:*`, `twitter:card` and `application/ld+json`.
- Edit `public/llms.txt` and add comments to `public/robots.txt`, keeping all existing rules as they are.
- Add the agent card URL to `llms.txt` only, not the sitemap.
