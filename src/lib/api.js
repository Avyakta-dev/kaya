/**
 * src/lib/api.js – Frontend API client
 *
 * All calls go to Vercel serverless functions under /api/.
 * Falls back to mock data automatically when the API is unreachable
 * (e.g. local `npm run dev` without `vercel dev`), so the UI always works.
 *
 * Usage:
 *   import { fetchLogs, saveSymptom, saveCycle, fetchReport } from './api';
 */

import { mockCycle }    from './mock/cycle';
import { mockInsights } from './mock/insights';
import { mockReport }   from './mock/report';

// ── Config ────────────────────────────────────────────────────

// In Vite the base URL is always '' (same origin), unless you set VITE_API_BASE.
const API_BASE = import.meta.env.VITE_API_BASE || '';

// Hardcoded demo user ID — matches db/seed.js
// Replace with real auth session user ID once auth is wired up.
export const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001';

// ── Internal helper ───────────────────────────────────────────
async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `API error ${res.status}`);
  }

  return res.json();
}

// ── Public API ────────────────────────────────────────────────

/**
 * fetchLogs({ userId, from, to })
 *
 * Returns { cycleLogs, symptomLogs, rules }
 * Falls back to mock data if the API is unavailable.
 */
export async function fetchLogs({ userId = DEMO_USER_ID, from, to } = {}) {
  try {
    const params = new URLSearchParams({ userId });
    if (from) params.set('from', from);
    if (to)   params.set('to', to);
    return await apiFetch(`/api/logs?${params}`);
  } catch (err) {
    console.warn('[api] fetchLogs fell back to mock data:', err.message);
    // Return a mock shape that matches the live response
    return {
      cycleLogs:   mockCycle.history.map((h, i) => ({ id: String(i), start_date: h.month, flow_intensity: h.flow })),
      symptomLogs: [],
      rules: {
        currentDay:  mockCycle.currentDay,
        phase:       mockCycle.currentPhase,
        next_period: null,
        avg_length:  mockCycle.cycleLength,
        flags:       mockInsights.filter(i => i.discussWithDoctor).map(i => ({
          code:   i.title.toUpperCase().replace(/ /g, '_'),
          detail: i.description,
        })),
      },
    };
  }
}

/**
 * saveSymptom({ userId, symptom_type, severity, area, source, note, date })
 *
 * Saves a tapped or voice-extracted symptom log.
 * Returns { ok, id }.
 */
export async function saveSymptom({
  userId = DEMO_USER_ID,
  symptom_type,
  severity,
  area,
  source = 'tap',
  note,
  date,
} = {}) {
  return apiFetch('/api/logs', {
    method: 'POST',
    body: JSON.stringify({ userId, type: 'symptom', symptom_type, severity, area, source, note, date }),
  });
}

/**
 * saveCycle({ userId, start_date, end_date, flow_intensity, notes })
 *
 * Saves the start (or completion) of a cycle.
 * Returns { ok, id }.
 */
export async function saveCycle({
  userId = DEMO_USER_ID,
  start_date,
  end_date,
  flow_intensity,
  notes,
} = {}) {
  return apiFetch('/api/logs', {
    method: 'POST',
    body: JSON.stringify({ userId, type: 'cycle', start_date, end_date, flow_intensity, notes }),
  });
}

/**
 * deleteLog({ id, table })
 *
 * table: 'cycle_logs' | 'symptom_logs'
 * Returns { ok }.
 */
export async function deleteLog({ id, table }) {
  return apiFetch(`/api/logs?id=${encodeURIComponent(id)}&table=${encodeURIComponent(table)}`, {
    method: 'DELETE',
  });
}

/**
 * fetchReport({ userId })
 *
 * Returns the full report payload — ready to pass to Report.jsx and src/lib/pdf.js.
 * Falls back to mockReport if the API is unavailable.
 */
export async function fetchReport({ userId = DEMO_USER_ID } = {}) {
  try {
    return await apiFetch(`/api/report?userId=${encodeURIComponent(userId)}`);
  } catch (err) {
    console.warn('[api] fetchReport fell back to mock data:', err.message);
    return mockReport;
  }
}
