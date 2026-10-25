-- ============================================================
-- Kaya – Database Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT,
  age           INT,
  -- age_group is derived but stored for fast insight copy selection
  age_group     TEXT CHECK (age_group IN ('teen', '20s', '30s', '40s+')),
  -- average cycle length seeded from onboarding, updated by the rules engine
  avg_cycle_length INT DEFAULT 28,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. CYCLE LOGS  (one row per menstrual period)
-- ============================================================
CREATE TABLE IF NOT EXISTS cycle_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_date      DATE NOT NULL,
  end_date        DATE,                   -- NULL until period ends
  flow_intensity  TEXT CHECK (flow_intensity IN ('light', 'moderate', 'heavy')),
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. SYMPTOM LOGS  (one row per symptom entry)
-- ============================================================
CREATE TABLE IF NOT EXISTS symptom_logs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date       DATE NOT NULL DEFAULT CURRENT_DATE,
  type       TEXT NOT NULL CHECK (type IN (
               'pain', 'fatigue', 'mood', 'bloating',
               'headache', 'nausea', 'cramps', 'spotting', 'other'
             )),
  severity   INT CHECK (severity BETWEEN 1 AND 5),
  area       TEXT,                        -- e.g. 'abdomen', 'lower back', 'head'
  source     TEXT CHECK (source IN ('tap', 'voice')),
  note       TEXT,                        -- raw voice transcript or free text
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. INDEXES  (speed up per-user date-range queries)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_cycle_logs_user_start
  ON cycle_logs (user_id, start_date DESC);

CREATE INDEX IF NOT EXISTS idx_symptom_logs_user_date
  ON symptom_logs (user_id, date DESC);

-- ============================================================
-- 5. ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE cycle_logs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptom_logs  ENABLE ROW LEVEL SECURITY;

-- Users can only read/write their own row
CREATE POLICY "users: own row only"
  ON users FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Cycle logs: scoped to the authenticated user
CREATE POLICY "cycle_logs: own data only"
  ON cycle_logs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Symptom logs: scoped to the authenticated user
CREATE POLICY "symptom_logs: own data only"
  ON symptom_logs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- SERVICE ROLE BYPASS (used by server-side API functions)
-- The Vercel functions use SUPABASE_SERVICE_KEY, which bypasses
-- RLS automatically — no extra policy needed.
-- ============================================================
