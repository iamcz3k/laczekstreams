
ALTER TABLE public.featured_events
  ADD COLUMN IF NOT EXISTS sport TEXT,
  ADD COLUMN IF NOT EXISTS home_team TEXT,
  ADD COLUMN IF NOT EXISTS away_team TEXT,
  ADD COLUMN IF NOT EXISTS home_flag TEXT,
  ADD COLUMN IF NOT EXISTS away_flag TEXT,
  ADD COLUMN IF NOT EXISTS timer_mode TEXT NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS timer_target_at TIMESTAMPTZ;

INSERT INTO public.feature_flags (key, enabled, description) VALUES
  ('tab_movies',     true, 'Show the Movies tab'),
  ('tab_tv',         true, 'Show the TV tab'),
  ('live_sports',    true, 'Show the Live Sports tab'),
  ('tab_youtube',    true, 'Show the YouTube tab'),
  ('tab_cctv',       true, 'Show the CCTV tab'),
  ('radio',          true, 'Show the Radio tab'),
  ('podcasts',       true, 'Show the Podcasts tab'),
  ('tab_genres',     true, 'Show the Genres tab'),
  ('tab_library',    true, 'Show the Library tab'),
  ('tab_anime',      true, 'Show the Anime tab'),
  ('tab_music',      true, 'Show the Music tab'),
  ('featured_banner',true, 'Show the homepage featured-events banner'),
  ('downloads',      true, 'Enable the Downloads feature'),
  ('livescore',      true, 'Show the LiveScore tab inside Live Sports'),
  ('party_mode',     true, 'Enable Watch-Party rooms'),
  ('match_chat',     true, 'Show chat on football/sports stream pages'),
  ('onboarding_popup', true, 'Show the first-visit onboarding popup'),
  ('bug_report',     true, 'Show the bug-report button')
ON CONFLICT (key) DO NOTHING;
