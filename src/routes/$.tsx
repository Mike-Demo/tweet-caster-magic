import { createFileRoute, Link } from "@tanstack/react-router";

import { AppFooter } from "@/components/app-footer";
import { AppWebAwesomeLoader } from "@/components/app-webawesome-loader";
import { SiteNav } from "@/components/site-nav";
import { WaButton, WaIcon } from "@/design-system/font-awsome-web-awesome-171158";

const TITLE = "Page not found — Crosspost";
const DESCRIPTION = "That address doesn't exist on Crosspost. Here are the pages that do.";

const LINKS = [
  { to: "/", label: "Home", icon: "house" },
  { to: "/changelog", label: "Changelog", icon: "clock-rotate-left" },
  { to: "/terms", label: "Terms of Service", icon: "file-lines" },
  { to: "/privacy", label: "Privacy Policy", icon: "shield-halved" },
  { to: "/licenses", label: "Licenses", icon: "scale-balanced" },
] as const;

export const Route = createFileRoute("/$")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "noindex, follow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
    ],
  }),
  component: NotFound,
});

function NotFound() {
  return (
    <>
      <AppWebAwesomeLoader />
      <SiteNav />
      <main
        id="main-content"
        className="wa-stack wa-gap-l"
        style={{
          maxWidth: "42rem",
          marginInline: "auto",
          paddingBlock: "var(--wa-space-3xl)",
          paddingInline: "var(--wa-space-l)",
        }}
      >
        <h1 style={{ margin: 0 }}>Page not found</h1>
        <p style={{ margin: 0, color: "var(--wa-color-text-quiet)" }}>
          That address doesn&apos;t exist on Crosspost. Try one of these instead.
        </p>
        <div className="wa-cluster wa-gap-s">
          {LINKS.map((link) => (
            <Link key={link.to} to={link.to} style={{ textDecoration: "none" }}>
              <WaButton appearance="outlined" size="s">
                <WaIcon slot="start" name={link.icon} /> {link.label}
              </WaButton>
            </Link>
          ))}
        </div>
      </main>
      <AppFooter />
    </>
  );
}
