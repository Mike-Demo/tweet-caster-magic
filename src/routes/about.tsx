import { AppWebAwesomeLoader } from "@/components/app-webawesome-loader";
import { AppFooter } from "@/components/app-footer";
import { SiteNav } from "@/components/site-nav";
import { Link, createFileRoute } from "@tanstack/react-router";
import { SITE_URL, pageJsonLd } from "@/lib/structured-data";

const TITLE = "About — Crosspost";
const DESCRIPTION =
  "Crosspost is an independent service by MikeDemo that reposts tweet.app posts to X using your own developer keys.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/about` },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: `${SITE_URL}/og-cover.png` },
      { name: "twitter:image", content: `${SITE_URL}/og-cover.png` },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/about` },
      { rel: "alternate", type: "text/markdown", href: `${SITE_URL}/about.md` },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: pageJsonLd({
          path: "/about",
          name: "About",
          description: DESCRIPTION,
        }),
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <AppWebAwesomeLoader />
      <SiteNav />
      <main
        id="main-content"
        className="wa-stack wa-gap-l"
        style={{ paddingBlock: "var(--wa-space-3xl)", paddingInline: "var(--wa-space-l)", maxWidth: "48rem", marginInline: "auto" }}
      >
        <h1 style={{ margin: 0 }}>About Crosspost</h1>

        <p style={{ margin: 0 }}>
          Crosspost watches a tweet.app account and reposts new posts to X, automatically or
          after a quick review, using each person&apos;s own X developer keys.
        </p>

        <section className="wa-stack wa-gap-2xs">
          <h2 style={{ margin: 0 }}>Why it exists</h2>
          <p style={{ margin: 0 }}>
            Posting the same content to two networks by hand is tedious and error-prone.
            Crosspost removes the copy-paste step: write once on tweet.app, and let Crosspost
            carry new posts over to X — either the moment they appear, or after you approve
            each one.
          </p>
        </section>

        <section className="wa-stack wa-gap-2xs">
          <h2 style={{ margin: 0 }}>How it works</h2>
          <p style={{ margin: 0 }}>
            You connect your tweet.app account, add the four OAuth 1.0a values from your own X
            developer app, and choose your posting behavior. Crosspost never uses a shared
            account: everything posts as you, under your own keys, and stays under your
            control. See the <Link to="/docs/setup">setup guide</Link> to get started.
          </p>
        </section>

        <section className="wa-stack wa-gap-2xs">
          <h2 style={{ margin: 0 }}>Who makes it</h2>
          <p style={{ margin: 0 }}>
            Crosspost is built and run by MikeDemo as an independent service. It is not
            affiliated with, endorsed by, or sponsored by X Corp. or Operation Bluebird, Inc.
          </p>
        </section>

        <section className="wa-stack wa-gap-2xs">
          <h2 style={{ margin: 0 }}>Learn more</h2>
          <ul style={{ margin: 0 }}>
            <li><Link to="/docs/setup">Setup guide</Link></li>
            <li><Link to="/docs/security">Security</Link></li>
            <li><Link to="/changelog">Changelog</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </section>
      </main>
      <AppFooter />
    </>
  );
}
