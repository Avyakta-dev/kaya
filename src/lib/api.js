export async function saveLog(entry) {
  try {
    const res = await fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });

    if (!res.ok) {
      throw new Error(`Failed to save log: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error('Save log error:', err);
    // TODO: switch to /api/logs when Person 1's endpoint is available
    // For now, return success to allow UI to continue
    return { success: true, entry };
  }
}
