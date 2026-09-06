import { createFileRoute } from "@tanstack/react-router";
import { authenticateCronRequest } from "@/integrations/supabase/cron-auth";

/** Scheduled job: pulls new tweet.app posts and sends them to X for everyone with auto-posting on. */
export const Route = createFileRoute("/api/public/hooks/auto-post")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const jobSecret = process.env["AUTO_POST_JOB_SECRET"];
        const presented = /^Bearer ([^\s,]+)$/.exec(request.headers.get("authorization") ?? "")?.[1];

        let authorized = false;
        if (jobSecret && presented) {
          const { createHash, timingSafeEqual } = await import("node:crypto");
          const digest = (value: string) => createHash("sha256").update(value, "utf8").digest();
          authorized = timingSafeEqual(digest(presented), digest(jobSecret));
        }

        if (!authorized) {
          const unauthorized = await authenticateCronRequest(request);
          if (unauthorized) return unauthorized;
        }

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
