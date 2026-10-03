import type { ReactElement } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";

import {
  WaCallout,
  WaCard,
  WaDetails,
  WaIcon,
} from "@/design-system/font-awsome-web-awesome-171158";
import { SITE_URL, pageJsonLd } from "@/lib/structured-data";

const TITLE = "Troubleshooting — Crosspost";
const DESCRIPTION =
  "Fixes for the usual Crosspost problems: tweet.app 401 errors, X keys rejected, posts not appearing, rate limits, duplicate content and sign-in trouble.";

export const Route = createFileRoute("/docs/troubleshooting")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `${SITE_URL}/docs/troubleshooting` },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: `${SITE_URL}/og-cover.png` },
      { name: "twitter:image", content: `${SITE_URL}/og-cover.png` },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/docs/troubleshooting` },
      { rel: "alternate", type: "text/markdown", href: `${SITE_URL}/docs/troubleshooting.md` },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: pageJsonLd({
          path: "/docs/troubleshooting",
          name: "Troubleshooting",
          description: DESCRIPTION,
        }),
      },
    ],
  }),
  component: TroubleshootingDocs,
});

function TroubleshootingDocs(): ReactElement {
  return (
    <article className="wa-stack wa-gap-l">
      <header className="wa-stack wa-gap-2xs">
        <h1 style={{ margin: 0 }}>Troubleshooting</h1>
        <p style={{ margin: 0, color: "var(--wa-color-text-quiet)" }}>
          Start with History on your dashboard: it records the reason for every skipped or failed
          item. Then find the matching symptom below.
        </p>
      </header>

      <WaCallout variant="warning">
        <WaIcon slot="icon" name="triangle-exclamation" />
        Current status: tweet.app locked down its public API, so reading only works with your own
        access token. If posting stopped without warning, a fresh token is the most likely fix —
        see the <Link to="/changelog">changelog</Link>.
      </WaCallout>

      <WaCard>
        <div className="wa-stack wa-gap-s">
          <h2 style={{ margin: 0, fontSize: "var(--wa-font-size-l)" }}>
            &ldquo;tweet.app feed request failed (401)&rdquo;
          </h2>
          <p style={{ margin: 0 }}>
            Your tweet.app token has expired, been revoked, or was copied incompletely. Sign in at
            tweet.app again, copy a fresh token as described in the{" "}
            <Link to="/docs/setup">setup guide</Link>, save it, and press{" "}
            <strong>Test connection</strong>. Automatic posting stays paused until the test passes,
            so nothing is lost while you sort it out.
          </p>
          <p style={{ margin: 0, color: "var(--wa-color-text-quiet)" }}>
            Copy the token value only — not the word <code>Bearer</code>, and no trailing spaces or
            line breaks.
          </p>
        </div>
      </WaCard>

      <WaCard>
        <div className="wa-stack wa-gap-s">
          <h2 style={{ margin: 0, fontSize: "var(--wa-font-size-l)" }}>
            X rejects the keys when saving
          </h2>
          <ul style={{ margin: 0 }}>
            <li>
              All four values must come from the <em>same</em> X app and the same environment.
            </li>
            <li>
              The app must be set to <strong>Read and Write</strong>, and the Access Token must have
              been generated <em>after</em> that setting was applied. If in doubt, regenerate the
              Access Token and Secret and save the new pair.
            </li>
            <li>Check for a stray space at the start or end of a pasted value.</li>
            <li>
              If you pasted the <strong>Bearer Token</strong> anywhere, remove it — it is not one of
              the four values. See <Link to="/docs/tokens">tokens and keys</Link>.
            </li>
          </ul>
        </div>
      </WaCard>

      <WaCard>
        <div className="wa-stack wa-gap-s">
          <h2 style={{ margin: 0, fontSize: "var(--wa-font-size-l)" }}>
            Nothing is being picked up
          </h2>
          <ul style={{ margin: 0 }}>
            <li>
              Only posts published <em>after</em> you connected the account are considered. Publish
              a new test post rather than waiting on older ones.
            </li>
            <li>Confirm the watched username is spelled exactly as it appears on tweet.app.</li>
            <li>
              Replies are skipped by default, and long posts may be skipped depending on your
              choice — check those switches on the Setup tab.
            </li>
            <li>Checks run on a schedule, so allow a little time before assuming a failure.</li>
          </ul>
        </div>
      </WaCard>

      <WaCard>
        <div className="wa-stack wa-gap-s">
          <h2 style={{ margin: 0, fontSize: "var(--wa-font-size-l)" }}>
            Items sit in Waiting and never go out
          </h2>
          <p style={{ margin: 0 }}>
            That is review-first mode working as designed. Approve each item, or switch on{" "}
            <strong>Post to X automatically</strong> on the Setup tab once you are happy with what
            you see.
          </p>
        </div>
      </WaCard>

      <WaCard>
        <div className="wa-stack wa-gap-s">
          <h2 style={{ margin: 0, fontSize: "var(--wa-font-size-l)" }}>
            X refuses a post
          </h2>
          <WaDetails summary="403 — not allowed">
            Usually permissions: the app is read-only, the tokens predate Read and Write, or X
            considers the content a duplicate of something you posted recently. Regenerate the
            tokens after fixing permissions, and vary duplicate text.
          </WaDetails>
          <WaDetails summary="429 — too many requests">
            You have hit X's rate limit for your app. Crosspost backs off and retries later; no
            action is needed unless it persists for hours, in which case check your app's usage in
            the X developer portal.
          </WaDetails>
          <WaDetails summary="401 — unauthorised">
            The keys were revoked or regenerated in X. Paste the current values and save again.
          </WaDetails>
        </div>
      </WaCard>

      <WaCard>
        <div className="wa-stack wa-gap-s">
          <h2 style={{ margin: 0, fontSize: "var(--wa-font-size-l)" }}>
            Sign-in and two-factor trouble
          </h2>
          <ul style={{ margin: 0 }}>
            <li>
              The captcha must be completed before the sign-in button will submit; if it looks
              stuck, reload the page and try again.
            </li>
            <li>
              Two-factor codes are six digits and change every 30 seconds — check that your phone's
              clock is set automatically.
            </li>
            <li>
              New accounts must confirm the email link before signing in for the first time.
            </li>
          </ul>
        </div>
      </WaCard>

      <WaCard>
        <div className="wa-stack wa-gap-s">
          <h2 style={{ margin: 0, fontSize: "var(--wa-font-size-l)" }}>Starting clean</h2>
          <p style={{ margin: 0 }}>
            <strong>Clear token</strong> and <strong>Clear keys</strong> remove everything stored
            for you and stop all activity at once. Reconnect from step 1 of the{" "}
            <Link to="/docs/setup">setup guide</Link> whenever you are ready.
          </p>
        </div>
      </WaCard>
    </article>
  );
}
