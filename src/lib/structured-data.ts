/** Shared schema.org JSON-LD used by route head() definitions. */

export const SITE_URL = "https://tweet.mikedemo.dev";

const TERMS_URLS: readonly string[] = [
  "https://docs.x.com/developer-terms",
  "https://x.com/en/tos",
  "https://tweet.app/terms-of-service/",
];

const PUBLISHER = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "MikeDemo",
  url: SITE_URL,
  sameAs: [
    "https://www.linkedin.com/in/mikedemopoulos",
    "https://x.com/mike_demo",
    "https://www.threads.com/@mdemop",
    "https://app.tweet.app/post/92206629-1525-4a74-8f51-39e226fc9e75",
  ],
} as const;

const WEBSITE = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "Crosspost",
  url: SITE_URL,
  publisher: { "@id": `${SITE_URL}/#organization` },
} as const;

const WEB_APPLICATION = {
  "@type": "WebApplication",
  "@id": `${SITE_URL}/#webapp`,
  name: "Crosspost",
  url: SITE_URL,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser with JavaScript enabled.",
  description:
    "Crosspost watches a tweet.app account and reposts new posts to X using each person's own X developer keys, automatically or after review. Crosspost is an independent service and is not affiliated with, endorsed by, or sponsored by X Corp. or Operation Bluebird, Inc. Using Crosspost requires your own X developer account and your own tweet.app account.",
  publisher: { "@id": `${SITE_URL}/#organization` },
  isPartOf: { "@id": `${SITE_URL}/#website` },
  license: `${SITE_URL}/licenses`,
  termsOfService: TERMS_URLS,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description:
      "Free to use; people bring their own X developer account and tweet.app account.",
  },
} as const;

/** JSON-LD graph for the public home page. */
export function homeJsonLd(): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      PUBLISHER,
      WEBSITE,
      WEB_APPLICATION,
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        ],
      },
    ],
  });
}

/** JSON-LD graph for the open source licenses page. */
export function licensesJsonLd(licenseNames: readonly string[]): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/licenses#webpage`,
        name: "Open source licenses — Crosspost",
        url: `${SITE_URL}/licenses`,
        description:
          "Credits and license information for the open source software and services that power Crosspost.",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        about: { "@id": `${SITE_URL}/#webapp` },
        license: licenseNames,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Open source licenses",
            item: `${SITE_URL}/licenses`,
          },
        ],
      },
    ],
  });
}
