
-- =====================================================
-- 1) downloadable_titles  (catalogue of files in the downloads bucket)
-- =====================================================
CREATE TABLE public.downloadable_titles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN ('movie','tv','anime')),
  tmdb_id text,
  title text NOT NULL,
  season int,
  episode int,
  storage_path text NOT NULL UNIQUE,
  size_bytes bigint NOT NULL DEFAULT 0,
  mime text NOT NULL DEFAULT 'video/mp4',
  poster_url text,
  description text,
  duration_seconds int,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX downloadable_titles_kind_tmdb_idx ON public.downloadable_titles(kind, tmdb_id);

GRANT SELECT ON public.downloadable_titles TO anon, authenticated;
GRANT ALL ON public.downloadable_titles TO service_role;
ALTER TABLE public.downloadable_titles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read catalogue" ON public.downloadable_titles
  FOR SELECT USING (true);

-- =====================================================
-- 2) user_downloads
-- =====================================================
CREATE TABLE public.user_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title_id uuid NOT NULL REFERENCES public.downloadable_titles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued','downloading','paused','completed','failed','cancelled')),
  bytes_downloaded bigint NOT NULL DEFAULT 0,
  device_label text,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, title_id)
);
CREATE INDEX user_downloads_user_idx ON public.user_downloads(user_id, updated_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_downloads TO authenticated;
GRANT ALL ON public.user_downloads TO service_role;
ALTER TABLE public.user_downloads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own downloads" ON public.user_downloads
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own downloads" ON public.user_downloads
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own downloads" ON public.user_downloads
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own downloads" ON public.user_downloads
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- =====================================================
-- 3) visitor_sessions  (used by existing tracker)
-- =====================================================
CREATE TABLE public.visitor_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key text NOT NULL UNIQUE,
  name text,
  country text,
  city text,
  ip text,
  user_agent text,
  device text,
  current_path text,
  duration_seconds int NOT NULL DEFAULT 0,
  page_views int NOT NULL DEFAULT 0,
  path_log jsonb NOT NULL DEFAULT '[]'::jsonb,
  watched jsonb NOT NULL DEFAULT '[]'::jsonb,
  searches jsonb NOT NULL DEFAULT '[]'::jsonb,
  started_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX visitor_sessions_last_seen_idx ON public.visitor_sessions(last_seen_at DESC);

GRANT ALL ON public.visitor_sessions TO service_role;
ALTER TABLE public.visitor_sessions ENABLE ROW LEVEL SECURITY;
-- All access via service role / server functions; no client policies.

-- =====================================================
-- 4) feature_flags
-- =====================================================
CREATE TABLE public.feature_flags (
  key text PRIMARY KEY,
  enabled boolean NOT NULL DEFAULT true,
  description text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.feature_flags TO anon, authenticated;
GRANT ALL ON public.feature_flags TO service_role;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads flags" ON public.feature_flags FOR SELECT USING (true);

INSERT INTO public.feature_flags (key, enabled, description) VALUES
  ('downloads', true, 'Show Downloads tab and Download buttons'),
  ('live_chat', true, 'Live chat in football match rooms'),
  ('party_mode', true, 'Watch-party rooms')
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- 5) featured_events
-- =====================================================
CREATE TABLE public.featured_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  image_url text,
  link_url text NOT NULL,
  kind text NOT NULL DEFAULT 'general',
  starts_at timestamptz,
  ends_at timestamptz,
  priority int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX featured_events_active_idx ON public.featured_events(active, priority DESC);

GRANT SELECT ON public.featured_events TO anon, authenticated;
GRANT ALL ON public.featured_events TO service_role;
ALTER TABLE public.featured_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads active events" ON public.featured_events
  FOR SELECT USING (active = true);

-- =====================================================
-- 6) match_chats  (live football chat)
-- =====================================================
CREATE TABLE public.match_chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id text NOT NULL,
  name text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX match_chats_match_idx ON public.match_chats(match_id, created_at);

GRANT SELECT, INSERT ON public.match_chats TO anon, authenticated;
GRANT ALL ON public.match_chats TO service_role;
ALTER TABLE public.match_chats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads chat" ON public.match_chats FOR SELECT USING (true);
CREATE POLICY "Anyone posts chat" ON public.match_chats FOR INSERT WITH CHECK (
  length(name) BETWEEN 1 AND 40 AND length(message) BETWEEN 1 AND 500
);

ALTER PUBLICATION supabase_realtime ADD TABLE public.match_chats;
ALTER TABLE public.match_chats REPLICA IDENTITY FULL;

-- =====================================================
-- 7) updated_at trigger
-- =====================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TRIGGER trg_downloadable_titles_updated BEFORE UPDATE ON public.downloadable_titles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_user_downloads_updated BEFORE UPDATE ON public.user_downloads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_feature_flags_updated BEFORE UPDATE ON public.feature_flags
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_featured_events_updated BEFORE UPDATE ON public.featured_events
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
