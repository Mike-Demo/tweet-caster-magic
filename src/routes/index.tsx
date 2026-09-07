import { AppWebAwesomeLoader } from "@/components/app-webawesome-loader";
import { AppFooter } from "@/components/app-footer";
import { SiteNav } from "@/components/site-nav";
import { SITE_URL, homeJsonLd } from "@/lib/structured-data";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { getCaptchaSiteKey, verifyCaptcha } from "@/lib/captcha.functions";
import {
  HCaptcha,
  WaButton,
  WaCallout,
  WaCard,
  WaIcon,
  WaSpinner,
} from "@/design-system/font-awsome-web-awesome-171158";
import type { HCaptchaHandle } from "@/design-system/font-awsome-web-awesome-171158/webawesome/patterns/hcaptcha";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): { mode?: Mode } =>
    search["mode"] === "signup" || search["mode"] === "signin"
      ? { mode: search["mode"] }
      : {},
  loader: async () => await getCaptchaSiteKey(),
  head: () => ({
    meta: [
      { title: "Crosspost — send your tweet.app posts straight to X" },
      {
        name: "description",
        content:
          "Connect your tweet.app account and your own X developer keys, then let every new post go out to X automatically or after a quick review.",
      },
      { property: "og:title", content: "Crosspost — tweet.app to X, automatically" },
      {
        property: "og:description",
        content:
          "Watch a tweet.app account and repost everything new to X with your own developer keys.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: `${SITE_URL}/og-cover.png` },
      { name: "twitter:image", content: `${SITE_URL}/og-cover.png` },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
    scripts: [{ type: "application/ld+json", children: homeJsonLd() }],
  }),
  component: Landing,
});

type Mode = "signin" | "signup";

