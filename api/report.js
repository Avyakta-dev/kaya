/**
 * api/report.js – Vercel serverless function
 *
 * GET /api/report?userId=<uuid>
 *
 * Aggregates the last 6 months of data from Supabase + runs the rules engine,
 * then returns a single structured payload that the Report page and PDF
 * generator can consume directly — no further data-shaping needed on the client.
 *
 * Response shape (mirrors mockReport in src/lib/mock/report.js):
 * {
 *   patient:   { name, age, lifeStage }
 *   generated: "Oct 24, 2026"
 *   loggedInterval: "3 Cycles (Aug–Oct)"
 *   avgCycleLength: "31 Days (Varied)"
 *   maxSpread:  "9 Days"
 *   cycles: [
 *     { month, length, status, details, severity }  // severity = 0-100 for the UI bar
 *   ]
 *   flaggedPatterns: [
 *     { title, icon, color, description }
 *   ]
 *   clinicalNote: string
 *   suggestedQuestions: string[]
 *   rules: { currentDay, phase, next_period, avg_length, flags }  // raw rules output too
 * }
 */

import { supabaseService } from './_lib/supabase.js';
import { runRules }        from './_lib/rules.js';

// ── CORS ─────────────────────────────────────────────────────
const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json');
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
  res.end(JSON.stringify(body));
}

// ── Helpers ───────────────────────────────────────────────────

/** Format a JS Date → "Oct 24, 2026" */
function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

/** Format a DATE string → abbreviated month name ("Aug") */
function fmtMonth(dateStr) {
  return new Date(dateStr + 'T00:00:00Z').toLocaleDateString('en-US', {
    month: 'short', timeZone: 'UTC',
  });
}

/** Diff in whole days between two ISO date strings */
function daysBetween(a, b) {
  return Math.round(
    (new Date(a + 'T00:00:00Z') - new Date(b + 'T00:00:00Z')) / 86_400_000
  );
}

/**
 * Map a flag code → { title, icon, color, description } for the UI.
 * These descriptions mirror what the LLM (/api/insights) will generate
 * for richer, age-adapted copy — this is the server-side fallback.
 */
function flagToPattern(flag) {
  const map = {
    IRREGULAR_CYCLE: {
      title:       'Cycle Length Variation',
      icon:        'warning',
      color:       '#F6D1C5',
      description: flag.detail,
    },
    RECURRING_PAIN: {
      title:       'Recurring Luteal Pain',
      icon:        'priority_high',
      color:       '#F4A990',
      description: flag.detail,
    },
    HEAVY_FLOW_FATIGUE: {
      title:       'Heavy Flow & Fatigue',
      icon:        'water_drop',
      color:       '#ffdbcf',
      description: flag.detail,
    },
  };
  return map[flag.code] || { title: flag.code, icon: 'info', color: '#F6D1C5', description: flag.detail };
}

/**
 * Build the UI-ready cycle timeline rows from sorted cycle_logs.
 * Each row mirrors the shape used in Report.jsx → mockReport.cycles[].
 */
function buildCycleTimeline(sortedCycles) {
  const lengths = sortedCycles.map((c, i) => {
    if (i === sortedCycles.length - 1) {
      // oldest cycle: use stored end_date if available
      return c.end_date ? daysBetween(c.end_date, c.start_date) + 1 : null;
    }
    return daysBetween(sortedCycles[i + 1].start_date, c.start_date);
  });

  const validLengths = lengths.filter(Boolean);
  const maxLen = validLengths.length ? Math.max(...validLengths) : 28;
  const minLen = validLengths.length ? Math.min(...validLengths) : 28;

  return sortedCycles.map((cycle, i) => {
    const len = lengths[i];

    // Status label
    let status = 'Typical';
    if (len != null && len > 35)       status = `Long (+${len - 28}d)`;
    else if (len != null && len < 21)  status = 'Short';

    // Severity bar (0–100): scale within observed range, min 30 for visibility
    const severity = len != null && maxLen !== minLen
      ? Math.round(30 + ((len - minLen) / (maxLen - minLen)) * 70)
      : 70;

    // Details: dominant symptom on period days
    const flowLabel = cycle.flow_intensity
      ? cycle.flow_intensity.charAt(0).toUpperCase() + cycle.flow_intensity.slice(1) + ' flow'
      : 'Flow logged';

    return {
      month:    fmtMonth(cycle.start_date).toUpperCase(),
      length:   len != null ? `${len} Days` : '— Days',
      status,
      details:  `${flowLabel}${cycle.notes ? ' · ' + cycle.notes : ''}`,
      severity: severity,
    };
  });
}

/**
 * Pick suggested questions for the doctor based on active flag codes.
 */
