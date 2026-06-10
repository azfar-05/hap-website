-- ============================================================
-- Products table
-- ============================================================

CREATE TABLE products (
  id          uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text          NOT NULL,
  description text,
  price       numeric       NOT NULL CHECK (price >= 0),
  category    text          NOT NULL CHECK (
                              category IN (
                                'tableware',
                                'kitchenware',
                                'crockery',
                                'cutlery',
                                'home_decor'
                              )
                            ),
  color       text,
  size        text,
  material    text,
  images      text[]        NOT NULL CHECK (array_length(images, 1) >= 1),
  in_stock    boolean       NOT NULL DEFAULT true,
  featured    boolean       NOT NULL DEFAULT false,
  created_at  timestamptz   NOT NULL DEFAULT now()
);

-- Indexes for the two most common query patterns
CREATE INDEX products_category_idx ON products (category);
CREATE INDEX products_featured_idx ON products (featured) WHERE featured = true;

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- Do NOT use FORCE ROW LEVEL SECURITY — it blocks the table owner role used
-- by Supabase's own dashboard and service-role client.

-- Anon (public) — read-only
CREATE POLICY "products: anon select"
  ON products
  FOR SELECT
  TO anon
  USING (true);

-- Authenticated (admin) — read access (needed when admin is browsing the catalog)
CREATE POLICY "products: authenticated select"
  ON products
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated (admin) — full write access
CREATE POLICY "products: authenticated insert"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "products: authenticated update"
  ON products
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "products: authenticated delete"
  ON products
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- Storage — product-images bucket
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public read (anon + authenticated)
CREATE POLICY "product-images: public read"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'product-images');

-- Authenticated write
CREATE POLICY "product-images: authenticated insert"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');

-- Authenticated update (drag-to-reorder replaces objects)
CREATE POLICY "product-images: authenticated update"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images')
  WITH CHECK (bucket_id = 'product-images');

-- Authenticated delete
CREATE POLICY "product-images: authenticated delete"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images');
