/* api/review.js - the review service behind the review comments of the screen mockups (screen-mockups skill v1.0).
   A Vercel serverless function (Node 22). One route, the action in the query: /api/review?action=...&project=...

   Storage   Vercel Blob, PRIVATE store (BLOB_READ_WRITE_TOKEN is set by Vercel when the store is connected).
             review/<project>/comments/<screen>/<id>.json   one file per comment, rewritten on every change
             review/<project>/audio/<screen>/<id>.<ext>     the recording, never changed or removed except with the comment
             Without a token and with REVIEW_LOCAL_DIR set, files go to that folder instead (local testing).
   Sign-in   x-review-key header = REVIEW_KEY_CUSTOMER (customer reviewers) or REVIEW_KEY_TEAM (delivery team);
             x-review-name = the reviewer's name (URI-encoded).
   AI        Convert to English: OpenAI audio translations (OPENAI_API_KEY; SPEECH_MODEL, default whisper-1) - any spoken
             language comes back as English text, English stays English.
             Make clearer: OpenAI chat (CLARIFY_MODEL, default gpt-4o-mini), or Anthropic when CLARIFY_PROVIDER=anthropic
             (ANTHROPIC_API_KEY, CLARIFY_MODEL required). REVIEW_AI_MOCK=1 returns canned text (testing).

   Actions   GET  whoami                         -> {role, name}
             GET  list [&screen=WF-12]           -> {comments: [...]}
             POST create  {screen, title, page, device, role, roleName, view, route, pin, text, audio: {data, type, duration}}
             POST update  {id, screen, patch: {text | clear | display | status, note}}
             POST delete  {id, screen}            (the author, while the comment is still open)
             GET  audio   &id=&screen=            -> the recording
             POST transcribe {id, screen}         -> {comment} with transcript {text, language}
             POST clarify {text}                  -> {text}  (a suggestion; saved only when the reviewer accepts it) */
const fs = require('fs');
const path = require('path');

const MAX_AUDIO = 3.2 * 1024 * 1024;           // bytes after decoding - keeps the request under Vercel's 4.5 MB body limit
const safe = s => String(s || '').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
const safeId = s => String(s || '').replace(/[^A-Za-z0-9_-]/g, '').slice(0, 40);

// ------------------------------------------------------------------ storage
function store() {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = require('@vercel/blob');
    return {
      async put(p, body, type) { await blob.put(p, body, {access: 'private', contentType: type, addRandomSuffix: false, allowOverwrite: true, cacheControlMaxAge: 60}); },
      async get(p) {
        const r = await blob.get(p, {access: 'private', useCache: false});
        if (!r || r.statusCode !== 200 || !r.stream) return null;
        return {body: Buffer.from(await new Response(r.stream).arrayBuffer()), type: r.blob.contentType};
      },
      async list(prefix) {
        const out = []; let cursor;
        do { const r = await blob.list({prefix, cursor, limit: 1000}); out.push(...r.blobs.map(b => b.pathname)); cursor = r.hasMore ? r.cursor : null; } while (cursor);
        return out;
      },
      async del(p) { try { await blob.del(p); } catch (e) {} }
    };
  }
  const root = process.env.REVIEW_LOCAL_DIR;
  if (!root) return null;
  const full = p => path.join(root, ...p.split('/'));
  return {
    async put(p, body) { fs.mkdirSync(path.dirname(full(p)), {recursive: true}); fs.writeFileSync(full(p), body); },
    async get(p) { try { return {body: fs.readFileSync(full(p)), type: p.endsWith('.json') ? 'application/json' : 'audio/' + p.split('.').pop()}; } catch (e) { return null; } },
    async list(prefix) {
      const out = []; const walk = d => { let e = []; try { e = fs.readdirSync(d, {withFileTypes: true}); } catch (x) {} e.forEach(x => x.isDirectory() ? walk(path.join(d, x.name)) : out.push(path.relative(root, path.join(d, x.name)).split(path.sep).join('/'))); };
      walk(full(prefix.replace(/\/$/, ''))); return out.filter(p => p.startsWith(prefix));
    },
    async del(p) { try { fs.unlinkSync(full(p)); } catch (e) {} }
  };
}

// ------------------------------------------------------------------ AI helpers
async function toEnglish(buf, type) {
  if (process.env.REVIEW_AI_MOCK === '1') return {text: 'Mock transcript: the order value should be shown before approval.', language: 'Hindi'};
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw Object.assign(new Error('Convert to English is not set up yet (OPENAI_API_KEY missing).'), {code: 501});
  const ext = (type.split('/')[1] || 'webm').split(';')[0].replace('mpeg', 'mp3').replace('x-m4a', 'm4a');
  const fd = new FormData();
  fd.append('file', new Blob([buf], {type}), 'comment.' + ext);
  fd.append('model', process.env.SPEECH_MODEL || 'whisper-1');
  fd.append('response_format', 'verbose_json');
  const r = await fetch('https://api.openai.com/v1/audio/translations', {method: 'POST', headers: {Authorization: 'Bearer ' + key}, body: fd});
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error('Speech service: ' + ((j.error || {}).message || r.status)), {code: 502});
  const lang = String(j.language || '').toLowerCase();
  return {text: String(j.text || '').trim(), language: lang ? lang[0].toUpperCase() + lang.slice(1) : ''};
}

