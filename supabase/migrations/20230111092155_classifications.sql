CREATE TABLE
  classifications (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    name text NOT NULL,
    area int4 NOT NULL CHECK (
      area > 0
      AND sqrt(area::numeric) % 1.0 = 0
    ),
    icon bytea NOT NULL CHECK (length(icon) = 128), -- 32x32 1-bit image
    approved boolean NOT NULL DEFAULT false,
    autonomous boolean NOT NULL,
    container boolean NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
  );

ALTER TABLE IF EXISTS public.classifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.classifications AS PERMISSIVE FOR
SELECT
  TO public USING (true);

ALTER publication supabase_realtime
ADD TABLE public.classifications;