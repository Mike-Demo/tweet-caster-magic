import { AppWebAwesomeLoader } from "@/components/app-webawesome-loader";
import { AppFooter } from "@/components/app-footer";
import { SiteNav } from "@/components/site-nav";
import { Link, createFileRoute } from "@tanstack/react-router";
import { SITE_URL, pageJsonLd } from "@/lib/structured-data";

const TITLE = "Contact — Crosspost";
const DESCRIPTION = "How to reach the person behind Crosspost.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/contact` },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: `${SITE_URL}/og-cover.png` },
      { name: "twitter:image", content: `${SITE_URL}/og-cover.png` },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/contact` },
      { rel: "alternate", type: "text/markdown", href: `${SITE_URL}/contact.md` },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: pageJsonLd({
          path: "/contact",
          name: "Contact",
          description: DESCRIPTION,
        }),
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <>
      <AppWebAwesomeLoader />
      <SiteNav />
      <main
        id="main-content"
        className="wa-stack wa-gap-l"
        style={{ paddingBlock: "var(--wa-space-3xl)", paddingInline: "var(--wa-space-l)", maxWidth: "48rem", marginInline: "auto" }}
      >
        <h1 style={{ margin: 0 }}>Contact</h1>

        <p style={{ margin: 0 }}>
          Crosspost is built and run by MikeDemo. Here is how to reach us:
        </p>

        <section className="wa-stack wa-gap-2xs">
          <h2 style={{ margin: 0 }}>Get in touch</h2>
          <ul style={{ margin: 0 }}>
            <li>
              Email:{" "}
              <a href="mailto:hey.demo@mikedemo.email">hey.demo@mikedemo.email</a>
            </li>
            <li>
              GitHub:{" "}
              <a href="https://github.com/Mike-Demo" target="_blank" rel="noreferrer">
                Mike-Demo
              </a>
            </li>
            <li>
              LinkedIn:{" "}
              <a href="https://www.linkedin.com/in/mikedemopoulos" target="_blank" rel="noreferrer">
                mikedemopoulos
              </a>
            </li>
          </ul>
        </section>

        <section className="wa-stack wa-gap-2xs">
          <h2 style={{ margin: 0 }}>Before you write</h2>
          <ul style={{ margin: 0 }}>
            <li>
              Setup questions are usually answered in the{" "}
              <Link to="/docs/setup">setup guide</Link>.
            </li>
            <li>
              Posting problems are usually answered in{" "}
              <Link to="/docs/troubleshooting">troubleshooting</Link>.
            </li>
            <li>
              How your keys are stored is explained in the{" "}
              <Link to="/docs/security">security documentation</Link>.
            </li>
          </ul>
        </section>

        <section className="wa-stack wa-gap-2xs">
          <h2 style={{ margin: 0 }}>Data deletion</h2>
          <p style={{ margin: 0 }}>
            For data deletion requests, see the{" "}
            <Link to="/privacy">Privacy Policy</Link>.
          </p>
        </section>
      </main>
      <AppFooter />
    </>
  );
}
