/**
 * api/_lib/supabase.js
 *
 * Two Supabase clients:
 *  • supabaseAnon    – uses SUPABASE_ANON_KEY. Respects RLS.
 *  • supabaseService – uses SUPABASE_SERVICE_KEY. Bypasses RLS.
 *                      Use only in server-side API functions.
 */

import { createClient } from '@supabase/supabase-js';

function cleanEnv(val) {
  if (!val) return val;
  let s = val.trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

let SUPABASE_URL = cleanEnv(process.env.SUPABASE_URL);
const SUPABASE_ANON_KEY = cleanEnv(process.env.SUPABASE_ANON_KEY);
const SUPABASE_SERVICE_KEY = cleanEnv(process.env.SUPABASE_SERVICE_KEY);

if (SUPABASE_URL) {
  const dashboardMatch = SUPABASE_URL.match(/supabase\.com\/dashboard\/project\/([a-z0-9_-]+)/i);
  if (dashboardMatch) {
    SUPABASE_URL = `https://${dashboardMatch[1]}.supabase.co`;
  }
}

// ── Anon client (user-scoped, RLS enforced) ───────────────────
export const supabaseAnon = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// ── Service client (server-side only, RLS bypassed) ───────────
export const supabaseService = SUPABASE_URL && SUPABASE_SERVICE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: { persistSession: false },
    })
  : null;