const CLARIFY_PROMPT = 'You tidy review comments that a customer wrote or spoke about a screen of a software application under design. ' +
  'Rewrite the comment in clear, plain English: correct grammar, keep every point and every detail, add nothing, keep names, numbers and field ' +
  'names exactly. If it makes more than one point, give one short bullet ("- ") per point. Reply with the rewritten comment only.';
async function clarify(text) {
  if (process.env.REVIEW_AI_MOCK === '1') return '- ' + text.trim().replace(/\s+/g, ' ');
  if (process.env.CLARIFY_PROVIDER === 'anthropic') {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key || !process.env.CLARIFY_MODEL) throw Object.assign(new Error('Make clearer is not set up yet (ANTHROPIC_API_KEY / CLARIFY_MODEL missing).'), {code: 501});
    const r = await fetch('https://api.anthropic.com/v1/messages', {method: 'POST', headers: {'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json'},
      body: JSON.stringify({model: process.env.CLARIFY_MODEL, max_tokens: 800, system: CLARIFY_PROMPT, messages: [{role: 'user', content: text}]})});
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw Object.assign(new Error('Language service: ' + ((j.error || {}).message || r.status)), {code: 502});
    return (j.content || []).map(x => x.text || '').join('').trim();
  }
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw Object.assign(new Error('Make clearer is not set up yet (OPENAI_API_KEY missing).'), {code: 501});
  const r = await fetch('https://api.openai.com/v1/chat/completions', {method: 'POST', headers: {Authorization: 'Bearer ' + key, 'content-type': 'application/json'},
    body: JSON.stringify({model: process.env.CLARIFY_MODEL || 'gpt-4o-mini', temperature: 0.2, messages: [{role: 'system', content: CLARIFY_PROMPT}, {role: 'user', content: text}]})});
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error('Language service: ' + ((j.error || {}).message || r.status)), {code: 502});
  return String((((j.choices || [])[0] || {}).message || {}).content || '').trim();
}

// ------------------------------------------------------------------ handler
function who(req) {
  const key = String(req.headers['x-review-key'] || '');
  let name = ''; try { name = decodeURIComponent(String(req.headers['x-review-name'] || '')).trim().slice(0, 80); } catch (e) {}
  const c = process.env.REVIEW_KEY_CUSTOMER, t = process.env.REVIEW_KEY_TEAM;
  const role = key && t && key === t ? 'team' : key && c && key === c ? 'customer' : '';
  return {role, name: name || (role === 'team' ? 'Delivery team' : 'Reviewer')};
}

