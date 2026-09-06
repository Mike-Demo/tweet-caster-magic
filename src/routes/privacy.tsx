import { AppFooter } from "@/components/app-footer";
import { SiteNav } from "@/components/site-nav";
import { TermageddonPolicy } from "@/components/termageddon-policy";
import { WebAwesomeLoader } from "@/design-system/font-awsome-web-awesome-171158";
import { TERMAGEDDON_POLICY_KEYS } from "@/lib/policies";
import { SITE_URL, pageJsonLd } from "@/lib/structured-data";
import { createFileRoute } from "@tanstack/react-router";

const TITLE = "Privacy Policy — Crosspost";
const DESCRIPTION =
  "What Crosspost stores, how your X developer keys are protected, who your data is shared with, and how to delete it.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/privacy` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/privacy` }],
    scripts: [
      {
        type: "application/ld+json",
        children: pageJsonLd({
          path: "/privacy",
          name: "Privacy Policy",
          description: DESCRIPTION,
        }),
      },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  const policyKey = TERMAGEDDON_POLICY_KEYS.privacy;

  return (
    <>
      <WebAwesomeLoader />
      <SiteNav />
      <main
        className="wa-stack wa-gap-l"
        style={{ padding: "3rem 1.5rem", maxWidth: "48rem", margin: "0 auto" }}
      >
        <h1 style={{ margin: 0 }}>Privacy Policy</h1>

        {policyKey ? (
          <TermageddonPolicy policyKey={policyKey} />
        ) : (
          <div className="wa-stack wa-gap-m">
            <p style={{ margin: 0, color: "var(--wa-color-text-quiet)" }}>
              Crosspost is operated by MikeDemo. This page explains what is stored and why.
            </p>

            <section className="wa-stack wa-gap-2xs">
              <h2 style={{ margin: 0 }}>What is stored</h2>
              <ul style={{ margin: 0 }}>
                <li>Your email address and sign-in details, including two-factor setup.</li>
                <li>The tweet.app handle you watch and your posting preferences.</li>
                <li>
                  A record of posts already sent, so the same post is never published twice.
                </li>
                <li>Your four X developer values, encrypted at rest.</li>
              </ul>
            </section>

            <section className="wa-stack wa-gap-2xs">
              <h2 style={{ margin: 0 }}>How your X keys are handled</h2>
              <p style={{ margin: 0 }}>
                Your API key, API key secret, access token and access token secret are encrypted
                before they are stored, are only decrypted on the server when a post is published,
                and are never sent back to any browser — including yours.
              </p>
            </section>

            <section className="wa-stack wa-gap-2xs">
              <h2 style={{ margin: 0 }}>Who it is shared with</h2>
              <ul style={{ margin: 0 }}>
                <li>The hosting and database provider that runs the service.</li>
                <li>X, when a post is published with your credentials.</li>
                <li>tweet.app, when your watched account is checked for new posts.</li>
                <li>hCaptcha, which screens the sign-in and sign-up form for bots.</li>
              </ul>
              <p style={{ margin: 0 }}>
                Your data is not sold, and it is not used for advertising.
              </p>
            </section>

            <section className="wa-stack wa-gap-2xs">
              <h2 style={{ margin: 0 }}>Deleting your data</h2>
              <p style={{ margin: 0 }}>
                Removing your keys in the app deletes them and stops all posting immediately.
                Deleting your account removes your settings and post history. You can also revoke
                Crosspost&apos;s access at any time by regenerating your tokens in the X developer
                console.
              </p>
            </section>

            <section className="wa-stack wa-gap-2xs">
              <h2 style={{ margin: 0 }}>Contact</h2>
              <p style={{ margin: 0 }}>
                For any question about your data, reach MikeDemo through the links in the footer of
                this site.
              </p>
            </section>
          </div>
        )}
      </main>
      <AppFooter />
    </>
  );
}
