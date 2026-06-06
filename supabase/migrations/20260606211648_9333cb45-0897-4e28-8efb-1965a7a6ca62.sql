
CREATE TABLE public.admin_broadcasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN ('notification','question','review')),
  message text NOT NULL,
  target_name text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.admin_broadcasts TO anon, authenticated;
GRANT ALL ON public.admin_broadcasts TO service_role;
ALTER TABLE public.admin_broadcasts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads active broadcasts" ON public.admin_broadcasts FOR SELECT USING (active = true);
CREATE TRIGGER trg_admin_broadcasts_updated BEFORE UPDATE ON public.admin_broadcasts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.admin_broadcast_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  broadcast_id uuid NOT NULL REFERENCES public.admin_broadcasts(id) ON DELETE CASCADE,
  session_key text NOT NULL,
  name text,
  response_text text,
  rating int CHECK (rating BETWEEN 1 AND 5),
  dismissed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (broadcast_id, session_key)
);
GRANT SELECT, INSERT ON public.admin_broadcast_responses TO anon, authenticated;
GRANT ALL ON public.admin_broadcast_responses TO service_role;
ALTER TABLE public.admin_broadcast_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads responses" ON public.admin_broadcast_responses FOR SELECT USING (true);
CREATE POLICY "Anyone writes own response" ON public.admin_broadcast_responses FOR INSERT WITH CHECK (length(session_key) >= 4);

CREATE INDEX idx_abr_session ON public.admin_broadcast_responses(session_key);
CREATE INDEX idx_abr_broadcast ON public.admin_broadcast_responses(broadcast_id);
CREATE INDEX idx_ab_active ON public.admin_broadcasts(active, created_at DESC);
