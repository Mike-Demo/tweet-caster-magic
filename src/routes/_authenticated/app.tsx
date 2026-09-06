import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import {
  getDashboard,
  postNow,
  removeXCredentials,
  saveAutomationSettings,
  saveSourceAccount,
  saveXCredentials,
  setPostStatus,
  syncNow,
  type QueueItem,
} from "@/lib/app.functions";
import { TwoFactorGate, TwoFactorSettings } from "@/components/two-factor-gate";
import {
  SiteFooter,
  WaBadge,
  WaButton,
  WaCallout,
  WaCard,
  WaDivider,
  WaIcon,
  WaSpinner,
  WaSwitch,
  WaTab,
  WaTabGroup,
  WaTabPanel,
  WebAwesomeLoader,
} from "@/design-system/font-awsome-web-awesome-171158";

export const Route = createFileRoute("/_authenticated/app")({
  head: () => ({
    meta: [
      { title: "Your crossposting dashboard | Crosspost" },
      {
        name: "description",
        content:
          "Choose the tweet.app account to watch, connect your X developer keys, and review everything waiting to go out.",
      },
      { property: "og:title", content: "Your crossposting dashboard" },
      {
        property: "og:description",
        content: "Watch a tweet.app account and repost to X automatically or after review.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProtectedDashboard,
});

function ProtectedDashboard() {
  return (
    <TwoFactorGate>
      <Dashboard />
    </TwoFactorGate>
  );
}

function statusVariant(status: string): "neutral" | "success" | "warning" | "danger" {
  if (status === "posted") return "success";
  if (status === "failed") return "danger";
  if (status === "skipped") return "warning";
  return "neutral";
}

function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dashboard = useQuery({ queryKey: ["dashboard"], queryFn: () => getDashboard() });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  const run = <T,>(promise: Promise<T>, success?: string) =>
    promise
      .then((value) => {
        setError(null);
        if (success) setMessage(success);
        void refresh();
        return value;
      })
      .catch((cause: unknown) => {
        setMessage(null);
        setError(cause instanceof Error ? cause.message : "Something went wrong.");
      });

  const [username, setUsername] = useState("");
  const [keys, setKeys] = useState({ apiKey: "", apiSecret: "", accessToken: "", accessSecret: "" });

  useEffect(() => {
    if (dashboard.data?.settings.tweetUsername) setUsername(dashboard.data.settings.tweetUsername);
  }, [dashboard.data?.settings.tweetUsername]);

  const saveAccount = useMutation({
    mutationFn: (value: string) => saveSourceAccount({ data: { username: value } }),
  });
  const saveKeys = useMutation({ mutationFn: () => saveXCredentials({ data: keys }) });
  const sync = useMutation({ mutationFn: () => syncNow() });

  if (dashboard.isLoading) {
    return (
      <div style={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
        <WaSpinner style={{ fontSize: "2rem" }} />
      </div>
    );
  }

  const data = dashboard.data;
  const settings = data?.settings;
  const posts = data?.posts ?? [];
  const pending = posts.filter((post) => post.status === "pending");
  const history = posts.filter((post) => post.status !== "pending");

  return (
    <>
      <WebAwesomeLoader />
      <div className="wa-stack wa-gap-l" style={{ maxWidth: "64rem", margin: "0 auto", padding: "2rem 1.25rem 4rem" }}>
        <header className="wa-cluster" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <span className="wa-cluster wa-gap-xs" style={{ fontWeight: 700, fontSize: "1.15rem" }}>
            <WaIcon name="repeat" /> Crosspost
          </span>
          <WaButton
            appearance="outlined"
            onClick={() => {
              void supabase.auth.signOut().then(() => {
                queryClient.clear();
                void navigate({ to: "/" });
              });
            }}
          >
            Sign out
          </WaButton>
        </header>

        <h1 style={{ margin: 0, fontSize: "var(--wa-font-size-2xl)" }}>Crosspost dashboard</h1>

        {error ? <WaCallout variant="danger">{error}</WaCallout> : null}
        {message ? <WaCallout variant="success">{message}</WaCallout> : null}

        {!data?.credentials.connected || !settings?.tweetUsername ? (
          <WaCallout variant="brand">
            <WaIcon slot="icon" name="circle-info" />
            Finish the two setup steps below and your posts start flowing to X.
          </WaCallout>
        ) : null}

        <WaTabGroup>
          <WaTab panel="setup">Setup</WaTab>
          <WaTab panel="queue">Waiting ({pending.length})</WaTab>
          <WaTab panel="history">History</WaTab>

          <WaTabPanel name="setup">
            <div className="wa-stack wa-gap-l" style={{ paddingTop: "1rem" }}>
              <WaCard>
                <div className="wa-stack wa-gap-m">
                  <h2 style={{ margin: 0 }}>1. The tweet.app account to watch</h2>
                  <div className="wa-cluster wa-gap-s" style={{ alignItems: "end" }}>
                    <label className="wa-stack wa-gap-2xs" style={{ flex: "1 1 16rem" }} htmlFor="tweet-username">
                      <span>Username</span>
                      <input
                        id="tweet-username"
                        name="tweetUsername"
                        value={username}
                        placeholder="demo"
                        onChange={(event) => setUsername(event.target.value)}
                      />
                    </label>

                    <WaButton
                      variant="brand"
                      disabled={saveAccount.isPending}
                      onClick={() => void run(saveAccount.mutateAsync(username), "Account connected.")}
                    >
                      Connect
                    </WaButton>
                  </div>
                  {settings?.tweetUsername ? (
                    <p style={{ margin: 0, color: "var(--wa-color-text-quiet)" }}>
                      Watching @{settings.tweetUsername}
                      {settings.tweetDisplayName ? ` (${settings.tweetDisplayName})` : ""}. Only posts
                      published from now on are sent.
                    </p>
                  ) : null}
                </div>
              </WaCard>

              <WaCard>
                <div className="wa-stack wa-gap-m">
                  <h2 style={{ margin: 0 }}>2. Your X developer keys</h2>
                  {data?.credentials.connected ? (
                    <div className="wa-stack wa-gap-s">
                      <p style={{ margin: 0 }}>
                        Connected as <strong>@{data.credentials.xUsername}</strong> · key{" "}
                        {data.credentials.hint}
                      </p>
                      <div>
                        <WaButton
                          appearance="outlined"
                          variant="danger"
                          onClick={() => void run(removeXCredentials(), "Keys removed.")}
                        >
                          Remove keys
                        </WaButton>
                      </div>
                    </div>
                  ) : (
                    <p style={{ margin: 0, color: "var(--wa-color-text-quiet)" }}>
                      You need your own X developer account and your own app — Crosspost never posts
                      through a shared or Crosspost-owned account. Set the app's user authentication
                      permission to <strong>Read and write</strong>, then paste its four values.
                    </p>
                  )}

                  <WaCallout variant="neutral">
                    <span slot="icon" />
                    <div className="wa-stack wa-gap-2xs">
                      <span>
                        The Access Token and Secret act as <strong>you</strong>: anything Crosspost
                        sends appears as a post from the account that owns the app.
                      </span>
                      <span>
                        In the X console, open <strong>Keys &amp; Tokens</strong>. The Consumer Key
                        and Secret Key are the first two values below. Under{" "}
                        <strong>OAuth 1.0 Keys</strong>, generate the Access Token and Secret after
                        setting Read and write — if you change the permission afterwards, regenerate
                        them or posting is refused.
                      </span>
                      <span>
                        The Bearer Token is not used here; it can only read public data, never post.
                      </span>
                      <span>
                        X shows these values only once. Keep them in a password manager —
                        regenerating replaces the old ones.
                      </span>
                      <span>
                        Crosspost stores the four values encrypted, uses them only to publish the
                        posts you approve (or all of them if you turn on automatic posting), and
                        never sends them back to your browser. Removing the keys stops all posting
                        immediately.
                      </span>
                    </div>
                  </WaCallout>

                  <div className="wa-cluster wa-gap-s" style={{ fontSize: "var(--wa-font-size-s)" }}>
                    {(
                      [
                        ["https://console.x.com", "Developer Console"],
                        ["https://docs.x.com/x-api/getting-started/getting-access", "Getting access"],
                        [
                          "https://docs.x.com/resources/fundamentals/authentication/overview",
                          "Authentication overview",
                        ],
                        [
                          "https://docs.x.com/resources/fundamentals/authentication/oauth-1-0a/api-key-and-secret",
                          "OAuth 1.0a keys",
                        ],
                      ] as const
                    ).map(([href, label]) => (
                      <a key={href} href={href} target="_blank" rel="noreferrer">
                        {label}
                      </a>
                    ))}
                  </div>

                  <div className="wa-grid" style={{ ["--min-column-size" as string]: "16rem" }}>
                    {(
                      [
                        ["apiKey", "API key", "Consumer Key in the X console"],
                        ["apiSecret", "API key secret", "Secret Key in the X console"],
                        [
                          "accessToken",
                          "Access token",
                          "Under OAuth 1.0 Keys — posts as your own account",
                        ],
                        [
                          "accessSecret",
                          "Access token secret",
                          "Shown once alongside the access token",
                        ],
                      ] as const
                    ).map(([field, label, hint]) => (

                      <label key={field} className="wa-stack wa-gap-2xs" htmlFor={`x-cred-${field}`}>
                        <span>{label}</span>
                        <input
                          id={`x-cred-${field}`}
                          name={field}
                          type="password"
                          autoComplete="off"
                          value={keys[field]}
                          onChange={(event) => setKeys({ ...keys, [field]: event.target.value })}
                        />
                        <small style={{ color: "var(--wa-color-text-quiet)" }}>{hint}</small>
                      </label>

                    ))}
                  </div>

                  <div>
                    <WaButton
                      variant="brand"
                      disabled={saveKeys.isPending}
                      onClick={() =>
                        void run(saveKeys.mutateAsync(), "Keys checked with X and saved.").then(() =>
                          setKeys({ apiKey: "", apiSecret: "", accessToken: "", accessSecret: "" }),
                        )
                      }
                    >
                      Check and save
                    </WaButton>
                  </div>
                </div>
              </WaCard>

              <WaCard>
                <div className="wa-stack wa-gap-m">
                  <h2 style={{ margin: 0 }}>3. How it should behave</h2>
                  <WaSwitch
                    checked={settings?.autoPost ?? false}
                    onWaChange={(event: { target: HTMLInputElement }) =>
                      void run(
                        saveAutomationSettings({
                          data: {
                            autoPost: event.target.checked,
                            skipReplies: settings?.skipReplies ?? true,
                            skipQuotes: settings?.skipQuotes ?? false,
                            longPostMode: settings?.longPostMode ?? "truncate",
                          },
                        }),
                        "Saved.",
                      )
                    }
                  >
                    Post to X automatically (otherwise everything waits for your approval)
                  </WaSwitch>
                  <WaSwitch
                    checked={settings?.skipReplies ?? true}
                    onWaChange={(event: { target: HTMLInputElement }) =>
                      void run(
                        saveAutomationSettings({
                          data: {
                            autoPost: settings?.autoPost ?? false,
                            skipReplies: event.target.checked,
                            skipQuotes: settings?.skipQuotes ?? false,
                            longPostMode: settings?.longPostMode ?? "truncate",
                          },
                        }),
                        "Saved.",
                      )
                    }
                  >
                    Skip replies
                  </WaSwitch>
                  <WaSwitch
                    checked={settings?.skipQuotes ?? false}
                    onWaChange={(event: { target: HTMLInputElement }) =>
                      void run(
                        saveAutomationSettings({
                          data: {
                            autoPost: settings?.autoPost ?? false,
                            skipReplies: settings?.skipReplies ?? true,
                            skipQuotes: event.target.checked,
                            longPostMode: settings?.longPostMode ?? "truncate",
                          },
                        }),
                        "Saved.",
                      )
                    }
                  >
                    Skip quote posts
                  </WaSwitch>
                  <label className="wa-stack wa-gap-2xs" style={{ maxWidth: "22rem" }} htmlFor="long-post-mode">
                    <span>Posts longer than X allows</span>
                    <select
                      id="long-post-mode"
                      name="longPostMode"
                      value={settings?.longPostMode ?? "truncate"}

                      onChange={(event) =>
                        void run(
                          saveAutomationSettings({
                            data: {
                              autoPost: settings?.autoPost ?? false,
                              skipReplies: settings?.skipReplies ?? true,
                              skipQuotes: settings?.skipQuotes ?? false,
                              longPostMode: event.target.value,
                            },
                          }),
                          "Saved.",
                        )
                      }
                    >
                      <option value="truncate">Shorten them to fit</option>
                      <option value="skip">Leave them out</option>
                    </select>
                  </label>
                </div>
              </WaCard>
            </div>
          </WaTabPanel>

          <WaTabPanel name="queue">
            <div className="wa-stack wa-gap-m" style={{ paddingTop: "1rem" }}>
              <div className="wa-cluster" style={{ justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--wa-color-text-quiet)" }}>
                  {settings?.lastSyncedAt
                    ? `Last checked ${new Date(settings.lastSyncedAt).toLocaleString()}`
                    : "Not checked yet"}
                </span>
                <WaButton
                  variant="brand"
                  appearance="outlined"
                  disabled={sync.isPending}
                  onClick={() =>
                    void run(sync.mutateAsync()).then((result) => {
                      if (result) setMessage(result.message);
                    })
                  }
                >
                  <WaIcon slot="start" name="rotate" /> Check for new posts
                </WaButton>
              </div>

              {pending.length === 0 ? (
                <WaCallout>Nothing waiting. New tweet.app posts show up here.</WaCallout>
              ) : (
                pending.map((post) => (
                  <PostCard key={post.id} post={post}>
                    <WaButton
                      variant="brand"
                      onClick={() => void run(postNow({ data: { id: post.id } }), "Sent to X.")}
                    >
                      Post to X
                    </WaButton>
                    <WaButton
                      appearance="outlined"
                      onClick={() =>
                        void run(
                          setPostStatus({ data: { id: post.id, status: "skipped" } }),
                          "Skipped.",
                        )
                      }
                    >
                      Skip
                    </WaButton>
                  </PostCard>
                ))
              )}
            </div>
          </WaTabPanel>

          <WaTabPanel name="history">
            <div className="wa-stack wa-gap-m" style={{ paddingTop: "1rem" }}>
              {history.length === 0 ? (
                <WaCallout>Nothing has been sent yet.</WaCallout>
              ) : (
                history.map((post) => (
                  <PostCard key={post.id} post={post}>
                    {post.xPostId ? (
                      <WaButton
                        appearance="outlined"
                        href={`https://x.com/i/web/status/${post.xPostId}`}
                        target="_blank"
                      >
                        View on X
                      </WaButton>
                    ) : null}
                    {post.status !== "posted" ? (
                      <WaButton
                        appearance="outlined"
                        onClick={() =>
                          void run(
                            setPostStatus({ data: { id: post.id, status: "pending" } }),
                            "Back in the queue.",
                          )
                        }
                      >
                        Try again
                      </WaButton>
                    ) : null}
                  </PostCard>
                ))
              )}
            </div>
          </WaTabPanel>
        </WaTabGroup>
        <TwoFactorSettings />
        <p
          style={{
            marginTop: "2.5rem",
            fontSize: "0.85rem",
            lineHeight: 1.6,
            color: "var(--wa-color-text-quiet)",
            textAlign: "center",
          }}
        >
          Crosspost is an independent service and is not affiliated with, endorsed by, or
          sponsored by X Corp. or Operation Bluebird, Inc. Using Crosspost requires your own X
          developer account and your own tweet.app account, and you remain responsible for
          following the{" "}
          <a href="https://docs.x.com/developer-terms" target="_blank" rel="noreferrer">
            X Developer Terms
          </a>
          , the{" "}
          <a href="https://x.com/en/tos" target="_blank" rel="noreferrer">
            X Terms of Service
          </a>
          , and the{" "}
          <a href="https://tweet.app/terms-of-service/" target="_blank" rel="noreferrer">
            tweet.app Terms of Service
          </a>
          .
        </p>

      </div>
      <SiteFooter />
    </>
  );
}

function PostCard({ post, children }: { post: QueueItem; children?: React.ReactNode }) {
  return (
    <WaCard>
      <div className="wa-stack wa-gap-s">
        <div className="wa-cluster" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "var(--wa-color-text-quiet)", fontSize: "0.9rem" }}>
            {new Date(post.sourceCreatedAt).toLocaleString()}
          </span>
          <WaBadge variant={statusVariant(post.status)}>{post.status}</WaBadge>
        </div>
        <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{post.sourceText}</p>
        {post.error ? (
          <span style={{ color: "var(--wa-color-danger-fill-loud)", fontSize: "0.9rem" }}>
            {post.error}
          </span>
        ) : null}
        <WaDivider />
        <div className="wa-cluster wa-gap-s">{children}</div>
      </div>
    </WaCard>
  );
}
