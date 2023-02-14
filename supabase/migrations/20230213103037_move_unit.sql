CREATE TYPE direction AS ENUM('north', 'east', 'south', 'west');

CREATE TYPE move_unit_props AS (
  unit_id uuid,
  current_position box,
  new_position box,
  action_point_cost int
);

CREATE FUNCTION move_unit (
  target_unit_id uuid,
  operator_unit_id uuid,
  action_id uuid,
  direction direction
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  delta point;
  props move_unit_props;
  can_operate boolean;
  has_collisions boolean;
BEGIN
  -- Convert the direction to a point representing the delta.
  SELECT
    CASE (move_unit.direction)
      WHEN 'north' THEN point(0, -1)
      WHEN 'east' THEN point(1, 0)
      WHEN 'south' THEN point(0, 1)
      WHEN 'west' THEN point(-1, 0)
    END
  INTO delta;

  -- Get the positions of the movement and the action point cost.
  SELECT
    units.id,
    units.position AS current_position,
    units.position + delta AS new_position,
    actions.action_point_cost
  INTO props
  FROM
    units
    JOIN classifications ON units.classification_id = classifications.id
    JOIN actions ON actions.classification_id = classifications.id
  WHERE true
    AND units.id = move_unit.target_unit_id
    AND actions.id = move_unit.action_id
    AND actions.type = 'move';

  -- Check that the operator unit is owned by the player, is an autonomous unit, has enough action points and is contained by the target unit.
  SELECT
    count(*) > 0
  INTO can_operate
  FROM
    units
    JOIN players ON units.owner_id = players.id
    JOIN classifications ON units.classification_id = classifications.id
  WHERE true
    AND units.id = move_unit.operator_unit_id
    AND players.user_id = auth.uid()
    AND classifications.autonomous = true
    AND now() >= update_timestamp(units.timestamp, props.action_point_cost)
    AND props.current_position @> units.position;
  
  -- Check that the new position is not occupied by a non-container unit or a container unit that is too small.
  SELECT
    count(*) > 0
  INTO has_collisions
  FROM (
    SELECT units.id
    FROM
      units
      JOIN classifications ON units.classification_id = classifications.id
    WHERE
      area(props.new_position # units.position) > 0
      AND (
        classifications.container = false
        OR classifications.area <= area(props.new_position)
      )
  ) AS collisions
  LEFT JOIN (
    SELECT id
    FROM
      units
    WHERE
      props.current_position @> units.position
  ) AS current_contents
    ON collisions.id = current_contents.id
  WHERE current_contents.id IS NULL;

  -- Update the target unit's position and the position of any contained units.
  UPDATE units
  SET
    position = position + delta
  WHERE
    can_operate = true AND
    has_collisions = false AND
    props.current_position @> units.position;

  -- Update the operator unit's timestamp.
  UPDATE units
  SET
    "timestamp" = update_timestamp(units.timestamp, props.action_point_cost)
  WHERE
    can_operate = true AND
    has_collisions = false AND
    units.id = props.unit_id;
END;
$$;