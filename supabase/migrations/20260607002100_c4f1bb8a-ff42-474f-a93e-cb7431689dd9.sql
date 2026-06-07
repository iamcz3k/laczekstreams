ALTER TABLE public.admin_broadcasts
ADD COLUMN IF NOT EXISTS target_session_key text;

CREATE INDEX IF NOT EXISTS idx_admin_broadcasts_target_session_key
ON public.admin_broadcasts(target_session_key)
WHERE target_session_key IS NOT NULL;