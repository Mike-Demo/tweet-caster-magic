# Separate keys for Development, Staging and Production

X gives each app three environments. Today Crosspost stores one set of keys per person, so switching environments means overwriting them. This adds a slot for each environment, a clear button on each, and a choice of which one actually posts.

## What you'll see

On the keys screen, three cards side by side (stacked on a phone): **Development**, **Staging**, **Production**.

Each card shows one of two states:

- **Not connected** — the four boxes (API Key, API Key Secret, Access Token, Access Token Secret) and a "Connect" button. The buttons read "Connect • Development", "Connect • Staging", "Connect • Production".
- **Connected** — the X account it posts as, the masked key hint, a "Clear keys" button, and a "Use this one" button (or an "In use" badge when it is already the active one).

Above the cards, a single line states which environment is currently in use, e.g. "Posting with your Production keys." If no environment is chosen yet, connecting the first set makes it active automatically.

Clearing the active set stops posting until another set is chosen; the screen says so plainly, and the sync/auto-post steps report "Add your X keys first" as they do today.

## Behaviour rules

- Each set is verified against X when saved, exactly as now — a bad set is rejected with the same plain-language message.
- Sending posts always uses the active environment's keys, both for "Post now" and for scheduled auto-posting.
- Keys are still encrypted before storage, never returned to the browser, and only the masked hint plus the X account name are shown back.
- Clearing a set removes it permanently; there is no undo, and the button asks for confirmation first.

## Technical notes

Database migration:
- Add `environment TEXT NOT NULL DEFAULT 'production'` to `public.x_credentials` with a check constraint of `development | staging | production`; replace the primary key with `(user_id, environment)`. Existing rows become `production`.
- Add `active_x_environment TEXT` to `public.profiles` (same check, nullable), backfilled to `production` where a credential row exists.
- No new grants needed: `x_credentials` stays service-role only with its deny-all policies; `profiles` already grants the owner.

Server functions in `src/lib/app.functions.ts`:
- `getDashboard` returns `credentials` as an array of three entries (`environment`, `connected`, `hint`, `xUsername`) plus `activeEnvironment`.
- `saveXCredentials` and `removeXCredentials` take an `environment` argument, validated against the three values; saving the first set sets `active_x_environment`, clearing the active set nulls it.
- New `setActiveXEnvironment` server function, guarded by the existing `requireMfa` middleware, that only accepts an environment that has stored keys.
- `loadCredentials` in `src/lib/sync.server.ts` reads `profiles.active_x_environment` and selects that row; returns null when nothing is active, so existing "Add your X keys first" paths still work.
- Regenerate `src/integrations/supabase/types.ts` after the migration.

UI in `src/routes/_authenticated/app.tsx`:
- Replace the single credentials block with a map over the three environments using existing Web Awesome cards, buttons and inputs already used on that screen; keys form state becomes keyed by environment.
- Keep the copy-paste panel (website, terms, privacy, callback URLs) as-is — those values are identical across environments.
- The sign-in, sign-up and two-step code controls are untouched.
