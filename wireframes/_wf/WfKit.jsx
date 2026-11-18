/* WfKit.jsx - wireframe runtime and generic responsive parts (screen-mockups skill v1.0; first written for
   frd-from-transcript v1.14). Interact.jsx adds navigation, sample data, toasts and dialogs; Review.jsx the
   review comments.
   Loaded by every wireframe page through Babel (offline copies of React / Babel / Lucide sit in _wf/vendor).

   A page is one wireframe. It runs in two modes:
     document  (the page itself)  - toolbar (Wireframe / Annotated, Desktop / Tablet / Mobile, role), the screen in a
                                    device frame, and in the annotated view the numbered descriptions, the customer
                                    queries, the feature / workflow / role mapping and what is deliberately missing.
     frame     (?frame=1)          - the screen alone at the device width, inside an iframe of the document, so the
                                    responsive layout reacts to a real window width.
   Data: window.WF_DATA (written by render_mockups.py from the project file). Screens register themselves with
   WFScreen('WF-05', Component). Parts use only --wf-* CSS variables, so a project restyles them in its theme.css. */
(function () {
const {useState, useEffect, useRef, useContext, createContext} = React;
const D = () => window.WF_DATA || {};
const P = new URLSearchParams(location.search);
const Ctx = createContext({annotated: false, size: 'desktop', role: '', w: 1440});
const useWF = () => useContext(Ctx);
window.WF_SCREENS = window.WF_SCREENS || {};
window.WFScreen = (id, C) => { window.WF_SCREENS[id] = C; };
const DEVICES = {desktop: {w: 1440, label: 'Desktop', icon: 'monitor'}, tablet: {w: 1024, label: 'Tablet', icon: 'tablet'}, mobile: {w: 390, label: 'Mobile', icon: 'smartphone'}};
const sizeOf = w => w >= 1200 ? 'desktop' : w >= 768 ? 'tablet' : 'mobile';

function Ic({name, size = 16, color, style}) {           // Lucide icon (offline copy); a blank box when unavailable
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || !window.lucide) return;
    ref.current.innerHTML = `<i data-lucide="${name}"></i>`;
    window.lucide.createIcons({attrs: {width: size, height: size, 'stroke-width': 1.75, stroke: color || 'currentColor'}, nameAttr: 'data-lucide'});
  }, [name, size, color]);
  return <span ref={ref} aria-hidden="true" style={{display: 'inline-flex', width: size, height: size, flex: 'none', ...style}}/>;
}

// ------------------------------------------------------------------ annotation inside the screen
function Mark({n, open}) {                             // numbered callout; shown only in the annotated view
  const {annotated} = useWF();
  if (!annotated) return null;
  return <span className={'wf-mark' + (open ? ' open' : '')} title={'Callout ' + n}>{n}</span>;
}
function Ask({id, children, style, inline}) {          // dotted outline + query tag where the customer must answer
  const {annotated} = useWF();
  if (!annotated) return inline ? <span style={style}>{children}</span> : <div style={style}>{children}</div>;
  const q = (D().queries || {})[id] || {};
  const T = inline ? 'span' : 'div';
  return <T className="wf-ask" style={{display: inline ? 'inline-block' : undefined, ...style}} title={q.question || id}>
    <span className="wf-ask-tag">{id} · input needed</span>{children}</T>;
}

// ------------------------------------------------------------------ generic responsive parts
const btnStyle = (variant, small) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, cursor: 'pointer', whiteSpace: 'nowrap',
  minHeight: small ? 34 : 'var(--wf-hit)', padding: small ? '0 12px' : '0 18px', borderRadius: 'var(--wf-radius)',
  font: `600 ${small ? 13 : 14}px var(--wf-font-body)`,
  background: variant === 'primary' ? 'var(--wf-primary)' : variant === 'ghost' ? 'transparent' : 'var(--wf-surface)',
  color: variant === 'primary' ? 'var(--wf-primary-ink)' : 'var(--wf-heading)',
  border: variant === 'primary' ? '1px solid var(--wf-primary)' : variant === 'ghost' ? '1px solid transparent' : '1px solid var(--wf-border-strong)'});
function Btn({variant = 'secondary', small, icon, children, onClick, style, block, disabled, title}) {
  const click = onClick || (() => window.wfNotBuilt && window.wfNotBuilt(typeof children === 'string' ? children : ''));
  return <button type="button" title={title} disabled={disabled} onClick={click} style={{...btnStyle(variant, small), width: block ? '100%' : undefined, opacity: disabled ? .5 : 1, cursor: disabled ? 'not-allowed' : 'pointer', ...style}}>
    {icon && <Ic name={icon} size={small ? 14 : 16}/>}{children}</button>;
}
const TONES = {ok: ['var(--wf-ok-bg)', 'var(--wf-ok)'], warn: ['var(--wf-warn-bg)', 'var(--wf-warn-fg)'], bad: ['var(--wf-bad-bg)', 'var(--wf-bad)'],
               info: ['var(--wf-accent-tint)', 'var(--wf-heading)'], neutral: ['var(--wf-sunken)', 'var(--wf-muted)']};
