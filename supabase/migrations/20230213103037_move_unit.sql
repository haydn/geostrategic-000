CREATE TYPE move_unit_props AS (
  unit_id uuid,
  current_position box,
  new_position box,
  action_point_cost int
);

CREATE FUNCTION move_unit (unit_id uuid, action_id uuid, direction direction) RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  props move_unit_props;
  has_collisions boolean;
BEGIN
  SELECT
    units.id,
    units.position AS current_position,
    units.position + (
      CASE (move_unit.direction)
        WHEN 'north' THEN point(0, -1)
        WHEN 'east' THEN point(1, 0)
        WHEN 'south' THEN point(0, 1)
        WHEN 'west' THEN point(-1, 0)
      END
    ) as new_position,
    actions.action_point_cost
  INTO props
  FROM
    units
    JOIN players ON units.owner_id = players.id
    JOIN classifications ON units.classification_id = classifications.id
    JOIN classification_actions ON classification_actions.classification_id = classifications.id
    JOIN actions ON classification_actions.action_id = actions.id
  WHERE true
    AND units.id = move_unit.unit_id
    AND players.user_id = auth.uid()
    AND classifications.autonomous = true
    AND actions.id = move_unit.action_id
    AND actions.type = 'move'
    AND now() >= update_timestamp(units.timestamp, actions.action_point_cost);

  SELECT
    count(*) > 0
  INTO has_collisions
  FROM (
    SELECT id
    FROM
      units
    WHERE
      area(props.new_position # units.position) > 0
  ) AS collisions
  LEFT JOIN (
    SELECT id
    FROM
      units
    WHERE
      props.current_position @> units.position
  ) AS contained
    ON collisions.id = contained.id
  WHERE contained.id IS NULL;

  UPDATE units
  SET
    position = position + (
      CASE (move_unit.direction)
        WHEN 'north' THEN point(0, -1)
        WHEN 'east' THEN point(1, 0)
        WHEN 'south' THEN point(0, 1)
        WHEN 'west' THEN point(-1, 0)
      END
    )
  WHERE
    has_collisions = false AND
    props.current_position @> units.position;

  UPDATE units
  SET
    "timestamp" = update_timestamp(units.timestamp, props.action_point_cost)
  WHERE
    has_collisions = false AND
    units.id = props.unit_id;
END;
$$;