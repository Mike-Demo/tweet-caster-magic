/**
 * Read-only client for the public tweet.app API. There is no per-author feed
 * endpoint, so we page the global feed and keep the posts we care about.
 */
const API_BASE = "https://api.tweet.app/api";

export interface TweetAppProfile {
  readonly username: string;
  readonly displayName: string;
  readonly bio: string;
  readonly avatarUrl: string;
}

export interface TweetAppPost {
  readonly id: string;
  readonly text: string;
  readonly createdAt: string;
  readonly authorUsername: string;
  readonly isReply: boolean;
  readonly isQuote: boolean;
}

interface RawPost {
  id?: string;
  text?: string;
  createdAt?: string;
  authorUsername?: string;
  conversationId?: string | null;
  quotedPostId?: string | null;
  parentPostId?: string | null;
  replyToPostId?: string | null;
}

interface FeedResponse {
  success?: boolean;
  posts?: RawPost[];
  nextCursor?: string | null;
}

export async function fetchTweetAppProfile(username: string): Promise<TweetAppProfile | null> {
  const response = await fetch(
    `${API_BASE}/users/by-username/${encodeURIComponent(username)}`,
    { headers: { Accept: "application/json" } },
  );
  if (!response.ok) return null;

  const body = (await response.json()) as {
    success?: boolean;
    profile?: {
      username?: string;
      displayName?: string;
      bio?: string;
      avatarUrl?: string;
    };
  };
  if (!body.success || !body.profile?.username) return null;

  return {
    username: body.profile.username,
    displayName: body.profile.displayName ?? body.profile.username,
    bio: body.profile.bio ?? "",
    avatarUrl: body.profile.avatarUrl ?? "",
  };
}

function normalize(raw: RawPost): TweetAppPost | null {
  if (!raw.id || typeof raw.text !== "string" || !raw.createdAt || !raw.authorUsername) return null;
  const isReply = Boolean(
    raw.parentPostId ?? raw.replyToPostId ?? (raw.conversationId && raw.conversationId !== raw.id),
  );
  return {
    id: raw.id,
    text: raw.text,
    createdAt: raw.createdAt,
    authorUsername: raw.authorUsername,
    isReply,
    isQuote: Boolean(raw.quotedPostId),
  };
}

/**
 * Walks the global feed newest-first, collecting posts by `username` that are
 * newer than `sinceIso`. Paging stops as soon as the feed reaches older posts.
 */
export async function fetchPostsByAuthor(
  username: string,
  sinceIso: string,
  maxPages = 12,
): Promise<TweetAppPost[]> {
  const wanted = username.toLowerCase();
  const since = new Date(sinceIso).getTime();
  const collected: TweetAppPost[] = [];
  let cursor: string | null = null;

  for (let page = 0; page < maxPages; page += 1) {
    const url = new URL(`${API_BASE}/posts`);
    url.searchParams.set("limit", "50");
    if (cursor) url.searchParams.set("cursor", cursor);

    const response = await fetch(url.toString(), { headers: { Accept: "application/json" } });
    if (!response.ok) {
      throw new Error(`tweet.app feed request failed (${response.status})`);
    }

    const body = (await response.json()) as FeedResponse;
    const posts = body.posts ?? [];
    if (posts.length === 0) break;

    let reachedOlder = false;
    for (const raw of posts) {
      const post = normalize(raw);
      if (!post) continue;
      if (new Date(post.createdAt).getTime() <= since) {
        reachedOlder = true;
        continue;
      }
      if (post.authorUsername.toLowerCase() === wanted) collected.push(post);
    }

    if (reachedOlder || !body.nextCursor) break;
    cursor = body.nextCursor;
  }

  return collected.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
}
