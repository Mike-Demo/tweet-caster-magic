import { useEffect, useRef } from "react";

const TERMAGEDDON_SCRIPT_SRC = "https://app.termageddon.com/js/termageddon.js";

interface TermageddonPolicyProps {
  /** The `data-policy-key` value from the Termageddon embed code. */
  policyKey: string;
}

/**
 * Renders a Termageddon-hosted policy. Termageddon injects the policy text
 * into the target element from its own script, so the script is appended once
 * after hydration rather than during server rendering.
 */
export function TermageddonPolicy({ policyKey }: TermageddonPolicyProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${TERMAGEDDON_SCRIPT_SRC}"]`,
    );
    if (existing) {
      existing.remove();
    }

    const script = document.createElement("script");
    script.src = TERMAGEDDON_SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, [policyKey]);

  return <div ref={containerRef} id="policy" data-policy-key={policyKey} />;
}
