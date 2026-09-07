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

import appCss from "../styles.css?url";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "MikeDemo" },
      { name: "google-site-verification", content: "RHlwBdxnagu8yjEC1UQ3cV-WcIJ17lGECi8uJYHO6P4" },
      { property: "og:site_name", content: "Crosspost" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      // Warm up the origins the first paint depends on before the CSS and
      // element definitions are requested.
      { rel: "preconnect", href: "https://cdn.jsdelivr.net", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://esm.sh", crossOrigin: "anonymous" },
      { rel: "dns-prefetch", href: "https://cdn.jsdelivr.net" },
      { rel: "dns-prefetch", href: "https://esm.sh" },
      { rel: "preconnect", href: SUPABASE_ORIGIN, crossOrigin: "anonymous" },

      { rel: "preload", as: "style", href: WEB_AWESOME_STYLE_URL },
      { rel: "preload", as: "style", href: FONT_AWESOME_STYLE_URL },
      { rel: "stylesheet", href: WEB_AWESOME_STYLE_URL },
      { rel: "stylesheet", href: FONT_AWESOME_STYLE_URL },
      { rel: "stylesheet", href: appCss },


      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "icon", href: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { rel: "icon", href: "/icon-512.png", type: "image/png", sizes: "512x512" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
      { rel: "manifest", href: "/manifest.webmanifest" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={WEB_AWESOME_HTML_CLASSES}>
      <head>
        <HeadContent />
      </head>
      <body>
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
