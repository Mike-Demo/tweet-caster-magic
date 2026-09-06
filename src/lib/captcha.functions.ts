import { createServerFn } from "@tanstack/react-start";

/** hCaptcha's public test key — used until a real site key is configured. */
export const HCAPTCHA_FALLBACK_SITE_KEY = "10000000-ffff-ffff-ffff-000000000001";

export const getCaptchaSiteKey = createServerFn({ method: "GET" }).handler(async () => {
  return { siteKey: process.env["HCAPTCHA_SITE_KEY"] ?? HCAPTCHA_FALLBACK_SITE_KEY };
});

export const verifyCaptcha = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string }) => {
    if (!data || typeof data.token !== "string" || data.token.length < 10) {
      throw new Error("Please complete the challenge.");
    }
    return { token: data.token };
  })
  .handler(async ({ data }) => {
    const secret = process.env["HCAPTCHA_SECRET_KEY"] ?? "0x0000000000000000000000000000000000000000";
    const response = await fetch("https://api.hcaptcha.com/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: data.token }),
    });

    const body = (await response.json()) as { success?: boolean };
    if (!body.success) throw new Error("The challenge could not be verified. Please try again.");
    return { ok: true as const };
  });
