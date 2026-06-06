
CREATE TABLE public.admin_changelog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL DEFAULT 'new',
  title text NOT NULL,
  detail text,
  active boolean NOT NULL DEFAULT true,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.admin_changelog TO anon, authenticated;
GRANT ALL ON public.admin_changelog TO service_role;

ALTER TABLE public.admin_changelog ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads active changelog"
  ON public.admin_changelog FOR SELECT
  USING (active = true);

CREATE TRIGGER admin_changelog_set_updated_at
  BEFORE UPDATE ON public.admin_changelog
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
