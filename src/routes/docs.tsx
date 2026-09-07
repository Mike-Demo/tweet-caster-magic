import type { ReactElement } from "react";
import { Link, Outlet, createFileRoute } from "@tanstack/react-router";

import { AppWebAwesomeLoader } from "@/components/app-webawesome-loader";
import { AppFooter } from "@/components/app-footer";
import { SiteNav } from "@/components/site-nav";
import { WaIcon } from "@/design-system/font-awsome-web-awesome-171158";

export const Route = createFileRoute("/docs")({
  component: DocsLayout,
});

const TABS = [
  { to: "/docs/setup", label: "Setup", icon: "list-check" },
  { to: "/docs/posting", label: "Posting", icon: "paper-plane" },
  { to: "/docs/tokens", label: "Tokens & keys", icon: "key" },
  { to: "/docs/troubleshooting", label: "Troubleshooting", icon: "life-ring" },
] as const;

function DocsLayout(): ReactElement {
  return (
    <>
      <AppWebAwesomeLoader />
      <SiteNav />
      <main
        id="main-content"
        className="wa-stack wa-gap-l"
        style={{
          paddingBlock: "var(--wa-space-3xl)",
          paddingInline: "var(--wa-space-l)",
          maxWidth: "48rem",
          marginInline: "auto",
        }}
      >
        <nav aria-label="Documentation" className="wa-cluster wa-gap-xs">
          {TABS.map((tab) => (
            <Link
              key={tab.to}
              to={tab.to}
              className="wa-cluster wa-gap-2xs"
              style={{
                alignItems: "center",
                textDecoration: "none",
                color: "var(--wa-color-text-normal)",
                paddingBlock: "var(--wa-space-2xs)",
                paddingInline: "var(--wa-space-s)",
                borderRadius: "var(--wa-border-radius-pill)",
                fontSize: "var(--wa-font-size-s)",
                backgroundColor: "var(--wa-color-surface-lowered)",
              }}
              activeProps={{
                style: {
                  backgroundColor: "var(--wa-color-brand-fill-loud)",
                  color: "var(--wa-color-brand-on-loud)",
                },
              }}
            >
              <WaIcon name={tab.icon} /> {tab.label}
            </Link>
          ))}
        </nav>
        <Outlet />
      </main>
      <AppFooter />
    </>
  );
}