function buildSuggestedQuestions(flags) {
  const questionMap = {
    IRREGULAR_CYCLE: [
      'Could my cycle length variation indicate an anovulatory cycle or hormonal imbalance?',
      'Should we run a baseline panel (FSH, LH, Prolactin, TSH)?',
    ],
    RECURRING_PAIN: [
      'Are recurring premenstrual cramps (4/5) consistent with secondary dysmenorrhea or endometriosis?',
      'Would a pelvic ultrasound or laparoscopy be appropriate?',
    ],
    HEAVY_FLOW_FATIGUE: [
      'Could heavy flow with fatigue indicate iron-deficiency anaemia or a thyroid issue?',
      'Should I get a CBC and ferritin test before my next cycle?',
    ],
  };

  // Deduplicate and cap at 4 questions
  const questions = flags.flatMap(f => questionMap[f.code] || []);
  return [...new Set(questions)].slice(0, 4);
}

/**
 * Build a short clinical note hinting at likely differential diagnoses.
 */
function buildClinicalNote(flags) {
  const codes = new Set(flags.map(f => f.code));
  const hints = [];
  if (codes.has('IRREGULAR_CYCLE'))    hints.push('PCOS or anovulatory cycles');
  if (codes.has('RECURRING_PAIN'))     hints.push('endometriosis or secondary dysmenorrhea');
  if (codes.has('HEAVY_FLOW_FATIGUE')) hints.push('iron-deficiency anaemia or thyroid dysfunction');
  return hints.length
    ? `Patterns may be clinically relevant for: ${hints.join('; ')}. Discuss with your doctor.`
    : 'No significant patterns detected. Continue regular tracking.';
}

// ── Main handler ─────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return json(res, 405, { error: 'Method not allowed' });
  }

  if (!supabaseService) {
    return json(res, 500, { error: 'Supabase not configured' });
  }

  const { userId } = req.query;
  if (!userId) return json(res, 400, { error: 'userId is required' });

  // ── 1. Fetch user profile
  const { data: user, error: userErr } = await supabaseService
    .from('users')
    .select('name, age, age_group')
    .eq('id', userId)
    .single();

  if (userErr) return json(res, 500, { error: userErr.message });

  // ── 2. Fetch last 6 months of cycle + symptom logs
  const sixMonthsAgo = (() => {
    const d = new Date(); d.setMonth(d.getMonth() - 6);
    return d.toISOString().slice(0, 10);
  })();

  const { data: cycleLogs, error: cycleErr } = await supabaseService
    .from('cycle_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('start_date', sixMonthsAgo)
    .order('start_date', { ascending: false });

  if (cycleErr) return json(res, 500, { error: cycleErr.message });

  const { data: symptomLogs, error: symptomErr } = await supabaseService
    .from('symptom_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('date', sixMonthsAgo)
    .order('date', { ascending: false });

  if (symptomErr) return json(res, 500, { error: symptomErr.message });

  // ── 3. Rules engine
  const rules = runRules(cycleLogs, symptomLogs);

  // ── 4. Build report payload
  const sortedCycles = [...cycleLogs].sort(
    (a, b) => new Date(a.start_date) - new Date(b.start_date)
  );

  // Cycle length stats
  const lengths = sortedCycles
    .map((c, i) => {
      if (i === sortedCycles.length - 1) return null;
      return daysBetween(sortedCycles[i + 1].start_date, c.start_date);
    })
    .filter(Boolean);

  const maxSpread = lengths.length >= 2
    ? Math.max(...lengths) - Math.min(...lengths)
    : 0;

  // Logged interval label: "3 Cycles (Aug–Oct)"
  const firstMonth = sortedCycles.length ? fmtMonth(sortedCycles[0].start_date) : '—';
  const lastMonth  = sortedCycles.length ? fmtMonth(sortedCycles[sortedCycles.length - 1].start_date) : '—';
  const loggedInterval = `${sortedCycles.length} Cycle${sortedCycles.length !== 1 ? 's' : ''} (${firstMonth}–${lastMonth})`;

  // Life stage
  const ageGroupLabel = {
    teen: 'Teen (Adolescent)',
    '20s': 'Adult (Regular tracking)',
    '30s': 'Adult (30s)',
    '40s+': 'Perimenopausal range',
  };

  // Flag → flaggedPatterns
  const flaggedPatterns = rules.flags.map(flagToPattern);

  const report = {
    patient: {
      name:      user?.name  || 'Patient',
      age:       user?.age   || '—',
      lifeStage: ageGroupLabel[user?.age_group] || 'Adult',
    },
    generated:      fmtDate(new Date()),
    loggedInterval,
    avgCycleLength: `${rules.avg_length} Days${maxSpread >= 7 ? ' (Varied)' : ''}`,
    maxSpread:      `${maxSpread} Days`,
    cycles:         buildCycleTimeline(
                      [...cycleLogs].sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
                    ),
    flaggedPatterns,
    clinicalNote:        buildClinicalNote(rules.flags),
    suggestedQuestions:  buildSuggestedQuestions(rules.flags),
    rules,  // raw output — used by src/lib/pdf.js and /api/insights
  };

  return json(res, 200, report);
}
