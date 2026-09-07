import type { ReactElement } from "react";

import { WaIcon } from "@/design-system/font-awsome-web-awesome-171158";

/** Exact brand colours requested for the mark (not theme tokens). */
const BIRD_COLOR = "#1D9BF0";
const ARROW_COLOR = "#000000";

/**
 * Crosspost mark: the repeat arrows with a small bird centred inside.
 * Composed from the two Font Awesome Free icons used in the concept.
 */
export function BrandMark(): ReactElement {
  return (
    <span
      aria-hidden="true"
      style={{ position: "relative", display: "inline-flex", lineHeight: 1 }}
    >
      <WaIcon name="retweet" style={{ color: ARROW_COLOR }} />
      <WaIcon
        name="dove"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "0.4em",
          color: BIRD_COLOR,
        }}
      />
    </span>
  );
}
