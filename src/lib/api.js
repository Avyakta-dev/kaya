/**
 * Thin client for the Vercel-style API routes in /api.
 * Payloads here mirror the backend contracts exactly:
 *   POST /api/logs        { userId, type: 'symptom', date, symptom_type, severity, area, source, note }
 *   POST /api/users       { name, age_group }
 *   GET  /api/users?id=
 *   GET  /api/logs?userId=&from=&to=  -> { cycleLogs, symptomLogs, rules }
 */

export async function saveLog(entry) {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    throw new Error('No user registered — complete onboarding first');
  }

  // Map a frontend symptom entry to the backend's expected shape
  const payload = {
    userId,
    type: 'symptom',
    date: entry.date,
    symptom_type: entry.type,
    severity: entry.severity,
    area: entry.area ?? null,
    source: entry.source || 'tap',
    note: entry.note ?? null,
  };

  const res = await fetch('/api/logs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Failed to save log: ${res.status}`);
  }

  return await res.json();
}

export async function registerUser(userData) {
  const res = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Failed to register user: ${res.status}`);
  }

  return await res.json();
}

export async function getUser(userId) {
  const res = await fetch(`/api/users?id=${userId}`);

  if (!res.ok) {
    console.error(`Failed to fetch user: ${res.status}`);
    return { user: null };
  }

  return await res.json();
}

export async function getLogs(userId, { from, to } = {}) {
  if (!userId) {
    throw new Error('userId is required');
  }

  // Default: two years of history so the calendar can navigate back
  const params = new URLSearchParams({ userId });
  if (from) params.set('from', from);
  if (to) params.set('to', to);
  if (!from) {
    const d = new Date();
    d.setMonth(d.getMonth() - 24);
    params.set('from', d.toISOString().slice(0, 10));
  }

  const res = await fetch(`/api/logs?${params.toString()}`);

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Failed to fetch logs: ${res.status}`);
  }

  return await res.json();
}
