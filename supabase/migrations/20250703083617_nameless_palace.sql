/*
  # Fix submissions table RLS policies

  1. Security Changes
    - Update RLS policies to allow public read access to submissions
    - Keep existing policies for insert/update/delete operations
    - Ensure admin panel can read all submissions without authentication

  2. Changes
    - Add policy for public read access to all submissions
    - Update existing policies to be more permissive for admin operations
*/

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can view all submissions" ON submissions;
DROP POLICY IF EXISTS "Users can view all comments" ON submissions;

-- Create new policy that allows public read access to all submissions
CREATE POLICY "Allow public read access to all submissions"
  ON submissions
  FOR SELECT
  TO public
  USING (true);

-- Keep existing policies for other operations
-- The insert policy for anon users should remain
-- The update/delete policies for authenticated users should remain

-- Ensure the policy is active
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;