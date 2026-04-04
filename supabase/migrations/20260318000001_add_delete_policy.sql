/*
  # Add Delete Policy for Order Submissions

  Add RLS policy to allow deletion of order submissions
*/

CREATE POLICY "Anyone can delete submissions"
  ON order_submissions FOR DELETE
  TO anon
  USING (true);