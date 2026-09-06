# Confirmed email sign-up + required authenticator app at sign-in

## What changes for people using Crosspost

**Signing up**
- After creating an account, nothing is unlocked yet: a confirmation email goes out and the page says "Check your inbox to confirm your address."
- Clicking the link in that email brings them back to Crosspost and finishes the sign-up.
- Unconfirmed accounts cannot sign in.

**Signing in (everyone, including Google)**
- After email + password (or Google), a second step appears asking for the 6-digit code from an authenticator app.
- Anyone who hasn't set up an authenticator yet — including all existing accounts — sees a one-time setup screen: a QR code to scan with Google Authenticator, 1Password, Authy, etc., plus a typed key for people who can't scan, then a code to confirm it worked.
- The dashboard is unreachable until that second step is passed.
- A "Sign out" escape is always visible on the second step so nobody gets stuck.

## Screens

- Sign-in / sign-up page: gains a second stage that shows either "Set up your authenticator" (QR + confirm code) or "Enter your 6-digit code".
- Dashboard: unchanged, but only reachable once the code check passes.
- A small "Two-factor" section on the dashboard so someone can see it's active and re-run setup if they lose their phone (they must enter a current code to change it).

## Technical notes

- Auth settings: leave email confirmation on (`auto_confirm_email: false`) and verify via `supabase--configure_auth`. Sign-up already passes `emailRedirectTo: window.location.origin`; keep that and stop treating a null session as signed in — surface the "confirm your email" notice instead (already partly handled in `src/routes/index.tsx`).
- 2FA uses Supabase MFA (TOTP): `supabase.auth.mfa.enroll({ factorType: 'totp' })` for setup (returns QR SVG + secret), `challenge()` + `verify()` for the code check, and `mfa.listFactors()` to decide setup vs. challenge.
- Enforcement is based on assurance level: `supabase.auth.mfa.getAuthenticatorAssuranceLevel()`. The gate in `src/routes/_authenticated/route.tsx` is integration-managed, so add the enforcement in a small client-side guard component wrapping the protected content: if `currentLevel !== 'aal2'` and either a verified factor exists or none does, render the 2FA step instead of the dashboard.
- The Google path returns to `/` and lands in the same gate, so Google users hit the identical requirement with no separate flow.
- Server side: add an assurance check to the authenticated server functions in `src/lib/app.functions.ts` via the existing `requireSupabaseAuth` context claims (`aal` claim must be `aal2`), so a hand-crafted request can't skip the code check. Reject with a clear error otherwise.
- Unverified/abandoned enroll attempts are unenrolled before starting a fresh enrollment to avoid factor pile-up.
- New UI built with the existing Web Awesome components; no new dependencies.

## Out of scope

- Recovery/backup codes and SMS codes (can be added later; today the fallback is re-enrolling from the dashboard while signed in).
- Changing the confirmation email's branding — it uses the default Cloud template unless you want custom-branded auth emails.
