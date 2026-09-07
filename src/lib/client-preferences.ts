/**
 * Per-device UI preferences (appearance, Web Awesome SSR mode).
 *
 * Every read touches localStorage / matchMedia, so callers must only invoke
 * these in the browser — from an effect, an event handler, or a component
 * that renders nothing.
 */

export const APPEARANCE_STORAGE_KEY = "crosspost:appearance";
export const WA_SSR_STORAGE_KEY = "crosspost:wa-ssr";

export type Appearance = "light" | "dark";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function readStoredAppearance(): Appearance | null {
  if (!isBrowser()) return null;
  try {
    const value = window.localStorage.getItem(APPEARANCE_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

export function systemAppearance(): Appearance {
  if (!isBrowser() || typeof window.matchMedia !== "function") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function resolveAppearance(): Appearance {
  return readStoredAppearance() ?? systemAppearance();
}

export function applyAppearance(appearance: Appearance): void {
  if (!isBrowser()) return;
  const root = document.documentElement;
  root.classList.toggle("wa-dark", appearance === "dark");
  root.classList.toggle("wa-light", appearance !== "dark");
}

export function storeAppearance(appearance: Appearance): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(APPEARANCE_STORAGE_KEY, appearance);
  } catch {
    /* storage unavailable — the class still applies for this page view */
  }
}

/** Server-rendered mode is on unless this device has explicitly turned it off. */
export function readSsrPreference(): boolean {
  if (!isBrowser()) return true;
  try {
    return window.localStorage.getItem(WA_SSR_STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

export function storeSsrPreference(enabled: boolean): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(WA_SSR_STORAGE_KEY, enabled ? "on" : "off");
  } catch {
    /* storage unavailable — the preference simply won't persist */
  }
}

/**
 * Runs in the document head before first paint so a stored dark appearance
 * (and SSR mode) is applied without a flash of the default theme.
 */
export const PREFERENCES_BOOTSTRAP_SCRIPT = `(function(){try{
var root=document.documentElement;
var stored=localStorage.getItem(${JSON.stringify(APPEARANCE_STORAGE_KEY)});
var dark=stored?stored==="dark":window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches;
root.classList.toggle("wa-dark",!!dark);
root.classList.toggle("wa-light",!dark);
if(localStorage.getItem(${JSON.stringify(WA_SSR_STORAGE_KEY)})!=="off"){root.setAttribute("data-wa-ssr","");}
}catch(e){}})();`;
