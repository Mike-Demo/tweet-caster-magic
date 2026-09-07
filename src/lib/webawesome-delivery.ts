/**
 * How the Web Awesome custom elements are delivered to the browser.
 *
 *   "bundle" — element definitions ship with the app (~800 KB up front,
 *              works offline, no third-party request).
 *   "cdn"    — the pinned autoloader registers only the elements a page
 *              actually uses, on demand. Smallest first download.
 *   "ssr"    — hydration-aware build, for pages whose markup was rendered
 *              ahead of time with declarative shadow DOM. Experimental:
 *              producing that markup needs the design system's
 *              `webawesome/ssr/render.server` helper plus the
 *              `@awesome.me/webawesome` and Lit SSR packages, which cannot
 *              run on the live request path of edge hosting.
 */
export type WebAwesomeDelivery = "bundle" | "cdn" | "ssr";

const CONFIGURED = import.meta.env["VITE_WEBAWESOME_DELIVERY"] as string | undefined;

function parse(value: string | undefined): WebAwesomeDelivery {
  return value === "bundle" || value === "cdn" || value === "ssr" ? value : "cdn";
}

/** Active delivery mode. Override with VITE_WEBAWESOME_DELIVERY at build time. */
export const WA_DELIVERY: WebAwesomeDelivery = parse(CONFIGURED);

/** Props the design system's loader needs for the active mode. */
export const WA_LOADER_PROPS: { source: "bundle" | "cdn"; hydrate: boolean } =
  WA_DELIVERY === "cdn"
    ? { source: "cdn", hydrate: false }
    : WA_DELIVERY === "ssr"
      ? { source: "bundle", hydrate: true }
      : { source: "bundle", hydrate: false };
