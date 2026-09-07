import type { ReactElement } from "react";

import { WaIcon } from "@/design-system/font-awsome-web-awesome-171158";

/**
 * Crosspost mark: the repeat arrows with a small bird centred inside.
 * Colours are fixed brand values (see .brand-mark-* in styles.css); the
 * arrows flip to white in dark mode.
 */
export function BrandMark(): ReactElement {
  return (
    <span aria-hidden="true" className="brand-mark">
      <WaIcon className="brand-mark-arrows" name="retweet" />
      <WaIcon className="brand-mark-bird" name="dove" />
    </span>
  );
}