function Pill({tone = 'neutral', children, dot = true}) {        // a state label: rounded, as the design rules reserve pills for states
  const [bg, fg] = TONES[tone] || TONES.neutral;
  return <span style={{display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 'var(--wf-radius-pill)', background: bg, color: fg,
    font: '600 12.5px var(--wf-font-body)', whiteSpace: 'nowrap'}}>{dot && <i style={{width: 7, height: 7, borderRadius: '50%', background: fg}}/>}{children}</span>;
}
function Panel({title, right, children, pad = true, style, sub}) {
  return <section style={{background: 'var(--wf-surface)', border: '1px solid var(--wf-border)', marginBottom: 16, ...style}}>
    {title && <header style={{display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--wf-border-soft)'}}>
      <div><h3 style={{margin: 0, font: '700 17px/1.25 var(--wf-font-display)', color: 'var(--wf-heading)'}}>{title}</h3>
        {sub && <div style={{fontSize: 13, color: 'var(--wf-muted)', marginTop: 2}}>{sub}</div>}</div>
      {right && <div style={{display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center'}}>{right}</div>}</header>}
    <div style={{padding: pad ? 16 : 0}}>{children}</div></section>;
}
function Stats({items}) {                                // KPI tiles, wrap 4 -> 2 -> 1
  return <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: 12, marginBottom: 16}}>
    {items.map((s, i) => <div key={i} role={s.onClick ? 'button' : undefined} tabIndex={s.onClick ? 0 : undefined} onClick={s.onClick}
      onKeyDown={s.onClick ? (e => (e.key === 'Enter' || e.key === ' ') && s.onClick()) : undefined} className={s.onClick ? 'wf-tile-link' : undefined}
      title={s.onClick ? (s.hint || 'Open') : undefined} style={{background: 'var(--wf-surface)', border: '1px solid var(--wf-border)', padding: '12px 14px', cursor: s.onClick ? 'pointer' : undefined,
      borderTop: '3px solid ' + (s.tone === 'warn' ? 'var(--wf-warn)' : s.tone === 'bad' ? 'var(--wf-bad)' : s.tone === 'ok' ? 'var(--wf-ok)' : 'var(--wf-accent)')}}>
      <div style={{fontSize: 13, color: 'var(--wf-muted)'}}>{s.label}{s.mark}</div>
      <div style={{font: '700 28px/1.15 var(--wf-font-display)', color: 'var(--wf-heading)', marginTop: 4}}>{s.value}
        {s.unit && <span style={{fontSize: 14, fontWeight: 500, color: 'var(--wf-muted)', marginLeft: 6}}>{s.unit}</span>}</div>
      {s.note && <div style={{fontSize: 12.5, color: 'var(--wf-muted)', marginTop: 2}}>{s.note}</div>}
      {s.onClick && <div style={{fontSize: 12.5, color: 'var(--wf-heading)', marginTop: 6, fontWeight: 600}}>{s.hint || 'Open'} &rarr;</div>}</div>)}</div>;
}
function KV({pairs, cols = 3}) {
  const {size} = useWF();
  const c = size === 'mobile' ? 1 : size === 'tablet' ? Math.min(cols, 2) : cols;
  return <dl style={{display: 'grid', gridTemplateColumns: `repeat(${c},1fr)`, gap: '10px 18px', margin: 0}}>
    {pairs.map(([k, v, mono], i) => <div key={i}><dt style={{fontSize: 12.5, color: 'var(--wf-muted)'}}>{k}</dt>
      <dd style={{margin: '2px 0 0', fontSize: 14.5, fontFamily: mono ? 'var(--wf-font-mono)' : undefined, color: 'var(--wf-ink)'}}>{v}</dd></div>)}</dl>;
}
/* Select: with `options` a working dropdown (onChange(value); uncontrolled when no onChange is given); `multi` gives
   a checklist. Without options it keeps the static look and says it is not wired up when clicked. */
const selBox = {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, minHeight: 40, padding: '0 10px',
  border: '1px solid var(--wf-border-strong)', borderRadius: 'var(--wf-radius-field)', background: 'var(--wf-surface)', fontSize: 14, color: 'var(--wf-ink)'};
const optOf = o => typeof o === 'object' && o !== null ? o : {value: o, label: o};
function Select({label, value, options, multi, mark, style, onChange, required, placeholder, disabled}) {
  const [own, setOwn] = useState(value);
  useEffect(() => { setOwn(value); }, [JSON.stringify(value)]);
  const cur = onChange ? value : own;
  const set = v => { if (!onChange) setOwn(v); else onChange(v); };
  const [open, setOpen] = useState(false); const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const f = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', f); return () => document.removeEventListener('mousedown', f);
  }, [open]);
  const lab = label && <span style={{fontSize: 12.5, color: 'var(--wf-muted)'}}>{label}{required && <b style={{color: 'var(--wf-bad)'}}> *</b>}{mark}</span>;
  if (!options) return <label style={{display: 'flex', flexDirection: 'column', gap: 4, minWidth: 150, ...style}}>{lab}
    <span style={selBox} onClick={() => window.wfNotBuilt && window.wfNotBuilt('Options of this list')}>
      <span style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{multi && Array.isArray(value) ? value.join(', ') : value}</span>
      <Ic name="chevron-down" size={15} color="var(--wf-muted)"/></span></label>;
  const opts = options.map(optOf);
  if (!multi) return <label style={{display: 'flex', flexDirection: 'column', gap: 4, minWidth: 150, ...style}}>{lab}
    <span style={{position: 'relative', display: 'block'}}>
      <select value={cur == null ? '' : cur} disabled={disabled} onChange={e => set(e.target.value)}
        style={{...selBox, width: '100%', appearance: 'none', WebkitAppearance: 'none', paddingRight: 30, font: '14px var(--wf-font-body)', cursor: 'pointer'}}>
        {placeholder != null && <option value="">{placeholder}</option>}
        {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
      <span style={{position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'inline-flex'}}><Ic name="chevron-down" size={15} color="var(--wf-muted)"/></span></span></label>;
  const arr = Array.isArray(cur) ? cur : [];
  const tog = v => set(arr.includes(v) ? arr.filter(x => x !== v) : arr.concat([v]));
  return <div ref={ref} style={{display: 'flex', flexDirection: 'column', gap: 4, minWidth: 150, position: 'relative', ...style}}>{lab}
    <button type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen(!open)} style={{...selBox, cursor: 'pointer', textAlign: 'left', font: '14px var(--wf-font-body)'}}>
      <span style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{arr.length ? opts.filter(o => arr.includes(o.value)).map(o => o.label).join(', ') : (placeholder || 'Choose')}</span>
      <Ic name="chevron-down" size={15} color="var(--wf-muted)"/></button>
    {open && <div role="listbox" aria-multiselectable="true" style={{position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, zIndex: 30, background: 'var(--wf-surface)',
      border: '1px solid var(--wf-border)', boxShadow: '0 10px 30px rgba(0,0,0,.14)', maxHeight: 260, overflow: 'auto', padding: '4px 0'}}>
      {opts.map(o => <div key={o.value} role="option" aria-selected={arr.includes(o.value)} onClick={() => tog(o.value)}
        style={{display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', cursor: 'pointer', fontSize: 14}}><Check on={arr.includes(o.value)}/>{o.label}</div>)}</div>}</div>;
}
function SearchBox({search, query, onSearch, grow}) {
  if (!onSearch) return <span style={{display: 'flex', alignItems: 'center', gap: 8, minHeight: grow ? 'var(--wf-hit)' : 40, padding: '0 10px', border: '1px solid var(--wf-border-strong)', borderRadius: 'var(--wf-radius-field)', background: 'var(--wf-surface)', color: 'var(--wf-muted)', fontSize: 14, flex: grow ? 1 : undefined}}><Ic name="search" size={15}/>{search}</span>;
  return <span style={{display: 'flex', alignItems: 'center', gap: 8, minHeight: grow ? 'var(--wf-hit)' : 40, padding: '0 10px', border: '1px solid var(--wf-border-strong)', borderRadius: 'var(--wf-radius-field)', background: 'var(--wf-surface)', flex: grow ? 1 : undefined}}>
    <Ic name="search" size={15} color="var(--wf-muted)"/><input value={query || ''} placeholder={search} onChange={e => onSearch(e.target.value)} aria-label="Search"
      style={{all: 'unset', flex: 1, minWidth: 0, font: '14px var(--wf-font-body)', color: 'var(--wf-ink)'}}/>
    {query && <button type="button" aria-label="Clear search" onClick={() => onSearch('')} style={{all: 'unset', cursor: 'pointer', display: 'inline-flex'}}><Ic name="x" size={14} color="var(--wf-muted)"/></button>}</span>;
}
function FilterBar({filters = [], search, query, onSearch, right, count}) {
  const {size} = useWF();
  const [open, setOpen] = useState(false);
  if (size === 'mobile') return <div style={{marginBottom: 12}}>
    <div style={{display: 'flex', gap: 8}}>
      {search && <SearchBox search={search} query={query} onSearch={onSearch} grow/>}
      <Btn small={false} icon="sliders-horizontal" onClick={() => setOpen(!open)}>Filters{count ? ` (${count})` : ''}</Btn></div>
    {open && <div style={{display: 'grid', gap: 10, marginTop: 10, padding: 12, background: 'var(--wf-surface)', border: '1px solid var(--wf-border)'}}>
      {filters.map((f, i) => <Select key={i} {...f}/>)}</div>}
    {right && <div style={{display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap'}}>{right}</div>}</div>;
  return <div style={{display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end', marginBottom: 14}}>
    {search && <label style={{display: 'flex', flexDirection: 'column', gap: 4, flex: '1 1 220px', maxWidth: 320}}><span style={{fontSize: 12.5, color: 'var(--wf-muted)'}}>Search</span>
      <SearchBox search={search} query={query} onSearch={onSearch}/></label>}
    {filters.map((f, i) => <Select key={i} {...f}/>)}
    {right && <div style={{marginLeft: 'auto', display: 'flex', gap: 8, flexWrap: 'wrap'}}>{right}</div>}</div>;
}
function Check({on, onClick, disabled}) {
  return <span role="checkbox" aria-checked={!!on} onClick={disabled ? undefined : onClick} style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18,
    border: '1.5px solid ' + (disabled ? 'var(--wf-border)' : on ? 'var(--wf-primary)' : 'var(--wf-border-strong)'), background: on ? 'var(--wf-primary)' : disabled ? 'var(--wf-sunken)' : 'var(--wf-surface)',
    borderRadius: 3, cursor: disabled ? 'not-allowed' : 'pointer', color: '#fff'}}>{on && <Ic name="check" size={13}/>}</span>;
}
/* DataTable: a table on desktop / tablet, cards on a phone. columns: [{key, label, align, mono, hide: 'tablet'|'mobile', w}]
   rows: objects; cardTitle / cardSub: keys used as the card heading on a phone; select: show checkboxes (selectable(row) decides). */
function DataTable({columns, rows: all, cardTitle, cardSub, select, selectable, selected, onSelect, onRow, rowTone, empty = 'Nothing to show.', flash, pageSize}) {
  const {size} = useWF();
  const [sort, setSort] = useState(null); const [page, setPage] = useState(0);
  const sv = (r, k) => (r.sort && r.sort[k] != null) ? r.sort[k] : (typeof r[k] === 'string' || typeof r[k] === 'number') ? r[k] : '';
  let rows = all;
  if (sort) rows = rows.slice().sort((a, b) => { const x = sv(a, sort.k), y = sv(b, sort.k); return (x > y ? 1 : x < y ? -1 : 0) * sort.d; });
  const pages = pageSize ? Math.max(1, Math.ceil(rows.length / pageSize)) : 1;
  const pg = Math.min(page, pages - 1);
  useEffect(() => { if (page > pages - 1) setPage(0); }, [pages]);
  if (pageSize) rows = rows.slice(pg * pageSize, pg * pageSize + pageSize);
  const pager = pageSize && all.length > pageSize ? <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '10px 12px', fontSize: 13, color: 'var(--wf-muted)', borderTop: '1px solid var(--wf-border-soft)'}}>
    <span>{pg * pageSize + 1}-{Math.min(all.length, pg * pageSize + pageSize)} of {all.length}</span>
    <span style={{display: 'flex', gap: 6}}><Btn small icon="chevron-left" disabled={pg === 0} onClick={() => setPage(pg - 1)}>Previous</Btn><Btn small disabled={pg >= pages - 1} onClick={() => setPage(pg + 1)}>Next</Btn></span></div> : null;
  const fl = k => flash != null && k === flash ? ' wf-flash' : '';
  const sel = selected || [];
  const can = r => !selectable || selectable(r);
  const toggle = (k, r) => onSelect && can(r) && onSelect(sel.includes(k) ? sel.filter(x => x !== k) : sel.concat([k]));
  const vis = columns.filter(c => !(c.hide === 'tablet' && size !== 'desktop') && !(c.hide === 'mobile' && size === 'mobile'));
  if (!rows.length) return <div style={{padding: 18, color: 'var(--wf-muted)', fontSize: 14}}>{empty}</div>;
  if (size === 'mobile') return <div><div style={{display: 'grid', gap: 10}}>{rows.map((r, i) => {
    const k = r.key != null ? r.key : i; const tone = rowTone && rowTone(r);
    return <div key={k} className={fl(k)} onClick={() => onRow && onRow(r)} style={{cursor: onRow ? 'pointer' : undefined, background: 'var(--wf-surface)', border: '1px solid var(--wf-border)', padding: 12,
      borderLeft: '3px solid ' + (tone === 'bad' ? 'var(--wf-bad)' : tone === 'warn' ? 'var(--wf-warn)' : tone === 'ok' ? 'var(--wf-ok)' : 'var(--wf-border)')}}>
      <div style={{display: 'flex', alignItems: 'flex-start', gap: 10}}>
        {select && <span style={{paddingTop: 2}}><Check on={sel.includes(k)} disabled={!can(r)} onClick={e => { e.stopPropagation && e.stopPropagation(); toggle(k, r); }}/></span>}
        <div style={{flex: 1, minWidth: 0}}><div style={{fontWeight: 600, color: 'var(--wf-heading)'}}>{r[cardTitle || columns[0].key]}</div>
          {cardSub && <div style={{fontSize: 13, color: 'var(--wf-muted)', marginTop: 2}}>{r[cardSub]}</div>}</div></div>
      <dl style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px', margin: '10px 0 0'}}>
        {columns.filter((c, ci) => ci > 0 && c.key !== cardTitle && c.key !== cardSub && c.hide !== 'mobile').map(c =>
          <div key={c.key} style={{gridColumn: c.wide ? '1 / -1' : undefined}}><dt style={{fontSize: 11.5, color: 'var(--wf-muted)'}}>{c.label}</dt>
            <dd style={{margin: '1px 0 0', fontSize: 13.5, fontFamily: c.mono ? 'var(--wf-font-mono)' : undefined}}>{r[c.key]}</dd></div>)}</dl></div>; })}</div>{pager}</div>;
  const head = c => !c.sortable ? c.label : <button type="button" onClick={() => setSort(sort && sort.k === c.key ? {k: c.key, d: -sort.d} : {k: c.key, d: 1})}
    style={{all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4}}>{c.label}<Ic name={sort && sort.k === c.key ? (sort.d > 0 ? 'arrow-up' : 'arrow-down') : 'arrow-up-down'} size={12}/></button>;
  return <div><div style={{overflowX: 'auto'}}><table style={{borderCollapse: 'collapse', width: '100%', fontSize: 14}}>
    <thead><tr>{select && <th style={thS}/>}{vis.map(c => <th key={c.key} style={{...thS, textAlign: c.align || 'left', width: c.w}}>{head(c)}</th>)}</tr></thead>
    <tbody>{rows.map((r, i) => { const k = r.key != null ? r.key : i; const tone = rowTone && rowTone(r);
      return <tr key={k} className={fl(k)} onClick={() => onRow && onRow(r)} style={{background: sel.includes(k) ? 'var(--wf-accent-tint)' : i % 2 ? 'var(--wf-sunken)' : 'var(--wf-surface)', cursor: onRow ? 'pointer' : undefined,
        boxShadow: tone ? 'inset 3px 0 0 ' + (tone === 'bad' ? 'var(--wf-bad)' : tone === 'warn' ? 'var(--wf-warn)' : 'var(--wf-ok)') : undefined}}>
        {select && <td style={tdS}><Check on={sel.includes(k)} disabled={!can(r)} onClick={e => { e.stopPropagation(); toggle(k, r); }}/></td>}
        {vis.map(c => <td key={c.key} style={{...tdS, textAlign: c.align || 'left', fontFamily: c.mono ? 'var(--wf-font-mono)' : undefined, whiteSpace: c.nowrap ? 'nowrap' : undefined}}>{r[c.key]}</td>)}</tr>; })}</tbody></table></div>{pager}</div>;
}
const thS = {textAlign: 'left', padding: '9px 10px', font: '600 12px var(--wf-font-body)', color: 'var(--wf-muted)', borderBottom: '1px solid var(--wf-border-strong)', whiteSpace: 'nowrap', background: 'var(--wf-surface)'};
const tdS = {padding: '9px 10px', borderBottom: '1px solid var(--wf-border-soft)', verticalAlign: 'top'};
function Tabs({tabs, value, onChange}) {
  return <div role="tablist" style={{display: 'flex', gap: 2, borderBottom: '1px solid var(--wf-border)', marginBottom: 14, overflowX: 'auto'}}>
    {tabs.map(t => { const id = t.id || t; const on = id === value;
      return <button key={id} type="button" role="tab" aria-selected={on} onClick={() => onChange && onChange(id)} style={{all: 'unset', cursor: 'pointer', padding: '10px 14px', whiteSpace: 'nowrap',
        font: `${on ? 600 : 500} 14px var(--wf-font-body)`, color: on ? 'var(--wf-heading)' : 'var(--wf-muted)', borderBottom: '3px solid ' + (on ? 'var(--wf-accent)' : 'transparent')}}>
        {t.label || t}{t.count != null && <span style={{marginLeft: 6, fontFamily: 'var(--wf-font-mono)', fontSize: 12}}>{t.count}</span>}{t.mark}</button>; })}</div>;
}
function Note({tone = 'info', children, icon}) {
  const [bg, fg] = tone === 'warn' ? ['var(--wf-warn-bg)', 'var(--wf-warn-fg)'] : tone === 'bad' ? ['var(--wf-bad-bg)', 'var(--wf-bad)'] : ['var(--wf-accent-tint)', 'var(--wf-heading)'];
  return <div style={{display: 'flex', gap: 10, alignItems: 'flex-start', background: bg, color: 'var(--wf-ink)', padding: '10px 12px', fontSize: 14, lineHeight: 1.5, marginBottom: 12, borderLeft: '3px solid ' + fg}}>
    <Ic name={icon || (tone === 'info' ? 'info' : 'triangle-alert')} size={16} color={fg} style={{marginTop: 2}}/><div>{children}</div></div>;
}

// ------------------------------------------------------------------ the application shell (role menu from the IA)
function AppShell({title, subtitle, actions, children, active, crumbs}) {
  const {size, role} = useWF();
  const data = D(); const prod = data.product || {};
  const r = (data.roles || {})[role] || Object.values(data.roles || {})[0] || {menu: []};
  const [drawer, setDrawer] = useState(false);
  const isOn = it => it.wf === active || it.name === active;
  const go = (it) => e => { e.preventDefault(); setDrawer(false); if (it.wf && it.wf !== active) window.WFGo(it.wf); else if (it.wf === active && window.WF_RESET_ROUTE) window.WF_RESET_ROUTE(); else if (!it.wf) window.wfNotBuilt(it.name); };
  const brand = <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
    {prod.logo ? <img src={prod.logo} alt="" style={{height: 26, filter: 'brightness(0) invert(1)'}}/> : <Ic name="box" size={22}/>}
    <div><div style={{font: '700 18px/1.1 var(--wf-font-display)', color: 'var(--wf-nav-ink)'}}>{prod.name || 'Product'}</div>
      {prod.sub && <div style={{fontSize: 12, opacity: .7}}>{prod.sub}</div>}</div></div>;
  const user = <div style={{display: 'flex', alignItems: 'center', gap: 9}}>
    <span style={{width: 30, height: 30, borderRadius: '50%', background: 'var(--wf-accent)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', font: '700 13px var(--wf-font-display)'}}>{(r.name || '?').split(/\s+/).map(x => x[0]).join('').slice(0, 2)}</span>
    <div style={{minWidth: 0, flex: 1}}><div style={{fontSize: 13, fontWeight: 600}}>{r.user || r.name}</div><div style={{fontSize: 11.5, opacity: .7}}>{r.actor || r.name}</div></div>
    {data.login && <a href="#" data-wf-nav="1" title="Sign out" aria-label="Sign out" onClick={e => { e.preventDefault(); window.WFGo(data.login); }} style={{color: 'var(--wf-nav-ink)', opacity: .8, display: 'inline-flex', padding: 6}}><Ic name="log-out" size={16}/></a>}</div>;
  const menu = (compact) => <nav style={{display: 'flex', flexDirection: 'column', gap: 2}}>
    {r.landing && <a href="#" data-wf-nav="1" title={r.landingName || 'Home'} onClick={go({wf: r.landing, name: r.landingName})} style={navA(isOn({wf: r.landing}), compact)}><Ic name="layout-dashboard" size={17}/>{!compact && (r.landingName || 'Home')}</a>}
    {r.menu.map((g, gi) => compact ? <RailGroup key={gi} g={g} on={g.items.some(isOn)} go={go}/> :
      <div key={gi} style={{marginTop: 10}}>
        <div style={{padding: '4px 16px', font: '600 11px var(--wf-font-mono)', letterSpacing: '.08em', textTransform: 'uppercase', opacity: .6}}>{g.group}</div>
        {g.items.map((it, ii) => <a key={ii} href="#" data-wf-nav="1" onClick={go(it)} style={navA(isOn(it), false)}><span style={{width: 17}}/>{it.name}</a>)}</div>)}</nav>;
  const head = <header style={{display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, padding: size === 'mobile' ? '14px 16px 12px' : '20px 28px 14px',
    background: 'var(--wf-surface)', borderBottom: '1px solid var(--wf-border)'}}>
    <div style={{minWidth: 0}}>{crumbs && <div style={{fontSize: 12.5, color: 'var(--wf-muted)', marginBottom: 4}}>{crumbs}</div>}
      <h1 style={{margin: 0, font: `700 ${size === 'mobile' ? 22 : 28}px/1.15 var(--wf-font-display)`, color: 'var(--wf-heading)'}}>{title}</h1>
      {subtitle && <p style={{margin: '4px 0 0', fontSize: 13.5, color: 'var(--wf-muted)'}}>{subtitle}</p>}</div>
    {actions && <div style={{display: 'flex', flexWrap: 'wrap', gap: 8, width: size === 'mobile' ? '100%' : undefined}}>{actions}</div>}</header>;
  const body = <div style={{padding: size === 'mobile' ? 14 : size === 'tablet' ? 20 : '22px 28px 32px'}}>{children}</div>;
  if (size === 'mobile') return <div style={{minHeight: 760, background: 'var(--wf-page)'}}>
    <div style={{position: 'sticky', top: 0, zIndex: 5, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', background: 'var(--wf-nav-bg)', color: 'var(--wf-nav-ink)'}}>
      <button type="button" aria-label="Menu" onClick={() => setDrawer(!drawer)} style={{all: 'unset', cursor: 'pointer', width: 'var(--wf-hit)', height: 'var(--wf-hit)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}><Ic name={drawer ? 'x' : 'menu'} size={22}/></button>
      {brand}<span style={{width: 44, display: 'inline-flex', justifyContent: 'center'}}><Ic name="bell" size={20}/></span></div>
    {drawer && <div style={{background: 'var(--wf-nav-bg)', color: 'var(--wf-nav-ink)', padding: '6px 0 14px'}}>{menu(false)}<div style={{padding: '12px 16px 0'}}>{user}</div></div>}
    {head}{body}</div>;
  const rail = size === 'tablet';
  return <div style={{display: 'grid', gridTemplateColumns: (rail ? 68 : 248) + 'px 1fr', minHeight: 720, background: 'var(--wf-page)'}}>
    <aside style={{background: 'var(--wf-nav-bg)', color: 'var(--wf-nav-ink)', display: 'flex', flexDirection: 'column', paddingTop: 16}}>
      <div style={{padding: rail ? '0 0 10px' : '0 16px 12px', display: 'flex', justifyContent: rail ? 'center' : 'flex-start'}}>{rail ? <Ic name="box" size={22}/> : brand}</div>
      {menu(rail)}
      <div style={{marginTop: 'auto', padding: rail ? '12px 0' : 16, borderTop: '1px solid rgba(255,255,255,.14)', display: 'flex', justifyContent: rail ? 'center' : 'flex-start'}}>{rail ? <Ic name="user" size={18}/> : user}</div></aside>
    <main style={{minWidth: 0}}>{head}{body}</main></div>;
}
function RailGroup({g, on, go}) {                       // tablet icon rail: the group's screens open in a fly-out
  const [open, setOpen] = useState(false); const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const f = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', f); return () => document.removeEventListener('mousedown', f);
  }, [open]);
  return <div ref={ref} style={{position: 'relative'}}>
    <a href="#" data-wf-nav="1" title={g.group} onClick={e => { e.preventDefault(); setOpen(!open); }} style={navA(on, true)}><Ic name={g.icon || 'folder'} size={18}/></a>
    {open && <div style={{position: 'absolute', left: '100%', top: 0, zIndex: 40, minWidth: 230, background: 'var(--wf-nav-bg)', color: 'var(--wf-nav-ink)', padding: '8px 0', boxShadow: '6px 6px 24px rgba(0,0,0,.25)'}}>
      <div style={{padding: '4px 16px 6px', font: '600 11px var(--wf-font-mono)', letterSpacing: '.08em', textTransform: 'uppercase', opacity: .6}}>{g.group}</div>
      {g.items.map((it, i) => <a key={i} href="#" data-wf-nav="1" onClick={e => { setOpen(false); go(it)(e); }} style={navA(false, false)}>{it.name}</a>)}</div>}</div>;
}
const navA = (on, compact) => ({display: 'flex', alignItems: 'center', justifyContent: compact ? 'center' : 'flex-start', gap: 10, minHeight: 40, padding: compact ? '0' : '6px 16px', lineHeight: 1.3,
  color: 'var(--wf-nav-ink)', opacity: on ? 1 : .78, textDecoration: 'none', fontSize: 14, fontWeight: on ? 600 : 400,
  background: on ? 'rgba(255,255,255,.13)' : 'transparent', borderLeft: '3px solid ' + (on ? 'var(--wf-accent)' : 'transparent')});

// ------------------------------------------------------------------ placeholder for a screen not drawn yet
function Placeholder({wf}) {
  return <AppShell title={wf.title} subtitle={(wf.module_name || '') + (wf.batch ? ` · planned for batch ${wf.batch}` : '')} active={wf.id}>
    <div className="wf-todo"><h3>{wf.kind === 'gap' ? 'New screen identified - to be drawn' : 'Wireframe to be drawn'}</h3>
      <div style={{color: 'var(--wf-muted)', fontSize: 14}}>What the Information Architecture says the user does here:</div>
      <ul>{(wf.functions || []).map((f, i) => <li key={i}>{f}</li>)}</ul>
      {wf.note && <p style={{fontSize: 14, color: 'var(--wf-muted)'}}>{wf.note}</p>}</div></AppShell>;
}

// ------------------------------------------------------------------ frame mode
function Frame({id, role, annotated}) {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => { const f = () => setW(window.innerWidth); addEventListener('resize', f); return () => removeEventListener('resize', f); }, []);
  useEffect(() => {                                           // tell the document how tall the screen is
    const send = () => parent.postMessage({wfHeight: document.documentElement.scrollHeight}, '*');
    const ro = new ResizeObserver(send); ro.observe(document.body); send();
    return () => ro.disconnect();
  }, []);
  const wf = (D().wireframes || {})[id] || {id, title: id};
  const S = window.WF_SCREENS[id];
  const Host = window.WFUiHost;
  return <Ctx.Provider value={{annotated, size: sizeOf(w), w, role}}>{S ? <S wf={wf} role={role}/> : <Placeholder wf={wf}/>}{Host && <Host/>}</Ctx.Provider>;
}

// ------------------------------------------------------------------ document mode
const setParam = (k, v) => { const u = new URL(location.href); u.searchParams.set(k, v); history.replaceState(null, '', u); };
function Doc({id}) {
  const data = D(); const wf = (data.wireframes || {})[id] || {id, title: id, roles: []};
  const roles = wf.roles || [];
  const [view, setView] = useState(P.get('view') === 'annotated' ? 'annotated' : 'wireframe');
  const [dev, setDev] = useState(DEVICES[P.get('device')] ? P.get('device') : (wf.device || 'desktop'));
  const [role, setRole] = useState(roles.some(r => r.id === P.get('role')) ? P.get('role') : (roles[0] || {}).id || '');
  const [h, setH] = useState(800); const [stageW, setStageW] = useState(1200);
  const stage = useRef(null); const frameEl = useRef(null);
  const [route, setRoute] = useState(() => decodeURIComponent(location.hash.replace(/^#\/?/, '')));
  const route0 = useRef(route);                                   // the iframe starts on the route of the address
  const [pinLayer, setPinLayer] = useState(null); const [rvSlot, setRvSlot] = useState(null);
  const st = useRef({}); st.current = {view, dev, role, roles};
  useEffect(() => {
    const f = e => {
      const d = e.data || {};
      if (d.wfHeight) setH(d.wfHeight);
      if (d.wfRoute != null) { route0.current = d.wfRoute; setRoute(d.wfRoute); try { history.replaceState(null, '', location.pathname + location.search + (d.wfRoute ? '#' + d.wfRoute : '')); } catch (x) {} }
      if (d.wfScrollTop && stage.current) { const r = stage.current.getBoundingClientRect(); if (r.top < 0) scrollBy(0, r.top - 60); }
      if (d.wfGo) {                                               // click-through: the next screen opens in this tab
        const tw = ((data.wireframes || {})[d.wfGo.id]) || {}; const s = st.current;
        const tr = (tw.roles || []).map(x => x.id);
        const role2 = d.wfGo.role || (tr.includes(s.role) ? s.role : (tr[0] || s.role));
        location.href = tw.page + `?view=${s.view}&device=${s.dev}&role=${encodeURIComponent(role2)}` + (d.wfGo.hash ? '#' + d.wfGo.hash : '');
      }
    };
    addEventListener('message', f); return () => removeEventListener('message', f);
  }, []);
  const sendView = () => {                                        // which part of the (tall) iframe the reader sees
    const fr = frameEl.current; if (!fr || !fr.contentWindow) return;
    const r = fr.getBoundingClientRect(); const s = r.width / (fr.offsetWidth || 1) || 1;
    const top = Math.max(0, -r.top) / s; const vis = (Math.min(innerHeight, r.bottom) - Math.max(0, r.top)) / s;
    try { fr.contentWindow.postMessage({wfView: {top: Math.round(top), height: Math.round(Math.max(320, vis))}}, '*'); } catch (x) {}
  };
  useEffect(() => { addEventListener('scroll', sendView, {passive: true}); addEventListener('resize', sendView); return () => { removeEventListener('scroll', sendView); removeEventListener('resize', sendView); }; }, []);
  useEffect(() => { sendView(); }, [h, stageW, dev]);
  useEffect(() => { const f = () => stage.current && setStageW(stage.current.clientWidth); f(); addEventListener('resize', f); return () => removeEventListener('resize', f); }, []);
  const annotated = view === 'annotated';
  const dw = DEVICES[dev].w; const scale = Math.min(1, (stageW - 32) / (dw + (dev === 'mobile' ? 20 : 2)));
  const src = React.useMemo(() => location.pathname + `?frame=1&view=${view}&role=${encodeURIComponent(role)}&device=${dev}` + (route0.current ? '#' + route0.current : ''), [view, role, dev]);
  const ref = (t) => { const href = t && (data.links || {})[t]; return href ? <a className="wf-ref" href={href} target="_top">{t}</a> : <span className="wf-ref">{t}</span>; };
  const refs = (s) => String(s || '').split(/\s*[,;·]\s*/).filter(Boolean).map((t, i) => <React.Fragment key={i}>{ref(t)}</React.Fragment>);
  const qs = (wf.queries || []).map(q => (data.queries || {})[q]).filter(Boolean);
  const m = wf.mapping || {};
  const chrome = <div className="chrome"><i/><i/><i/><span>{(data.product || {}).host ? (data.product.host + '/' + (wf.url || '')) : wf.url}</span></div>;
  return <div>
    <div className="wf-bar"><div className="t"><small>{[wf.group, wf.module_name].filter(Boolean).join(' · ')}</small><b><span>{wf.id}</span>{wf.title}</b></div>
      <div className="wf-tools">
        <div className="wf-seg">{['wireframe', 'annotated'].map(v => <button key={v} className={view === v ? 'on' : ''} onClick={() => { setView(v); setParam('view', v); }}>{v === 'wireframe' ? 'Wireframe' : 'Annotated wireframe'}</button>)}</div>
        <div className="wf-seg">{Object.keys(DEVICES).map(k => <button key={k} title={DEVICES[k].w + ' px'} className={dev === k ? 'on' : ''} onClick={() => { setDev(k); setParam('device', k); }}>{DEVICES[k].label}</button>)}</div>
        {roles.length > 1 && <select className="wf-role" aria-label="Role" value={role} onChange={e => { setRole(e.target.value); setParam('role', e.target.value); }}>
          {roles.map(r => <option key={r.id} value={r.id}>{r.name} - {r.access}</option>)}</select>}
        <span ref={setRvSlot} className="wf-rv-slot"/>
        <button type="button" className="wf-reset" title="Put the sample data back as it was" onClick={() => { window.resetStore && window.resetStore(); location.hash = ''; location.reload(); }}>Reset sample data</button>
        <a className="wf-open" href={location.pathname + location.search + location.hash} target="_blank" rel="noopener" title="Open this wireframe in a new tab">Open &#8599;</a></div></div>
    <div className="wf-body">
      {annotated && <div className="wf-head"><div className="wf-eyebrow">{[wf.group, wf.module_name].filter(Boolean).join(' · ')}</div>
        <h1><span>{wf.id}</span>{wf.headline || wf.title}</h1>{wf.intro && <p>{wf.intro}</p>}
        <div className="wf-chips">{(wf.chips || []).map((c, i) => <span key={i} className="wf-chip">{c}</span>)}
          {qs.length > 0 && <span className="wf-chip q">{qs.length} customer input{qs.length > 1 ? 's' : ''} needed</span>}</div></div>}
      <div className="wf-stage" ref={stage}>
        <div style={{width: (dw + (dev === 'mobile' ? 20 : 2)) * scale, height: (h + (dev === 'mobile' ? 48 : 38)) * scale}}>
          <div className={'wf-device' + (dev === 'mobile' ? ' phone' : '')} style={{width: dw + (dev === 'mobile' ? 20 : 2), transform: `scale(${scale})`, transformOrigin: 'top left'}}>
            {chrome}<div style={{position: 'relative'}}><iframe ref={frameEl} title={wf.title} src={src} style={{height: h}} onLoad={sendView}/>
              <div ref={setPinLayer} className="wf-pin-layer" style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}/></div></div></div></div>
      {scale < 1 && <div className="wf-scale-note">{DEVICES[dev].label} {dw} px shown at {Math.round(scale * 100)}% - use Open &#8599; for full size</div>}
      {window.WFReview && <window.WFReview wf={wf} dev={dev} role={role} view={view} route={route} scale={scale} layer={pinLayer} slot={rvSlot} frameH={h}
        setDev={k => { setDev(k); setParam('device', k); }}/>}
      {annotated && <>
        {(wf.items || []).length > 0 && <div className="wf-sec"><h2>What the numbers mean</h2>
          <p className="lead">{wf.items.length} callouts{(wf.items || []).filter(x => x.tone === 'open').length ? `, ${wf.items.filter(x => x.tone === 'open').length} on an open question` : ''}. Each one carries the FRD requirement or section it comes from.</p>
          <div className="wf-legend">{wf.items.map(it => <div key={it.n} className="wf-item"><span className={'wf-mark' + (it.tone === 'open' ? ' open' : '')}>{it.n}</span>
            <div><span className="lab">{it.label}</span>{it.control && <span className="ctl">{it.control}</span>}{refs(it.ref)}
              <p>{it.description}</p>
              {it.query && <div className="wf-box query"><b>Open query{it.query.ref ? ' · ' + it.query.ref : ''}</b>{it.query.text}</div>}
              {it.proposal && <div className="wf-box proposal"><b>Our proposal - not stated</b>{it.proposal}</div>}</div></div>)}</div></div>}
        {qs.length > 0 && <div className="wf-sec"><h2>Inputs needed from the customer</h2>
          <p className="lead">Each one is outlined with a dotted amber line on the screen. The screen is drawn on the assumption shown; the customer confirms or corrects it.</p>
          {qs.map(q => <div key={q.id} className="wf-cq" id={q.id}><h3><code>{q.id}</code>{q.area}</h3><dl>
            <dt>Question</dt><dd>{q.question}</dd><dt>Assumed</dt><dd>{q.assumption}</dd>
            {q.oi && <><dt>Related</dt><dd>{refs(q.oi)}</dd></>}<dt>Status</dt><dd>{q.status === 'answered' ? 'Answered - ' + (q.answer || '') : 'Open'}</dd></dl></div>)}</div>}
        {(wf.flows || []).length > 0 && <div className="wf-sec"><h2>Click-through</h2>
          <p className="lead">What each working control on this screen does in the clickable mockup.</p>
          <table className="wf-t"><thead><tr><th style={{width: 240}}>Action</th><th>Opens</th><th>Notes</th></tr></thead>
            <tbody>{wf.flows.map((f, i) => { const tw = f.to && (data.wireframes || {})[f.to];
              return <tr key={i}><td>{f.action}</td><td>{tw ? <a href={tw.page + `?view=${view}&device=${dev}` + (f.hash ? '#' + f.hash : '')}>{tw.id} {tw.title}{f.hash ? ' · ' + f.hash : ''}</a> : (f.view || 'Same screen')}</td><td>{f.note || ''}</td></tr>; })}</tbody></table></div>}
        <div className="wf-sec"><h2>Mapping</h2><p className="lead">The features, workflows and roles this screen serves - generated from the FRD master.</p>
          <table className="wf-t"><thead><tr><th style={{width: 170}}>Feature mapping</th><th>FRD section</th><th>Requirements</th></tr></thead>
            <tbody>{(m.features || []).map((f, i) => <tr key={i}><td>{ref(f.family)} {f.title}</td><td>{ref(f.section)}</td><td>{f.frs.map((x, j) => <React.Fragment key={j}>{ref(x)}</React.Fragment>)}</td></tr>)}
              {!(m.features || []).length && <tr><td colSpan={3}>None mapped yet.</td></tr>}</tbody></table>
          <table className="wf-t" style={{marginTop: 18}}><thead><tr><th style={{width: 170}}>Workflow mapping</th><th>Steps on this screen</th></tr></thead>
            <tbody>{(m.workflows || []).map((w, i) => <tr key={i}><td>{ref(w.id)} {w.title}</td><td>{w.steps.map((s, j) => <div key={j}><span className="wf-mono" style={{fontSize: 12.5, color: 'var(--wf-muted)'}}>{s.step}</span> {s.text}</div>)}</td></tr>)}
              {!(m.workflows || []).length && <tr><td colSpan={2}>No swimlane step names this screen yet.</td></tr>}</tbody></table>
          <table className="wf-t" style={{marginTop: 18}}><thead><tr><th style={{width: 170}}>Roles and access</th><th>Access</th><th>Information Architecture</th></tr></thead>
            <tbody>{roles.map((r, i) => <tr key={i}><td>{r.name}</td><td><span className={'wf-acc ' + (r.access || '').toLowerCase()}>{r.access}</span>{r.assumed && <span style={{fontSize: 12.5, color: 'var(--wf-muted)', marginLeft: 8}}>assumed - confirm</span>}</td>
              <td>{(r.ia || []).map((x, j) => <div key={j}>{ref(x.visual)} {x.path}</div>)}</td></tr>)}</tbody></table></div>
        {wf.missing && <div className="wf-sec"><h2>What is deliberately missing</h2><div className="wf-missing">
          <div><b>States not drawn</b><ul>{(wf.missing.states || []).map((x, i) => <li key={i}>{x}</li>)}</ul></div>
          <div><b>Detail not specified</b><ul>{(wf.missing.detail || []).map((x, i) => <li key={i}>{x}</li>)}</ul></div></div>
          {wf.missing.most && <div className="wf-box query" style={{marginTop: 12}}><b>Most important omission</b>{wf.missing.most}</div>}</div>}
      </>}
      <div className="wf-foot">{data.footer || 'Illustrative wireframe, pre-approval - not a visual design.'}</div></div></div>;
}

// ------------------------------------------------------------------ boot
window.WFBoot = function (id, need) {
  const frame = P.get('frame') === '1';
  document.body.className = frame ? 'wf-frame' : 'wf-doc';
  const wf = (D().wireframes || {})[id] || {};
  const want = (need || []).concat(wf.drawn ? [id] : []);
  let tries = 0;
  const go = () => {
    const ns = window[D().ds_ns] || {};
    const missing = want.filter(n => !(window.WF_SCREENS[n] || ns[n] || window[n]));
    if (missing.length && tries++ < 200) return setTimeout(go, 50);
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(frame ? <Frame id={id} role={P.get('role') || ((wf.roles || [])[0] || {}).id} annotated={P.get('view') === 'annotated'}/> : <Doc id={id}/>);
  };
  go();
};
Object.assign(window, {useWF, Mark, Ask, Ic, Btn, Pill, Panel, Stats, KV, Select, FilterBar, Check, DataTable, Tabs, Note, AppShell, WF_DEVICES: DEVICES});
})();
