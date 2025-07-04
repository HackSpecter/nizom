/*
  # Create submissions table for Instabarakat applications

  1. New Tables
    - `submissions`
      - `id` (uuid, primary key)
      - `name` (text, required) - Applicant's full name
      - `contact` (text, required) - Telegram or WhatsApp contact
      - `instagram` (text, required) - Instagram profile URL
      - `expectations` (text, required) - What they expect from the course
      - `status` (text, default 'pending') - Application status
      - `notes` (text, optional) - Admin notes
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `submissions` table
    - Add policy for public insert (form submissions)
    - Add policy for authenticated admin access
*/

CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  contact text NOT NULL,
  instagram text NOT NULL,
  expectations text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'contacted')),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Allow public to insert submissions (for the landing page form)
CREATE POLICY "Anyone can submit applications"
  ON submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users (admins) to view and manage all submissions
CREATE POLICY "Authenticated users can view all submissions"
  ON submissions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update submissions"
  ON submissions
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete submissions"
  ON submissions
  FOR DELETE
  TO authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_submissions_updated_at
  BEFORE UPDATE ON submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_name ON submissions(name);