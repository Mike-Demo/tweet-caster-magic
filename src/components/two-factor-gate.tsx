import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";

import { supabase } from "@/integrations/supabase/client";
import { WaButton } from "@/design-system/font-awsome-web-awesome-171158/webawesome/react/button";
import { WaCallout } from "@/design-system/font-awsome-web-awesome-171158/webawesome/react/callout";
import { WaCard } from "@/design-system/font-awsome-web-awesome-171158/webawesome/react/card";
import { WaSpinner } from "@/design-system/font-awsome-web-awesome-171158/webawesome/react/spinner";
import { WebAwesomeLoader } from "@/design-system/font-awsome-web-awesome-171158/webawesome/setup";

type Stage = "checking" | "enroll" | "challenge" | "ready";

interface EnrollInfo {
  factorId: string;
  qrCode: string;
  secret: string;
}

async function signOut(): Promise<void> {
  await supabase.auth.signOut();
  window.location.href = "/";
}

/**
 * Blocks its children until the signed-in person has completed the
 * authenticator-app step. People without a factor are enrolled first.
 */
export function TwoFactorGate({ children }: { children: ReactNode }) {
  const [stage, setStage] = useState<Stage>("checking");
  const [enrollInfo, setEnrollInfo] = useState<EnrollInfo | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startEnrollment = useCallback(async () => {
    const { data: factors } = await supabase.auth.mfa.listFactors();
    const stale = (factors?.all ?? []).filter(
      (factor) => factor.factor_type === "totp" && factor.status !== "verified",
    );
    for (const factor of stale) {
      await supabase.auth.mfa.unenroll({ factorId: factor.id });
    }

    const { data, error: enrollError } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: `Crosspost ${new Date().toISOString()}`,
    });
    if (enrollError || !data) {
      setError(enrollError?.message ?? "Could not start setup. Please try again.");
      return;
    }
    setEnrollInfo({ factorId: data.id, qrCode: data.totp.qr_code, secret: data.totp.secret });
    setFactorId(data.id);
    setStage("enroll");
  }, []);

  const evaluate = useCallback(async () => {
    setError(null);
    const { data: aal, error: aalError } =
      await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aalError) {
      setError(aalError.message);
      return;
    }
    if (aal?.currentLevel === "aal2") {
      setStage("ready");
      return;
    }

    const { data: factors } = await supabase.auth.mfa.listFactors();
    const verified = (factors?.totp ?? []).find((factor) => factor.status === "verified");
    if (verified) {
      setFactorId(verified.id);
      setEnrollInfo(null);
      setStage("challenge");
      return;
    }
    await startEnrollment();
  }, [startEnrollment]);

  useEffect(() => {
    void evaluate();
  }, [evaluate]);

  async function handleVerify(event: React.FormEvent) {
    event.preventDefault();
    if (!factorId) return;
    if (code.trim().length !== 6) {
      setError("Enter the full 6-digit code from your authenticator app.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId,
      });
      if (challengeError || !challenge) throw challengeError ?? new Error("Could not start check.");

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.id,
        code: code.trim(),
      });
      if (verifyError) throw verifyError;

      setCode("");
      await evaluate();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "That code didn't work. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (stage === "ready") return <>{children}</>;

  if (stage === "checking") {
    return (
      <div style={{ display: "grid", placeItems: "center", minHeight: "60vh", padding: "var(--wa-space-3xl)" }}>
        <WaSpinner style={{ fontSize: "var(--wa-font-size-2xl)" }} />
      </div>
    );
  }

  const setup = stage === "enroll" && enrollInfo !== null;

  return (
    <>
      <WebAwesomeLoader />
      <main
      className="wa-stack wa-gap-l"
      style={{ padding: "var(--wa-space-3xl) var(--wa-space-l)", maxWidth: "34rem", margin: "0 auto" }}
    >
      <WaCard>
        <form className="wa-stack wa-gap-m" onSubmit={handleVerify}>
          <h1 style={{ margin: 0, fontSize: "var(--wa-font-size-xl)" }}>
            {setup ? "Set up your authenticator" : "Enter your 6-digit code"}
          </h1>

          {setup ? (
            <>
              <p style={{ margin: 0, color: "var(--wa-color-text-quiet)" }}>
                Scan this with Google Authenticator, 1Password, Authy or a similar app, then type
                the 6-digit code it shows.
              </p>
              <div className="wa-cluster wa-justify-content-center">
                <img
                  src={enrollInfo.qrCode}
                  alt="Authenticator setup QR code"
                  style={{ display: "block", maxWidth: "100%" }}
                />
              </div>
              <p style={{ margin: 0, fontSize: "var(--wa-font-size-s)", color: "var(--wa-color-text-quiet)" }}>
                Can&apos;t scan? Enter this key instead:{" "}
                <code style={{ wordBreak: "break-all" }}>{enrollInfo.secret}</code>
              </p>
            </>
          ) : (
            <p style={{ margin: 0, color: "var(--wa-color-text-quiet)" }}>
              Open your authenticator app and type the current code for Crosspost.
            </p>
          )}

          {error ? <WaCallout variant="danger">{error}</WaCallout> : null}

          <label className="wa-stack wa-gap-2xs" htmlFor="totp-code">
            <span>6-digit code</span>
            <input
              id="totp-code"
              name="totpCode"
              inputMode="numeric"

              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
            />
          </label>

          <WaButton type="submit" variant="brand" disabled={busy}>
            {busy ? <WaSpinner slot="start" /> : null}
            {setup ? "Confirm and continue" : "Verify"}
          </WaButton>

          <WaButton
            type="button"
            appearance="plain"
            onClick={() => {
              void signOut();
            }}
          >
            Sign out
          </WaButton>
        </form>
      </WaCard>
      </main>
    </>
  );
}

/** Dashboard panel showing that two-factor is active, with a reset path. */
export function TwoFactorSettings() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleReset() {
    setBusy(true);
    setError(null);
    try {
      const { data: factors } = await supabase.auth.mfa.listFactors();
      for (const factor of factors?.all ?? []) {
        await supabase.auth.mfa.unenroll({ factorId: factor.id });
      }
      await supabase.auth.refreshSession();
      window.location.reload();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not reset two-factor.");
      setBusy(false);
    }
  }

  return (
    <WaCard>
      <div className="wa-stack wa-gap-s">
        <h2 style={{ margin: 0, fontSize: "var(--wa-font-size-l)" }}>Two-factor authentication</h2>
        <p style={{ margin: 0, color: "var(--wa-color-text-quiet)" }}>
          Active. Every sign-in asks for a code from your authenticator app.
        </p>
        {error ? <WaCallout variant="danger">{error}</WaCallout> : null}
        <WaButton
          appearance="outlined"
          disabled={busy}
          onClick={() => {
            void handleReset();
          }}
        >
          {busy ? <WaSpinner slot="start" /> : null}
          Set up a new device
        </WaButton>
      </div>
    </WaCard>
  );
}
