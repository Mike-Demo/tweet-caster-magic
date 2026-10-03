import type { ReactElement } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";

import {
  WaCallout,
  WaCard,
  WaIcon,
} from "@/design-system/font-awsome-web-awesome-171158";
import { SITE_URL, pageJsonLd } from "@/lib/structured-data";

const TITLE = "Setup guide — Crosspost";
const DESCRIPTION =
  "Step-by-step setup for Crosspost: connect your tweet.app account, choose the account to watch, add your own X developer keys, and pick how posting behaves.";

export const Route = createFileRoute("/docs/setup")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `${SITE_URL}/docs/setup` },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: `${SITE_URL}/og-cover.png` },
      { name: "twitter:image", content: `${SITE_URL}/og-cover.png` },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/docs/setup` },
      { rel: "alternate", type: "text/markdown", href: `${SITE_URL}/docs/setup.md` },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: pageJsonLd({
          path: "/docs/setup",
          name: "Setup guide",
          description: DESCRIPTION,
        }),
      },
    ],
  }),
  component: SetupDocs,
});

function SetupDocs(): ReactElement {
  return (
    <article className="wa-stack wa-gap-l">
      <header className="wa-stack wa-gap-2xs">
        <h1 style={{ margin: 0 }}>Setup</h1>
        <p style={{ margin: 0, color: "var(--wa-color-text-quiet)" }}>
          Four steps, all on the Setup tab of your dashboard. Expect about ten minutes the first
          time, most of it spent in your X developer account.
        </p>
      </header>

      <WaCallout variant="brand">
        <WaIcon slot="icon" name="circle-info" />
        Crosspost never uses a shared account. You bring your own tweet.app account and your own X
        developer app, so everything posts as you and stays under your control.
      </WaCallout>

      <WaCard>
        <div className="wa-stack wa-gap-s">
          <h2 style={{ margin: 0, fontSize: "var(--wa-font-size-l)" }}>
            Before you start
          </h2>
          <ul style={{ margin: 0 }}>
            <li>A Crosspost account — register on the home page and confirm your email.</li>
            <li>A tweet.app account you can sign into in a browser.</li>
            <li>
              An X developer account with an app set to <strong>Read and Write</strong>. See the{" "}
              <Link to="/docs/tokens">tokens and keys guide</Link>.
            </li>
          </ul>
        </div>
      </WaCard>

      <WaCard>
        <div className="wa-stack wa-gap-s">
          <h2 style={{ margin: 0, fontSize: "var(--wa-font-size-l)" }}>
            1. Connect your tweet.app account
          </h2>
          <p style={{ margin: 0 }}>
            tweet.app closed its public API, so Crosspost can only read your posts with a token
            from your own signed-in session. Paste that token on the Setup tab and press{" "}
            <strong>Save token</strong>. It is encrypted before storage and never sent back to any
            browser.
          </p>
          <ol style={{ margin: 0 }}>
            <li>Sign in at tweet.app in Chrome and open developer tools (F12).</li>
            <li>
              Open the <strong>Network</strong> tab, tick <strong>Preserve log</strong>, filter to{" "}
              <strong>Fetch/XHR</strong>, then reload your feed.
            </li>
            <li>
              Click any request to <code>api.tweet.app/api/…</code> and, under{" "}
              <strong>Request Headers</strong>, copy the value after{" "}
              <code>Authorization: Bearer</code>.
            </li>
            <li>
              Paste it into <strong>tweet.app access token</strong>, save, then press{" "}
              <strong>Test connection</strong>.
            </li>
          </ol>
          <p style={{ margin: 0, color: "var(--wa-color-text-quiet)" }}>
            Tokens expire. When one does, reading pauses and the dashboard asks you to paste a fresh
            one — nothing is lost in the meantime.
          </p>
        </div>
      </WaCard>

      <WaCard>
        <div className="wa-stack wa-gap-s">
          <h2 style={{ margin: 0, fontSize: "var(--wa-font-size-l)" }}>
            2. Choose the account to watch
          </h2>
          <p style={{ margin: 0 }}>
            Enter the tweet.app username whose posts should be mirrored — usually your own — and
            press <strong>Connect</strong>. Only posts published after you connect are considered,
            so connecting never floods X with your back catalogue.
          </p>
        </div>
      </WaCard>

      <WaCard>
        <div className="wa-stack wa-gap-s">
          <h2 style={{ margin: 0, fontSize: "var(--wa-font-size-l)" }}>
            3. Add your X developer keys
          </h2>
          <p style={{ margin: 0 }}>
            Crosspost keeps one set of keys: API Key, API Secret, Access Token and Access Token
            Secret. Tell it which environment those keys came from — Development, Staging or
            Production — and press <strong>Check and save</strong>. The keys are verified with X
            before they are stored, so a typo is caught immediately.
          </p>
          <p style={{ margin: 0 }}>
            Start with Development keys, confirm one real post goes out as expected, then swap in
            Production. Full details are in the{" "}
            <Link to="/docs/tokens">tokens and keys guide</Link>.
          </p>
        </div>
      </WaCard>

      <WaCard>
        <div className="wa-stack wa-gap-s">
          <h2 style={{ margin: 0, fontSize: "var(--wa-font-size-l)" }}>
            4. Decide how it should behave
          </h2>
          <p style={{ margin: 0 }}>
            Leave automatic posting off at first: everything lands in <strong>Waiting</strong> for
            your approval so you can see exactly what would have gone out. Turn it on once you
            trust the result. The choices for replies, quotes and long posts are explained in the{" "}
            <Link to="/docs/posting">posting guide</Link>.
          </p>
        </div>
      </WaCard>
    </article>
  );
}
