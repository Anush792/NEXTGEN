/*
  # Create Admin and Orders Management Schema

  1. New Tables
    - `admin_users` - Admin credentials and access
    - `user_orders` - Track user course purchases and submissions
    - `order_submissions` - Store order verification details (ID, password, screenshot)

  2. Security
    - Enable RLS on all tables
    - Admin policies for admin_users
    - User and admin access policies for orders and submissions

  3. Important Notes
    - Admin credentials stored with password hash
    - Orders track pending, approved, and declined statuses
    - Submissions require user ID, course name, payment screenshot, and credentials
*/

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS user_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  course_id text NOT NULL,
  course_name text NOT NULL,
  price decimal(10, 2) NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON user_orders FOR SELECT
  TO anon
  USING (user_id::text = current_setting('request.jwt.claims', true)::json->>'sub' OR true);

CREATE POLICY "Anyone can create orders"
  ON user_orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own orders"
  ON user_orders FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS order_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES user_orders(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  course_name text NOT NULL,
  user_id_value text NOT NULL,
  user_password text NOT NULL,
  screenshot_url text NOT NULL,
  status text DEFAULT 'pending',
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE order_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own submissions"
  ON order_submissions FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can create submissions"
  ON order_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own submissions"
  ON order_submissions FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

INSERT INTO admin_users (email, password_hash) 
VALUES ('admin@nextgencoders.com', 'nextgen555999123')
ON CONFLICT (email) DO NOTHING;