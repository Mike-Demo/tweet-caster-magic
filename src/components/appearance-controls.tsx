import { useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";

import { WaIcon, WaSwitch } from "@/design-system/font-awsome-web-awesome-171158";
import {
  applyAppearance,
  readSsrPreference,
  resolveAppearance,
  storeAppearance,
  storeSsrPreference,
  type Appearance,
} from "@/lib/client-preferences";

type SwitchElement = HTMLElement & { checked: boolean };

function useSwitch(
  checked: boolean,
  onToggle: (next: boolean) => void,
): React.RefObject<SwitchElement | null> {
  const ref = useRef<SwitchElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.checked = checked;
  }, [checked]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const handler = () => onToggle(element.checked);
    element.addEventListener("change", handler);
    return () => element.removeEventListener("change", handler);
  }, [onToggle]);

  return ref;
}

/**
 * Footer controls: light/dark appearance and the design system's
 * server-rendered ("SSR") startup mode. Placement only — the switches keep
 * their own styling.
 */
export function AppearanceControls(): ReactElement {
  const [ready, setReady] = useState(false);
  const [appearance, setAppearance] = useState<Appearance>("light");
  const [ssrMode, setSsrMode] = useState(false);

  useEffect(() => {
    setAppearance(resolveAppearance());
    setSsrMode(readSsrPreference());
    setReady(true);
  }, []);

  const appearanceRef = useSwitch(appearance === "dark", (next) => {
    const value: Appearance = next ? "dark" : "light";
    setAppearance(value);
    storeAppearance(value);
    applyAppearance(value);
  });

  const ssrRef = useSwitch(ssrMode, (next) => {
    setSsrMode(next);
    storeSsrPreference(next);
    // Elements register once per document, so the new mode takes effect on
    // the next load rather than mid-session.
    window.location.reload();
  });

  return (
    <div
      className="wa-stack wa-gap-xs wa-align-items-center"
      style={{ marginBlockStart: "var(--wa-space-l)", textAlign: "center" }}
    >
      <div className="wa-cluster wa-gap-l wa-justify-content-center">
        <WaSwitch ref={appearanceRef} size="s" disabled={!ready}>
          <WaIcon slot="prefix" name={appearance === "dark" ? "moon" : "sun"} />
          Dark appearance
        </WaSwitch>

        <WaSwitch ref={ssrRef} size="s" disabled={!ready}>
          Server-rendered mode
        </WaSwitch>
      </div>

      <p
        style={{
          margin: 0,
          maxWidth: "36rem",
          fontSize: "var(--wa-font-size-xs)",
          color: "var(--wa-color-text-quiet)",
        }}
      >
        Server-rendered mode keeps page pieces hidden until they are fully ready instead of
        letting them appear half-styled. Turning it on or off reloads the page.
      </p>
    </div>
  );
}
