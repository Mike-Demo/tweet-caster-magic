import { createServerFn } from "@tanstack/react-start";
import { requireMfa } from "@/lib/mfa-middleware";

export interface DashboardSettings {
  tweetUsername: string | null;
  tweetDisplayName: string | null;
  tweetAvatarUrl: string | null;
  autoPost: boolean;
  skipReplies: boolean;
  skipQuotes: boolean;
  longPostMode: string;
  lastSyncedAt: string | null;
}

export interface QueueItem {
  id: string;
  sourceText: string;
  sourceCreatedAt: string;
  status: string;
  xPostId: string | null;
  error: string | null;
  postedAt: string | null;
}

export const X_ENVIRONMENTS = ["development", "staging", "production"] as const;
export type XEnvironment = (typeof X_ENVIRONMENTS)[number];

export interface CredentialSlot {
  environment: XEnvironment;
  connected: boolean;
  hint: string | null;
  xUsername: string | null;
}

export interface TweetAppConnection {
  connected: boolean;
  hint: string | null;
  needsReconnect: boolean;
}

export interface DashboardData {
  settings: DashboardSettings;
  credentials: CredentialSlot[];
  activeEnvironment: XEnvironment | null;
  tweetApp: TweetAppConnection;
  posts: QueueItem[];
}


function parseEnvironment(value: unknown): XEnvironment {
  const environment = String(value ?? "");
  if (!X_ENVIRONMENTS.includes(environment as XEnvironment)) {
    throw new Error("Pick Development, Staging or Production.");
  }
  return environment as XEnvironment;
}


const emptySettings: DashboardSettings = {
  tweetUsername: null,
  tweetDisplayName: null,
  tweetAvatarUrl: null,
  autoPost: false,
  skipReplies: true,
  skipQuotes: false,
  longPostMode: "truncate",
  lastSyncedAt: null,
};

export const getDashboard = createServerFn({ method: "GET" })
  .middleware([requireMfa])
  .handler(async ({ context }): Promise<DashboardData> => {
    const { supabase, userId } = context;

    const [profileResult, postsResult] = await Promise.all([
      supabase
        .from("profiles")
        .select(
          "tweet_username, tweet_display_name, tweet_avatar_url, auto_post, skip_replies, skip_quotes, long_post_mode, last_synced_at, active_x_environment",
        )
        .eq("id", userId)
        .maybeSingle(),
      supabase
        .from("synced_posts")
        .select("id, source_text, source_created_at, status, x_post_id, error, posted_at")
        .eq("user_id", userId)
        .order("source_created_at", { ascending: false })
        .limit(200),
    ]);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [{ data: credentialRows }, { data: tweetAppRow }] = await Promise.all([
      supabaseAdmin
        .from("x_credentials")
        .select("environment, api_key_hint, x_username")
        .eq("user_id", userId),
      supabaseAdmin
        .from("tweet_app_credentials")
        .select("token_hint, needs_reconnect")
        .eq("user_id", userId)
        .maybeSingle(),
    ]);



    const profile = profileResult.data;
    const activeEnvironment = profile?.active_x_environment
      ? (profile.active_x_environment as XEnvironment)
      : null;

    return {
      settings: profile
        ? {
            tweetUsername: profile.tweet_username,
            tweetDisplayName: profile.tweet_display_name,
            tweetAvatarUrl: profile.tweet_avatar_url,
            autoPost: profile.auto_post,
            skipReplies: profile.skip_replies,
            skipQuotes: profile.skip_quotes,
            longPostMode: profile.long_post_mode,
            lastSyncedAt: profile.last_synced_at,
          }
        : emptySettings,
      activeEnvironment,
      credentials: X_ENVIRONMENTS.map((environment) => {
        const row = (credentialRows ?? []).find((item) => item.environment === environment);
        return {
          environment,
          connected: Boolean(row),
          hint: row?.api_key_hint ?? null,
          xUsername: row?.x_username ?? null,
        };
      }),

      tweetApp: {
        connected: Boolean(tweetAppRow),
        hint: tweetAppRow?.token_hint ?? null,
        needsReconnect: Boolean(tweetAppRow?.needs_reconnect),
      },



      posts: (postsResult.data ?? []).map((row) => ({
        id: row.id,
        sourceText: row.source_text,
        sourceCreatedAt: row.source_created_at,
        status: row.status,
        xPostId: row.x_post_id,
        error: row.error,
        postedAt: row.posted_at,
      })),
    };
  });

