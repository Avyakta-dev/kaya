/**
 * db/test-rules.js – Quick sanity check for the rules engine
 * 
 * Run with:  node db/test-rules.js
 * (No Supabase connection needed — uses hardcoded seed data)
 */

import { runRules } from '../api/_lib/rules.js';

// ── Replicate the seed data inline ───────────────────────────

const cycleLogs = [
  { start_date: '2026-10-10', end_date: '2026-11-07', flow_intensity: 'moderate' },
  { start_date: '2026-09-01', end_date: '2026-10-07', flow_intensity: 'heavy'    },
  { start_date: '2026-08-01', end_date: '2026-08-28', flow_intensity: 'moderate' },
];

function addDays(dateStr, n) {
  const d = new Date(dateStr + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

const symptomLogs = [];

// Period cramps + fatigue for each cycle
for (const cycle of cycleLogs) {
  for (let d = 0; d < 5; d++) {
    const date = addDays(cycle.start_date, d);
    symptomLogs.push({ date, type: 'cramps',  severity: d < 2 ? 4 : 3, area: 'abdomen' });
    if (cycle.flow_intensity === 'heavy' || d < 3) {
      symptomLogs.push({ date, type: 'fatigue', severity: cycle.flow_intensity === 'heavy' ? 4 : 3 });
    }
  }
  // Luteal pain
  const lengths = { '2026-10-10': 29, '2026-09-01': 37, '2026-08-01': 28 };
  const len = lengths[cycle.start_date];
  for (let d = len - 7; d < len; d++) {
    const date = addDays(cycle.start_date, d);
    symptomLogs.push({ date, type: 'pain', severity: d >= len - 4 ? 4 : 3, area: 'lower back' });
  }
}

// ── Run ───────────────────────────────────────────────────────

const result = runRules(cycleLogs, symptomLogs);

console.log('\n📊  Rules engine output:\n');
console.log(JSON.stringify(result, null, 2));

// ── Assertions ────────────────────────────────────────────────

const flagCodes = result.flags.map(f => f.code);
const pass = (label, condition) =>
  console.log(`${condition ? '✅' : '❌'}  ${label}`);

console.log('\n🧪  Assertions:\n');
pass('IRREGULAR_CYCLE flag present',    flagCodes.includes('IRREGULAR_CYCLE'));
pass('RECURRING_PAIN flag present',     flagCodes.includes('RECURRING_PAIN'));
pass('HEAVY_FLOW_FATIGUE flag present', flagCodes.includes('HEAVY_FLOW_FATIGUE'));
pass('phase is a valid string',         typeof result.phase === 'string');
pass('next_period is an ISO date',      /^\d{4}-\d{2}-\d{2}$/.test(result.next_period));
pass('avg_length is a number',          typeof result.avg_length === 'number');

const allPass = [
  'IRREGULAR_CYCLE', 'RECURRING_PAIN', 'HEAVY_FLOW_FATIGUE'
].every(c => flagCodes.includes(c));

console.log(`\n${allPass ? '🎉  All assertions passed!' : '⚠️  Some assertions failed.'}\n`);
