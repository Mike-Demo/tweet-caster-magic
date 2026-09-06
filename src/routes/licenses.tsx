import { createFileRoute } from "@tanstack/react-router";

import {
  LicensesPage,
  SiteFooter,
  WebAwesomeLoader,
} from "@/design-system/font-awsome-web-awesome-171158";
import { baseCredits } from "@/design-system/font-awsome-web-awesome-171158/webawesome/patterns/licenses";

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
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Licenses,
});

function Licenses() {
  return (
    <>
      <WebAwesomeLoader />
      <main style={{ padding: "3rem 1.5rem", maxWidth: "60rem", margin: "0 auto" }}>
        <LicensesPage
          entries={[
            ...baseCredits,
            {
              name: "hCaptcha",
              author: "Intuition Machines, Inc.",
              license: "Proprietary service",
              url: "https://www.hcaptcha.com/",
              note: "Bot protection on the sign-in and sign-up form.",
            },
          ]}
        />
      </main>
      <SiteFooter />
    </>
  );
}
