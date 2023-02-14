CREATE TABLE
  players (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    user_id uuid,
    color int NOT NULL DEFAULT floor(random() * 360),
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES auth.users (id)
  );

ALTER TABLE IF EXISTS public.players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.players AS PERMISSIVE FOR
SELECT
  TO public USING (true);

ALTER publication supabase_realtime
ADD TABLE public.players;
