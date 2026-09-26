import { AppWebAwesomeLoader } from "@/components/app-webawesome-loader";
import { AppFooter } from "@/components/app-footer";
import { SiteNav } from "@/components/site-nav";
import { createFileRoute } from "@tanstack/react-router";

import {
  LicensesPage,
} from "@/design-system/font-awsome-web-awesome-171158";
import { baseCredits } from "@/design-system/font-awsome-web-awesome-171158/webawesome/patterns/licenses";
import { SITE_URL, licensesJsonLd } from "@/lib/structured-data";

export const Route = createFileRoute("/licenses")({
  head: () => ({
    meta: [
      { title: "Open source licenses — Crosspost" },
      {
        name: "description",
        content:
          "Credits and license information for the open source software and services that power Crosspost.",
      },
      { property: "og:title", content: "Open source licenses — Crosspost" },
      {
        property: "og:description",
        content: "Credits for the open source software and services behind Crosspost.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/licenses` },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: `${SITE_URL}/og-cover.png` },
      { name: "twitter:image", content: `${SITE_URL}/og-cover.png` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/licenses` }],
    scripts: [
      {
        type: "application/ld+json",
        children: licensesJsonLd([
          ...new Set(baseCredits.map((entry) => entry.license)),
        ]),
      },
    ],
  }),
  component: Licenses,
});

function Licenses() {
  return (
    <>
      <AppWebAwesomeLoader />
      <SiteNav />
      <main id="main-content" style={{ paddingBlock: "var(--wa-space-3xl)", paddingInline: "var(--wa-space-l)", maxWidth: "60rem", marginInline: "auto" }}>
        <LicensesPage
          groups={[
            {
              title: "Open source libraries",
              entries: [
                ...baseCredits,
                {
                  name: "Supabase",
                  author: "Supabase, Inc.",
                  license: "MIT (client libraries)",
                  url: "https://github.com/supabase/supabase-js/blob/master/LICENSE",
                  note: "Accounts and sign-in.",
                },
              ],
            },
            {
              title: "Services",
              entries: [
                {
                  name: "hCaptcha",
                  author: "Intuition Machines, Inc.",
                  license: "Proprietary service",
                  url: "https://www.hcaptcha.com/",
                  note: "Bot protection on the sign-in and sign-up form.",
                },
                {
                  name: "tweet.app API",
                  author: "Operation Bluebird, Inc.",
                  license: "Public API, used with each person's own account",
                  url: "https://tweet.app",
                  note: "Source of the posts this app reposts.",
                },
                {
                  name: "X API",
                  author: "X Corp.",
                  license: "X Developer Agreement and Policy",
                  url: "https://developer.x.com/en/developer-terms/agreement-and-policy",
                  note: "Posts are published to X using each person's own X developer account and keys. This app is not affiliated with X Corp.",
                },

              ],
            },
          ]}
        />
      </main>
      <AppFooter />
    </>
  );
}
