/* OGYS wireframes - illustrative sample data shared by the screens. Names of the dealer, brand and locations are
   the ones shown on the session screens (Figures 9.3.1a, 9.4.1b); every number is illustrative. */
(function () {
const DS = window.SpareCareDesignSystem_556483 || {};
const DEALERS = [
  {key: 'd1', dealer: 'STAR GROUP', loc: 'Sagar-MP', brand: 'Mahindra', builder: 'Ritu S.', data: 'Stock · Pending PO · OEM invoice', files: [4, 4], ready: 'ready', sister: true, due: 'Today', ogs: 'Mother MAX', cat: 'Spare Part'},
  {key: 'd2', dealer: 'STAR GROUP', loc: 'Satna-MP', brand: 'Mahindra', builder: 'Ritu S.', data: 'Stock · Pending PO', files: [2, 2], ready: 'ready', sister: true, due: 'Today', ogs: 'Child of Sagar-MP', cat: 'Spare Part'},
  {key: 'd3', dealer: 'STAR GROUP', loc: 'Vidisha-MP', brand: 'Mahindra', builder: 'Ritu S.', data: 'Stock · Pending PO · DLR receipt', files: [2, 3], ready: 'waiting', sister: false, due: 'Today', ogs: '-', cat: 'Spare Part'},
  {key: 'd4', dealer: 'Shivam Motors', loc: 'YMCA Faridabad-HR', brand: 'Mahindra', builder: 'Aman K.', data: 'Stock · Pending PO · OEM invoice', files: [3, 3], ready: 'exception', sister: false, due: 'Today', ogs: '-', cat: 'Spare Part'},
  {key: 'd5', dealer: 'Prakash Auto', loc: 'Bhopal-MP', brand: 'Tata', builder: 'Aman K.', data: 'Stock · Pending PO', files: [2, 2], ready: 'ready', sister: false, due: 'Today', ogs: '-', cat: 'Accessories'},
  {key: 'd6', dealer: 'Prakash Auto', loc: 'Indore-MP', brand: 'Tata', builder: 'Aman K.', data: 'Stock · Pending PO', files: [1, 2], ready: 'waiting', sister: false, due: 'Carried forward · 3 Nov', ogs: '-', cat: 'Spare Part', carried: true},
  {key: 'd7', dealer: 'Vikas Wheels', loc: 'Gwalior-MP', brand: 'Mahindra', builder: 'Ritu S.', data: 'Stock · Pending PO · OEM invoice', files: [3, 3], ready: 'ready', sister: false, due: 'Carried forward · 4 Nov', ogs: '-', cat: 'Spare Part', carried: true},
];
const ORDERS = [
  {key: 'o1', no: 'ORD-26-04812', dealer: 'STAR GROUP', loc: 'Sagar-MP', cons: 'Dealer', status: 'flagged', due: '05-11-2026', next: '12-11-2026', lastMax: '28-10-2026', qty: '1,240', value: '5,02,400', usual: '1.0 - 1.5 lakh', rrs: '42 / 118 / 9'},
  {key: 'o2', no: 'ORD-26-04813', dealer: 'STAR GROUP', loc: 'Satna-MP', cons: 'Sister location', status: 'generated', due: '05-11-2026', next: '12-11-2026', lastMax: '28-10-2026', qty: '312', value: '1,18,750', usual: '1.0 - 1.4 lakh', rrs: '18 / 40 / 2'},
  {key: 'o3', no: 'ORD-26-04814', dealer: 'Prakash Auto', loc: 'Bhopal-MP', cons: 'Dealer', status: 'approved', due: '05-11-2026', next: '08-11-2026', lastMax: '01-11-2026', qty: '86', value: '64,300', usual: '55 - 70 thousand', rrs: '9 / 22 / 0'},
  {key: 'o4', no: 'ORD-26-04809', dealer: 'Vikas Wheels', loc: 'Gwalior-MP', cons: 'Dealer', status: 'notsent', due: '04-11-2026', next: '11-11-2026', lastMax: '30-10-2026', qty: '204', value: '96,120', usual: '0.9 - 1.1 lakh', rrs: '14 / 31 / 3'},
  {key: 'o5', no: 'ORD-26-04815', dealer: 'Shivam Motors', loc: 'YMCA Faridabad-HR', cons: 'Dealer', status: 'generated', due: '05-11-2026', next: '07-11-2026', lastMax: '02-11-2026', qty: '451', value: '2,12,900', usual: '1.8 - 2.4 lakh', rrs: '30 / 77 / 6'},
];
/* Dealer master sample (WF-45, shared by the rule and notification screens). Kept for the browser tab with
   useStore('dealers', MASTER), so a dealer added on WF-45 appears in the other screens' lists. */
const BRANDS = ['Mahindra', 'Tata', 'JCB'];
const ZONES = ['North', 'Central', 'West', 'South'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MASTER = [
  {code: 'DLR-0001', name: 'STAR GROUP', brand: 'Mahindra', oem: 'MH-DLR-40711', oemName: 'STAR AUTOMOBILES PVT LTD', zone: 'Central', days: ['Monday', 'Thursday'], active: true, locs: ['Sagar-MP', 'Satna-MP', 'Vidisha-MP'], by: 'Neha G.', at: '02-11-2026 10:15'},
  {code: 'DLR-0002', name: 'Prakash Auto', brand: 'Tata', oem: 'TT-0098812', oemName: 'PRAKASH AUTOMOTIVE LLP', zone: 'Central', days: ['Tuesday'], active: true, locs: ['Bhopal-MP', 'Indore-MP'], by: 'Neha G.', at: '28-10-2026 16:40'},
  {code: 'DLR-0003', name: 'Shivam Motors', brand: 'Mahindra', oem: 'MH-DLR-41020', oemName: 'SHIVAM MOTORS PVT LTD', zone: 'North', days: ['Wednesday', 'Saturday'], active: true, locs: ['YMCA Faridabad-HR'], by: 'Rahul S.', at: '21-10-2026 11:02'},
  {code: 'DLR-0004', name: 'Vikas Wheels', brand: 'Mahindra', oem: 'MH-DLR-39877', oemName: 'VIKAS WHEELS PVT LTD', zone: 'Central', days: ['Monday'], active: true, locs: ['Gwalior-MP'], by: 'Neha G.', at: '19-10-2026 09:30'},
  {code: 'DLR-0005', name: 'Rajdhani Motors', brand: 'JCB', oem: 'JCB-77120', oemName: 'RAJDHANI EARTHMOVERS', zone: 'North', days: ['Friday'], active: false, locs: ['Delhi-Okhla', 'Gurugram-HR'], by: 'Rahul S.', at: '10-10-2026 14:22'},
  {code: 'DLR-0006', name: 'Malwa Tractors', brand: 'Mahindra', oem: 'MH-DLR-42210', oemName: 'MALWA TRACTORS', zone: 'Central', days: ['Tuesday', 'Friday'], active: true, locs: ['Ujjain-MP', 'Dewas-MP'], by: 'Neha G.', at: '08-10-2026 12:00'},
  {code: 'DLR-0007', name: 'Konkan Auto', brand: 'Tata', oem: 'TT-0101457', oemName: 'KONKAN AUTO SALES', zone: 'West', days: ['Wednesday'], active: true, locs: ['Ratnagiri-MH'], by: 'Rahul S.', at: '05-10-2026 15:18'},
  {code: 'DLR-0008', name: 'Deccan Motors', brand: 'Mahindra', oem: 'MH-DLR-38804', oemName: 'DECCAN MOTORS PVT LTD', zone: 'South', days: ['Monday', 'Thursday'], active: true, locs: ['Hyderabad-TS', 'Warangal-TS'], by: 'Neha G.', at: '01-10-2026 10:45'},
  {code: 'DLR-0009', name: 'Narmada Earthmovers', brand: 'JCB', oem: 'JCB-77342', oemName: 'NARMADA EARTHMOVERS', zone: 'Central', days: ['Thursday'], active: true, locs: ['Jabalpur-MP'], by: 'Rahul S.', at: '28-09-2026 17:05'},
  {code: 'DLR-0010', name: 'Thar Motors', brand: 'Tata', oem: 'TT-0099120', oemName: 'THAR MOTORS', zone: 'West', days: ['Saturday'], active: false, locs: ['Jodhpur-RJ'], by: 'Neha G.', at: '20-09-2026 13:30'},
];
const READY = {ready: ['ok', 'Ready'], waiting: ['neutral', 'Waiting for data'], exception: ['warn', 'Exception'], flagged: ['warn', 'Flagged'],
               generated: ['info', 'Generated'], approved: ['ok', 'Approved'], notsent: ['bad', 'Not sent']};
function State({s}) {                         // a state label in the design system's Tag when it is loaded
  const [tone, label] = READY[s] || ['neutral', s];
  if (DS.Tag) return <DS.Tag tone={{ok: 'ok', warn: 'low', bad: 'out', info: 'info', neutral: 'neutral'}[tone]} dot>{label}</DS.Tag>;
  return <window.Pill tone={tone}>{label}</window.Pill>;
}
function Act({primary, children, icon, onClick, small, disabled}) {   // the design system's Button (sharp corners, 44px) when loaded
  onClick = onClick || (() => window.wfNotBuilt && window.wfNotBuilt(typeof children === 'string' ? children : ''));
  if (DS.Button) return <DS.Button variant={primary ? 'primary' : 'secondary'} size={small ? 'sm' : 'md'} onClick={onClick} disabled={disabled}
    iconLeft={icon ? <window.Ic name={icon} size={15}/> : undefined}>{children}</DS.Button>;
  return <window.Btn variant={primary ? 'primary' : 'secondary'} small={small} icon={icon} onClick={onClick} disabled={disabled}>{children}</window.Btn>;
}
function Seg({options, value: v0, onChange: oc}) {         // a two- or three-way switch (Always / Only today); works on its own when no onChange
  const [own, setOwn] = React.useState(v0);
  const value = oc ? v0 : own; const onChange = oc || setOwn;
  return <span style={{display: 'inline-flex', border: '1px solid var(--wf-border-strong)', borderRadius: 'var(--wf-radius)'}}>
    {options.map(o => <button key={o} type="button" onClick={() => onChange && onChange(o)} style={{all: 'unset', cursor: 'pointer', padding: '8px 14px', minHeight: 20,
      font: '600 13.5px var(--wf-font-body)', background: o === value ? 'var(--wf-primary)' : 'var(--wf-surface)', color: o === value ? '#fff' : 'var(--wf-heading)'}}>{o}</button>)}</span>;
}
function Upload({label, file: f0, note}) {                 // choosing a file shows its name (nothing is uploaded in the mockup)
  const [file, setFile] = React.useState(f0); const inp = React.useRef(null);
  return <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, border: '1px dashed var(--wf-border-strong)', padding: '12px 14px', background: 'var(--wf-surface)'}}>
    <window.Ic name="upload" size={18} color="var(--wf-heading)"/>
    <div style={{flex: '1 1 200px'}}><div style={{fontWeight: 600, color: 'var(--wf-heading)'}}>{label}</div>
      <div style={{fontSize: 13, color: 'var(--wf-muted)'}}>{file ? <span className="wf-mono">{file}</span> : 'Drop an Excel / CSV file or choose one'}{note ? ' · ' + note : ''}</div></div>
    <input ref={inp} type="file" accept=".xlsx,.xls,.csv" style={{display: 'none'}} onChange={e => { const x = e.target.files[0]; if (x) { setFile(x.name); window.wfToast && window.wfToast('ok', x.name + ' chosen - the mockup does not read the file'); } }}/>
    <Act small icon="file-up" onClick={() => inp.current && inp.current.click()}>{file ? 'Replace file' : 'Choose file'}</Act></div>;
}
function Switch({on: on0, label, onChange}) {              // works on its own; onChange(on) when given
  const [own, setOwn] = React.useState(!!on0); const on = onChange ? on0 : own;
  return <span role="switch" aria-checked={!!on} tabIndex={0} onClick={() => onChange ? onChange(!on) : setOwn(!on)} style={{display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 14, cursor: 'pointer'}}>
    <span style={{width: 38, height: 22, borderRadius: 11, background: on ? 'var(--wf-primary)' : 'var(--wf-border-strong)', position: 'relative', flex: 'none'}}>
      <span style={{position: 'absolute', top: 3, left: on ? 19 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff'}}/></span>{label}</span>;
}

/* Rule screens (Batch 4): scope of a rule (brand / dealer / location, bulk apply), condition rows and version line. */
function RuleScope({level: l0 = 'Brand', applies, mark, bulk = true, brand: b0 = 'Mahindra', onChange}) {
  const {size} = window.useWF();
  const [level, setLevel] = React.useState(l0); const [brand, setBrand] = React.useState(b0);
  const [dealer, setDealer] = React.useState(''); const [loc, setLoc] = React.useState('');
  const dealers = MASTER.filter(d => d.brand === brand);
  const dl = dealers.find(d => d.name === dealer) || dealers[0] || {};
  const locs = dl.locs || [];
  const cur = {level, brand, dealer: dl.name, location: level === 'Location' ? (loc || locs[0]) : ''};
  React.useEffect(() => { onChange && onChange(cur); }, [level, brand, dl.name, cur.location]);
  const nDealers = {Mahindra: 146, Tata: 38, JCB: 21}[brand] || dealers.length;
  const now = applies && level === l0 && brand === b0 ? applies :
    level === 'Brand' ? `${brand} - all ${nDealers} dealers` : level === 'Dealer' ? `${dl.name} (${brand}) - ${locs.length} location${locs.length === 1 ? '' : 's'}` : `${cur.location} of ${dl.name}`;
  return <window.Panel title={<span>Applies to {mark}</span>} sub="Brand level is the default; dealer and location rules override it">
    <div style={{display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end'}}>
      <label style={{display: 'flex', flexDirection: 'column', gap: 4}}><span style={{fontSize: 12.5, color: 'var(--wf-muted)'}}>Level</span><Seg options={['Brand', 'Dealer', 'Location']} value={level} onChange={setLevel}/></label>
      <window.Select label="Brand" value={brand} options={BRANDS} onChange={v => { setBrand(v); setDealer(''); setLoc(''); }}/>
      {level !== 'Brand' && <window.Select label="Dealer" value={dl.name} options={dealers.map(d => d.name)} onChange={v => { setDealer(v); setLoc(''); }}/>}
      {level === 'Location' && <window.Select label="Location" value={cur.location} options={locs} onChange={setLoc}/>}
      {bulk && <span style={{marginLeft: size === 'mobile' ? 0 : 'auto'}}><Act small icon="copy" onClick={async () => {
        const z = await window.wfConfirm({title: 'Apply this rule to several', body: 'Choose the dealers by zone; each keeps a dealer-level copy of the rule.', ok: 'Apply', input: {label: 'Zone (North, Central, West, South)', value: 'Central'}});
        if (z) window.wfToast('ok', `Rule applied to the ${brand} dealers in zone ${z} (sample)`); }}>Apply to several (filter by zone, brand)</Act></span>}</div>
    <div style={{fontSize: 13.5, color: 'var(--wf-muted)', marginTop: 10}}>Currently applied to: <b style={{color: 'var(--wf-ink)'}}>{now}</b></div></window.Panel>;
}
function Conds({rows, title = 'Conditions', mark, sub, add = true}) {           // rows: [[parameter, operator, value, then]]
  return <window.Panel title={<span>{title} {mark}</span>} sub={sub} right={add && <Act small icon="plus">Add condition</Act>} pad={false}>
    <window.DataTable cardTitle="p" columns={[{key: 'p', label: 'Parameter', mono: true}, {key: 'o', label: 'Operator', align: 'center'}, {key: 'v', label: 'Value'}, {key: 't', label: 'Then'}]}
      rows={rows.map((r, i) => ({key: i, p: r[0], o: <span className="wf-mono">{r[1]}</span>, v: r[2], t: r[3] || ''}))}/></window.Panel>;
}
function Version({v = 'v7', who = 'Neha G.', when = '05-11-2026 09:40', eff = '06-11-2026', mark, onHistory}) {
  return <div style={{display: 'flex', flexWrap: 'wrap', gap: '6px 16px', alignItems: 'center', fontSize: 13, color: 'var(--wf-muted)', margin: '-4px 0 14px'}}>
    <span className="wf-mono" style={{color: 'var(--wf-heading)'}}>{v}</span><span>saved by {who} · {when}</span><span>effective from {eff}</span><a href="#" data-wf-nav={onHistory ? '1' : undefined} onClick={onHistory ? (e => { e.preventDefault(); onHistory(); }) : undefined} style={{color: 'var(--wf-heading)'}}>Version history</a>{mark}</div>;
}
function Formula({children, mark}) {
  return <div className="wf-mono" style={{padding: '10px 12px', background: 'var(--wf-sunken)', borderLeft: '3px solid var(--wf-accent)', fontSize: 14, lineHeight: 1.6}}>{children}{mark}</div>;
}
Object.assign(window, {ORuleScope: RuleScope, OConds: Conds, OVersion: Version, OFormula: Formula});

Object.assign(window, {OGYS: {DEALERS, ORDERS, MASTER, BRANDS, ZONES, DAYS}, OState: State, OAct: Act, OSeg: Seg, OUpload: Upload, OSwitch: Switch});
})();
