/* Review.jsx - review comments on the screens (screen-mockups skill v1.0).

   On every screen page: a "Review comments" button opens a side panel where a reviewer
     * types a comment or records one (the recording is always kept and can be played again),
     * pins it to a spot on the screen (the pin belongs to the device size and the view it was made on),
     * turns a recording into English text ("Convert to English": Hindi is translated, English is written out),
     * tidies the wording ("Make clearer": a suggestion to edit and accept; the original stays one click away).
   Status: Open -> Incorporated (the delivery team, with a note) -> Done (the customer), or Reopened.
   review-comments.html lists every comment of every screen, with filters and a CSV download.

   The comments live in the review service of the site (api/review, see reference/review.md); a reviewer signs in once
   with a name and the passcode the team shares. Opened from disk or offline, the panel says the service is needed.
   Data: WF_DATA.review = {api: '/api/review'}; WF_DATA.project names the project in the store. */
(function () {
const {useState, useEffect, useRef} = React;
const D = () => window.WF_DATA || {};
const API = () => (D().review || {}).api || '/api/review';
const AKEY = () => 'wf-review:' + (D().project || 'p');
const loadAuth = () => { try { return JSON.parse(localStorage.getItem(AKEY()) || 'null'); } catch (e) { return null; } };
const saveAuth = a => { try { a ? localStorage.setItem(AKEY(), JSON.stringify(a)) : localStorage.removeItem(AKEY()); } catch (e) {} };
const STATUS = {open: ['Open', 'warn'], incorporated: ['Incorporated', 'info'], done: ['Done', 'ok'], reopened: ['Reopened', 'bad']};
const ROLE = {customer: 'Customer', team: 'Delivery team'};
const MAX_SEC = 240;

async function call(auth, action, {method = 'GET', params = {}, body} = {}) {
  const u = new URL(API(), location.href);
  u.searchParams.set('action', action); u.searchParams.set('project', D().project || 'p');
  Object.entries(params).forEach(([k, v]) => v != null && u.searchParams.set(k, v));
  let r;
  try {
    r = await fetch(u.href, {method, headers: Object.assign({'x-review-key': (auth || {}).key || '', 'x-review-name': encodeURIComponent((auth || {}).name || '')},
      body ? {'content-type': 'application/json'} : {}), body: body ? JSON.stringify(body) : undefined});
  } catch (e) { const x = new Error('The review service cannot be reached. Open the published site and check the internet connection.'); x.offline = true; throw x; }
  if (action === 'audio' && r.ok) return r.blob();
  const j = await r.json().catch(() => ({}));
  if (!r.ok) { const x = new Error(j.error || ('The review service answered ' + r.status)); x.status = r.status; throw x; }
  return j;
}
const when = iso => { try { return new Date(iso).toLocaleString('en-IN', {day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'}); } catch (e) { return iso; } };
const mmss = s => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
const DEVL = {desktop: 'Desktop', tablet: 'Tablet', mobile: 'Mobile'};
const blobToB64 = b => new Promise((res, rej) => { const f = new FileReader(); f.onload = () => res(String(f.result).split(',')[1]); f.onerror = rej; f.readAsDataURL(b); });

// ------------------------------------------------------------------ sign in
function SignIn({onDone, compact}) {
  const [name, setName] = useState(''); const [key, setKey] = useState(''); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const go = async () => {
    if (!name.trim() || !key.trim()) return setErr('Enter your name and the review passcode.');
    setBusy(true); setErr('');
    try { const a = {name: name.trim(), key: key.trim()}; const me = await call(a, 'whoami'); a.role = me.role; saveAuth(a); onDone(a); }
    catch (e) { setErr(e.status === 401 ? 'That passcode is not right.' : e.message); }
    setBusy(false);
  };
  return <div className={'rv-signin' + (compact ? ' compact' : '')}>
    <p>Sign in once to read and add review comments. Your name is shown on every comment you add.</p>
    <label>Your name<input value={name} onChange={e => setName(e.target.value)} autoComplete="name"/></label>
    <label>Review passcode<input type="password" value={key} onChange={e => setKey(e.target.value)} onKeyDown={e => e.key === 'Enter' && go()}/></label>
    {err && <div className="rv-err">{err}</div>}
    <button type="button" className="rv-btn primary" disabled={busy} onClick={go}>{busy ? 'Checking…' : 'Sign in'}</button></div>;
}

// ------------------------------------------------------------------ recorder
function Recorder({value, onChange}) {
  const [state, setState] = useState('idle'); const [sec, setSec] = useState(0); const [err, setErr] = useState('');
  const rec = useRef(null); const timer = useRef(null); const chunks = useRef([]); const t0 = useRef(0);
  const url = React.useMemo(() => value ? URL.createObjectURL(value.blob) : '', [value]);
  useEffect(() => () => { clearInterval(timer.current); if (rec.current && rec.current.state === 'recording') rec.current.stop(); }, []);
  const start = async () => {
    setErr('');
    if (!navigator.mediaDevices || !window.MediaRecorder) return setErr('This browser cannot record audio. Type the comment instead.');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({audio: true});
      const type = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'].find(x => MediaRecorder.isTypeSupported(x)) || '';
      const r = new MediaRecorder(stream, type ? {mimeType: type, audioBitsPerSecond: 32000} : undefined);
      chunks.current = [];
      r.ondataavailable = e => e.data.size && chunks.current.push(e.data);
      r.onstop = () => {
        stream.getTracks().forEach(x => x.stop()); clearInterval(timer.current);
        const blob = new Blob(chunks.current, {type: (r.mimeType || type || 'audio/webm').split(';')[0]});
        onChange({blob, type: blob.type, duration: (Date.now() - t0.current) / 1000}); setState('idle');
      };
      r.start(1000); rec.current = r; t0.current = Date.now(); setSec(0); setState('rec');
      timer.current = setInterval(() => { const s = (Date.now() - t0.current) / 1000; setSec(s); if (s >= MAX_SEC) r.stop(); }, 250);
    } catch (e) { setErr('The microphone could not be used - allow it in the browser and try again.'); }
  };
  if (state === 'rec') return <div className="rv-rec on"><span className="rv-dot"/>Recording {mmss(sec)} <small>(up to {MAX_SEC / 60} minutes)</small>
    <button type="button" className="rv-btn" onClick={() => rec.current.stop()}>Stop</button></div>;
  if (value) return <div className="rv-rec"><audio controls src={url}/><button type="button" className="rv-btn" onClick={start}>Record again</button>
    <button type="button" className="rv-btn ghost" onClick={() => onChange(null)}>Remove</button></div>;
  return <div className="rv-rec"><button type="button" className="rv-btn" onClick={start}><window.Ic name="mic" size={15}/> Record a spoken comment</button>
    {err && <div className="rv-err">{err}</div>}</div>;
}

function Audio({auth, c}) {
  const [url, setUrl] = useState(''); const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
  const load = async () => {
    setBusy(true); setErr('');
    try { const b = await call(auth, 'audio', {params: {id: c.id, screen: c.screen}}); setUrl(URL.createObjectURL(b)); } catch (e) { setErr(e.message); }
    setBusy(false);
  };
  if (url) return <audio controls autoPlay src={url} className="rv-audio"/>;
  return <div><button type="button" className="rv-btn" disabled={busy} onClick={load}><window.Ic name="play" size={14}/> {busy ? 'Loading…' : `Play the recording (${mmss(c.audio.duration || 0)})`}</button>
    {err && <div className="rv-err">{err}</div>}</div>;
}

// ------------------------------------------------------------------ one comment
function Card({auth, c, n, onChange, onDelete, here, focus, onPinClick}) {
  const [busy, setBusy] = useState(''); const [err, setErr] = useState('');
  const [sugg, setSugg] = useState(null); const [edit, setEdit] = useState(null); const [note, setNote] = useState(null); const [del, setDel] = useState(false);
  const [showOrig, setShowOrig] = useState(false); const [hist, setHist] = useState(false);
  const mine = c.author === auth.name && c.authorRole === auth.role;
  const team = auth.role === 'team';
  const [lab, tone] = STATUS[c.status] || STATUS.open;
  const run = async (what, f) => { setBusy(what); setErr(''); try { await f(); } catch (e) { setErr(e.message); } setBusy(''); };
  const update = patch => run('save', async () => { const r = await call(auth, 'update', {method: 'POST', body: {id: c.id, screen: c.screen, patch}}); onChange(r.comment); });
  const base = c.text || (c.transcript || {}).text || '';
  const shown = c.clear && c.display === 'clear' && !showOrig ? c.clear.text : null;
  return <div className={'rv-card s-' + c.status + (focus ? ' focus' : '')} id={'rv-' + c.id}>
    <div className="rv-card-h">
      <button type="button" className={'rv-num s-' + c.status} title={c.pin ? 'Show the pin on the screen' : 'Not pinned to a spot'} onClick={() => onPinClick && onPinClick(c)}>{n}</button>
      <div className="who"><b>{c.author}</b> <span>{ROLE[c.authorRole] || ''}</span><div className="meta">{when(c.created)}</div></div>
      <window.Pill tone={tone}>{lab}</window.Pill></div>
    <div className="rv-ctx">{DEVL[c.device] || c.device}{c.route ? ' · ' + c.route : ''}{c.roleName ? ' · ' + c.roleName : ''}{c.pin ? ' · pinned' : ''}
      {!here && <a href={c.link} title="Open the screen the way it was when the comment was made"> · open there</a>}</div>
    {edit != null ? <div className="rv-edit"><textarea rows={4} value={edit} onChange={e => setEdit(e.target.value)}/>
      <div className="rv-row"><button type="button" className="rv-btn primary" onClick={() => { update({text: edit}); setEdit(null); }}>Save</button><button type="button" className="rv-btn ghost" onClick={() => setEdit(null)}>Cancel</button></div></div> :
      <>{shown ? <div className="rv-text">{shown}<div className="rv-tag">Clear version · <a href="#" onClick={e => { e.preventDefault(); setShowOrig(true); }}>show the original wording</a></div></div> :
        <>{c.text && <div className="rv-text">{c.text}</div>}
          {c.clear && showOrig && <div className="rv-tag"><a href="#" onClick={e => { e.preventDefault(); setShowOrig(false); }}>show the clear version</a></div>}</>}</>}
    {c.audio && <Audio auth={auth} c={c}/>}
    {c.transcript && <div className="rv-transcript"><div className="rv-tag">From the recording{c.transcript.language ? ` · spoken in ${c.transcript.language}` : ''}{c.transcript.language && !/english/i.test(c.transcript.language) ? ', shown in English' : ''}</div>{c.transcript.text}</div>}
    {sugg != null && <div className="rv-sugg"><div className="rv-tag">Suggested clear wording - edit it if needed</div>
      <textarea rows={4} value={sugg} onChange={e => setSugg(e.target.value)}/>
      <div className="rv-row"><button type="button" className="rv-btn primary" onClick={() => { update({clear: {text: sugg}, display: 'clear'}); setSugg(null); setShowOrig(false); }}>Use this wording</button>
        <button type="button" className="rv-btn ghost" onClick={() => setSugg(null)}>Discard</button></div></div>}
    {note != null && <div className="rv-sugg"><div className="rv-tag">{note.status === 'incorporated' ? 'What was changed (shown to the customer)' : 'Why it is reopened'}</div>
      <textarea rows={3} value={note.text} onChange={e => setNote({...note, text: e.target.value})}/>
      <div className="rv-row"><button type="button" className="rv-btn primary" onClick={() => { update({status: note.status, note: note.text}); setNote(null); }}>{note.status === 'incorporated' ? 'Mark incorporated' : 'Reopen'}</button>
        <button type="button" className="rv-btn ghost" onClick={() => setNote(null)}>Cancel</button></div></div>}
    {c.incorporatedNote && <div className="rv-note"><b>Change made:</b> {c.incorporatedNote}</div>}
    <div className="rv-actions">
      {c.audio && !c.transcript && <button type="button" className="rv-btn" disabled={!!busy} onClick={() => run('tr', async () => { const r = await call(auth, 'transcribe', {method: 'POST', body: {id: c.id, screen: c.screen}}); onChange(r.comment); })}>
        <window.Ic name="languages" size={14}/> {busy === 'tr' ? 'Converting…' : 'Convert to English'}</button>}
      {base && sugg == null && <button type="button" className="rv-btn" disabled={!!busy} onClick={() => run('cl', async () => { const r = await call(auth, 'clarify', {method: 'POST', body: {text: base}}); setSugg(r.text); })}>
        <window.Ic name="wand-sparkles" size={14}/> {busy === 'cl' ? 'Working…' : 'Make clearer'}</button>}
      {mine && ['open', 'reopened'].includes(c.status) && edit == null && <button type="button" className="rv-btn ghost" onClick={() => setEdit(c.text || '')}>Edit</button>}
      {team && ['open', 'reopened'].includes(c.status) && note == null && <button type="button" className="rv-btn" onClick={() => setNote({status: 'incorporated', text: ''})}><window.Ic name="check" size={14}/> Mark incorporated</button>}
      {!team && c.status === 'incorporated' && <button type="button" className="rv-btn primary" onClick={() => update({status: 'done'})}><window.Ic name="check-check" size={14}/> Mark done</button>}
      {!team && ['incorporated', 'done'].includes(c.status) && note == null && <button type="button" className="rv-btn ghost" onClick={() => setNote({status: 'reopened', text: ''})}>Reopen</button>}
      {mine && c.status === 'open' && (del ? <><button type="button" className="rv-btn danger" onClick={() => run('del', async () => { await call(auth, 'delete', {method: 'POST', body: {id: c.id, screen: c.screen}}); onDelete(c); })}>Delete for good</button>
        <button type="button" className="rv-btn ghost" onClick={() => setDel(false)}>Keep</button></> : <button type="button" className="rv-btn ghost" onClick={() => setDel(true)}>Delete</button>)}
      {(c.history || []).length > 1 && <button type="button" className="rv-btn ghost" onClick={() => setHist(!hist)}>History ({c.history.length})</button>}</div>
    {busy === 'save' && <div className="rv-tag">Saving…</div>}
    {err && <div className="rv-err">{err}</div>}
    {hist && <ul className="rv-hist">{c.history.map((h, i) => <li key={i}>{when(h.at)} · {h.by} · {(STATUS[h.status] || [h.status])[0]}{h.note ? ' - ' + h.note : ''}</li>)}</ul>}
  </div>;
}

// ------------------------------------------------------------------ the panel on a screen page
function WFReview({wf, dev, role, view, route, layer, slot, setDev}) {
  const P = new URLSearchParams(location.search);
  const [auth, setAuth] = useState(loadAuth);
  const [open, setOpen] = useState(!!P.get('comment'));
  const [list, setList] = useState(null); const [err, setErr] = useState(''); const [offline, setOffline] = useState(false);
  const [filter, setFilter] = useState('all');
  const [compose, setCompose] = useState(false); const [text, setText] = useState(''); const [audio, setAudio] = useState(null);
  const [pin, setPin] = useState(null); const [picking, setPicking] = useState(false); const [saving, setSaving] = useState(false);
  const [focus, setFocus] = useState(P.get('comment') || '');
  const roleName = ((wf.roles || []).find(r => r.id === role) || {}).name || '';
  const load = async (a = auth) => {
    if (!a) return;
    setErr('');
    try { const r = await call(a, 'list', {params: {screen: wf.id}}); setList(r.comments || []); setOffline(false); }
    catch (e) { if (e.status === 401) { saveAuth(null); setAuth(null); } else { setErr(e.message); setOffline(!!e.offline); } setList(list || []); }
  };
  useEffect(() => { load(); }, [auth && auth.key]);
  useEffect(() => { document.body.classList.toggle('rv-open', open); dispatchEvent(new Event('resize')); }, [open]);   // the page makes room for the panel
  useEffect(() => { if (focus && open) setTimeout(() => { const el = document.getElementById('rv-' + focus); el && el.scrollIntoView({block: 'center'}); }, 300); }, [focus, open, list && list.length]);
  const sorted = (list || []).slice().sort((a, b) => a.created < b.created ? -1 : 1);
  const num = {}; sorted.forEach((c, i) => { num[c.id] = i + 1; });
  const counts = {all: sorted.length}; sorted.forEach(c => { counts[c.status] = (counts[c.status] || 0) + 1; });
  const openN = (counts.open || 0) + (counts.reopened || 0);
  const shown = sorted.filter(c => filter === 'all' || c.status === filter || (filter === 'open' && c.status === 'reopened'));
  const linkOf = (c) => wf.page + `?view=${view}&device=${c.device}&role=${encodeURIComponent(c.role || role)}&comment=${c.id}` + (c.route ? '#' + c.route : '');
  const save = async () => {
    if (!text.trim() && !audio) return setErr('Type a comment or record one.');
    setSaving(true); setErr('');
    try {
      const body = {screen: wf.id, title: wf.title, page: wf.page, device: dev, role, roleName, view, route: route || '', pin, text: text.trim()};
      if (audio) body.audio = {data: await blobToB64(audio.blob), type: audio.type, duration: Math.round(audio.duration)};
      const r = await call(auth, 'create', {method: 'POST', body});
      setList(sorted.concat([r.comment])); setText(''); setAudio(null); setPin(null); setCompose(false); setFocus(r.comment.id);
    } catch (e) { setErr(e.message); }
    setSaving(false);
  };
  const pinClick = c => {
    if (!c.pin) return;
    if (c.device !== dev || (c.route || '') !== (route || '')) { location.href = linkOf(c); return; }
    setFocus(c.id);
    const el = document.getElementById('rv-pin-' + c.id); el && el.scrollIntoView({block: 'center', behavior: 'smooth'});
  };
  // pins on the screen (only those made on this device size and view)
  const here = c => c.device === dev && (c.route || '') === (route || '');
  const pins = layer && ReactDOM.createPortal(<>
    {sorted.filter(c => c.pin && here(c)).map(c => <button key={c.id} id={'rv-pin-' + c.id} type="button" className={'rv-pin s-' + c.status + (focus === c.id ? ' focus' : '')}
      style={{left: c.pin.x, top: c.pin.y}} title={(c.text || 'Spoken comment').slice(0, 120)} onClick={() => { setOpen(true); setFocus(c.id); }}>{num[c.id]}</button>)}
    {pin && picking === false && compose && <span className="rv-pin new" style={{left: pin.x, top: pin.y}}>+</span>}
    {picking && <div className="rv-pick" onClick={e => { const r = e.currentTarget.getBoundingClientRect(); const s = r.width / e.currentTarget.offsetWidth || 1;
      setPin({x: Math.round((e.clientX - r.left) / s), y: Math.round((e.clientY - r.top) / s)}); setPicking(false); }}><span>Click the spot this comment is about</span></div>}
  </>, layer);
  return <>
    {pins}
    {slot && ReactDOM.createPortal(<button type="button" className={'rv-fab' + (open ? ' on' : '')} onClick={() => setOpen(!open)} aria-expanded={open}>
      <window.Ic name="message-square-text" size={16}/> Review comments{list ? <span className="n">{openN ? `${openN} open` : sorted.length}</span> : null}</button>, slot)}
    {open && <aside className="rv-panel" aria-label="Review comments">
      <header><div><small>{wf.id} · Review comments</small><b>{wf.title}</b></div>
        <button type="button" aria-label="Close" className="rv-x" onClick={() => setOpen(false)}><window.Ic name="x" size={20}/></button></header>
      <div className="rv-body">
        {!auth ? <SignIn onDone={a => { setAuth(a); load(a); }}/> : <>
          <div className="rv-me">Signed in as <b>{auth.name}</b> ({ROLE[auth.role] || auth.role}) · <a href="#" onClick={e => { e.preventDefault(); saveAuth(null); setAuth(null); setList(null); }}>sign out</a>
            {' · '}<a href="review-comments.html">all screens</a></div>
          {offline && <div className="rv-err">{err}</div>}
          {!compose ? <button type="button" className="rv-btn primary block" onClick={() => { setCompose(true); setErr(''); }}><window.Ic name="plus" size={15}/> Add a comment on this screen</button> :
            <div className="rv-compose">
              <label>Your comment<textarea rows={4} value={text} placeholder="Type here - or record it below" onChange={e => setText(e.target.value)}/></label>
              <Recorder value={audio} onChange={setAudio}/>
              <div className="rv-row">{pin ? <><span className="rv-tag">Pinned on {DEVL[dev]}{route ? ' · ' + route : ''}</span><button type="button" className="rv-btn ghost" onClick={() => setPin(null)}>Remove pin</button></> :
                <button type="button" className="rv-btn" onClick={() => setPicking(!picking)}><window.Ic name="map-pin" size={14}/> {picking ? 'Click on the screen…' : 'Pin to a spot on the screen'}</button>}</div>
              <div className="rv-tag">Saved with: {DEVL[dev]}{route ? ' · ' + route : ''}{roleName ? ' · ' + roleName : ''}</div>
              {err && !offline && <div className="rv-err">{err}</div>}
              <div className="rv-row"><button type="button" className="rv-btn primary" disabled={saving} onClick={save}>{saving ? 'Saving…' : 'Save comment'}</button>
                <button type="button" className="rv-btn ghost" onClick={() => { setCompose(false); setPicking(false); setPin(null); setAudio(null); setText(''); }}>Cancel</button></div></div>}
          <div className="rv-filters">{['all', 'open', 'incorporated', 'done'].map(k => <button key={k} type="button" className={filter === k ? 'on' : ''} onClick={() => setFilter(k)}>
            {k === 'all' ? 'All' : STATUS[k][0]} <span>{k === 'open' ? openN : (counts[k] || 0)}</span></button>)}</div>
          {list == null ? <div className="rv-tag">Loading…</div> : shown.length === 0 ? <div className="rv-empty">{sorted.length ? 'Nothing with this status.' : 'No comments on this screen yet.'}</div> :
            shown.map(c => <Card key={c.id} auth={auth} c={{...c, link: linkOf(c)}} n={num[c.id]} here={here(c)} focus={focus === c.id} onPinClick={pinClick}
              onChange={x => setList(sorted.map(y => y.id === x.id ? x : y))} onDelete={x => setList(sorted.filter(y => y.id !== x.id))}/>)}
        </>}</div></aside>}
  </>;
}

// ------------------------------------------------------------------ the register of every screen's comments
function Register() {
  const [auth, setAuth] = useState(loadAuth);
  const [list, setList] = useState(null); const [err, setErr] = useState('');
  const [st, setSt] = useState('all'); const [scr, setScr] = useState(''); const [q, setQ] = useState('');
  const load = async (a = auth) => {
    if (!a) return;
    try { const r = await call(a, 'list'); setList(r.comments || []); setErr(''); } catch (e) { if (e.status === 401) { saveAuth(null); setAuth(null); } setErr(e.message); }
  };
  useEffect(() => { load(); }, [auth && auth.key]);
  const W = D().wireframes || {};
  const all = (list || []).slice().sort((a, b) => a.screen === b.screen ? (a.created < b.created ? -1 : 1) : (a.screen < b.screen ? -1 : 1));
  const num = {}; const per = {}; all.forEach(c => { per[c.screen] = (per[c.screen] || 0) + 1; num[c.id] = per[c.screen]; });
  const rows = all.filter(c => (st === 'all' || c.status === st || (st === 'open' && c.status === 'reopened')) && (!scr || c.screen === scr) &&
    (!q || JSON.stringify([c.text, c.clear, c.transcript, c.author]).toLowerCase().includes(q.toLowerCase())));
  const txt = c => (c.clear && c.display === 'clear' ? c.clear.text : c.text) || (c.transcript || {}).text || (c.audio ? '(spoken comment - not converted yet)' : '');
  const link = c => (W[c.screen] || {}).page + `?view=${c.view || 'wireframe'}&device=${c.device}&role=${encodeURIComponent(c.role || '')}&comment=${c.id}` + (c.route ? '#' + c.route : '');
  const csv = () => {
    const head = ['Screen', 'No', 'Comment', 'Original wording', 'From recording (English)', 'Spoken in', 'Has recording', 'By', 'Role', 'Made on', 'Device', 'View', 'Status', 'Change made', 'Link'];
    const esc = v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
    const lines = [head.map(esc).join(',')].concat(rows.map(c => [`${c.screen} ${c.title || ''}`, num[c.id], txt(c), c.text, (c.transcript || {}).text, (c.transcript || {}).language,
      c.audio ? 'yes' : 'no', c.author, ROLE[c.authorRole], when(c.created), DEVL[c.device], c.route, (STATUS[c.status] || [c.status])[0], c.incorporatedNote,
      new URL(link(c), location.href).href].map(esc).join(',')));
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['﻿' + lines.join('\r\n')], {type: 'text/csv'})); a.download = `review-comments-${D().project || 'project'}.csv`; a.click();
  };
  const counts = {}; all.forEach(c => { const k = c.status === 'reopened' ? 'open' : c.status; counts[k] = (counts[k] || 0) + 1; });
  return <div className="wf-index">
    <div className="wf-eyebrow">Wireframes · review</div><h1>Review comments</h1>
    <p className="lead">Every comment made on the screens, by screen. A comment is <b>Open</b> until the delivery team marks it <b>Incorporated</b> with a note on
      what changed; the customer then checks the screen and marks it <b>Done</b> - or reopens it. Open a comment to see it on its screen, pinned where it was made.</p>
    {!auth ? <div style={{maxWidth: 420}}><SignIn onDone={a => { setAuth(a); load(a); }}/></div> : <>
      <div className="rv-me">Signed in as <b>{auth.name}</b> ({ROLE[auth.role] || auth.role}) · <a href="#" onClick={e => { e.preventDefault(); saveAuth(null); setAuth(null); }}>sign out</a></div>
      {err && <div className="rv-err">{err}</div>}
      <div className="rv-regbar">
        <div className="rv-filters">{['all', 'open', 'incorporated', 'done'].map(k => <button key={k} type="button" className={st === k ? 'on' : ''} onClick={() => setSt(k)}>
          {k === 'all' ? 'All' : STATUS[k][0]} <span>{k === 'all' ? all.length : counts[k] || 0}</span></button>)}</div>
        <select value={scr} onChange={e => setScr(e.target.value)} className="wf-role" aria-label="Screen"><option value="">All screens</option>
          {Object.values(W).filter(w => all.some(c => c.screen === w.id)).map(w => <option key={w.id} value={w.id}>{w.id} {w.title}</option>)}</select>
        <input className="wf-role" placeholder="Search comments" value={q} onChange={e => setQ(e.target.value)}/>
        <button type="button" className="rv-btn" onClick={csv}><window.Ic name="download" size={14}/> Download (CSV)</button></div>
      {list == null ? <p>Loading…</p> : <div className="wf-matrix"><table><thead><tr><th>Screen</th><th>No</th><th>Comment</th><th>By</th><th>When</th><th>Status</th><th>Change made</th></tr></thead>
        <tbody>{rows.map(c => <tr key={c.id}><td style={{whiteSpace: 'nowrap'}}><a href={link(c)}>{c.screen}</a><div style={{fontSize: 12.5, color: 'var(--wf-muted)'}}>{c.title}</div></td>
          <td className="c">{num[c.id]}</td><td>{txt(c)}{c.audio && <div style={{fontSize: 12.5, color: 'var(--wf-muted)'}}>with a recording{c.transcript && c.transcript.language ? ` · spoken in ${c.transcript.language}` : ''}</div>}</td>
          <td>{c.author}<div style={{fontSize: 12.5, color: 'var(--wf-muted)'}}>{ROLE[c.authorRole]}</div></td><td style={{whiteSpace: 'nowrap'}}>{when(c.created)}</td>
          <td><window.Pill tone={(STATUS[c.status] || STATUS.open)[1]}>{(STATUS[c.status] || STATUS.open)[0]}</window.Pill></td><td>{c.incorporatedNote || ''}</td></tr>)}
          {!rows.length && <tr><td colSpan={7}>No comments{st !== 'all' || scr || q ? ' match the filters' : ' yet'}.</td></tr>}</tbody></table></div>}
    </>}</div>;
}
window.WFReviewRegister = function () {
  const go = () => { if (!window.useWF || !window.Pill) return setTimeout(go, 50); ReactDOM.createRoot(document.getElementById('root')).render(<Register/>); };
  go();
};
Object.assign(window, {WFReview});
})();
