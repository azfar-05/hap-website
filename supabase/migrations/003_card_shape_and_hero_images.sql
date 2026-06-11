-- ============================================================
-- Migration 003: card_shape column, focal_point column, hero_images table
-- ============================================================

-- -------------------------------------------------------
-- 1. Add card_shape to products
-- -------------------------------------------------------
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS card_shape text
    CHECK (card_shape IN ('portrait', 'square', 'wide', 'lead'))
    DEFAULT 'portrait';

-- -------------------------------------------------------
-- 2. Add focal_point to products (if not already present
--    from a prior migration; safe with IF NOT EXISTS)
-- -------------------------------------------------------
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS focal_point text DEFAULT 'center';

-- -------------------------------------------------------
-- 3. Add featured_at to products (if not already present)
-- -------------------------------------------------------
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS featured_at timestamptz;

-- -------------------------------------------------------
-- 4. hero_images table — 3 fixed slots for the homepage collage
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS hero_images (
  slot        integer       PRIMARY KEY CHECK (slot BETWEEN 1 AND 3),
  image_url   text          NOT NULL,
  updated_at  timestamptz   NOT NULL DEFAULT now()
);

-- Row Level Security on hero_images
ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;

-- Anon — read-only
CREATE POLICY "hero_images: anon select"
  ON hero_images
  FOR SELECT
  TO anon
  USING (true);

-- Authenticated — read
CREATE POLICY "hero_images: authenticated select"
  ON hero_images
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated — upsert
CREATE POLICY "hero_images: authenticated insert"
  ON hero_images
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "hero_images: authenticated update"
  ON hero_images
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated — delete (remove slot)
CREATE POLICY "hero_images: authenticated delete"
  ON hero_images
  FOR DELETE
  TO authenticated
  USING (true);
