/* Interact.jsx - what makes a wireframe clickable (screen-mockups skill v1.0). Loaded after WfKit.jsx.

   Navigation   WFGo('WF-12', {hash: 'new'})   opens another screen in the same tab (keeps view, device, role)
                useRoute()  -> [route, setRoute]   views inside one screen: '' list, 'new', 'view/<code>', 'edit/<code>',
                                                    or filters such as 'status=Active'  (parseRoute(route) splits them)
   Sample data  useStore('dealers', initialRows)    kept for the browser tab, shared by every screen, so a record saved
                                                    on one screen is still there when you come back; Reset clears it
                flash(key) / takeFlash()            highlight the row just saved when the list opens again
   Feedback     wfToast('ok' | 'warn' | 'bad' | 'info', text), await wfConfirm({title, body, ok, danger, input}),
                wfNotBuilt(label)                   the 'not part of this mockup' message for controls not wired up
   Parts        Input, TextArea, Toggle, Drawer, RowMenu, Steps, UiHost (toasts and dialogs; rendered by the frame)

   A screen runs inside an iframe that is as tall as the screen, so dialogs and drawers are placed in the part of
   the iframe the reader can see (the document sends that part with {wfView}). */
(function () {
const {useState, useEffect, useRef} = React;
const D = () => window.WF_DATA || {};
const inFrame = (() => { try { return window.parent !== window; } catch (e) { return true; } })();
const post = msg => { if (inFrame) { try { parent.postMessage(msg, '*'); } catch (e) {} } };

// ------------------------------------------------------------------ sample data for the tab
const mem = {};
const skey = k => 'wf:' + (D().project || 'p') + ':' + k;
function sget(k, d) {
  try { const v = sessionStorage.getItem(skey(k)); if (v != null) return JSON.parse(v); } catch (e) {}
  return k in mem ? mem[k] : d;
}
function sset(k, v) { mem[k] = v; try { sessionStorage.setItem(skey(k), JSON.stringify(v)); } catch (e) {} }
function useStore(k, init) {
  const [v, setV] = useState(() => sget(k, typeof init === 'function' ? init() : init));
  const set = x => setV(prev => { const n = typeof x === 'function' ? x(prev) : x; sset(k, n); return n; });
  return [v, set];
}
function resetStore() {
  Object.keys(mem).forEach(k => delete mem[k]);
  try { Object.keys(sessionStorage).filter(k => k.startsWith('wf:' + (D().project || 'p') + ':')).forEach(k => sessionStorage.removeItem(k)); } catch (e) {}
}
const flash = key => sset('_flash', key);
function takeFlash() { const k = sget('_flash', null); if (k != null) sset('_flash', null); return k; }

// ------------------------------------------------------------------ routes inside a screen, and moving between screens
const readRoute = () => { try { return decodeURIComponent(location.hash.replace(/^#\/?/, '')); } catch (e) { return ''; } };
function useRoute() {
  const [r, setR] = useState(readRoute());
  useEffect(() => {
    const f = () => { const x = readRoute(); setR(x); post({wfRoute: x}); };
    addEventListener('popstate', f); addEventListener('hashchange', f);
    return () => { removeEventListener('popstate', f); removeEventListener('hashchange', f); };
  }, []);
  const go = x => {
    x = x || '';
    try { history.pushState(null, '', location.pathname + location.search + (x ? '#' + x : '')); } catch (e) {}
    setR(x); post({wfRoute: x});
    if (inFrame) post({wfScrollTop: true}); else scrollTo(0, 0);
  };
  return [r, go];
}
function parseRoute(r) {               // 'new' | 'view/CODE' | 'edit/CODE' | 'a=1&b=2' (list with filters)
  r = r || '';
  const [head, ...rest] = r.split('/');
  if (head === 'new') return {view: 'new', code: '', params: {}};
  if (head === 'view' || head === 'edit') return {view: head, code: rest.join('/'), params: {}};
  const params = {};
  r.split('&').filter(Boolean).forEach(p => { const [k, v = ''] = p.split('='); params[k] = decodeURIComponent(v); });
  return {view: 'list', code: '', params};
}
function WFGo(id, opts = {}) {
  const w = (D().wireframes || {})[id];
  if (!w) return wfNotBuilt(id);
  if (inFrame) return post({wfGo: {id, hash: opts.hash || '', role: opts.role || ''}});
  const u = new URL(w.page, location.href);
  new URLSearchParams(location.search).forEach((v, k) => { if (k !== 'frame') u.searchParams.set(k, v); });
  if (opts.role) u.searchParams.set('role', opts.role);
  u.hash = opts.hash || '';
  location.href = u.href;
}

// ------------------------------------------------------------------ toasts and dialogs
const bus = {l: new Set(), emit(e) { this.l.forEach(f => f(e)); }};
let vp = {top: 0, height: 760};
addEventListener('message', e => { if (e.data && e.data.wfView) { vp = e.data.wfView; bus.emit({type: 'vp'}); } });
const wfToast = (tone, text) => bus.emit({type: 'toast', tone, text, id: Math.random()});
const wfConfirm = o => new Promise(res => bus.emit({type: 'dialog', o, res}));
const wfNotBuilt = label => wfToast('info', (label ? '"' + String(label).slice(0, 60) + '" - ' : '') + 'not wired up in this clickable mockup');
function useVp() {
  const [, f] = useState(0);
  useEffect(() => { const g = e => e.type === 'vp' && f(x => x + 1); bus.l.add(g); return () => bus.l.delete(g); }, []);
  return inFrame ? vp : {top: 0, height: innerHeight};
}
const layer = (v, z) => ({position: inFrame ? 'absolute' : 'fixed', left: 0, right: 0, top: v.top, height: v.height, zIndex: z});
const TONE = {ok: ['var(--wf-ok)', 'circle-check'], warn: ['var(--wf-warn)', 'triangle-alert'], bad: ['var(--wf-bad)', 'circle-x'], info: ['var(--wf-accent)', 'info']};

function UiHost() {
  const [toasts, setT] = useState([]); const [dlg, setDlg] = useState(null); const [val, setVal] = useState('');
  const v = useVp();
  useEffect(() => {
    const f = e => {
      if (e.type === 'toast') { setT(t => t.concat([e])); setTimeout(() => setT(t => t.filter(x => x.id !== e.id)), 3400); }
      if (e.type === 'dialog') { setVal((e.o.input || {}).value || ''); setDlg(e); }
    };
    bus.l.add(f); return () => bus.l.delete(f);
  }, []);
  const close = r => { dlg.res(r); setDlg(null); };
  return <>
    {toasts.length > 0 && <div style={{...layer(v, 60), pointerEvents: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: 8, padding: 18}}>
      {toasts.map(t => { const [c, ic] = TONE[t.tone] || TONE.info;
        return <div key={t.id} role="status" style={{pointerEvents: 'auto', display: 'flex', gap: 10, alignItems: 'center', maxWidth: 520, background: 'var(--wf-surface)', color: 'var(--wf-ink)',
          border: '1px solid var(--wf-border)', borderLeft: '4px solid ' + c, padding: '10px 14px', fontSize: 14, boxShadow: '0 6px 24px rgba(0,0,0,.14)'}}>
          <window.Ic name={ic} size={18} color={c}/><span>{t.text}</span></div>; })}</div>}
    {dlg && <div style={{...layer(v, 70), background: 'rgba(20,24,30,.42)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16}} onClick={() => close(false)}>
      <div role="dialog" aria-modal="true" onClick={e => e.stopPropagation()} style={{width: '100%', maxWidth: 460, background: 'var(--wf-surface)', border: '1px solid var(--wf-border)', boxShadow: '0 18px 50px rgba(0,0,0,.22)'}}>
        <div style={{padding: '16px 18px 6px', font: '700 19px/1.25 var(--wf-font-display)', color: 'var(--wf-heading)'}}>{dlg.o.title || 'Please confirm'}</div>
        {dlg.o.body && <div style={{padding: '4px 18px 6px', fontSize: 14.5, lineHeight: 1.55}}>{dlg.o.body}</div>}
        {dlg.o.input && <div style={{padding: '8px 18px 0'}}><Input label={dlg.o.input.label} value={val} onChange={setVal} placeholder={dlg.o.input.placeholder} type={dlg.o.input.type}/></div>}
        <div style={{display: 'flex', justifyContent: 'flex-end', gap: 8, padding: 16}}>
          <window.Btn onClick={() => close(false)}>{dlg.o.cancel || 'Cancel'}</window.Btn>
          <window.Btn variant="primary" style={dlg.o.danger ? {background: 'var(--wf-bad)', borderColor: 'var(--wf-bad)'} : undefined}
            onClick={() => close(dlg.o.input ? (val || '') : true)}>{dlg.o.ok || 'Confirm'}</window.Btn></div></div></div>}
  </>;
}

function Drawer({open, title, sub, onClose, children, footer, width = 480}) {
  const v = useVp(); const {size} = window.useWF();
  if (!open) return null;
  return ReactDOM.createPortal(<div style={{...layer(v, 50), background: 'rgba(20,24,30,.32)'}} onClick={onClose}>
    <aside onClick={e => e.stopPropagation()} style={{position: 'absolute', top: 0, right: 0, bottom: 0, width: size === 'mobile' ? '100%' : width, background: 'var(--wf-surface)',
      borderLeft: '1px solid var(--wf-border)', display: 'flex', flexDirection: 'column', boxShadow: '-12px 0 40px rgba(0,0,0,.16)'}}>
      <header style={{display: 'flex', alignItems: 'flex-start', gap: 10, padding: '14px 16px', borderBottom: '1px solid var(--wf-border-soft)'}}>
        <div style={{flex: 1}}><div style={{font: '700 18px/1.25 var(--wf-font-display)', color: 'var(--wf-heading)'}}>{title}</div>
          {sub && <div style={{fontSize: 13, color: 'var(--wf-muted)', marginTop: 2}}>{sub}</div>}</div>
        <button type="button" aria-label="Close" onClick={onClose} style={{all: 'unset', cursor: 'pointer', width: 36, height: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}><window.Ic name="x" size={20}/></button></header>
      <div style={{flex: 1, overflow: 'auto', padding: 16}}>{children}</div>
      {footer && <footer style={{display: 'flex', justifyContent: 'flex-end', gap: 8, padding: 14, borderTop: '1px solid var(--wf-border-soft)'}}>{footer}</footer>}</aside></div>, document.body);
}

// ------------------------------------------------------------------ fields
const fieldBox = (err) => ({minHeight: 40, padding: '0 10px', border: '1px solid ' + (err ? 'var(--wf-bad)' : 'var(--wf-border-strong)'), borderRadius: 'var(--wf-radius-field)',
  background: 'var(--wf-surface)', font: '14px var(--wf-font-body)', color: 'var(--wf-ink)', width: '100%'});
function Label({label, required, mark}) {
  return label ? <span style={{fontSize: 12.5, color: 'var(--wf-muted)'}}>{label}{required && <b style={{color: 'var(--wf-bad)'}}> *</b>}{mark}</span> : null;
}
function Input({label, value, onChange, placeholder, mono, type = 'text', required, error, hint, mark, style, readOnly}) {
  return <label style={{display: 'flex', flexDirection: 'column', gap: 4, minWidth: 150, ...style}}>
    <Label label={label} required={required} mark={mark}/>
    <input type={type} value={value == null ? '' : value} readOnly={readOnly} placeholder={placeholder} onChange={e => onChange && onChange(e.target.value)}
      style={{...fieldBox(error), fontFamily: mono ? 'var(--wf-font-mono)' : undefined, background: readOnly ? 'var(--wf-sunken)' : 'var(--wf-surface)'}}/>
    {(error || hint) && <span style={{fontSize: 12.5, color: error ? 'var(--wf-bad)' : 'var(--wf-muted)'}}>{error || hint}</span>}</label>;
}
function TextArea({label, value, onChange, placeholder, rows = 3, required, mark, style}) {
  return <label style={{display: 'flex', flexDirection: 'column', gap: 4, ...style}}>
    <Label label={label} required={required} mark={mark}/>
    <textarea rows={rows} value={value || ''} placeholder={placeholder} onChange={e => onChange && onChange(e.target.value)}
      style={{...fieldBox(), padding: '8px 10px', resize: 'vertical', lineHeight: 1.5}}/></label>;
}
function Toggle({on, onChange, label, disabled}) {
  return <button type="button" role="switch" aria-checked={!!on} disabled={disabled} onClick={() => onChange && onChange(!on)}
    style={{all: 'unset', cursor: disabled ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 14, minHeight: 32}}>
    <span style={{width: 38, height: 22, borderRadius: 11, background: on ? 'var(--wf-primary)' : 'var(--wf-border-strong)', position: 'relative', flex: 'none', transition: 'background .15s'}}>
      <span style={{position: 'absolute', top: 3, left: on ? 19 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left .15s'}}/></span>{label}</button>;
}
function RowMenu({items, label = 'Actions'}) {
  const [open, setOpen] = useState(false); const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const f = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', f); return () => document.removeEventListener('mousedown', f);
  }, [open]);
  return <span ref={ref} style={{position: 'relative', display: 'inline-block'}} onClick={e => e.stopPropagation()}>
    <button type="button" aria-label={label} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)}
      style={{all: 'unset', cursor: 'pointer', width: 34, height: 34, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--wf-border)', background: 'var(--wf-surface)'}}>
      <window.Ic name="ellipsis-vertical" size={16}/></button>
    {open && <div role="menu" style={{position: 'absolute', right: 0, top: 38, zIndex: 30, minWidth: 190, background: 'var(--wf-surface)', border: '1px solid var(--wf-border)', boxShadow: '0 10px 30px rgba(0,0,0,.14)', padding: '4px 0'}}>
      {items.filter(Boolean).map((it, i) => <button key={i} type="button" role="menuitem" onClick={() => { setOpen(false); it.onClick ? it.onClick() : wfNotBuilt(it.label); }}
        style={{all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, width: '100%', boxSizing: 'border-box', padding: '9px 14px', fontSize: 14,
          color: it.danger ? 'var(--wf-bad)' : 'var(--wf-ink)'}}>{it.icon && <window.Ic name={it.icon} size={15}/>}{it.label}</button>)}</div>}</span>;
}
function Steps({steps, current}) {                       // 1 Dealer -> 2 Locations
  return <div style={{display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 14, fontSize: 13.5}}>
    {steps.map((s, i) => <React.Fragment key={i}>{i > 0 && <window.Ic name="chevron-right" size={14} color="var(--wf-muted)"/>}
      <span style={{display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 'var(--wf-radius-pill)',
        background: i === current ? 'var(--wf-primary)' : i < current ? 'var(--wf-ok-bg)' : 'var(--wf-sunken)', color: i === current ? '#fff' : i < current ? 'var(--wf-ok)' : 'var(--wf-muted)', fontWeight: 600}}>
        {i < current ? <window.Ic name="check" size={13}/> : <span className="wf-mono">{i + 1}</span>}{s}</span></React.Fragment>)}</div>;
}

// the active menu item opens the screen's first view again
window.WF_RESET_ROUTE = () => { try { history.pushState(null, '', location.pathname + location.search); } catch (e) {} dispatchEvent(new PopStateEvent('popstate')); };

// links written as href="#" inside a screen say they are not wired up instead of jumping to the top
if (inFrame || new URLSearchParams(location.search).get('frame') === '1') {
  document.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('a[href="#"]');
    if (a && !a.dataset.wfNav) { e.preventDefault(); wfNotBuilt(a.textContent.trim()); }
  });
}

Object.assign(window, {WFGo, useRoute, parseRoute, useStore, resetStore, flash, takeFlash, wfToast, wfConfirm, wfNotBuilt,
  Input, TextArea, Toggle, RowMenu, Drawer, Steps, WFUiHost: UiHost, WF_IN_FRAME: inFrame});
})();
