/*
  # Add Certificate URL to Order Submissions

  1. Add certificate_url column to order_submissions table
*/

ALTER TABLE order_submissions ADD COLUMN IF NOT EXISTS certificate_url text;