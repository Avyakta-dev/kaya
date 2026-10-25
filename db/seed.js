/**
 * db/seed.js – Demo patient seed script
 *
 * Creates a realistic 3-month history that triggers all three
 * hackathon demo patterns for Kaya's rules engine:
 *   • IRREGULAR_CYCLE   – cycle lengths: 28d → 37d → 29d (spread = 9d)
 *   • RECURRING_PAIN    – cramps severity ≥ 4 in every cycle's luteal phase
 *   • HEAVY_FLOW_FATIGUE – heavy flow days with same-day fatigue entries
 *
 * Usage:
 *   node db/seed.js
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// ── Robust .env loader ────────────────────────────────────────
function loadEnv() {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const envPath = resolve(__dirname, '../.env');

  if (!existsSync(envPath)) {
    console.error('❌ .env file not found at:', envPath);
    process.exit(1);
  }

  const lines = readFileSync(envPath, 'utf8').split(/\r?\n/);
  const parsed = {};

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const eqIdx = line.indexOf('=');
    if (eqIdx === -1) continue;

    const key = line.slice(0, eqIdx).trim();
    let val = line.slice(eqIdx + 1).trim();

    // Remove wrapping quotes if present
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1).trim();
    }

    parsed[key] = val;
  }

  return parsed;
}

const env = loadEnv();

// Sanitize SUPABASE_URL: if user pasted the dashboard URL, convert to API URL
let supabaseUrl = env['SUPABASE_URL'] || process.env.SUPABASE_URL;
const supabaseKey = env['SUPABASE_SERVICE_KEY'] || process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env');
  process.exit(1);
}

// Convert "https://supabase.com/dashboard/project/<ref>" -> "https://<ref>.supabase.co"
const dashboardMatch = supabaseUrl.match(/supabase\.com\/dashboard\/project\/([a-z0-9_-]+)/i);
if (dashboardMatch) {
  const projectRef = dashboardMatch[1];
  supabaseUrl = `https://${projectRef}.supabase.co`;
  console.log(`ℹ️  Normalized dashboard URL to API URL: ${supabaseUrl}`);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

// ── Helper ───────────────────────────────────────────────────
function addDays(dateStr, n) {
  const d = new Date(dateStr + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

// ── Demo patient ─────────────────────────────────────────────
const DEMO_USER = {
  id: '00000000-0000-0000-0000-000000000001',
  name: 'Priya S.',
  age: 26,
  age_group: '20s',
  avg_cycle_length: 28,
};

// ── Cycle history ────────────────────────────────────────────
// Designed to trigger IRREGULAR_CYCLE (max spread = 9 days)
const CYCLES = [
  { start_date: '2026-08-01', length: 28, flow_intensity: 'moderate', notes: 'Normal cycle' },
  { start_date: '2026-09-01', length: 37, flow_intensity: 'heavy', notes: 'Delayed, severe cramps' },
  { start_date: '2026-10-10', length: 29, flow_intensity: 'moderate', notes: 'Back to normal' },
];

// ── Build symptom entries ─────────────────────────────────────
function buildSymptoms(userId, cycles) {
  const rows = [];

  cycles.forEach(cycle => {
    const { start_date, length, flow_intensity } = cycle;

    // Period days (days 1–5): flow-related symptoms
    for (let d = 0; d < 5; d++) {
      const date = addDays(start_date, d);

      // Cramps on period days
      rows.push({
        user_id: userId,
        date,
        type: 'cramps',
        severity: d < 2 ? 4 : 3,   // first 2 days more severe → triggers RECURRING_PAIN
        area: 'abdomen',
        source: 'tap',
        note: null,
      });

      // Fatigue on heavy flow days → triggers HEAVY_FLOW_FATIGUE
      if (flow_intensity === 'heavy' || d < 3) {
        rows.push({
          user_id: userId,
          date,
          type: 'fatigue',
          severity: flow_intensity === 'heavy' ? 4 : 3,
          area: null,
          source: 'tap',
          note: null,
        });
      }
    }

    // Luteal phase (last 7 days before next period): recurring pain
    for (let d = length - 7; d < length; d++) {
      const date = addDays(start_date, d);

      // Severe pre-menstrual cramps → RECURRING_PAIN across cycles
      rows.push({
        user_id: userId,
        date,
        type: 'pain',
        severity: d >= length - 4 ? 4 : 3,
        area: 'lower back',
        source: 'tap',
        note: null,
      });
    }

    // Mid-cycle: occasional mood dips
    const midCycle = addDays(start_date, Math.floor(length / 2));
    rows.push({
      user_id: userId,
      date: midCycle,
      type: 'mood',
      severity: 2,
      area: null,
      source: 'tap',
      note: null,
    });
  });

  // A voice-logged entry from the most recent cycle
  rows.push({
    user_id: userId,
    date: addDays(CYCLES[2].start_date, 2),
    type: 'pain',
    severity: 4,
    area: 'abdomen',
    source: 'voice',
    note: 'stomach is hurting a lot since morning',
  });

  return rows;
}

// ── Main ─────────────────────────────────────────────────────
async function seed() {
  console.log(`🌱  Connecting to Supabase at: ${supabaseUrl}`);
  console.log('🌱  Seeding Kaya demo data…\n');

  // 1. Upsert demo user
  const { error: userErr } = await supabase
    .from('users')
    .upsert(DEMO_USER, { onConflict: 'id' });
  if (userErr) {
    console.error('❌ User upsert failed:', userErr.message || userErr);
    process.exit(1);
  }
  console.log('✅  User upserted:', DEMO_USER.name);

  // 2. Upsert cycle logs
  const cyclesToInsert = CYCLES.map(c => ({
    user_id: DEMO_USER.id,
    start_date: c.start_date,
    end_date: addDays(c.start_date, c.length - 1),
    flow_intensity: c.flow_intensity,
    notes: c.notes,
  }));

  // Clear existing demo cycles first for idempotency
  await supabase.from('cycle_logs').delete().eq('user_id', DEMO_USER.id);
  const { error: cycleErr } = await supabase.from('cycle_logs').insert(cyclesToInsert);
  if (cycleErr) {
    console.error('❌ Cycle logs insert failed:', cycleErr.message || cycleErr);
    process.exit(1);
  }
  console.log('✅  Cycle logs inserted:', cyclesToInsert.length, 'cycles');

  // 3. Upsert symptom logs
  const symptoms = buildSymptoms(DEMO_USER.id, CYCLES);
  await supabase.from('symptom_logs').delete().eq('user_id', DEMO_USER.id);
  const { error: symptomErr } = await supabase.from('symptom_logs').insert(symptoms);
  if (symptomErr) {
    console.error('❌ Symptom logs insert failed:', symptomErr.message || symptomErr);
    process.exit(1);
  }
  console.log('✅  Symptom logs inserted:', symptoms.length, 'entries');

  console.log('\n🎉  Seed complete! Demo patient data is loaded in Supabase.');
}

seed().catch(err => {
  console.error('❌ Unexpected seed error:', err);
  process.exit(1);
});
