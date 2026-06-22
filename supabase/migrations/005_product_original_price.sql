-- ============================================================
-- Migration 005: optional "original price" for strikethrough pricing
-- ============================================================

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS original_price numeric;
