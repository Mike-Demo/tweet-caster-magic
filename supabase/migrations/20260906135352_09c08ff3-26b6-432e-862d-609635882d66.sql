CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY,
  tweet_username TEXT,
  tweet_display_name TEXT,
  tweet_avatar_url TEXT,
  auto_post BOOLEAN NOT NULL DEFAULT false,
  skip_replies BOOLEAN NOT NULL DEFAULT true,
  skip_quotes BOOLEAN NOT NULL DEFAULT false,
  long_post_mode TEXT NOT NULL DEFAULT 'truncate',
  watch_since TIMESTAMP WITH TIME ZONE,
  last_synced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT profiles_long_post_mode_check CHECK (long_post_mode IN ('truncate', 'skip'))
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own profile" ON public.profiles FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.x_credentials (
  user_id UUID NOT NULL PRIMARY KEY,
  api_key_ct TEXT NOT NULL,
  api_secret_ct TEXT NOT NULL,
  access_token_ct TEXT NOT NULL,
  access_secret_ct TEXT NOT NULL,
  api_key_hint TEXT NOT NULL,
  x_username TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT ALL ON public.x_credentials TO service_role;
ALTER TABLE public.x_credentials ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.synced_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  source_post_id TEXT NOT NULL,
  source_text TEXT NOT NULL,
  source_created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  x_post_id TEXT,
  error TEXT,
  posted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT synced_posts_status_check CHECK (status IN ('pending', 'posted', 'skipped', 'failed')),
  CONSTRAINT synced_posts_unique_source UNIQUE (user_id, source_post_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.synced_posts TO authenticated;
GRANT ALL ON public.synced_posts TO service_role;
ALTER TABLE public.synced_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own synced posts" ON public.synced_posts FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER x_credentials_set_updated_at BEFORE UPDATE ON public.x_credentials FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER synced_posts_set_updated_at BEFORE UPDATE ON public.synced_posts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id) VALUES (NEW.id) ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE INDEX synced_posts_user_status_idx ON public.synced_posts (user_id, status, source_created_at DESC);