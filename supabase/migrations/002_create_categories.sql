-- ============================================================
-- Migration 002: dynamic categories table
-- ============================================================

-- Drop the hardcoded category CHECK constraint from migration 001
-- so categories can now be managed dynamically via the admin panel.
ALTER TABLE products
  DROP CONSTRAINT IF EXISTS products_category_check;

-- ============================================================
-- Categories table
-- ============================================================

CREATE TABLE IF NOT EXISTS categories (
  id            uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text          NOT NULL,
  slug          text          NOT NULL UNIQUE,
  display_order integer       NOT NULL DEFAULT 0,
  created_at    timestamptz   NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS categories_display_order_idx ON categories (display_order);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "categories: anon select"
  ON categories FOR SELECT TO anon USING (true);

CREATE POLICY "categories: authenticated select"
  ON categories FOR SELECT TO authenticated USING (true);

CREATE POLICY "categories: authenticated insert"
  ON categories FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "categories: authenticated update"
  ON categories FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "categories: authenticated delete"
  ON categories FOR DELETE TO authenticated USING (true);

-- ============================================================
-- Seed default categories
-- ============================================================

INSERT INTO categories (name, slug, display_order) VALUES
  ('Tableware',   'tableware',   1),
  ('Kitchenware', 'kitchenware', 2),
  ('Crockery',    'crockery',    3),
  ('Cutlery',     'cutlery',     4),
  ('Home Decor',  'home_decor',  5)
ON CONFLICT (slug) DO NOTHING;
