REVOKE ALL ON public.x_credentials FROM anon, authenticated;

CREATE POLICY "No client access to x_credentials"
ON public.x_credentials
AS RESTRICTIVE
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);