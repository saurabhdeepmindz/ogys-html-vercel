/* WF-33 Notification Management - Admin. FR-022.1-022.7. Clickable (pilot): the dealer list comes from the dealer
   master sample and the location list follows the dealer; each location keeps its own rules; Add rule / Edit open a
   side panel; selecting a rule shows its template; Save rules confirms; Send log opens the log of the last messages. */
(function () {
const {useState} = React;
const TYPES = ['SOQ (order)', 'ITO', 'MIS', 'One Pager (AI call)'];
const CHANNELS = ['E-mail', 'WhatsApp', 'SMS', 'Mobile app', 'AI call'];
const TEMPLATES = {'Order mail v2': 'Dear {dealer}, please find attached order {order_no} for {location}, dated {date}.',
  'Value message': 'Order {order_no} for {location} is Rs {value}. Please arrange payment.',
  'Transfer alert': 'Transfer {ito_no}: send {qty} parts from {from_location} to {to_location}.'};
const SEED = [{id: 1, t: 'SOQ (order)', c: 'E-mail', r: 'spm.sagar@stargroup.in', p: 'order file', tp: 'Order mail v2'},
  {id: 2, t: 'SOQ (order)', c: 'WhatsApp', r: '98260 41300 (service GM)', p: 'order value for payment', tp: 'Value message'},
  {id: 3, t: 'ITO', c: 'Mobile app', r: 'Stores - Satna-MP, Vidisha-MP', p: 'transfer to make', tp: 'Transfer alert'},
  {id: 4, t: 'MIS', c: '-', r: 'To be defined', p: '', tp: '-'}, {id: 5, t: 'One Pager (AI call)', c: 'To be confirmed', r: '-', p: '', tp: '-'}];
const LOG = [['05-11 07:02', 'SOQ (order)', 'E-mail', 'spm.sagar@stargroup.in', 'Delivered'], ['05-11 07:02', 'SOQ (order)', 'WhatsApp', '98260 41300', 'Failed - number not on WhatsApp'],
  ['04-11 07:01', 'ITO', 'Mobile app', 'Stores - Satna-MP', 'Delivered'], ['01-11 07:03', 'SOQ (order)', 'E-mail', 'spm.sagar@stargroup.in', 'Delivered']];
const BLANK = {t: 'SOQ (order)', c: 'E-mail', r: '', p: '', tp: 'Order mail v2'};
function Screen() {
  const {size} = useWF(); const two = size === 'desktop';
  const [dealers] = useStore('dealers', OGYS.MASTER);
  const act = dealers.filter(d => d.active);
  const [dealer, setDealer] = useState('STAR GROUP');
  const dl = act.find(d => d.name === dealer) || act[0];
  const [loc, setLoc] = useState('Sagar-MP');
  const location = dl.locs.includes(loc) ? loc : dl.locs[0];
  const [all, setAll] = useStore('notification-rules', {'Sagar-MP': SEED});
  const rules = all[location] || [];
  const setRules = r => setAll({...all, [location]: r});
  const [sel, setSel] = useState(2); const [form, setForm] = useState(null); const [err, setErr] = useState(''); const [log, setLog] = useState(false);
  const [fl, setFl] = useState(null);
  const pick = rules.find(r => r.id === sel) || rules.find(r => TEMPLATES[r.tp]);
  const saveRule = () => {
    if (!form.r.trim()) return setErr('Enter at least one recipient - an e-mail ID or a mobile number.');
    const id = form.id || Math.max(0, ...rules.map(r => r.id)) + 1;
    setRules(form.id ? rules.map(r => r.id === form.id ? {...form} : r) : rules.concat([{...form, id}]));
    setFl(id); setSel(id); setForm(null);
    wfToast('ok', `Rule ${form.id ? 'updated' : 'added'} for ${location} - Save rules to keep it`);
  };
  return <AppShell active="WF-33" title="Notification management" subtitle="Who is told what, by which channel - per dealer location"
    actions={<OAct primary icon="check" onClick={() => wfToast('ok', `${rules.length} rules saved for ${dl.name}, ${location}`)}>Save rules</OAct>}>
    <FilterBar filters={[{label: 'Dealer', value: dl.name, options: act.map(d => d.name), onChange: v => { setDealer(v); setSel(null); }},
      {label: <span>Location<Mark n={1}/></span>, value: location, options: dl.locs, onChange: v => { setLoc(v); setSel(null); }}]}/>
    <Ask id="CQ-52"><Panel pad={false} title={<span>Rules by communication type <Mark n={2} open/></span>} sub={`${rules.length} rule${rules.length === 1 ? '' : 's'} for ${location} · select one to see its template`}
      right={<OAct small icon="plus" onClick={() => { setErr(''); setForm({...BLANK}); }}>Add rule</OAct>}>
      <DataTable cardTitle="t" flash={fl} onRow={r => setSel(r.key)} empty={`No rule for ${location} yet - nothing is sent. Add the first rule.`}
        rowTone={r => r.key === (pick || {}).id ? 'ok' : null}
        columns={[{key: 't', label: 'Type'}, {key: 'c', label: 'Channel'}, {key: 'r', label: <span>Recipients · purpose<Mark n={3}/></span>, wide: true}, {key: 'tp', label: 'Template'}, {key: 'm', label: '', align: 'right'}]}
        rows={rules.map(r => ({key: r.id, t: <b>{r.t}</b>, c: r.c, r: r.r + (r.p ? ' · ' + r.p : ''), tp: r.tp,
          m: <RowMenu items={[{label: 'Edit', icon: 'pencil', onClick: () => { setErr(''); setForm({...r}); }},
            {label: 'Delete', icon: 'trash-2', danger: true, onClick: async () => { if (await wfConfirm({title: `Delete the ${r.t} ${r.c} rule?`, body: 'Nothing is sent by this rule any more. Save rules to keep the change.', ok: 'Delete', danger: true})) { setRules(rules.filter(x => x.id !== r.id)); wfToast('warn', 'Rule deleted'); } }}]}/>}))}/></Panel></Ask>
    <div style={{display: 'grid', gridTemplateColumns: two ? '1fr 1fr' : '1fr', gap: 16}}>
      <Panel title={<span>Template - {pick && TEMPLATES[pick.tp] ? pick.tp : 'none'} <Mark n={4}/></span>} sub={pick ? `${pick.t} by ${pick.c}` : 'Select a rule'}>
        {pick && TEMPLATES[pick.tp] ? <div style={{fontSize: 14, lineHeight: 1.6, padding: 12, background: 'var(--wf-sunken)'}}>
          {TEMPLATES[pick.tp].split(/(\{[a-z_]+\})/).map((x, i) => x.startsWith('{') ? <span key={i} className="wf-mono">{x}</span> : x)}</div> :
          <div style={{fontSize: 14, color: 'var(--wf-muted)'}}>This rule has no template yet.</div>}</Panel>
      <Panel title={<span>Dealer view <Mark n={5}/></span>}><div style={{fontSize: 14}}>The order is always visible on the dealer's side of OGYS, whatever is sent.</div>
        <div style={{marginTop: 10}}><OAct small icon="list" onClick={() => setLog(true)}>Send log</OAct></div><Mark n={6}/></Panel></div>
    <Drawer open={!!form} onClose={() => setForm(null)} title={form && form.id ? 'Edit rule' : 'Add rule'} sub={`${dl.name} · ${location}`}
      footer={<><OAct onClick={() => setForm(null)}>Cancel</OAct><OAct primary icon="check" onClick={saveRule}>{form && form.id ? 'Update rule' : 'Add rule'}</OAct></>}>
      {form && <div style={{display: 'grid', gap: 14}}>
        <Select label="Communication type" required value={form.t} options={TYPES} onChange={v => setForm({...form, t: v})}/>
        <Select label="Channel" required value={form.c} options={CHANNELS} onChange={v => setForm({...form, c: v})}/>
        <Input label="Recipients" required value={form.r} onChange={v => { setForm({...form, r: v}); setErr(''); }} placeholder="E-mail IDs or mobile numbers, separated by commas" error={err}/>
        <Input label="Purpose" value={form.p} onChange={v => setForm({...form, p: v})} placeholder="e.g. order value for payment"/>
        <Select label="Template" value={form.tp} options={Object.keys(TEMPLATES).concat(['-'])} onChange={v => setForm({...form, tp: v})}/>
        {TEMPLATES[form.tp] && <div style={{fontSize: 13.5, lineHeight: 1.55, padding: 10, background: 'var(--wf-sunken)'}}>{TEMPLATES[form.tp]}</div>}
        {['SMS', 'AI call', 'Mobile app'].includes(form.c) && <Note tone="warn">{form.c} is not confirmed for this phase (CQ-52).</Note>}</div>}</Drawer>
    <Drawer open={log} onClose={() => setLog(false)} title="Send log" sub={`${dl.name} · ${location} · last messages (sample)`} width={560}>
      <DataTable cardTitle="w" columns={[{key: 'w', label: 'When', nowrap: true}, {key: 't', label: 'Type'}, {key: 'c', label: 'Channel'}, {key: 'r', label: 'To'}, {key: 's', label: 'Result'}]}
        rows={LOG.map((l, i) => ({key: i, w: l[0], t: l[1], c: l[2], r: l[3], s: /Failed/.test(l[4]) ? <window.Pill tone="bad">{l[4]}</window.Pill> : <window.Pill tone="ok">{l[4]}</window.Pill>}))}/></Drawer>
  </AppShell>;
}
WFScreen('WF-33', Screen);
})();
