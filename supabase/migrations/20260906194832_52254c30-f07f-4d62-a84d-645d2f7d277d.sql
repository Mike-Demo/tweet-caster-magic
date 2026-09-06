ALTER TABLE public.x_credentials
  ADD COLUMN environment TEXT NOT NULL DEFAULT 'production';

ALTER TABLE public.x_credentials
  ADD CONSTRAINT x_credentials_environment_check
  CHECK (environment IN ('development', 'staging', 'production'));

ALTER TABLE public.x_credentials DROP CONSTRAINT x_credentials_pkey;
ALTER TABLE public.x_credentials ADD PRIMARY KEY (user_id, environment);

ALTER TABLE public.profiles
  ADD COLUMN active_x_environment TEXT;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_active_x_environment_check
  CHECK (active_x_environment IS NULL OR active_x_environment IN ('development', 'staging', 'production'));

UPDATE public.profiles p
SET active_x_environment = 'production'
WHERE EXISTS (SELECT 1 FROM public.x_credentials c WHERE c.user_id = p.id);