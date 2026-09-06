/**
 * Termageddon policy keys for the hosted terms of service and privacy policy.
 *
 * Fill these in with the `data-policy-key` values from the Termageddon embed
 * codes. While a key is empty the matching route renders the interim
 * plain-language policy written into the page instead.
 */
export const TERMAGEDDON_POLICY_KEYS = {
  terms: "",
  privacy: "",
} as const;

export type PolicyName = keyof typeof TERMAGEDDON_POLICY_KEYS;
