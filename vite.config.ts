import path from "path";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { componentTagger } from "lovable-tagger";
import { mockupPreviewPlugin } from "./mockupPreviewPlugin";

export default defineConfig(({ command, mode }) => {
  // Cloudflare Workers plugin only on build (produces the worker output);
  // the workerd runtime isn't available for the dev server.
  const useCloudflare = command === "build";

  return {
    server: {
      host: "::",
      port: 8080,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    plugins: [
      mockupPreviewPlugin(),
      tsConfigPaths({ projects: ["./tsconfig.json"] }),
      ...(useCloudflare ? [cloudflare({ viteEnvironment: { name: "ssr" } })] : []),
      tanstackStart({
        // Fully static public pages are rendered once at build time.
        // "/" reads the captcha key per request and "/app" is per-user, so
        // discovery stays off and this list is exhaustive.
        pages: [
          { path: "/terms" },
          { path: "/privacy" },
          { path: "/licenses" },
          { path: "/changelog" },
        ],
        prerender: { enabled: true, autoStaticPathsDiscovery: false },
      }),

      viteReact(),
      ...(mode === "development" ? [componentTagger()] : []),
    ],
  };
});
