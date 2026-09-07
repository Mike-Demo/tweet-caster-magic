import { AppWebAwesomeLoader } from "@/components/app-webawesome-loader";
import { AppFooter } from "@/components/app-footer";
import { SiteNav } from "@/components/site-nav";
import { TermageddonPolicy } from "@/components/termageddon-policy";
import { TERMAGEDDON_POLICY_KEYS } from "@/lib/policies";
import { SITE_URL, pageJsonLd } from "@/lib/structured-data";
import { createFileRoute } from "@tanstack/react-router";

const TITLE = "Terms of Service — Crosspost";
const DESCRIPTION =
  "The terms that apply when you use Crosspost to repost your tweet.app posts to X with your own X developer keys.";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/terms` },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: `${SITE_URL}/og-cover.png` },
      { name: "twitter:image", content: `${SITE_URL}/og-cover.png` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/terms` }],
    scripts: [
      {
        type: "application/ld+json",
        children: pageJsonLd({
          path: "/terms",
          name: "Terms of Service",
          description: DESCRIPTION,
        }),
      },
    ],
  }),
  component: Terms,
});

function Terms() {
  const policyKey = TERMAGEDDON_POLICY_KEYS.terms;

  return (
    <>
      <AppWebAwesomeLoader />
      <SiteNav />
      <main id="main-content"
        className="wa-stack wa-gap-l"
        style={{ padding: "3rem 1.5rem", maxWidth: "48rem", margin: "0 auto" }}
      >
        <h1 style={{ margin: 0 }}>Terms of Service</h1>

        {policyKey ? (
          <TermageddonPolicy policyKey={policyKey} />
        ) : (
          <div className="wa-stack wa-gap-m">
            <p style={{ margin: 0, color: "var(--wa-color-text-quiet)" }}>
              Crosspost is an independent service operated by MikeDemo. By creating an account
              you agree to the terms below.
            </p>

            <section className="wa-stack wa-gap-2xs">
              <h2 style={{ margin: 0 }}>What the service does</h2>
              <p style={{ margin: 0 }}>
                Crosspost watches a tweet.app account you nominate and publishes new posts to X
                using X developer credentials that you supply, either automatically or after you
                approve each post.
              </p>
            </section>

            <section className="wa-stack wa-gap-2xs">
              <h2 style={{ margin: 0 }}>Accounts you bring</h2>
              <p style={{ margin: 0 }}>
                You need your own X developer account and app, and your own tweet.app account.
                Crosspost never posts through a shared or Crosspost-owned account. Everything sent
                on your behalf appears as coming from the account that owns your X app, and you are
                responsible for that content.
              </p>
            </section>

            <section className="wa-stack wa-gap-2xs">
              <h2 style={{ margin: 0 }}>Rules you remain bound by</h2>
              <p style={{ margin: 0 }}>
                You remain responsible for following the{" "}
                <a href="https://docs.x.com/developer-terms" target="_blank" rel="noreferrer">
                  X Developer Terms
                </a>
                , the{" "}
                <a href="https://x.com/en/tos" target="_blank" rel="noreferrer">
                  X Terms of Service
                </a>{" "}
                and the{" "}
                <a href="https://tweet.app/terms-of-service/" target="_blank" rel="noreferrer">
                  tweet.app Terms of Service
                </a>
                . Do not use Crosspost for spam, automated abuse, or content you do not have the
                right to publish.
              </p>
            </section>

            <section className="wa-stack wa-gap-2xs">
              <h2 style={{ margin: 0 }}>Availability and warranty</h2>
              <p style={{ margin: 0 }}>
                Crosspost is provided as is, without warranty of any kind. Posting can fail or be
                delayed because of rate limits, outages, or changes made by X or tweet.app. To the
                extent permitted by law, MikeDemo is not liable for lost posts, lost reach, or any
                indirect or consequential loss.
              </p>
            </section>

            <section className="wa-stack wa-gap-2xs">
              <h2 style={{ margin: 0 }}>Ending your use</h2>
              <p style={{ margin: 0 }}>
                You can remove your keys or delete your account at any time, which stops all
                posting immediately. We may suspend or end access if the service is misused or if
                required by X or tweet.app.
              </p>
            </section>

            <section className="wa-stack wa-gap-2xs">
              <h2 style={{ margin: 0 }}>Changes</h2>
              <p style={{ margin: 0 }}>
                These terms may be updated. Continuing to use Crosspost after an update means you
                accept the revised terms.
              </p>
            </section>
          </div>
        )}
      </main>
      <AppFooter />
    </>
  );
}
