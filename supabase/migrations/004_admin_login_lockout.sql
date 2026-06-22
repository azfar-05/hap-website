-- ============================================================
-- Migration 004: admin login attempt lockout
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_login_attempts (
  email         text          PRIMARY KEY,
  failed_count  integer       NOT NULL DEFAULT 0,
  locked_until  timestamptz,
  updated_at    timestamptz   NOT NULL DEFAULT now()
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE admin_login_attempts ENABLE ROW LEVEL SECURITY;

-- No policies: only the service-role key (used server-side before
-- a session exists) can read or write this table.
