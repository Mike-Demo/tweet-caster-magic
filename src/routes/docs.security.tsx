import type { ReactElement } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";

import {
  WaCallout,
  WaCard,
  WaIcon,
} from "@/design-system/font-awsome-web-awesome-171158";
import { SITE_URL, pageJsonLd } from "@/lib/structured-data";

const TITLE = "Security — Crosspost";
const DESCRIPTION =
  "Where Crosspost keeps your X keys and tweet.app token, how they are encrypted, who can use them, and how to delete them at any time.";

export const Route = createFileRoute("/docs/security")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `${SITE_URL}/docs/security` },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: `${SITE_URL}/og-cover.png` },
      { name: "twitter:image", content: `${SITE_URL}/og-cover.png` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/docs/security` }],
    scripts: [
      {
        type: "application/ld+json",
        children: pageJsonLd({
          path: "/docs/security",
          name: "Security",
          description: DESCRIPTION,
        }),
      },
    ],
  }),
  component: SecurityDocs,
});

interface ExternalLink {
  readonly href: string;
  readonly label: string;
  readonly note: string;
}

const FURTHER_READING: readonly ExternalLink[] = [
  {
    href: "https://docs.lovable.dev/features/security",
    label: "Lovable — Security",
    note: "How apps built on Lovable are checked and protected.",
  },
  {
    href: "https://docs.lovable.dev/features/cloud",
    label: "Lovable Cloud",
    note: "The hosted database, sign-in and server platform Crosspost runs on.",
  },
  {
    href: "https://lovable.dev/security",
    label: "Lovable Trust Center",
    note: "Platform-level security and compliance information.",
  },
];

function SecurityDocs(): ReactElement {
  return (
    <article className="wa-stack wa-gap-l">
      <header className="wa-stack wa-gap-2xs">
        <h1 style={{ margin: 0 }}>Security</h1>
        <p style={{ margin: 0, color: "var(--wa-color-text-quiet)" }}>
          Your keys let something post as you, so it matters where they sit. Here is exactly what
          Crosspost keeps, how it is protected, and how to take it back.
        </p>
      </header>

      <WaCallout variant="brand">
        <WaIcon slot="icon" name="lock" />
        Secrets are encrypted before they are written down and can only be unlocked by Crosspost's
        own server code. No browser ever reads them back — not yours, not anyone's.
      </WaCallout>

      <WaCard>
        <div className="wa-stack wa-gap-s">
          <h2 style={{ margin: 0, fontSize: "var(--wa-font-size-l)" }}>What Crosspost stores</h2>
          <ul style={{ margin: 0 }}>
            <li>Your account: email address and sign-in details.</li>
            <li>The four X values from your own developer app, and which environment they came from.</li>
            <li>Your tweet.app access token.</li>
            <li>The tweet.app username you asked us to watch, and your posting preferences.</li>
            <li>
              A record of the posts we have seen and sent, so the same post is never published
              twice.
            </li>
          </ul>
        </div>
      </WaCard>

      <WaCard>
        <div className="wa-stack wa-gap-s">
          <h2 style={{ margin: 0, fontSize: "var(--wa-font-size-l)" }}>Where it lives</h2>
          <p style={{ margin: 0 }}>
            Everything sits in a private database hosted on Lovable Cloud, in the same place as the
            app itself. Nothing is copied to a third party, and nothing is stored in your browser
            beyond the session that keeps you signed in.
          </p>
        </div>
      </WaCard>

      <WaCard>
        <div className="wa-stack wa-gap-s">
          <h2 style={{ margin: 0, fontSize: "var(--wa-font-size-l)" }}>How it is protected</h2>
          <ul style={{ margin: 0 }}>
            <li>
              Every secret is scrambled with a key held only on the server, so even a stolen copy of
              the database is unreadable without it.
            </li>
            <li>
              The secrets table is closed to browsers entirely. Only trusted server code that
              publishes on your behalf can unlock a value.
            </li>
            <li>
              Every other piece of your data is fenced to your own account, so one person's records
              can never be read by another.
            </li>
            <li>
              The dashboard only ever shows a short hint and a connected badge, never the values
              themselves.
            </li>
            <li>Everything travels over an encrypted connection.</li>
          </ul>
        </div>
      </WaCard>

      <WaCard>
        <div className="wa-stack wa-gap-s">
          <h2 style={{ margin: 0, fontSize: "var(--wa-font-size-l)" }}>
            Protecting your Crosspost account
          </h2>
          <ul style={{ margin: 0 }}>
            <li>Registering requires confirming your email address.</li>
            <li>Signing in requires a six-digit code from your authenticator app.</li>
            <li>A bot check guards both the sign-in and register forms.</li>
            <li>Signing in with Google is also available if you prefer it to a password.</li>
          </ul>
        </div>
      </WaCard>

      <WaCard>
        <div className="wa-stack wa-gap-s">
          <h2 style={{ margin: 0, fontSize: "var(--wa-font-size-l)" }}>Taking your keys back</h2>
          <ul style={{ margin: 0 }}>
            <li>
              <strong>Clear keys</strong> and <strong>Clear token</strong> in the dashboard delete
              them immediately and stop all posting and reading.
            </li>
            <li>
              Regenerating or revoking the credentials in X or tweet.app cuts access instantly,
              whatever Crosspost still holds.
            </li>
            <li>
              Ask us to delete your account and everything above goes with it. See the{" "}
              <Link to="/privacy">Privacy Policy</Link>.
            </li>
          </ul>
        </div>
      </WaCard>

      <WaCard>
        <div className="wa-stack wa-gap-s">
          <h2 style={{ margin: 0, fontSize: "var(--wa-font-size-l)" }}>What Crosspost never does</h2>
          <ul style={{ margin: 0 }}>
            <li>It never posts from a shared account — only from your own X developer app.</li>
            <li>It never shows or sends your keys to a browser after you save them.</li>
            <li>It never sells or shares your data.</li>
            <li>
              It never reads anything beyond the posts of the tweet.app account you asked it to
              watch.
            </li>
          </ul>
        </div>
      </WaCard>

      <WaCard>
        <div className="wa-stack wa-gap-s">
          <h2 style={{ margin: 0, fontSize: "var(--wa-font-size-l)" }}>Reporting a problem</h2>
          <p style={{ margin: 0 }}>
            If you think you have found a security issue, please report it privately rather than
            posting it publicly — a direct message to{" "}
            <a href="https://app.tweet.app/demo" target="_blank" rel="noreferrer">
              @demo on tweet.app
            </a>{" "}
            reaches us. Include enough detail to reproduce it, and give us a chance to fix it before
            sharing it more widely.
          </p>
        </div>
      </WaCard>

      <WaCard>
        <div className="wa-stack wa-gap-s">
          <h2 style={{ margin: 0, fontSize: "var(--wa-font-size-l)" }}>Further reading</h2>
          <ul style={{ margin: 0 }}>
            {FURTHER_READING.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>{" "}
                — {link.note}
              </li>
            ))}
            <li>
              <Link to="/docs/tokens">Tokens and keys</Link> — which values are needed and why.
            </li>
            <li>
              <Link to="/privacy">Privacy Policy</Link> — the formal version of this page.
            </li>
          </ul>
        </div>
      </WaCard>
    </article>
  );
}
