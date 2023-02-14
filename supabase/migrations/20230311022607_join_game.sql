CREATE FUNCTION join_game () RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  unit_id uuid;
  user_has_player boolean;
  player_id uuid;
BEGIN
  SELECT
    units.id
  INTO unit_id
  FROM units
  JOIN classifications
    ON units.classification_id = classifications.id
  WHERE true
    AND classifications.autonomous = true
    AND units.owner_id IS NULL
  ORDER BY units.created_at DESC
  LIMIT 1;
  
  SELECT
    count(*) > 0
  INTO user_has_player
  FROM players
  WHERE user_id = auth.uid();

  SELECT gen_random_uuid()
  INTO player_id;

  INSERT INTO players (id, user_id)
  SELECT player_id, auth.uid()
  WHERE unit_id IS NOT NULL AND user_has_player = FALSE;

  UPDATE units
  SET owner_id = player_id
  WHERE id = unit_id AND user_has_player = FALSE;
END;
$$;