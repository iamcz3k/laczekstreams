CREATE POLICY "No direct visitor session access"
ON public.visitor_sessions
FOR ALL
USING (false)
WITH CHECK (false);