export const saveSourceAccount = createServerFn({ method: "POST" })
  .middleware([requireMfa])
  .inputValidator((data: { username: string }) => {
    const username = (data?.username ?? "").trim().replace(/^@/, "");
    if (!/^[A-Za-z0-9_.-]{1,40}$/.test(username)) throw new Error("That username doesn't look right.");
    return { username };
  })
  .handler(async ({ data, context }) => {
    const { fetchTweetAppProfile } = await import("./tweetApp.server");
    const { loadTweetAppToken } = await import("./sync.server");
    const token = await loadTweetAppToken(context.userId);
    if (!token) throw new Error("Connect your tweet.app account first.");
    const profile = await fetchTweetAppProfile(data.username, token);
    if (!profile) throw new Error(`No tweet.app account found for @${data.username}.`);


    const { error } = await context.supabase
      .from("profiles")
      .update({
        tweet_username: profile.username,
        tweet_display_name: profile.displayName,
        tweet_avatar_url: profile.avatarUrl,
        watch_since: new Date().toISOString(),
        last_synced_at: new Date().toISOString(),
      })
      .eq("id", context.userId);
    if (error) throw new Error(error.message);

    return { username: profile.username, displayName: profile.displayName };
  });

export const saveAutomationSettings = createServerFn({ method: "POST" })
  .middleware([requireMfa])
  .inputValidator(
    (data: {
      autoPost: boolean;
      skipReplies: boolean;
      skipQuotes: boolean;
      longPostMode: string;
    }) => ({
      autoPost: Boolean(data?.autoPost),
      skipReplies: Boolean(data?.skipReplies),
      skipQuotes: Boolean(data?.skipQuotes),
      longPostMode: data?.longPostMode === "skip" ? "skip" : "truncate",
    }),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("profiles")
      .update({
        auto_post: data.autoPost,
        skip_replies: data.skipReplies,
        skip_quotes: data.skipQuotes,
        long_post_mode: data.longPostMode,
      })
      .eq("id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const saveXCredentials = createServerFn({ method: "POST" })
  .middleware([requireMfa])
  .inputValidator(
    (data: {
      environment: string;
      apiKey: string;
      apiSecret: string;
      accessToken: string;
      accessSecret: string;
    }) => {
      const values = {
        environment: parseEnvironment(data?.environment),
        apiKey: (data?.apiKey ?? "").trim(),
        apiSecret: (data?.apiSecret ?? "").trim(),
        accessToken: (data?.accessToken ?? "").trim(),
        accessSecret: (data?.accessSecret ?? "").trim(),
      };
      if (
        [values.apiKey, values.apiSecret, values.accessToken, values.accessSecret].some(
          (value) => value.length < 10,
        )
      ) {
        throw new Error("All four values from your X developer app are required.");
      }
      return values;
    },
  )
  .handler(async ({ data, context }) => {
    const { verifyXCredentials } = await import("./x.server");
    const { encryptSecret } = await import("./crypto.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const account = await verifyXCredentials(data);

    const { error } = await supabaseAdmin.from("x_credentials").upsert(
      {
        user_id: context.userId,
        environment: data.environment,
        api_key_ct: encryptSecret(data.apiKey),
        api_secret_ct: encryptSecret(data.apiSecret),
        access_token_ct: encryptSecret(data.accessToken),
        access_secret_ct: encryptSecret(data.accessSecret),
        api_key_hint: `${data.apiKey.slice(0, 4)}…${data.apiKey.slice(-4)}`,
        x_username: account.username,
      },
      { onConflict: "user_id,environment" },
    );
    if (error) throw new Error(error.message);

    // Only one set of keys is kept; saving replaces any set stored under another mode.
    await supabaseAdmin
      .from("x_credentials")
      .delete()
      .eq("user_id", context.userId)
      .neq("environment", data.environment);

    await context.supabase
      .from("profiles")
      .update({ active_x_environment: data.environment })
      .eq("id", context.userId);

    return { xUsername: account.username, environment: data.environment };

  });

export const removeXCredentials = createServerFn({ method: "POST" })
  .middleware([requireMfa])
  .inputValidator((data: { environment: string }) => ({
    environment: parseEnvironment(data?.environment),
  }))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("x_credentials")
      .delete()
      .eq("user_id", context.userId)
      .eq("environment", data.environment);
    if (error) throw new Error(error.message);

    const { data: remaining } = await supabaseAdmin
      .from("x_credentials")
      .select("environment")
      .eq("user_id", context.userId);

    const { data: profile } = await context.supabase
      .from("profiles")
      .select("active_x_environment")
      .eq("id", context.userId)
      .maybeSingle();

    if (profile?.active_x_environment === data.environment) {
      const fallback = (remaining ?? [])[0]?.environment ?? null;
      await context.supabase
        .from("profiles")
        .update({ active_x_environment: fallback })
        .eq("id", context.userId);
    }

    return { ok: true as const };
  });

export const setActiveXEnvironment = createServerFn({ method: "POST" })
  .middleware([requireMfa])
  .inputValidator((data: { environment: string }) => ({
    environment: parseEnvironment(data?.environment),
  }))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("x_credentials")
      .select("environment")
      .eq("user_id", context.userId)
      .eq("environment", data.environment)
      .maybeSingle();
    if (!row) throw new Error("Add keys for that environment first.");

    const { error } = await context.supabase
      .from("profiles")
      .update({ active_x_environment: data.environment })
      .eq("id", context.userId);
    if (error) throw new Error(error.message);

    return { environment: data.environment };
  });

