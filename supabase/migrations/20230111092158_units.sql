CREATE TABLE
  units (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    classification_id uuid NOT NULL,
    owner_id uuid,
    position box NOT NULL,
    timestamp timestamptz NOT NULL DEFAULT now(),
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (id),
    FOREIGN KEY (classification_id) REFERENCES classifications (id),
    FOREIGN KEY (owner_id) REFERENCES players (id)
  );

ALTER TABLE IF EXISTS public.units ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.units AS PERMISSIVE FOR
SELECT
  TO public USING (true);

ALTER publication supabase_realtime
ADD TABLE public.units;