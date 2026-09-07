import type { ReactElement } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";

import {
  WaCallout,
  WaCard,
  WaIcon,
} from "@/design-system/font-awsome-web-awesome-171158";
import {
  PREVIEW_URL,
  PUBLISHED_URL,
  SITE_URL,
  pageJsonLd,
} from "@/lib/structured-data";

const TITLE = "Tokens and keys — Crosspost";
const DESCRIPTION =
  "Which X developer keys Crosspost needs, why the Bearer Token is not one of them, how the tweet.app access token works, and how both are stored and removed.";

export const Route = createFileRoute("/docs/tokens")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `${SITE_URL}/docs/tokens` },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: `${SITE_URL}/og-cover.png` },
      { name: "twitter:image", content: `${SITE_URL}/og-cover.png` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/docs/tokens` }],
    scripts: [
      {
        type: "application/ld+json",
        children: pageJsonLd({
          path: "/docs/tokens",
          name: "Tokens and keys",
          description: DESCRIPTION,
        }),
      },
    ],
  }),
  component: TokensDocs,
});

const CALLBACKS: readonly string[] = [
  `${SITE_URL}/x-callback`,
  `${PUBLISHED_URL}/x-callback`,
  `${PREVIEW_URL}/x-callback`,
];

function TokensDocs(): ReactElement {
  return (
    <article className="wa-stack wa-gap-l">
      <header className="wa-stack wa-gap-2xs">
        <h1 style={{ margin: 0 }}>Tokens and keys</h1>
        <p style={{ margin: 0, color: "var(--wa-color-text-quiet)" }}>
          Crosspost holds two secrets on your behalf: a tweet.app access token for reading, and
          four X values for publishing.
        </p>
      </header>

      <WaCard>
        <div className="wa-stack wa-gap-s">
          <h2 style={{ margin: 0, fontSize: "var(--wa-font-size-l)" }}>
            The four X values you need
          </h2>
          <ul style={{ margin: 0 }}>
            <li>
              <strong>API Key</strong> (also shown as Consumer Key) — identifies your X app.
            </li>
            <li>
              <strong>API Key Secret</strong> — the matching secret for that app.
            </li>
            <li>
              <strong>Access Token</strong> — identifies your X account within your app.
            </li>
            <li>
              <strong>Access Token Secret</strong> — the matching secret for that token.
            </li>
          </ul>
          <p style={{ margin: 0 }}>
            All four together are OAuth 1.0a user-context credentials, which is the only kind that
            can publish a post as you.
          </p>
        </div>
      </WaCard>

      <WaCallout variant="warning">
        <WaIcon slot="icon" name="circle-exclamation" />
        The <strong>Bearer Token</strong> is not used by Crosspost. It is app-only and read-only —
        it can never publish on your behalf, so there is no need to paste it anywhere.
      </WaCallout>

      <WaCard>
        <div className="wa-stack wa-gap-s">
          <h2 style={{ margin: 0, fontSize: "var(--wa-font-size-l)" }}>
            Creating them in your X developer account
          </h2>
          <ol style={{ margin: 0 }}>
            <li>Sign up for an X developer account and create a project and an app.</li>
            <li>
              In the app's <strong>User authentication settings</strong>, set permissions to{" "}
              <strong>Read and Write</strong>, choose <strong>Web App, Automated App or Bot</strong>
              , and fill in a website URL, terms URL and privacy URL.
            </li>
            <li>
              Add a callback URL. Crosspost does not send you through X to sign in, so this is only
              a required field — any of the addresses below is fine:
              <ul>
                {CALLBACKS.map((url) => (
                  <li key={url}>
                    <code>{url}</code>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              Open <strong>Keys and tokens</strong>. Generate the Access Token and Secret{" "}
              <em>after</em> permissions are set to Read and Write — a token made under read-only
              permissions cannot post, even once the setting changes.
            </li>
            <li>Copy all four values into the Setup tab and press Check and save.</li>
          </ol>
          <p style={{ margin: 0, color: "var(--wa-color-text-quiet)" }}>
            Secrets are shown once. If you missed one, regenerate the pair in X and save the new
            values here — regenerating invalidates the old pair immediately.
          </p>
        </div>
      </WaCard>

      <WaCard>
        <div className="wa-stack wa-gap-s">
          <h2 style={{ margin: 0, fontSize: "var(--wa-font-size-l)" }}>
            Development, Staging or Production
          </h2>
          <p style={{ margin: 0 }}>
            X organises keys by environment. Crosspost stores one set at a time and simply records
            which environment you took them from, so the dashboard can label them and warn you
            before a mismatch causes a confusing failure. Test with Development keys first, then
            replace them with Production keys once a real post has gone out correctly.
          </p>
        </div>
      </WaCard>

      <WaCard>
        <div className="wa-stack wa-gap-s">
          <h2 style={{ margin: 0, fontSize: "var(--wa-font-size-l)" }}>
            The tweet.app access token
          </h2>
          <p style={{ margin: 0 }}>
            Since tweet.app closed its public API, reading your posts requires a token from your
            own signed-in session, copied from the <code>Authorization: Bearer</code> header in your
            browser's developer tools. Step-by-step instructions are in the{" "}
            <Link to="/docs/setup">setup guide</Link>. These tokens expire on tweet.app's schedule,
            so expect to refresh yours from time to time.
          </p>
        </div>
      </WaCard>

      <WaCard>
        <div className="wa-stack wa-gap-s">
          <h2 style={{ margin: 0, fontSize: "var(--wa-font-size-l)" }}>How they are stored</h2>
          <ul style={{ margin: 0 }}>
            <li>Everything is encrypted before it is written down.</li>
            <li>
              No browser can read them back — not yours, not anyone's. Only trusted server code
              that publishes on your behalf can decrypt them.
            </li>
            <li>
              The dashboard shows a short hint and a connected badge, never the values themselves.
            </li>
            <li>
              <strong>Clear keys</strong> and <strong>Clear token</strong> delete them at once and
              stop all posting and reading. Revoking or regenerating in X or tweet.app also cuts
              access instantly, whatever Crosspost holds.
            </li>
          </ul>
        </div>
      </WaCard>
    </article>
  );
}