export const saveTweetAppToken = createServerFn({ method: "POST" })
  .middleware([requireMfa])
  .inputValidator((data: { token: string }) => {
    const token = (data?.token ?? "").trim().replace(/^Bearer\s+/i, "");
    if (token.length < 16) throw new Error("That doesn't look like a tweet.app access token.");
    return { token };
  })
  .handler(async ({ data, context }) => {
    const { fetchTweetAppProfile } = await import("./tweetApp.server");
    const { encryptSecret } = await import("./crypto.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: profile } = await context.supabase
      .from("profiles")
      .select("tweet_username")
      .eq("id", context.userId)
      .maybeSingle();

    // Confirm the token works before storing it.
    await fetchTweetAppProfile(profile?.tweet_username ?? "demo", data.token);

    const { error } = await supabaseAdmin.from("tweet_app_credentials").upsert(
      {
        user_id: context.userId,
        token_ct: encryptSecret(data.token),
        token_hint: `${data.token.slice(0, 4)}…${data.token.slice(-4)}`,
        needs_reconnect: false,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );
    if (error) throw new Error(error.message);

    return { ok: true as const };
  });

export const clearTweetAppToken = createServerFn({ method: "POST" })
  .middleware([requireMfa])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("tweet_app_credentials")
      .delete()
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const testTweetAppConnection = createServerFn({ method: "POST" })
  .middleware([requireMfa])
  .handler(async ({ context }) => {
    const { fetchTweetAppProfile } = await import("./tweetApp.server");
    const { loadTweetAppToken, markTweetAppReconnect } = await import("./sync.server");
    const { TweetAppAuthError } = await import("./tweetApp.server");

    const token = await loadTweetAppToken(context.userId);
    if (!token) throw new Error("Connect your tweet.app account first.");

    const { data: profile } = await context.supabase
      .from("profiles")
      .select("tweet_username")
      .eq("id", context.userId)
      .maybeSingle();

    try {
      const result = await fetchTweetAppProfile(profile?.tweet_username ?? "demo", token);
      await markTweetAppReconnect(context.userId, false);
      return {
        ok: true as const,
        username: result?.username ?? null,
        message: result
          ? `Connected — tweet.app answered for @${result.username}.`
          : "Connected — tweet.app accepted your token.",
      };
    } catch (cause) {
      if (cause instanceof TweetAppAuthError && cause.needsReconnect) {
        await markTweetAppReconnect(context.userId, true);
      }
      throw cause instanceof Error ? cause : new Error("tweet.app test failed.");
    }
  });


export const syncNow = createServerFn({ method: "POST" })
  .middleware([requireMfa])
  .handler(async ({ context }) => {
    const { syncAndMaybePublish } = await import("./sync.server");
    return syncAndMaybePublish(context.userId);
  });

export const postNow = createServerFn({ method: "POST" })
  .middleware([requireMfa])
  .inputValidator((data: { id: string }) => {
    if (!data?.id) throw new Error("Missing post.");
    return { id: data.id };
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("synced_posts")
      .select("id, source_text")
      .eq("id", data.id)
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw new Error("That post is no longer in your queue.");

    const { loadCredentials } = await import("./sync.server");
    const { postToX, fitToX } = await import("./x.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const credentials = await loadCredentials(userId);
    if (!credentials) throw new Error("Add your X keys first.");

    try {
      const result = await postToX(credentials, fitToX(row.source_text));
      await supabaseAdmin
        .from("synced_posts")
        .update({
          status: "posted",
          x_post_id: result.id,
          posted_at: new Date().toISOString(),
          error: null,
        })
        .eq("id", row.id);
      return { xPostId: result.id };
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Posting failed.";
      await supabaseAdmin
        .from("synced_posts")
        .update({ status: "failed", error: message })
        .eq("id", row.id);
      throw new Error(message);
    }
  });

export const setPostStatus = createServerFn({ method: "POST" })
  .middleware([requireMfa])
  .inputValidator((data: { id: string; status: string }) => {
    if (!data?.id) throw new Error("Missing post.");
    const status = data.status === "skipped" ? "skipped" : "pending";
    return { id: data.id, status };
  })
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("synced_posts")
      .update({ status: data.status, error: null })
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
