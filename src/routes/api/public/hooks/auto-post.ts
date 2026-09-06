import { createFileRoute } from "@tanstack/react-router";
import { authenticateCronRequest } from "@/integrations/supabase/cron-auth";

/** Scheduled job: pulls new tweet.app posts and sends them to X for everyone with auto-posting on. */
export const Route = createFileRoute("/api/public/hooks/auto-post")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const unauthorized = await authenticateCronRequest(request);
        if (unauthorized) return unauthorized;

        const { runScheduledSync } = await import("@/lib/sync.server");
        try {
          const result = await runScheduledSync();
          return Response.json({ success: true, ...result });
        } catch (cause) {
          console.error("auto-post job failed", cause);
          return Response.json({ success: false, error: "Job failed" }, { status: 500 });
        }
      },
    },
  },
});
