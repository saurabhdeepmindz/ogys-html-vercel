/* WF-45 Dealer Master - Admin. FR-028.1, 028.6, 028.7, 028.9. Clickable (pilot):
     list   search, brand / zone / status filters (also from the address: #status=Active), sort, pages, row menu
     #new   add a dealer: required fields, duplicate OEM code check, Save -> list with the row highlighted,
            Save and add locations -> Location Master
     #view/<code>, #edit/<code>   the dealer; deactivate / activate asks first (deactivate, never delete) */
(function () {
const {useState} = React;
const EMPTY = {brand: 'Mahindra', oem: '', oemName: '', name: '', zone: 'Central', days: ['Monday'], active: true, locs: []};
function Screen() {
  const {size} = useWF();
  const [rows, setRows] = useStore('dealers', OGYS.MASTER);
  const [route, go] = useRoute();
  const R = parseRoute(route);
  if (R.view === 'new' || R.view === 'edit') return <Form rows={rows} setRows={setRows} go={go} code={R.code}/>;
  if (R.view === 'view') return <View rows={rows} setRows={setRows} go={go} code={R.code}/>;
  return <List key={route} rows={rows} setRows={setRows} go={go} params={R.params} size={size}/>;
}

async function toggleActive(d, rows, setRows) {
  const off = d.active;
  const ok = await wfConfirm({title: off ? `Deactivate ${d.name}?` : `Activate ${d.name}?`, danger: off, ok: off ? 'Deactivate' : 'Activate',
    body: off ? 'No orders are generated for its locations while it is inactive. The dealer and its history are kept - dealers are never deleted.' : 'Orders are generated again for its locations from the next ordering day.'});
  if (!ok) return;
  setRows(rows.map(x => x.code === d.code ? {...x, active: !off} : x));
  wfToast(off ? 'warn' : 'ok', `${d.name} ${off ? 'deactivated' : 'activated'}`);
}

function List({rows, setRows, go, params, size}) {
  const [flash] = useState(takeFlash);
  const [q, setQ] = useState(params.q || '');
  const [brand, setBrand] = useState(params.brand || 'All'); const [zone, setZone] = useState(params.zone || 'All');
  const [status, setStatus] = useState(params.status || 'All');
  const shown = rows.filter(d => (brand === 'All' || d.brand === brand) && (zone === 'All' || d.zone === zone) &&
    (status === 'All' || (status === 'Active') === d.active) && (!q || (d.name + ' ' + d.oem + ' ' + d.oemName).toLowerCase().includes(q.toLowerCase())));
  const nAct = rows.filter(d => d.active).length;
  return <AppShell active="WF-45" title="Dealers" subtitle={`${nAct} active · ${rows.length - nAct} inactive (sample)`}
    actions={<><OAct icon="upload" onClick={() => WFGo('WF-48')}>Upload</OAct><OAct primary icon="plus" onClick={() => go('new')}>Add dealer</OAct></>}>
    <FilterBar search="Dealer or OEM code" query={q} onSearch={setQ} count={[brand, zone, status].filter(x => x !== 'All').length}
      filters={[{label: 'Brand', value: brand, options: ['All'].concat(OGYS.BRANDS), onChange: setBrand}, {label: 'Zone', value: zone, options: ['All'].concat(OGYS.ZONES), onChange: setZone},
                {label: 'Status', value: status, options: ['All', 'Active', 'Inactive'], onChange: setStatus}]}/>
    <Panel pad={false} title={<span>Dealer list <Mark n={1}/></span>} sub={`${shown.length} of ${rows.length} dealers · select a dealer to open it`}>
      <DataTable cardTitle="d" cardSub="b" flash={flash} pageSize={8} onRow={r => go('view/' + r.key)} empty="No dealer matches the filters."
        columns={[{key: 'd', label: 'Dealer', sortable: true}, {key: 'b', label: 'Brand', sortable: true}, {key: 'c', label: 'OEM dealer code', mono: true, hide: 'tablet'},
                  {key: 'z', label: 'Zone', hide: 'mobile', sortable: true}, {key: 'l', label: 'Locations', align: 'right'}, {key: 'o', label: <span>Ordering days<Mark n={4}/></span>, hide: 'tablet'},
                  {key: 's', label: <span>Status<Mark n={5}/></span>}, {key: 'm', label: '', align: 'right'}]}
        rows={shown.map(d => ({key: d.code, sort: {d: d.name, b: d.brand, z: d.zone}, d: <b>{d.name}</b>, b: d.brand, c: d.oem, z: d.zone, l: d.locs.length,
          o: d.days.map(x => x.slice(0, 3)).join(', '), s: d.active ? <window.Pill tone="ok">Active</window.Pill> : <window.Pill tone="neutral">Inactive</window.Pill>,
          m: <RowMenu items={[{label: 'View', icon: 'eye', onClick: () => go('view/' + d.code)}, {label: 'Edit', icon: 'pencil', onClick: () => go('edit/' + d.code)},
            {label: 'Locations', icon: 'map-pin', onClick: () => WFGo('WF-46')},
            {label: d.active ? 'Deactivate' : 'Activate', icon: d.active ? 'circle-pause' : 'circle-play', danger: d.active, onClick: () => toggleActive(d, rows, setRows)}]}/>}))}/></Panel>
  </AppShell>;
}

function Form({rows, setRows, go, code}) {
  const {size} = useWF();
  const old = rows.find(d => d.code === code);
  const [f, setF] = useState(old ? {...old} : {...EMPTY});
  const [err, setErr] = useState({});
  const set = (k, v) => { setF({...f, [k]: v}); setErr({...err, [k]: ''}); };
  const save = (next) => {
    const e = {};
    if (!f.oem.trim()) e.oem = 'Enter the OEM dealer code.';
    else if (rows.some(d => d.brand === f.brand && d.oem.toLowerCase() === f.oem.trim().toLowerCase() && d.code !== code)) e.oem = `${f.brand} already has a dealer with this code.`;
    if (!f.oemName.trim()) e.oemName = 'Enter the OEM dealer name.';
    if (!f.name.trim()) e.name = 'Enter the name used in OGYS.';
    if (!f.days.length) e.days = 'Choose at least one ordering day.';
    setErr(e); if (Object.keys(e).length) return wfToast('bad', 'Check the fields marked in red');
    const now = new Date(); const at = now.toLocaleDateString('en-GB').replace(/\//g, '-') + ' ' + now.toTimeString().slice(0, 5);
    const rec = {...f, oem: f.oem.trim(), name: f.name.trim(), oemName: f.oemName.trim(), by: 'Neha G.', at,
      code: code || 'DLR-' + String(Math.max(0, ...rows.map(d => +d.code.slice(4))) + 1).padStart(4, '0')};
    setRows(code ? rows.map(d => d.code === code ? rec : d) : [rec].concat(rows));
    flash(rec.code);
    wfToast('ok', `${rec.name} ${code ? 'updated' : 'added'}` + (next ? ' - now add its locations' : ''));
    if (next) WFGo('WF-46', {hash: 'new'}); else go('');
  };
  return <AppShell active="WF-45" title={old ? `Edit ${old.name}` : 'Add dealer'} crumbs={<a href="#" data-wf-nav="1" onClick={e => { e.preventDefault(); go(''); }} style={{color: 'var(--wf-heading)'}}>Dealers</a>}
    subtitle={old ? `OGYS id ${old.code}` : 'Step 1 of onboarding - the dealer; then its locations one by one'}
    actions={<><OAct onClick={() => go(code ? 'view/' + code : '')}>Cancel</OAct><OAct primary icon="check" onClick={() => save(false)}>Save</OAct></>}>
    <div style={{display: 'flex', alignItems: 'center', gap: 6}}><Steps steps={['Dealer', `Locations${old ? ' (' + old.locs.length + ')' : ''}`]} current={0}/><Mark n={2}/></div>
    <Panel title={<span>Dealer <Mark n={1}/></span>} sub="Fields marked * are required">
      <div style={{display: 'grid', gridTemplateColumns: size === 'mobile' ? '1fr' : '1fr 1fr', gap: 14, maxWidth: 820}}>
        <Select label="Brand" required value={f.brand} options={OGYS.BRANDS} onChange={v => set('brand', v)}/>
        <Select label="Zone" value={f.zone} options={OGYS.ZONES} onChange={v => set('zone', v)}/>
        <Ask id="CQ-29"><Input label={<span>OEM dealer code<Mark n={3} open/></span>} required mono value={f.oem} onChange={v => set('oem', v)} placeholder="MH-DLR-40711" error={err.oem}
          hint="Entered from the OEM; OGYS keeps its own internal id"/></Ask>
        <Input label="OEM dealer name" required value={f.oemName} onChange={v => set('oemName', v.toUpperCase())} placeholder="STAR AUTOMOBILES PVT LTD" error={err.oemName}/>
        <Input label="Dealer name in OGYS" required value={f.name} onChange={v => set('name', v)} placeholder="STAR GROUP" error={err.name}/>
        <div><Select label={<span>Ordering days (dealer level)<Mark n={4}/></span>} required multi value={f.days} options={OGYS.DAYS} onChange={v => set('days', v)}/>
          {err.days && <div style={{fontSize: 12.5, color: 'var(--wf-bad)', marginTop: 4}}>{err.days}</div>}
          <div style={{fontSize: 12.5, color: 'var(--wf-muted)', marginTop: 4}}>A location can have its own days</div></div>
      </div>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', alignItems: 'center', marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--wf-border-soft)'}}>
        <span><Toggle on={f.active} onChange={v => set('active', v)} label={f.active ? 'Active' : 'Inactive - deactivate, never delete'}/><Mark n={5}/></span>
        <OAct small primary icon="arrow-right" onClick={() => save(true)}>Save and add locations</OAct></div></Panel>
  </AppShell>;
}

function View({rows, setRows, go, code}) {
  const d = rows.find(x => x.code === code);
  if (!d) return <AppShell active="WF-45" title="Dealer not found"><Note tone="warn">There is no dealer {code} in the sample. <a href="#" data-wf-nav="1" onClick={e => { e.preventDefault(); go(''); }}>Back to the list</a></Note></AppShell>;
  return <AppShell active="WF-45" title={d.name} crumbs={<a href="#" data-wf-nav="1" onClick={e => { e.preventDefault(); go(''); }} style={{color: 'var(--wf-heading)'}}>Dealers</a>}
    subtitle={`${d.brand} · OGYS id ${d.code} · last changed by ${d.by}, ${d.at}`}
    actions={<><OAct icon={d.active ? 'circle-pause' : 'circle-play'} onClick={() => toggleActive(d, rows, setRows)}>{d.active ? 'Deactivate' : 'Activate'}</OAct><OAct primary icon="pencil" onClick={() => go('edit/' + d.code)}>Edit</OAct></>}>
    <Panel title={<span>Dealer <Mark n={1}/></span>} right={d.active ? <window.Pill tone="ok">Active</window.Pill> : <window.Pill tone="neutral">Inactive</window.Pill>}>
      <KV pairs={[['Brand', d.brand], ['OEM dealer code', d.oem, true], ['OEM dealer name', d.oemName], ['Zone', d.zone], ['Ordering days (dealer level)', d.days.join(', ')], ['OGYS id', d.code, true]]}/></Panel>
    <Panel pad={false} title={<span>Locations <Mark n={2}/></span>} sub="Onboarded one by one after the dealer" right={<OAct small icon="plus" onClick={() => WFGo('WF-46', {hash: 'new'})}>Add location</OAct>}>
      <DataTable cardTitle="l" onRow={() => WFGo('WF-46')} empty="No location yet - add the first one." columns={[{key: 'l', label: 'Location'}, {key: 'o', label: 'Ordering days'}, {key: 's', label: 'Status'}]}
        rows={d.locs.map((l, i) => ({key: i, l: <b>{l}</b>, o: 'As the dealer', s: d.active ? <window.Pill tone="ok">Active</window.Pill> : <window.Pill tone="neutral">Inactive</window.Pill>}))}/></Panel>
  </AppShell>;
}
WFScreen('WF-45', Screen);
})();
