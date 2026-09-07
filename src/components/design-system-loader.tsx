import type * as React from "react";
import { WebAwesomeLoader } from "@/design-system/font-awsome-web-awesome-171158/webawesome/setup";
import { WA_LOADER_PROPS } from "@/lib/webawesome-delivery";

/**
 * Mounts the Web Awesome element loader using the app's configured delivery
 * mode. Rendered once per page, inside routed content.
 */
export function DesignSystemLoader(): React.ReactElement {
  return <WebAwesomeLoader source={WA_LOADER_PROPS.source} hydrate={WA_LOADER_PROPS.hydrate} />;
}
