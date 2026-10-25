/**
 * api/_lib/rules.js
 *
 * Pure rules engine — no database calls, no side effects.
 * Takes arrays of cycle_logs + symptom_logs and returns:
 *
 *   {
 *     currentDay:   number,          // day of current cycle (1-indexed)
 *     phase:        string,          // 'menstrual' | 'follicular' | 'ovulation' | 'luteal'
 *     next_period:  string,          // ISO date string (predicted)
 *     avg_length:   number,          // average cycle length in days
 *     flags: [
 *       { code: string, detail: string }   // see FLAG_CODES below
 *     ]
 *   }
 *
 * FLAG CODES
 *   IRREGULAR_CYCLE     – cycle length spread ≥ 7 days across last 3 cycles
 *   RECURRING_PAIN      – pain/cramps severity ≥ 4 in every cycle's luteal phase
 *   HEAVY_FLOW_FATIGUE  – heavy flow day + same-day fatigue entry in any cycle
 */

// ── Constants ────────────────────────────────────────────────

const PHASE_THRESHOLDS = {
  menstrual:  { startDay: 1,  endDay: 5  },   // days 1–5   (period)
  follicular: { startDay: 6,  endDay: 13 },   // days 6–13
  ovulation:  { startDay: 14, endDay: 16 },   // days 14–16 (peak fertility)
  luteal:     { startDay: 17, endDay: 999 },  // day 17 → end of cycle
};

const IRREGULAR_SPREAD_THRESHOLD = 7;   // days
const PAIN_SEVERITY_THRESHOLD    = 4;   // out of 5
const PAIN_TYPES                 = new Set(['pain', 'cramps']);
const FATIGUE_TYPES              = new Set(['fatigue']);

// ── Helpers ──────────────────────────────────────────────────

/** Parse an ISO date string or Date object → plain Date at midnight UTC */
function toDate(d) {
  if (d instanceof Date) return d;
  return new Date(d + 'T00:00:00Z');
}

/** Difference in whole days between two dates (a - b) */
function daysBetween(a, b) {
  return Math.round((toDate(a) - toDate(b)) / 86_400_000);
}

