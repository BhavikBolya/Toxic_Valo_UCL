// File: api/db.ts
// Simple Firestore REST proxy — no SDK needed

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID!;
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { action, key, value } = req.body || {};
  const { key: qKey } = req.query || {};

  try {
    // GET — read a document
    if (req.method === 'GET' && qKey) {
      const r = await fetch(`${BASE}/ucl/${encodeURIComponent(qKey)}`);
      if (!r.ok) return res.status(404).json({ error: 'Not found' });
      const doc = await r.json();
      return res.json({ key: qKey, value: doc.fields?.value?.stringValue || null });
    }

    // POST — write a document
    if (req.method === 'POST' && action === 'set' && key) {
      await fetch(`${BASE}/ucl/${encodeURIComponent(key)}?updateMask.fieldPaths=value`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: { value: { stringValue: value } }
        })
      });
      return res.json({ ok: true, key });
    }

    // POST — delete a document
    if (req.method === 'POST' && action === 'delete' && key) {
      await fetch(`${BASE}/ucl/${encodeURIComponent(key)}`, { method: 'DELETE' });
      return res.json({ ok: true, deleted: key });
    }

    return res.status(400).json({ error: 'Invalid request. Use GET ?key=X or POST {action,key,value}' });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}