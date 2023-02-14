CREATE TYPE action_type AS ENUM('move');

CREATE TYPE direction AS ENUM('north', 'east', 'south', 'west');

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
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
  );

ALTER TABLE IF EXISTS public.classifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.classifications AS PERMISSIVE FOR
SELECT
  TO public USING (true);

CREATE TABLE
  actions (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    type action_type NOT NULL,
    name text NOT NULL,
    action_point_cost int NOT NULL,
    approved boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
  );

ALTER TABLE IF EXISTS public.actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.actions AS PERMISSIVE FOR
SELECT
  TO public USING (true);

CREATE TABLE
  classification_actions (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    classification_id uuid NOT NULL,
    action_id uuid NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (classification_id) REFERENCES classifications (id),
    FOREIGN KEY (action_id) REFERENCES actions (id)
  );

ALTER TABLE IF EXISTS public.classification_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.classification_actions AS PERMISSIVE FOR
SELECT
  TO public USING (true);

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