import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { decryptSecret } from "./crypto.server";
import { fetchPostsByAuthor } from "./tweetApp.server";
import { fitToX, postToX, X_MAX_CHARACTERS, XApiError, type XCredentials } from "./x.server";

export interface SyncResult {
  readonly imported: number;
  readonly posted: number;
  readonly failed: number;
  readonly message: string;
}

export async function loadCredentials(userId: string): Promise<XCredentials | null> {
  const { data, error } = await supabaseAdmin
    .from("x_credentials")
    .select("api_key_ct, api_secret_ct, access_token_ct, access_secret_ct")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  return {
    apiKey: decryptSecret(data.api_key_ct),
    apiSecret: decryptSecret(data.api_secret_ct),
    accessToken: decryptSecret(data.access_token_ct),
    accessSecret: decryptSecret(data.access_secret_ct),
  };
}

/** Pulls new tweet.app posts into the queue. Never records the same post twice. */
export async function importNewPosts(userId: string): Promise<number> {
  const { data: profile, error } = await supabaseAdmin
    .from("profiles")
    .select("tweet_username, skip_replies, skip_quotes, watch_since, last_synced_at")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!profile?.tweet_username) return 0;

  const since = profile.last_synced_at ?? profile.watch_since ?? new Date().toISOString();
  const posts = await fetchPostsByAuthor(profile.tweet_username, since);

  const rows = posts
    .filter((post) => !(profile.skip_replies && post.isReply))
    .filter((post) => !(profile.skip_quotes && post.isQuote))
    .filter((post) => post.text.trim().length > 0)
    .map((post) => ({
      user_id: userId,
      source_post_id: post.id,
      source_text: post.text,
      source_created_at: post.createdAt,
      status: "pending",
    }));

  let imported = 0;
  if (rows.length > 0) {
    const { data: inserted, error: insertError } = await supabaseAdmin
      .from("synced_posts")
      .upsert(rows, { onConflict: "user_id,source_post_id", ignoreDuplicates: true })
      .select("id");
    if (insertError) throw new Error(insertError.message);
    imported = inserted?.length ?? 0;
  }

  const newest = posts.at(-1)?.createdAt;
  await supabaseAdmin
    .from("profiles")
    .update({ last_synced_at: newest ?? new Date().toISOString() })
    .eq("id", userId);

  return imported;
}

/** Sends every pending post for this person to X, oldest first. */
export async function publishPending(userId: string, limit = 10): Promise<{ posted: number; failed: number }> {
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("long_post_mode")
    .eq("id", userId)
    .maybeSingle();

  const { data: pending, error } = await supabaseAdmin
    .from("synced_posts")
    .select("id, source_text")
    .eq("user_id", userId)
    .eq("status", "pending")
    .order("source_created_at", { ascending: true })
    .limit(limit);

  if (error) throw new Error(error.message);
  if (!pending || pending.length === 0) return { posted: 0, failed: 0 };

  const credentials = await loadCredentials(userId);
  if (!credentials) throw new Error("No X keys saved yet.");

  let posted = 0;
  let failed = 0;

  for (const row of pending) {
    const tooLong = Array.from(row.source_text).length > X_MAX_CHARACTERS;
    if (tooLong && profile?.long_post_mode === "skip") {
      await supabaseAdmin
        .from("synced_posts")
        .update({ status: "skipped", error: "Longer than X allows." })
        .eq("id", row.id);
      continue;
    }

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
      posted += 1;
    } catch (cause) {
      failed += 1;
      const message = cause instanceof Error ? cause.message : "Posting failed.";
      const rateLimited = cause instanceof XApiError && cause.status === 429;
      await supabaseAdmin
        .from("synced_posts")
        .update({ status: rateLimited ? "pending" : "failed", error: message })
        .eq("id", row.id);
      if (rateLimited) break;
    }
  }

  return { posted, failed };
}

export async function syncAndMaybePublish(userId: string, forcePublish = false): Promise<SyncResult> {
  const imported = await importNewPosts(userId);

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("auto_post")
    .eq("id", userId)
    .maybeSingle();

  if (!forcePublish && !profile?.auto_post) {
    return {
      imported,
      posted: 0,
      failed: 0,
      message: imported > 0 ? `${imported} new post(s) waiting for your review.` : "No new posts.",
    };
  }

  const { posted, failed } = await publishPending(userId);
  return {
    imported,
    posted,
    failed,
    message: `${imported} imported, ${posted} sent to X${failed > 0 ? `, ${failed} failed` : ""}.`,
  };
}

/** Used by the scheduled job: runs the whole loop for everyone with auto-posting on. */
export async function runScheduledSync(): Promise<{ users: number; posted: number }> {
  const { data: profiles, error } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("auto_post", true)
    .not("tweet_username", "is", null);

  if (error) throw new Error(error.message);

  let posted = 0;
  for (const profile of profiles ?? []) {
    try {
      const result = await syncAndMaybePublish(profile.id);
      posted += result.posted;
    } catch (cause) {
      console.error("scheduled sync failed", profile.id, cause);
    }
  }

  return { users: profiles?.length ?? 0, posted };
}