/** Add n days to an ISO date string → ISO date string */
function addDays(dateStr, n) {
  const d = toDate(dateStr);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** Return the cycle phase name for a given cycle day (1-indexed) */
function phaseForDay(cycleDay) {
  for (const [name, { startDay, endDay }] of Object.entries(PHASE_THRESHOLDS)) {
    if (cycleDay >= startDay && cycleDay <= endDay) return name;
  }
  return 'luteal';   // fallback for long cycles
}

// ── Core calculations ────────────────────────────────────────

/**
 * Sort cycle logs newest-first and compute per-cycle lengths.
 * Requires at least one log with a start_date.
 *
 * @param {Array} cycleLogs  – rows from the cycle_logs table
 * @returns {{ sorted: Array, lengths: number[] }}
 */
function parseCycles(cycleLogs) {
  const sorted = [...cycleLogs]
    .filter(c => c.start_date)
    .sort((a, b) => toDate(b.start_date) - toDate(a.start_date));

  // Compute length of each cycle from its start to the next cycle's start
  const lengths = sorted
    .map((c, i) => {
      if (i === sorted.length - 1) return null;  // oldest cycle: use stored end_date
      const next = sorted[i + 1];
      return daysBetween(c.start_date, next.start_date);
    })
    .filter(Boolean);

  // If only 1 cycle logged, fall back to end_date
  if (lengths.length === 0 && sorted.length > 0 && sorted[0].end_date) {
    lengths.push(daysBetween(sorted[0].end_date, sorted[0].start_date) + 1);
  }

  return { sorted, lengths };
}

/**
 * Predict the next period start date using the most recent cycle start
 * and the average cycle length.
 */
function predictNextPeriod(latestStart, avgLength) {
  return addDays(latestStart, avgLength);
}

// ── Flag detectors ───────────────────────────────────────────

/**
 * IRREGULAR_CYCLE: spread between longest and shortest cycle ≥ 7 days.
 */
function detectIrregularCycle(lengths) {
  if (lengths.length < 2) return null;

  const max    = Math.max(...lengths);
  const min    = Math.min(...lengths);
  const spread = max - min;

  if (spread >= IRREGULAR_SPREAD_THRESHOLD) {
    return {
      code:   'IRREGULAR_CYCLE',
      detail: `Cycle length varied by ${spread} days over the last ${lengths.length + 1} cycles (shortest ${min}d, longest ${max}d)`,
    };
  }
  return null;
}

/**
 * RECURRING_PAIN: pain or cramps with severity ≥ 4 appeared in the
 * luteal phase of every cycle in the dataset.
 *
 * Strategy: for each cycle, look for high-severity pain in the 10 days
 * before the next cycle's start (luteal window).
 */
function detectRecurringPain(sortedCycles, symptomLogs) {
  if (sortedCycles.length < 2) return null;

  // Build a lookup: date → symptom rows
  const byDate = {};
  for (const s of symptomLogs) {
    if (!byDate[s.date]) byDate[s.date] = [];
    byDate[s.date].push(s);
  }

  let cyclesWithSeverePain = 0;

  // Check all cycles except the most recent (no "next start" to bound it)
  for (let i = sortedCycles.length - 1; i >= 1; i--) {
    const cycleStart = sortedCycles[i].start_date;
    const nextStart  = sortedCycles[i - 1].start_date;
    const lutealWindowStart = addDays(nextStart, -10);  // last 10 days of cycle

    // Walk each day in the luteal window
    let foundSeverePain = false;
    for (let d = 0; d <= 10; d++) {
      const date = addDays(lutealWindowStart, d);
      const daySymptoms = byDate[date] || [];
      if (
        daySymptoms.some(
          s => PAIN_TYPES.has(s.type) && s.severity >= PAIN_SEVERITY_THRESHOLD
        )
      ) {
        foundSeverePain = true;
        break;
      }
    }
    if (foundSeverePain) cyclesWithSeverePain++;
  }

  const totalChecked = sortedCycles.length - 1;
  if (cyclesWithSeverePain === totalChecked && totalChecked >= 1) {
    return {
      code:   'RECURRING_PAIN',
      detail: `Pain severity ≥${PAIN_SEVERITY_THRESHOLD}/5 detected in the luteal phase of all ${totalChecked + 1} logged cycles`,
    };
  }

  return null;
}

/**
 * HEAVY_FLOW_FATIGUE: any cycle that recorded a heavy flow day where
 * the same-day symptom log also contains a fatigue entry.
 */
function detectHeavyFlowFatigue(sortedCycles, symptomLogs) {
  // Build date → symptoms lookup
  const byDate = {};
  for (const s of symptomLogs) {
    if (!byDate[s.date]) byDate[s.date] = [];
    byDate[s.date].push(s);
  }

  for (const cycle of sortedCycles) {
    if (cycle.flow_intensity !== 'heavy') continue;

    // Check the first 5 days of this cycle (period days)
    for (let d = 0; d < 5; d++) {
      const date = addDays(cycle.start_date, d);
      const daySymptoms = byDate[date] || [];

      const hasFatigue = daySymptoms.some(s => FATIGUE_TYPES.has(s.type) && s.severity >= 3);
      if (hasFatigue) {
        return {
          code:   'HEAVY_FLOW_FATIGUE',
          detail: `Heavy flow and fatigue (severity ≥ 3) co-occurred on ${date}`,
        };
      }
    }
  }

  return null;
}

// ── Public API ───────────────────────────────────────────────

/**
 * runRules(cycleLogs, symptomLogs)
 *
 * @param {Array} cycleLogs    – rows from cycle_logs table (need: user_id, start_date, end_date, flow_intensity)
 * @param {Array} symptomLogs  – rows from symptom_logs table (need: date, type, severity)
 * @returns {Object}           – { currentDay, phase, next_period, avg_length, flags }
 */
export function runRules(cycleLogs = [], symptomLogs = []) {
  // ── 1. Parse cycles
  const { sorted, lengths } = parseCycles(cycleLogs);

  if (sorted.length === 0) {
    // No data yet — return safe defaults
    return { currentDay: 1, phase: 'follicular', next_period: null, avg_length: 28, flags: [] };
  }

  // ── 2. Averages & predictions
  const avg_length = lengths.length > 0
    ? Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length)
    : 28;

  const latestStart  = sorted[0].start_date;
  const today        = new Date().toISOString().slice(0, 10);
  const currentDay   = daysBetween(today, latestStart) + 1;  // 1-indexed
  const phase        = phaseForDay(Math.max(1, currentDay));
  const next_period  = predictNextPeriod(latestStart, avg_length);

  // ── 3. Run flag detectors
  const flags = [
    detectIrregularCycle(lengths),
    detectRecurringPain(sorted, symptomLogs),
    detectHeavyFlowFatigue(sorted, symptomLogs),
  ].filter(Boolean);   // drop nulls

  return { currentDay, phase, next_period, avg_length, flags };
}
