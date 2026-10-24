/**
 * api/logs.js – Vercel serverless function
 *
 * Routes (all require ?userId=<uuid>):
 *
 *   GET    /api/logs?userId=&from=ISO_DATE&to=ISO_DATE
 *          Returns { cycleLogs, symptomLogs, rules }
 *          `rules` is the live output of runRules() — used by Home and Insights pages.
 *
 *   POST   /api/logs
 *          Body: { userId, type: 'cycle'|'symptom', ...fields }
 *          Saves a new cycle log or symptom log. Returns { ok, id }.
 *
 *   DELETE /api/logs?id=<uuid>&table=cycle_logs|symptom_logs
 *          Hard-deletes a single row. Returns { ok }.
 */

import { supabaseService } from './_lib/supabase.js';
import { runRules }        from './_lib/rules.js';

// ── CORS headers (needed for local vercel dev) ────────────────
const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json');
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
  res.end(JSON.stringify(body));
}

// ── Handler ──────────────────────────────────────────────────
export default async function handler(req, res) {
  // Pre-flight
  if (req.method === 'OPTIONS') {
    Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
    return res.status(204).end();
  }

  if (!supabaseService) {
    return json(res, 500, { error: 'Supabase not configured' });
  }

  // ── GET ──────────────────────────────────────────────────────
  if (req.method === 'GET') {
    const { userId, from, to } = req.query;

    if (!userId) return json(res, 400, { error: 'userId is required' });

    // Default date range: last 6 months
    const toDate   = to   || new Date().toISOString().slice(0, 10);
    const fromDate = from || (() => {
      const d = new Date(); d.setMonth(d.getMonth() - 6);
      return d.toISOString().slice(0, 10);
    })();

    // Fetch cycle logs
    const { data: cycleLogs, error: cycleErr } = await supabaseService
      .from('cycle_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('start_date', fromDate)
      .lte('start_date', toDate)
      .order('start_date', { ascending: false });

    if (cycleErr) return json(res, 500, { error: cycleErr.message });

    // Fetch symptom logs
    const { data: symptomLogs, error: symptomErr } = await supabaseService
      .from('symptom_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('date', fromDate)
      .lte('date', toDate)
      .order('date', { ascending: false });

    if (symptomErr) return json(res, 500, { error: symptomErr.message });

    // Run rules engine — gives Home + Insights their live data
    const rules = runRules(cycleLogs, symptomLogs);

    return json(res, 200, { cycleLogs, symptomLogs, rules });
  }

  // ── POST ─────────────────────────────────────────────────────
  if (req.method === 'POST') {
    let body;
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch {
      return json(res, 400, { error: 'Invalid JSON body' });
    }

    const { userId, type, ...fields } = body;
    if (!userId) return json(res, 400, { error: 'userId is required' });
    if (!type)   return json(res, 400, { error: 'type is required (cycle | symptom)' });

    if (type === 'cycle') {
      const { start_date, end_date, flow_intensity, notes } = fields;
      if (!start_date) return json(res, 400, { error: 'start_date is required for cycle logs' });

      const { data, error } = await supabaseService
        .from('cycle_logs')
        .insert({ user_id: userId, start_date, end_date, flow_intensity, notes })
        .select('id')
        .single();

      if (error) return json(res, 500, { error: error.message });
      return json(res, 201, { ok: true, id: data.id });
    }

    if (type === 'symptom') {
      const { date, symptom_type, severity, area, source, note } = fields;
      if (!symptom_type) return json(res, 400, { error: 'symptom_type is required' });

      const { data, error } = await supabaseService
        .from('symptom_logs')
        .insert({
          user_id: userId,
          date:    date || new Date().toISOString().slice(0, 10),
          type:    symptom_type,
          severity,
          area,
          source,
          note,
        })
        .select('id')
        .single();

      if (error) return json(res, 500, { error: error.message });
      return json(res, 201, { ok: true, id: data.id });
    }

    return json(res, 400, { error: `Unknown type "${type}". Use "cycle" or "symptom".` });
  }

  // ── DELETE ───────────────────────────────────────────────────
  if (req.method === 'DELETE') {
    const { id, table } = req.query;
    if (!id)    return json(res, 400, { error: 'id is required' });
    if (!table) return json(res, 400, { error: 'table is required (cycle_logs | symptom_logs)' });

    const allowed = ['cycle_logs', 'symptom_logs'];
    if (!allowed.includes(table)) {
      return json(res, 400, { error: `table must be one of: ${allowed.join(', ')}` });
    }

    const { error } = await supabaseService.from(table).delete().eq('id', id);
    if (error) return json(res, 500, { error: error.message });
    return json(res, 200, { ok: true });
  }

  return json(res, 405, { error: `Method ${req.method} not allowed` });
}
