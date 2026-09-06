import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { verifyCaptcha } from "@/lib/captcha.functions";
import {
  HCaptcha,
  WaButton,
  WaCallout,
  WaCard,
  WaIcon,
  WaSpinner,
  WebAwesomeLoader,
} from "@/design-system/font-awsome-web-awesome-171158";
import type { HCaptchaHandle } from "@/design-system/font-awsome-web-awesome-171158/webawesome/patterns/hcaptcha";

const HCAPTCHA_SITE_KEY =
  (import.meta.env["VITE_HCAPTCHA_SITE_KEY"] as string | undefined) ??
  "10000000-ffff-ffff-ffff-000000000001";

export const Route = createFileRoute("/")({
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
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

type Mode = "signin" | "signup";

function Landing() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const captchaRef = useRef<HCaptchaHandle | null>(null);

  useEffect(() => {
    let active = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (active && data.session) void navigate({ to: "/app" });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) void navigate({ to: "/app" });
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

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
      <WebAwesomeLoader />
      <main className="wa-stack wa-gap-2xl" style={{ padding: "3rem 1.5rem", maxWidth: "68rem", margin: "0 auto" }}>
        <section className="wa-grid" style={{ ["--min-column-size" as string]: "22rem", gap: "3rem", alignItems: "center" }}>
          <div className="wa-stack wa-gap-l">
            <span className="wa-cluster wa-gap-xs" style={{ color: "var(--wa-color-brand-fill-loud)", fontWeight: 600 }}>
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

              <label className="wa-stack wa-gap-2xs">
                <span>Email</span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>

              <label className="wa-stack wa-gap-2xs">
                <span>Password</span>
                <input
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
                siteKey={HCAPTCHA_SITE_KEY}
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
    </>
  );
}
