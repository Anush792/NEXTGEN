/*
  # Create NextGen Coders Platform Schema

  1. New Tables
    - `courses`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `category` (text)
      - `difficulty` (text)
      - `price` (numeric)
      - `instructor_name` (text)
      - `duration_hours` (integer)
      - `rating` (numeric)
      - `image_url` (text)
      - `created_at` (timestamptz)
    
    - `testimonials`
      - `id` (uuid, primary key)
      - `student_name` (text)
      - `content` (text)
      - `rating` (integer)
      - `created_at` (timestamptz)
    
    - `team_members`
      - `id` (uuid, primary key)
      - `name` (text)
      - `role` (text)
      - `bio` (text)
      - `image_url` (text)
      - `order_index` (integer)
      - `created_at` (timestamptz)
    
    - `projects`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `image_url` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add public read access policies
*/

CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  difficulty text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  instructor_name text NOT NULL,
  duration_hours integer NOT NULL,
  num_classes integer DEFAULT 0,
  num_videos integer DEFAULT 0,
  rating numeric DEFAULT 0,
  image_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name text NOT NULL,
  content text NOT NULL,
  rating integer DEFAULT 5,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  bio text NOT NULL,
  image_url text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read courses"
  ON courses FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can read testimonials"
  ON testimonials FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can read team members"
  ON team_members FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can read projects"
  ON projects FOR SELECT
  TO public
  USING (true);