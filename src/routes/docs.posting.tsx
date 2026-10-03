import type { ReactElement } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";

import {
  WaCallout,
  WaCard,
  WaIcon,
} from "@/design-system/font-awsome-web-awesome-171158";
import { SITE_URL, pageJsonLd } from "@/lib/structured-data";

const TITLE = "Posting guide — Crosspost";
const DESCRIPTION =
  "How Crosspost turns tweet.app posts into posts on X: automatic or review-first, replies and quotes, long posts, the waiting queue, and history.";

export const Route = createFileRoute("/docs/posting")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `${SITE_URL}/docs/posting` },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: `${SITE_URL}/og-cover.png` },
      { name: "twitter:image", content: `${SITE_URL}/og-cover.png` },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/docs/posting` },
      { rel: "alternate", type: "text/markdown", href: `${SITE_URL}/docs/posting.md` },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: pageJsonLd({
          path: "/docs/posting",
          name: "Posting guide",
          description: DESCRIPTION,
        }),
      },
    ],
  }),
  component: PostingDocs,
});

function PostingDocs(): ReactElement {
  return (
    <article className="wa-stack wa-gap-l">
      <header className="wa-stack wa-gap-2xs">
        <h1 style={{ margin: 0 }}>Posting</h1>
        <p style={{ margin: 0, color: "var(--wa-color-text-quiet)" }}>
          What Crosspost sends to X, when it sends it, and how to stay in control of the result.
        </p>
      </header>

      <WaCard>
        <div className="wa-stack wa-gap-s">
          <h2 style={{ margin: 0, fontSize: "var(--wa-font-size-l)" }}>The cycle</h2>
          <ol style={{ margin: 0 }}>
            <li>Crosspost checks the watched tweet.app account on a regular schedule.</li>
            <li>Anything published after you connected, and not seen before, becomes an item.</li>
            <li>
              With automatic posting on, the item goes straight to X. With it off, the item waits in{" "}
              <strong>Waiting</strong> until you approve or dismiss it.
            </li>
            <li>Every attempt lands in <strong>History</strong> with its result.</li>
          </ol>
          <p style={{ margin: 0, color: "var(--wa-color-text-quiet)" }}>
            Each post is remembered, so a post is never sent to X twice — even if a check runs
            again or a connection is repaired later.
          </p>
        </div>
      </WaCard>

      <WaCard>
        <div className="wa-stack wa-gap-s">
          <h2 style={{ margin: 0, fontSize: "var(--wa-font-size-l)" }}>
            Automatic or review first
          </h2>
          <p style={{ margin: 0 }}>
            Review-first is the default and the safer starting point: nothing reaches X until you
            press approve. Switch on <strong>Post to X automatically</strong> once a few approvals
            have looked right. You can turn it back off at any moment; items already sent are not
            recalled.
          </p>
        </div>
      </WaCard>

      <WaCard>
        <div className="wa-stack wa-gap-s">
          <h2 style={{ margin: 0, fontSize: "var(--wa-font-size-l)" }}>What gets skipped</h2>
          <ul style={{ margin: 0 }}>
            <li>
              <strong>Replies</strong> — skipped by default. A reply usually makes no sense outside
              the thread it belongs to.
            </li>
            <li>
              <strong>Quotes</strong> — sent by default. Turn them off if the quoted post will not
              exist on X.
            </li>
            <li>
              <strong>Long posts</strong> — tweet.app allows more characters than X. Choose{" "}
              <em>Shorten them to fit</em> to trim the text, or <em>Leave them out</em> to skip
              anything too long rather than publish a cut-off version.
            </li>
          </ul>
        </div>
      </WaCard>

      <WaCallout variant="warning">
        <WaIcon slot="icon" name="triangle-exclamation" />
        Text only, for now. Images, videos and threads are not carried across, and posts are not
        edited or deleted on X when they change on tweet.app.
      </WaCallout>

      <WaCard>
        <div className="wa-stack wa-gap-s">
          <h2 style={{ margin: 0, fontSize: "var(--wa-font-size-l)" }}>Waiting and History</h2>
          <p style={{ margin: 0 }}>
            <strong>Waiting</strong> shows every item held for approval, with the text exactly as it
            would be published. <strong>History</strong> keeps the record: what was sent, what was
            skipped and why, and what failed. If posting stops unexpectedly, History is the first
            place to look, then the{" "}
            <Link to="/docs/troubleshooting">troubleshooting guide</Link>.
          </p>
        </div>
      </WaCard>

      <WaCard>
        <div className="wa-stack wa-gap-s">
          <h2 style={{ margin: 0, fontSize: "var(--wa-font-size-l)" }}>Your responsibilities</h2>
          <p style={{ margin: 0 }}>
            Posts published through Crosspost are published by you, with your own X app. Automated
            posting is subject to the{" "}
            <a href="https://docs.x.com/developer-terms" target="_blank" rel="noopener noreferrer">
              X Developer Terms
            </a>
            , the{" "}
            <a href="https://x.com/en/tos" target="_blank" rel="noopener noreferrer">
              X Terms of Service
            </a>{" "}
            and the{" "}
            <a
              href="https://tweet.app/terms-of-service/"
              target="_blank"
              rel="noopener noreferrer"
            >
              tweet.app Terms of Service
            </a>
            , including their rules on duplicate and automated content.
          </p>
        </div>
      </WaCard>
    </article>
  );
}
