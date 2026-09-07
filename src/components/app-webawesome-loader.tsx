import { WebAwesomeLoader } from "@/design-system/font-awsome-web-awesome-171158";
import { readSsrPreference } from "@/lib/client-preferences";

/**
 * Design-system element loader, wired to the per-device SSR-mode preference.
 *
 * Renders nothing, so reading the stored preference during render cannot
 * cause a hydration mismatch; the loader's own effect needs the flag on its
 * first mount, which is too early for an effect-based read.
 */
export function AppWebAwesomeLoader(): React.ReactElement {
  const hydrate = typeof window !== "undefined" && readSsrPreference();
  return <WebAwesomeLoader hydrate={hydrate} />;
}