function Landing() {
  const navigate = useNavigate();
  const { siteKey } = Route.useLoaderData();
  const search = Route.useSearch();
  const [mode, setMode] = useState<Mode>(search.mode ?? "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const captchaRef = useRef<HCaptchaHandle | null>(null);

  useEffect(() => {
    if (search.mode) setMode(search.mode);
  }, [search.mode]);

  useEffect(() => {
    let active = true;

    // Full-page Google sign-in returns to this route with the tokens in the
    // URL (hash on most providers, query string on some). Nothing else in the
    // app consumes them, so establish the session here before anything else.
    async function consumeOAuthReturn(): Promise<boolean> {
      if (typeof window === "undefined") return false;
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const query = new URLSearchParams(window.location.search);
      const accessToken = hash.get("access_token") ?? query.get("access_token");
      const refreshToken = hash.get("refresh_token") ?? query.get("refresh_token");
      const oauthError = hash.get("error_description") ?? query.get("error_description");

      if (oauthError) {
        setError(oauthError);
        window.history.replaceState(null, "", window.location.pathname);
        return false;
      }
      if (!accessToken || !refreshToken) return false;

      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      window.history.replaceState(null, "", window.location.pathname);
      if (sessionError) {
        setError("Google sign-in could not be completed. Please try again.");
        return false;
      }
      return true;
    }

    void (async () => {
      const signedIn = await consumeOAuthReturn();
      if (!active) return;
      if (signedIn) {
        void navigate({ to: "/app" });
        return;
      }
      const { data } = await supabase.auth.getSession();
      if (active && data.session) void navigate({ to: "/app" });
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) void navigate({ to: "/app" });
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);


  async function handleGoogle() {
    setError(null);
    setNotice(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError("Google sign-in could not start. Please try again.");
      return;
    }
    if (result.redirected) return;
    void navigate({ to: "/app" });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setNotice(null);

    if (!captchaToken) {
      setError("Please complete the challenge first.");
      return;
    }

    setBusy(true);
    try {
      await verifyCaptcha({ data: { token: captchaToken } });

      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (signUpError) throw signUpError;
        if (!data.session) {
          setNotice("Check your inbox and confirm your address to finish signing up.");
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong.");
    } finally {
      setBusy(false);
      setCaptchaToken(null);
      captchaRef.current?.reset();
    }
  }

  return (
    <>
      <AppWebAwesomeLoader />
      <SiteNav />
      <main id="main-content" className="wa-stack wa-gap-2xl" style={{ paddingBlock: "var(--wa-space-3xl)", paddingInline: "var(--wa-space-l)", maxWidth: "68rem", marginInline: "auto" }}>
        <WaCallout variant="warning">
          <WaIcon slot="icon" name="triangle-exclamation" />
          <strong>Service status:</strong> tweet.app changed its API and no longer answers public
          requests, so posting may not work until you connect your own tweet.app account in the
          dashboard. tweet.app’s{" "}
          <a
            href="https://app.tweet.app/post/13b0e028-7164-429f-9045-9c264d741298"
            target="_blank"
            rel="noopener noreferrer"
          >
            @punkrokk announced
          </a>{" "}
          it: “2.) API locked down. No more (intentionally) public APIs ATM.” Details on the{" "}
          <a href="/changelog">changelog</a>.
        </WaCallout>

        <section className="wa-grid" style={{ ["--min-column-size" as string]: "22rem", gap: "3rem", alignItems: "center" }}>
          <div className="wa-stack wa-gap-l">
            <span className="wa-cluster wa-gap-xs" style={{ color: "var(--wa-color-brand-fill-loud)", fontWeight: "var(--wa-font-weight-semibold)" }}>
              <WaIcon name="repeat" /> tweet.app → X
            </span>
            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", lineHeight: 1.05, margin: 0 }}>
              Post once on tweet.app. Land on X automatically.
            </h1>
            <p style={{ fontSize: "1.15rem", color: "var(--wa-color-text-quiet)", maxWidth: "34rem" }}>
              Point us at your tweet.app handle, paste the keys from your own X developer app,
              and every new post goes out on your behalf — instantly, or after you approve it.
            </p>
            <ul className="wa-stack wa-gap-s" style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                "Your own X developer keys, encrypted and used only on our servers.",
                "Automatic posting on a schedule, or a review queue you control.",
                "Skip replies or quote posts, and never send the same post twice.",
              ].map((line) => (
                <li key={line} style={{ display: "flex", gap: "0.5rem", alignItems: "start" }}>
                  <WaIcon name="circle-check" style={{ color: "var(--wa-color-success-fill-loud)", marginTop: "0.2rem" }} />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <WaCard style={{ width: "100%" }}>
            <form className="wa-stack wa-gap-m" onSubmit={handleSubmit}>
              <h2 style={{ margin: 0 }}>{mode === "signin" ? "Sign in" : "Create your account"}</h2>

              {error ? <WaCallout variant="danger">{error}</WaCallout> : null}
              {notice ? <WaCallout variant="success">{notice}</WaCallout> : null}

              <WaButton
                type="button"
                appearance="outlined"
                onClick={() => {
                  void handleGoogle();
                }}
              >
                <WaIcon slot="start" name="google" family="brands" /> Continue with Google
              </WaButton>

              <span
                style={{
                  textAlign: "center",
                  color: "var(--wa-color-text-quiet)",
                  fontSize: "0.9rem",
                }}
              >
                or use your email
              </span>



              <label className="wa-stack wa-gap-2xs" htmlFor="auth-email">
                <span>Email</span>
                <input
                  id="auth-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>

              <label className="wa-stack wa-gap-2xs" htmlFor="auth-password">
                <span>Password</span>
                <input
                  id="auth-password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </label>


              <HCaptcha
                ref={captchaRef}
                siteKey={siteKey}
                onVerify={(token) => setCaptchaToken(token)}
                onExpire={() => setCaptchaToken(null)}
                onError={() => setCaptchaToken(null)}
              />

              <WaButton type="submit" variant="brand" disabled={busy}>
                {busy ? <WaSpinner slot="start" /> : null}
                {mode === "signin" ? "Sign in" : "Create account"}
              </WaButton>

              <button
                type="button"
                onClick={() => {
                  setMode(mode === "signin" ? "signup" : "signin");
                  setError(null);
                  setNotice(null);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--wa-color-brand-fill-loud)",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                {mode === "signin"
                  ? "New here? Create an account"
                  : "Already have an account? Sign in"}
              </button>
            </form>
          </WaCard>
        </section>

      </main>

      <AppFooter />
    </>
  );
}
