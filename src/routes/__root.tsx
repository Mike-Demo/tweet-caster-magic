import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import {
  FONT_AWESOME_STYLE_URL,
  WEB_AWESOME_STYLE_URL,
} from "@/design-system/font-awsome-web-awesome-171158/webawesome/cdn";
import { WEB_AWESOME_HTML_CLASSES } from "@/design-system/font-awsome-web-awesome-171158/webawesome/setup";
import { PREFERENCES_BOOTSTRAP_SCRIPT } from "@/lib/client-preferences";

import appCss from "../styles.css?url";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        httpEquiv: "Content-Security-Policy",
        content: "default-src 'self'; script-src 'self' 'unsafe-inline' https://umami-lite.view.fast https://cdn.jsdelivr.net https://esm.sh https://js.hcaptcha.com https://hcaptcha.com https://*.hcaptcha.com https://app.termageddon.com; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://hcaptcha.com https://*.hcaptcha.com; img-src 'self' data: https://cdn.jsdelivr.net https://app.aikido.dev; font-src 'self' data: https://cdn.jsdelivr.net; connect-src 'self' https://umami-lite.view.fast https://*.supabase.co wss://*.supabase.co https://cdn.jsdelivr.net https://app.termageddon.com https://hcaptcha.com https://*.hcaptcha.com; frame-src https://hcaptcha.com https://*.hcaptcha.com; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'",
      },
      { name: "author", content: "MikeDemo" },
      { name: "google-site-verification", content: "RHlwBdxnagu8yjEC1UQ3cV-WcIJ17lGECi8uJYHO6P4" },
      { property: "og:site_name", content: "Crosspost" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      { rel: "preconnect", href: "https://cdn.jsdelivr.net", crossOrigin: "anonymous" },
      { rel: "dns-prefetch", href: "https://cdn.jsdelivr.net" },
      { rel: "stylesheet", href: WEB_AWESOME_STYLE_URL },
      { rel: "stylesheet", href: FONT_AWESOME_STYLE_URL },
      { rel: "stylesheet", href: appCss },

      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "icon", href: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { rel: "icon", href: "/icon-512.png", type: "image/png", sizes: "512x512" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
      { rel: "manifest", href: "/manifest.webmanifest" },
    ],
    scripts: [{ children: PREFERENCES_BOOTSTRAP_SCRIPT }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    // The head bootstrap script sets the appearance class and SSR flag on
    // <html> before hydration, so React must not "correct" them back.
    <html lang="en" className={WEB_AWESOME_HTML_CLASSES} suppressHydrationWarning>

      <head>
        <HeadContent />
        <script defer src="https://umami-lite.view.fast/tracker.js" data-website-id="627e6b2b-a61f-4530-8ac5-78a8581a263f"></script>
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

// Keep this root providers-only: canvas preview routes (/__mockup,
// /__component) render inside it, so any chrome leaks into every frame.
function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
