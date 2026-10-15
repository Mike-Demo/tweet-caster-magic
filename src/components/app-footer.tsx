import { useEffect, useState } from "react";
import type { ReactElement } from "react";

import { AppearanceControls } from "@/components/appearance-controls";
import { SiteFooter } from "@/design-system/font-awsome-web-awesome-171158";

/**
 * Per-visit carbon estimate, computed entirely in the visitor's browser from
 * Performance API transfer sizes and the Sustainable Web Design model in
 * CO2.js. No external API calls; renders nothing when the estimate is
 * unavailable.
 */
function CarbonEstimateLine(): ReactElement | null {
  const [grams, setGrams] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    async function estimate(): Promise<void> {
      if (typeof performance === "undefined") return;

      const entries = [
        ...performance.getEntriesByType("navigation"),
        ...performance.getEntriesByType("resource"),
      ];
      const totalBytes = entries.reduce<number>(
        (sum, entry) => sum + ("transferSize" in entry ? entry.transferSize : 0),
        0,
      );
      if (!Number.isFinite(totalBytes)) return;

      const { co2 } = await import("@tgwf/co2");
      const model = new co2({ model: "swd", version: 4 });
      const value = model.perByte(totalBytes, false);
      if (!active || !Number.isFinite(value)) return;
      setGrams(value);
    }

    void estimate().catch(() => {
      /* leave hidden on any failure */
    });
    return () => {
      active = false;
    };
  }, []);

  if (grams === null) return null;

  return (
    <p
      style={{
        marginBlock: "0 var(--wa-space-m)",
        marginInline: "auto",
        paddingInline: "var(--wa-space-l)",
        fontSize: "var(--wa-font-size-2xs)",
        lineHeight: "var(--wa-line-height-expanded)",
        color: "var(--wa-color-text-quiet)",
        textAlign: "center",
      }}
    >
      This visit ≈ {grams.toFixed(2)} g CO₂e · estimated with CO2.js (The Green Web
      Foundation)
    </p>
  );
}

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
        .{" "}
        <a href="/changelog">Changelog</a>.
      </p>
      <CarbonEstimateLine />
      <SiteFooter />
      <AppearanceControls />
    </>
  );
}