module.exports = async function handler(req, res) {
  const send = (code, obj) => { res.statusCode = code; res.setHeader('content-type', 'application/json'); res.setHeader('cache-control', 'no-store'); res.end(JSON.stringify(obj)); };
  try {
    const q = req.query || Object.fromEntries(new URL(req.url, 'http://x').searchParams);
    const action = String(q.action || '');
    const S = store();
    if (!S) return send(503, {error: 'The review store is not connected yet (no BLOB_READ_WRITE_TOKEN).'});
    if (!process.env.REVIEW_KEY_CUSTOMER && !process.env.REVIEW_KEY_TEAM) return send(503, {error: 'Review passcodes are not set yet (REVIEW_KEY_CUSTOMER / REVIEW_KEY_TEAM).'});
    const me = who(req);
    if (!me.role) return send(401, {error: 'Sign in with the review passcode.'});
    const project = safe(q.project) || 'project';
    const base = `review/${project}/`;
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const cpath = (screen, id) => `${base}comments/${safe(screen)}/${safeId(id)}.json`;
    const load = async (screen, id) => { const r = await S.get(cpath(screen, id)); if (!r) throw Object.assign(new Error('That comment no longer exists.'), {code: 404}); return JSON.parse(r.body.toString('utf8')); };
    const save = c => S.put(cpath(c.screen, c.id), JSON.stringify(c), 'application/json');
    const now = () => new Date().toISOString();

    if (action === 'whoami') return send(200, me);

    if (action === 'list' && req.method === 'GET') {
      const prefix = `${base}comments/` + (q.screen ? safe(q.screen) + '/' : '');
      const files = (await S.list(prefix)).filter(p => p.endsWith('.json'));
      const out = [];
      for (let i = 0; i < files.length; i += 16) {                // 16 reads at a time
        const part = await Promise.all(files.slice(i, i + 16).map(p => S.get(p).then(r => r ? JSON.parse(r.body.toString('utf8')) : null).catch(() => null)));
        out.push(...part.filter(Boolean));
      }
      return send(200, {comments: out});
    }

    if (action === 'audio' && req.method === 'GET') {
      const c = await load(q.screen, q.id);
      if (!c.audio) return send(404, {error: 'No recording on this comment.'});
      const r = await S.get(c.audio.path);
      if (!r) return send(404, {error: 'The recording is missing.'});
      res.statusCode = 200; res.setHeader('content-type', c.audio.type || r.type || 'audio/webm'); res.setHeader('cache-control', 'private, max-age=3600');
      return res.end(r.body);
    }

    if (req.method !== 'POST') return send(405, {error: 'Use POST for ' + action});

    if (action === 'create') {
      if (!body.screen || (!String(body.text || '').trim() && !body.audio)) return send(400, {error: 'A comment needs a screen and a text or a recording.'});
      const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
      const c = {id, project, screen: String(body.screen).slice(0, 20), title: String(body.title || '').slice(0, 200), page: String(body.page || '').slice(0, 200),
        device: ['desktop', 'tablet', 'mobile'].includes(body.device) ? body.device : 'desktop', role: String(body.role || '').slice(0, 20), roleName: String(body.roleName || '').slice(0, 120),
        view: body.view === 'annotated' ? 'annotated' : 'wireframe', route: String(body.route || '').slice(0, 200),
        pin: body.pin && isFinite(body.pin.x) && isFinite(body.pin.y) ? {x: Math.round(body.pin.x), y: Math.round(body.pin.y)} : null,
        author: me.name, authorRole: me.role, created: now(), text: String(body.text || '').slice(0, 8000), audio: null, transcript: null, clear: null, display: 'original',
        status: 'open', incorporatedNote: '', history: [{at: now(), by: me.name, status: 'open'}]};
      if (body.audio && body.audio.data) {
        const buf = Buffer.from(String(body.audio.data), 'base64');
        if (buf.length > MAX_AUDIO) return send(413, {error: 'The recording is too long - keep it under about 4 minutes.'});
        const type = String(body.audio.type || 'audio/webm').split(';')[0];
        if (!/^audio\/[a-z0-9.+-]+$/.test(type)) return send(400, {error: 'Unknown recording type.'});
        const ext = (type.split('/')[1] || 'webm').replace('mpeg', 'mp3');
        const p = `${base}audio/${safe(c.screen)}/${id}.${ext}`;
        await S.put(p, buf, type);
        c.audio = {path: p, type, duration: Math.max(0, Math.round(Number(body.audio.duration) || 0)), bytes: buf.length};
      }
      await save(c);
      return send(200, {comment: c});
    }

    if (action === 'update') {
      const c = await load(body.screen, body.id); const p = body.patch || {};
      const mine = c.author === me.name && c.authorRole === me.role;
      if (p.text != null) {
        if (!mine || !['open', 'reopened'].includes(c.status)) return send(403, {error: 'Only the author can change an open comment.'});
        c.text = String(p.text).slice(0, 8000); c.clear = null; c.display = 'original';
      }
      if (p.clear != null) { c.clear = {text: String(p.clear.text || '').slice(0, 8000), by: me.name, at: now()}; c.display = 'clear'; }
      if (p.display) c.display = p.display === 'clear' && c.clear ? 'clear' : 'original';
      if (p.status) {
        const ok = (me.role === 'team' && p.status === 'incorporated' && ['open', 'reopened'].includes(c.status)) ||
                   (me.role === 'customer' && p.status === 'done' && c.status === 'incorporated') ||
                   (me.role === 'customer' && p.status === 'reopened' && ['incorporated', 'done'].includes(c.status));
        if (!ok) return send(403, {error: `A ${me.role === 'team' ? 'delivery team member' : 'customer reviewer'} cannot move this comment to ${p.status}.`});
        c.status = p.status;
        if (p.status === 'incorporated') c.incorporatedNote = String(p.note || '').slice(0, 2000);
        c.history.push({at: now(), by: me.name, status: p.status, note: String(p.note || '').slice(0, 2000)});
      }
      c.updated = now();
      await save(c);
      return send(200, {comment: c});
    }

    if (action === 'delete') {
      const c = await load(body.screen, body.id);
      if (!(c.author === me.name && c.authorRole === me.role && c.status === 'open')) return send(403, {error: 'Only the author can delete a comment, and only while it is open.'});
      if (c.audio) await S.del(c.audio.path);
      await S.del(cpath(c.screen, c.id));
      return send(200, {ok: true});
    }

    if (action === 'transcribe') {
      const c = await load(body.screen, body.id);
      if (!c.audio) return send(400, {error: 'This comment has no recording.'});
      const a = await S.get(c.audio.path);
      if (!a) return send(404, {error: 'The recording is missing.'});
      c.transcript = Object.assign(await toEnglish(a.body, c.audio.type || a.type), {at: now()});
      await save(c);
      return send(200, {comment: c});
    }

    if (action === 'clarify') {
      const t = String(body.text || '').trim();
      if (!t) return send(400, {error: 'Nothing to make clearer.'});
      return send(200, {text: await clarify(t.slice(0, 8000))});
    }

    return send(400, {error: 'Unknown action ' + action});
  } catch (e) {
    return send(e.code && e.code >= 400 && e.code < 600 ? e.code : 500, {error: e.message || 'Unexpected error'});
  }
};
