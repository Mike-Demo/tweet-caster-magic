import type { ReactElement } from "react";

import { SiteFooter } from "@/design-system/font-awsome-web-awesome-171158";

/**
 * Standard footer plus the legal disclaimer shown on every page.
 * Placement only — the design-system footer keeps its own styling.
 */
export function AppFooter(): ReactElement {
  return (
    <>
      <p
        style={{
          marginBlockStart: "var(--wa-space-2xl)",
          marginBlockEnd: "var(--wa-space-m)",
          marginInline: "auto",
          paddingInline: "var(--wa-space-l)",
          fontSize: "var(--wa-font-size-s)",
          lineHeight: "var(--wa-line-height-expanded)",
          color: "var(--wa-color-text-quiet)",
          textAlign: "center",
        }}
      >
        Crosspost is an independent service and is not affiliated with, endorsed by, or
        sponsored by X Corp. or Operation Bluebird, Inc. Using Crosspost requires your own X
        developer account and your own tweet.app account, and you remain responsible for
        following the{" "}
        <a href="https://docs.x.com/developer-terms" target="_blank" rel="noreferrer">
          X Developer Terms
        </a>
        , the{" "}
        <a href="https://x.com/en/tos" target="_blank" rel="noreferrer">
          X Terms of Service
        </a>
        , and the{" "}
        <a href="https://tweet.app/terms-of-service/" target="_blank" rel="noreferrer">
          tweet.app Terms of Service
        </a>
        .
      </p>
      <SiteFooter />
    </>
  );
}
