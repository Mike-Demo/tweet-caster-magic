import { createMiddleware } from "@tanstack/react-start";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Requires a session that has passed the authenticator-app step (AAL2).
 * Chains on top of requireSupabaseAuth, so handlers still receive
 * `supabase`, `userId` and `claims` in context.
 */
export const requireMfa = createMiddleware({ type: "function" })
  .middleware([requireSupabaseAuth])
  .server(async ({ next, context }) => {
    const claims = context.claims as { aal?: string };
    if (claims.aal !== "aal2") {
      throw new Error("Unauthorized: two-factor verification required");
    }
    return next();
  });
