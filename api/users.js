/**
 * api/users.js – Vercel serverless function
 *
 * Routes:
 *
 *   POST   /api/users
 *          Body: { name, age_group }
 *          Creates a new user. Returns { ok, id, user }.
 *
 *   GET    /api/users?id=<uuid>
 *          Returns user record by ID.
 */

import { supabaseService } from './_lib/supabase.js';

// ── CORS headers (needed for local vercel dev) ────────────────
const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

  // ── POST ─────────────────────────────────────────────────────
  if (req.method === 'POST') {
    let body;
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch {
      return json(res, 400, { error: 'Invalid JSON body' });
    }

    const { name, age_group } = body;
    if (!name) return json(res, 400, { error: 'name is required' });
    if (!age_group) return json(res, 400, { error: 'age_group is required' });

    // Map life stage to age_group
    const ageGroupMap = {
      'teen': 'teen',
      'adult': '20s',
      'perimenopause': '40s+'
    };

    const mappedAgeGroup = ageGroupMap[age_group] || age_group;

    const { data, error } = await supabaseService
      .from('users')
      .insert({
        name,
        age_group: mappedAgeGroup
      })
      .select('id, name, age_group, created_at')
      .single();

    if (error) return json(res, 500, { error: error.message });
    return json(res, 201, { ok: true, id: data.id, user: data });
  }

  // ── GET ─────────────────────────────────────────────────────
  if (req.method === 'GET') {
    const { id } = req.query;
    if (!id) return json(res, 400, { error: 'id is required' });

    const { data, error } = await supabaseService
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return json(res, 500, { error: error.message });
    if (!data) return json(res, 404, { error: 'User not found' });
    return json(res, 200, { user: data });
  }

  return json(res, 405, { error: `Method ${req.method} not allowed` });
}
