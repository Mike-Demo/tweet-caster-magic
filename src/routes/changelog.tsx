import { AppWebAwesomeLoader } from "@/components/app-webawesome-loader";
import { AppFooter } from "@/components/app-footer";
import { SiteNav } from "@/components/site-nav";
import {
  WaBadge,
  WaCard,
} from "@/design-system/font-awsome-web-awesome-171158";
import { SITE_URL, changelogJsonLd } from "@/lib/structured-data";
import { createFileRoute } from "@tanstack/react-router";

const TITLE = "Changelog — Crosspost";
const DESCRIPTION =
  "Update history for Crosspost: service status, new features, and notes on what changed and why.";

export const Route = createFileRoute("/changelog")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/changelog` },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: `${SITE_URL}/og-cover.png` },
      { name: "twitter:image", content: `${SITE_URL}/og-cover.png` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/changelog` }],
    scripts: [
      { type: "application/ld+json", children: changelogJsonLd(ENTRIES) },
    ],
  }),
  component: Changelog,
});

interface Source {
  readonly label: string;
  readonly quote: string;
  readonly href: string;
}

interface Entry {
  readonly date: string;
  readonly title: string;
  readonly kind: "Status" | "New" | "Improved" | "Fixed";
  readonly notes: readonly string[];
  readonly source?: Source;
}

const ENTRIES: readonly Entry[] = [
  {
    date: "2026-09-07",
    title: "tweet.app now needs your own connection",
    kind: "Status",
    notes: [
      "tweet.app changed its API so it no longer answers public requests — reading your posts now requires a signed-in token.",
      "Setup step 1 is new: paste your own tweet.app access token, with a guide for finding it and a Test connection button.",
      "Your token is stored encrypted and never sent back to your browser; clearing it stops all reading immediately.",
      "Errors now read in plain language, and automatic posting pauses instead of retrying every hour when a connection is broken.",
    ],
    source: {
      label: "@punkrokk on tweet.app",
      quote: "2.) API locked down. No more (intentionally) public APIs ATM.",
      href: "https://app.tweet.app/post/13b0e028-7164-429f-9045-9c264d741298",
    },
  },
  {
    date: "2026-09-05",
    title: "New logo, social cards and app icons",
    kind: "Improved",
    notes: [
      "The Crosspost mark — the repeat arrows around a bird — now appears in the header, browser tab, and installed app icons.",
      "Shared links show a proper preview image.",
    ],
  },
  {
    date: "2026-09-04",
    title: "Menu, terms and privacy pages",
    kind: "New",
    notes: [
      "A menu was added with sign in, register and every public page.",
      "Terms of Service and Privacy Policy pages were published, along with the independence disclaimer in the footer.",
    ],
  },
  {
    date: "2026-09-03",
    title: "One set of X keys with a mode you choose",
    kind: "Improved",
    notes: [
      "Crosspost now keeps a single set of X developer keys and lets you say whether they came from Development, Staging or Production.",
      "Detailed key guidance moved into a collapsible section, with a recommendation to test in Development first.",
    ],
  },
  {
    date: "2026-09-02",
    title: "Security hardening",
    kind: "Fixed",
    notes: [
      "Stored X keys are unreachable from any browser — only trusted server code can use them.",
      "Dependency updates closed known vulnerabilities, and the two-factor code entry no longer blocks the sixth digit.",
    ],
  },
];

function badgeVariant(kind: Entry["kind"]): "brand" | "success" | "warning" | "neutral" {
  if (kind === "Status") return "warning";
  if (kind === "New") return "brand";
  if (kind === "Fixed") return "success";
  return "neutral";
}

function Changelog() {
  return (
    <>
      <AppWebAwesomeLoader />
      <SiteNav />
      <main id="main-content"
        className="wa-stack wa-gap-l"
        style={{ padding: "3rem 1.5rem", maxWidth: "48rem", margin: "0 auto" }}
      >
        <h1 style={{ margin: 0 }}>Changelog</h1>
        <p style={{ margin: 0, color: "var(--wa-color-text-quiet)" }}>
          What changed in Crosspost, newest first, with notes on why.
        </p>

        {ENTRIES.map((entry) => (
          <WaCard key={entry.date + entry.title}>
            <div className="wa-stack wa-gap-s">
              <div className="wa-cluster wa-gap-xs" style={{ alignItems: "center" }}>
                <WaBadge variant={badgeVariant(entry.kind)}>{entry.kind}</WaBadge>
                <time
                  dateTime={entry.date}
                  style={{
                    color: "var(--wa-color-text-quiet)",
                    fontSize: "var(--wa-font-size-s)",
                  }}
                >
                  {entry.date}
                </time>
              </div>
              <h2 style={{ margin: 0, fontSize: "var(--wa-font-size-l)" }}>{entry.title}</h2>
              <ul style={{ margin: 0 }}>
                {entry.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
              {entry.source ? (
                <p style={{ margin: 0, fontSize: "var(--wa-font-size-s)" }}>
                  “{entry.source.quote}” —{" "}
                  <a href={entry.source.href} target="_blank" rel="noopener noreferrer">
                    {entry.source.label}
                  </a>
                </p>
              ) : null}
            </div>
          </WaCard>
        ))}
      </main>
      <AppFooter />
    </>
  );
}
