// ============================================================================
// SCRIBBLEHUB INSTANT SERVERLESS SCRIPT DISPENSER
// ============================================================================

import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  const { id } = req.query;

  res.setHeader('Access-Control-Allow-Origin', '*');

  if (!id) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.status(400).send("-- [ScribbleCDN] Error: Missing script identifier.");
  }

  try {
    // Fetch script code from Vercel KV storage
    const scriptCode = await kv.get(`script:${id}`);

    if (!scriptCode) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.status(404).send(`-- [ScribbleCDN] Error: Script ID '${id}' not found in database.`);
    }

    // Return clean plaintext for game:HttpGet()
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=60');

    return res.status(200).send(scriptCode);
  } catch (error) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.status(500).send(`-- [ScribbleCDN] Database Exception: ${error.message}`);
  }
}
