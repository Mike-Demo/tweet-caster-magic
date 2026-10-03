import { createFileRoute } from "@tanstack/react-router";

const SITE = "https://tweet.mikedemo.dev";

const AGENT_CARD = {
  name: "Crosspost",
  description:
    "Crosspost watches a tweet.app account and reposts new posts to X, automatically or after a quick review, using each person's own X developer keys.",
  url: SITE,
  provider: { organization: "MikeDemo", url: SITE },
  version: "1.0.0",
  documentationUrl: `${SITE}/docs/setup`,
  capabilities: { streaming: false, pushNotifications: false },
  defaultInputModes: ["text"],
  defaultOutputModes: ["text"],
  skills: [
    {
      id: "read-documentation",
      name: "Read Crosspost documentation",
      description:
        "Read the public setup, posting, tokens, security, and troubleshooting docs plus the changelog to understand how Crosspost watches a tweet.app account and reposts new posts to X.",
      tags: ["docs", "read"],
    },
    {
      id: "browse-public-pages",
      name: "Browse public pages",
      description:
        "Browse and index Crosspost's public informational pages (home, docs, licenses, changelog, privacy, terms). Signing in, saving keys, and posting are for people only.",
      tags: ["browse", "read"],
    },
  ],
  links: {
    llms: `${SITE}/llms.txt`,
    sitemap: `${SITE}/sitemap.xml`,
    robots: `${SITE}/robots.txt`,
    changelog: `${SITE}/changelog`,
    terms: `${SITE}/terms`,
    privacy: `${SITE}/privacy`,
    security: `${SITE}/docs/security`,
  },
  policy: {
    publicApi: false,
    agentActions: "not-permitted",
    summary:
      "There is no public API for agents. Signing in, saving keys and posting are for people only. Reading and indexing public pages is welcome.",
  },
} as const;

export const Route = createFileRoute("/.well-known/agent.json")({
  server: {
    handlers: {
      GET: () =>
        Response.json(AGENT_CARD, {
          headers: { "Cache-Control": "public, max-age=3600" },
        }),
    },
  },
});
