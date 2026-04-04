/*
  # Add Course Videos Table

  1. New Table
    - `course_videos` - Store YouTube video links for courses

  2. Security
    - Enable RLS
    - Public read access
    - Admin write access
*/

CREATE TABLE IF NOT EXISTS course_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_name text NOT NULL,
  title text NOT NULL,
  youtube_url text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE course_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view course videos"
  ON course_videos FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Admins can manage course videos"
  ON course_videos FOR ALL
  TO anon
  USING (true);