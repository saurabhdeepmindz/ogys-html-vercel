/* WF-12 OOQ Rule Settings - Admin. FR-004.1-004.7, FR-005.1-005.4. Clickable (pilot): the scope (level, brand,
   dealer, location) changes what the rule applies to; Edit rule builds the formula from the parameter and operator
   tokens and checks it; the time period is chosen; Save as new version asks for the effective date and adds the
   version to the history; Duplicate copies the rule to another brand. */
(function () {
const {useState} = React;
const TOKENS = ['PO', 'MRN', 'STN Pending', 'In-Transit', 'STN In', 'STN Out', 'Company Back Order'];
const OPS = ['+', '-', 'x', '/', '(', ')'];
const START = {main: ['Pending PO', '+', 'Pending In-Transit', '+', 'Pending STN receipts'], po: ['PO', '-', 'MRN', '-', 'STN Pending'],
               second: ['Company Back Order', '+', 'In-Transit', '+', 'STN Out', '-', 'STN In'], days: '90 days', by: 'Order date'};
const HIST = [{v: 'v7', who: 'Neha G.', when: '05-11-2026 09:40', eff: '06-11-2026', what: 'Pending PO age limit 20 to 15 days'},
              {v: 'v6', who: 'Neha G.', when: '21-10-2026 12:10', eff: '22-10-2026', what: 'Secondary rule added'},
              {v: 'v5', who: 'Rahul S.', when: '02-10-2026 15:32', eff: '03-10-2026', what: 'Time period 60 to 90 days'}];
function check(t) {                                   // operands and operators alternate, brackets balance
  let depth = 0, want = 'operand';
  for (const x of t) {
    if (x === '(') { if (want !== 'operand') return 'An operator is needed before "("'; depth++; continue; }
    if (x === ')') { if (want === 'operand') return 'A parameter is needed before ")"'; if (--depth < 0) return 'A ")" has no "("'; continue; }
    const op = OPS.includes(x);
    if (op && want === 'operand') return `"${x}" needs a parameter before it`;
    if (!op && want === 'operator') return `An operator is needed before "${x}"`;
    want = op ? 'operand' : 'operator';
  }
  if (!t.length) return 'The rule is empty';
  if (want === 'operand') return 'The rule ends with an operator';
  if (depth) return 'A "(" is not closed';
  return '';
}
function Screen() {
  const {size} = useWF();
  const [rule, setRule] = useStore('ooq-rule', START);
  const [hist, setHist] = useStore('ooq-versions', HIST);
  const [scope, setScope] = useState(null);
  const [edit, setEdit] = useState(null); const [msg, setMsg] = useState('');
  const [open, setOpen] = useState(false);
  const cur = hist[0];
  const save = async () => {
    if (edit) { const e = check(edit); if (e) { setMsg(e); return wfToast('bad', 'The Pending PO rule is not complete: ' + e); } }
    const tomorrow = new Date(Date.now() + 864e5).toISOString().slice(0, 10);
    const eff = await wfConfirm({title: 'Save as a new version', ok: 'Save version', input: {label: 'Effective from', type: 'date', value: tomorrow},
      body: `The current version ${cur.v} stays in the history; order runs from the effective date use the new one. Applies to: ${scope ? (scope.level === 'Brand' ? scope.brand : scope.level === 'Dealer' ? scope.dealer : scope.location) : 'Mahindra'}.`});
    if (!eff) return;
    const v = 'v' + (+cur.v.slice(1) + 1); const now = new Date();
    if (edit) setRule({...rule, po: edit});
    setHist([{v, who: 'Neha G.', when: now.toLocaleDateString('en-GB').replace(/\//g, '-') + ' ' + now.toTimeString().slice(0, 5), eff: eff.split('-').reverse().join('-'),
      what: edit ? 'Pending PO rule changed' : `Time period ${rule.days} by ${rule.by.toLowerCase()}`}].concat(hist));
    setEdit(null); setMsg('');
    wfToast('ok', `Saved as ${v}, effective from ${eff.split('-').reverse().join('-')}`);
  };
  const dup = async () => {
    const b = await wfConfirm({title: 'Duplicate this rule', body: 'The copy is saved as version v1 of the other brand, ready to edit.', ok: 'Duplicate', input: {label: 'Copy to brand (Tata or JCB)', value: 'Tata'}});
    if (b) wfToast('ok', `OOQ rule copied to ${b} as v1 (sample)`);
  };
  const F = (t) => t.join(' ');
  return <AppShell active="WF-12" title="OOQ rules" subtitle="How 'already on order' is worked out - built from the brand's parameters"
    actions={<><OAct icon="copy" onClick={dup}>Duplicate</OAct><OAct primary icon="check" onClick={save}>Save as new version</OAct></>}>
    <OVersion v={cur.v} who={cur.who} when={cur.when} eff={cur.eff} mark={<Mark n={6}/>} onHistory={() => setOpen(true)}/>
    <ORuleScope applies="Mahindra - 146 dealers (5 with their own rule)" mark={<Mark n={1}/>} onChange={setScope}/>
    <Panel title={<span>Rule <Mark n={2}/></span>} sub="Each term is itself a rule over the uploaded parameters"
      right={edit ? <><OAct small onClick={() => { setEdit(null); setMsg(''); }}>Cancel</OAct><OAct small icon="check-check" onClick={() => { const e = check(edit); setMsg(e || 'ok'); }}>Check rule</OAct></> :
        <OAct small icon="pencil" onClick={() => setEdit(rule.po.slice())}>Edit Pending PO</OAct>}>
      <OFormula>OOQ = {F(rule.main)}</OFormula>
      <div style={{display: 'grid', gridTemplateColumns: size === 'mobile' ? '1fr' : '1fr 1fr', gap: 12, marginTop: 12}}>
        <Ask id="CQ-32"><div><div style={{fontSize: 13, color: 'var(--wf-muted)', marginBottom: 4}}>Pending PO<Mark n={3} open/>{edit && ' - editing'}</div>
          <OFormula>{edit ? (edit.length ? F(edit) : <span style={{color: 'var(--wf-muted)'}}>Click the parameters and operators below</span>) : F(rule.po)}</OFormula>
          {edit && msg && <div style={{fontSize: 13, marginTop: 6, color: msg === 'ok' ? 'var(--wf-ok)' : 'var(--wf-bad)'}}>{msg === 'ok' ? 'The rule is complete.' : msg}</div>}</div></Ask>
        <div><div style={{fontSize: 13, color: 'var(--wf-muted)', marginBottom: 4}}>Secondary rule</div><OFormula>{F(rule.second)}</OFormula></div></div>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12, alignItems: 'center'}}>
        {TOKENS.concat(OPS).map(t => <button key={t} type="button" className="wf-mono" disabled={!edit} title={edit ? 'Add to the Pending PO rule' : 'Choose Edit Pending PO first'}
          onClick={() => { setEdit(edit.concat([t])); setMsg(''); }}
          style={{padding: '5px 10px', border: '1px solid ' + (edit ? 'var(--wf-accent)' : 'var(--wf-border-strong)'), fontSize: 13, background: edit ? 'var(--wf-accent-tint)' : 'var(--wf-surface)',
            cursor: edit ? 'pointer' : 'default', color: 'var(--wf-ink)'}}>{t}</button>)}
        {edit && <><OAct small icon="delete" onClick={() => { setEdit(edit.slice(0, -1)); setMsg(''); }}>Remove last</OAct><OAct small onClick={() => { setEdit([]); setMsg(''); }}>Clear</OAct></>}<Mark n={4}/></div></Panel>
    <Ask id="CQ-33"><Panel title={<span>Time period <Mark n={5} open/></span>}><div style={{display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', fontSize: 14}}>Count only orders from the last
      <Select value={rule.days} options={['30 days', '60 days', '90 days', '180 days']} onChange={v => setRule({...rule, days: v})} style={{minWidth: 120}}/> by
      <Select value={rule.by} options={['Order date', 'PO date', 'Invoice date']} onChange={v => setRule({...rule, by: v})} style={{minWidth: 140}}/></div></Panel></Ask>
    <Note>OOQ is worked out per part number at each location; the exceptions (one location ordering for its branches, linked locations) are rules on the next screens -
      <a href="#" data-wf-nav="1" onClick={e => { e.preventDefault(); WFGo('WF-13'); }} style={{color: 'var(--wf-heading)', marginLeft: 4}}>Inter-Location OOQ</a></Note>
    <Drawer open={open} onClose={() => setOpen(false)} title="Version history - OOQ rule" sub="Every change is kept with who saved it and when it takes effect">
      {hist.map((h, i) => <div key={h.v} style={{padding: '10px 0', borderBottom: '1px solid var(--wf-border-soft)'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', gap: 10}}><b className="wf-mono" style={{color: 'var(--wf-heading)'}}>{h.v}</b>{i === 0 && <window.Pill tone="ok">Current</window.Pill>}</div>
        <div style={{fontSize: 14, marginTop: 4}}>{h.what}</div>
        <div style={{fontSize: 12.5, color: 'var(--wf-muted)', marginTop: 2}}>saved by {h.who} · {h.when} · effective from {h.eff}</div></div>)}</Drawer>
  </AppShell>;
}
WFScreen('WF-12', Screen);
})();
