CREATE TABLE public.tweet_app_credentials (
  user_id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  token_ct TEXT NOT NULL,
  token_hint TEXT,
  needs_reconnect BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

REVOKE ALL ON public.tweet_app_credentials FROM anon, authenticated;
GRANT ALL ON public.tweet_app_credentials TO service_role;

ALTER TABLE public.tweet_app_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tweet_app_credentials_deny_select" ON public.tweet_app_credentials FOR SELECT USING (false);
CREATE POLICY "tweet_app_credentials_deny_insert" ON public.tweet_app_credentials FOR INSERT WITH CHECK (false);
CREATE POLICY "tweet_app_credentials_deny_update" ON public.tweet_app_credentials FOR UPDATE USING (false) WITH CHECK (false);
CREATE POLICY "tweet_app_credentials_deny_delete" ON public.tweet_app_credentials FOR DELETE USING (false);