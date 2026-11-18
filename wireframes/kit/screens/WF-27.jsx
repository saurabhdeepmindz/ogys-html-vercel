/* WF-27 Scheduled Orders List (covers the IA screens "Scheduled Orders List" and "Generate Orders") - FR-023.1-023.5,
   FR-023.12, FR-014.4-014.7. Order team, Full. */
(function () {
const {useState} = React;
function Screen() {
  const {DEALERS} = window.OGYS; const {size} = useWF();
  const [tab, setTab] = useState('today');
  const [sel, setSel] = useState(['d1', 'd2', 'd5']);
  const rows = DEALERS.filter(d => tab === 'today' ? !d.carried : d.carried).map(d => ({
    key: d.key,
    dealer: <span><b style={{color: 'var(--wf-heading)'}}>{d.dealer}</b><div style={{fontSize: 13, color: 'var(--wf-muted)'}}>{d.loc}</div></span>,
    brand: d.brand,
    data: <span style={{fontSize: 13.5}}>{d.data}</span>,
    ready: <span style={{display: 'inline-flex', gap: 8, alignItems: 'center', flexWrap: 'wrap'}}><OState s={d.ready}/><span className="wf-mono" style={{fontSize: 12.5, color: 'var(--wf-muted)'}}>{d.files[0]}/{d.files[1]} files</span></span>,
    sister: d.sister ? 'Yes' : '-',
    due: d.carried ? <span style={{color: 'var(--wf-warn-fg)', fontWeight: 600}}>{d.due}</span> : d.due,
    builder: d.builder, ogs: d.ogs,
    open: <OAct small icon="chevron-right">Open</OAct>,
    title: d.dealer + ' · ' + d.loc, _ready: d.ready}));
  const ready = sel.filter(k => (DEALERS.find(d => d.key === k) || {}).ready === 'ready');
  return <AppShell active="WF-27" title="Today's scheduled orders" subtitle="Thursday 5 November 2026 · 50 scheduled · 6 carried forward"
    actions={<><OAct icon="plus">Non-scheduled order</OAct><Mark n={9}/><OAct primary icon="play">Generate selected ({ready.length})</OAct><Mark n={7}/></>}>
    <Stats items={[{label: 'Scheduled today', value: 50}, {label: 'Ready to generate', value: 31, tone: 'ok', mark: <Mark n={4}/>},
                   {label: 'Waiting for data', value: 15, tone: 'warn'}, {label: 'With exceptions', value: 4, tone: 'bad'}, {label: 'Carried forward', value: 6, tone: 'warn'}]}/>
    <Ask id="CQ-01"><FilterBar count={2} search="Dealer or location" filters={[{label: 'Brand', value: 'Mahindra, Tata', multi: true}, {label: 'Zone', value: 'Central'},
      {label: 'Order builder', value: 'All'}, {label: 'Readiness', value: 'All'}]} /></Ask><Mark n={2}/>
    <Panel pad={false} title={<span>Orders <Mark n={1}/></span>} right={<span style={{fontSize: 13, color: 'var(--wf-muted)'}}>Only ready orders can be selected</span>}>
      <div style={{padding: '4px 16px 0'}}><Tabs value={tab} onChange={setTab} tabs={[{id: 'today', label: "Today's scheduled", count: 50}, {id: 'carried', label: 'Carried forward', count: 6}]}/></div>
      <div style={{padding: '0 8px 8px'}}>
        <DataTable select selected={sel} onSelect={setSel} selectable={r => r._ready === 'ready'} cardTitle="title" rowTone={r => r._ready === 'exception' ? 'warn' : null}
          columns={[{key: 'dealer', label: 'Dealer · location'}, {key: 'brand', label: 'Brand', hide: 'tablet'},
            {key: 'data', label: <span>Data needed<Mark n={3}/></span>, hide: 'tablet', wide: true}, {key: 'ready', label: 'Readiness'},
            {key: 'sister', label: <span>Sister order<Mark n={5}/></span>, align: 'center'}, {key: 'due', label: 'Due'},
            {key: 'builder', label: 'Order builder', hide: 'tablet'}, {key: 'ogs', label: <span>OGS setting<Mark n={6}/></span>, hide: 'tablet'},
            {key: 'open', label: '', align: 'right', hide: 'mobile'}]}
          rows={rows}/></div></Panel>
    <Ask id="CQ-02"><Panel title={<span>Generate {ready.length} selected orders <Mark n={8} open/></span>} sub="Child-location switches come from each dealer's configuration; change them here for this run only.">
      <div style={{display: 'flex', flexWrap: 'wrap', gap: '14px 32px', alignItems: 'center'}}>
        <OSwitch on label="Include stock of child locations"/><OSwitch on label="Include MAX of child locations"/>
        <span style={{fontSize: 13, color: 'var(--wf-muted)'}}>Defaults: STAR GROUP - both on · Prakash Auto - both off</span>
        <span style={{marginLeft: size === 'mobile' ? 0 : 'auto', width: size === 'mobile' ? '100%' : undefined}}><OAct primary icon="play">Generate {ready.length} orders</OAct></span></div></Panel></Ask>
    <Ask id="CQ-03" style={{marginTop: 18}}><Note>Orders not generated on their day stay on the Carried forward tab until they are generated or marked Not Sent.</Note></Ask>
  </AppShell>;
}
WFScreen('WF-27', Screen);
})();
