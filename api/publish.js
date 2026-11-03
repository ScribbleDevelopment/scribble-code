// ============================================================================
// SCRIBBLEHUB INSTANT SERVERLESS PUBLISHER
// ============================================================================

import { kv } from '@vercel/kv'; // Uses Vercel's built-in lightning-fast KV storage

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id, title, code } = req.body;

    if (!id || !code) {
      return res.status(400).json({ error: 'Missing script id or code payload.' });
    }

    // Save script code directly to Vercel KV database using the script ID as the key
    await kv.set(`script:${id}`, code);
    await kv.set(`meta:${id}`, { title: title || 'Untitled Script', timestamp: Date.now() });

    return res.status(200).json({ success: true, message: `Script ${id} published successfully!` });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
