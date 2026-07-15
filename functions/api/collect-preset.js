// Cloudflare Pages Function — VoidSynth AI training-data collector.
//
// Accepts a POST from installed copies of VoidSynth after a successful
// AI generation and stores it in D1 for later use in training a fully-local
// replacement model. This endpoint is intentionally a side-channel: the
// plugin must treat any failure here as silent and non-blocking — nothing
// about VoidSynth's core AI feature should ever depend on this being up.
//
// Auth: shared secret in the "X-VoidSynth-Key" header (set as a Cloudflare
// secret, not a public value). This isn't meant to stop a determined
// attacker, just keep the endpoint from being casually spammed/scraped.

const MAX_PROMPT_LEN = 500;
const MAX_PARAMS_LEN = 8000; // JSON string length, generous for ~150 params

export async function onRequestPost({ request, env }) {
    const providedKey = request.headers.get('X-VoidSynth-Key') || '';
    if (!env.COLLECT_SHARED_SECRET || providedKey !== env.COLLECT_SHARED_SECRET) {
        return new Response('Unauthorized', { status: 401 });
    }

    let body;
    try {
        body = await request.json();
    } catch {
        return new Response('Bad Request', { status: 400 });
    }

    const { prompt, params, model, tool, app_version, client_id } = body || {};

    if (typeof prompt !== 'string' || prompt.length === 0 || prompt.length > MAX_PROMPT_LEN) {
        return new Response('Invalid prompt', { status: 400 });
    }
    if (typeof params !== 'object' || params === null) {
        return new Response('Invalid params', { status: 400 });
    }
    const paramsStr = JSON.stringify(params);
    if (paramsStr.length > MAX_PARAMS_LEN) {
        return new Response('Params too large', { status: 400 });
    }

    try {
        await env.DB.prepare(
            `INSERT INTO presets (prompt, params, model, tool, app_version, client_id)
             VALUES (?, ?, ?, ?, ?, ?)`
        ).bind(
            prompt.substring(0, MAX_PROMPT_LEN),
            paramsStr,
            typeof model === 'string' ? model.substring(0, 100) : null,
            typeof tool === 'string' ? tool.substring(0, 50) : null,
            typeof app_version === 'string' ? app_version.substring(0, 50) : null,
            typeof client_id === 'string' ? client_id.substring(0, 64) : null
        ).run();
    } catch (err) {
        return new Response('Storage error', { status: 500 });
    }

    return new Response(null, { status: 204 });
}

// Reject any method other than POST explicitly (Pages Functions otherwise 404s,
// which is fine too, but this is clearer for debugging).
export async function onRequestGet() {
    return new Response('Method Not Allowed', { status: 405 });
}
