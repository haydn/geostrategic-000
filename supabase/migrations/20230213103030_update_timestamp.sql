CREATE FUNCTION update_timestamp (
  current timestamp with time zone,
  action_points int
) RETURNS timestamp with time zone LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN greatest(current, now() - '2 days'::interval) + action_points * ('1 millisecond'::interval) * 2;
END;
$$;