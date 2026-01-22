-- Create function to update order status
-- This bypasses TypeScript type restrictions

CREATE OR REPLACE FUNCTION update_order_status(
  order_id uuid,
  new_status text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  -- Validate status
  IF new_status NOT IN ('created', 'paid', 'completed', 'cancelled') THEN
    RAISE EXCEPTION 'Invalid status: %', new_status;
  END IF;

  -- Update the order
  UPDATE orders
  SET status = new_status
  WHERE id = order_id;

  -- Check if order was found
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found: %', order_id;
  END IF;

  -- Return the updated order
  SELECT json_build_object(
    'id', id,
    'status', status
  ) INTO result
  FROM orders
  WHERE id = order_id;

  RETURN result;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION update_order_status(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION update_order_status(uuid, text) TO service_role;
