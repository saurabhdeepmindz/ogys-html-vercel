/* WF-04 My Locations Dashboard - sales and operations teams (FS / BDM / ZBDM, OC / BM). FR-027.7, FR-028.2, FR-029.1-029.2,
   FR-014.3, FR-026.5 - assembled, the screens of these roles were not discussed (assumed). */
(function () {
function Screen({role}) {
  const {size} = useWF();
  return <AppShell active="WF-04" title="My locations" subtitle={(role === 'A4' ? 'Operations (OC / BM)' : 'Sales (FS / BDM / ZBDM)') + ' · Central zone · 18 locations'}
    actions={<OAct icon="download">Export</OAct>}>
    <Note>You see only the brands, dealers and locations assigned to you.<Mark n={1}/></Note>
    <Stats items={[{label: 'Scheduled this week', value: 42, mark: <Mark n={2}/>}, {label: 'Generated', value: 30, tone: 'ok'}, {label: 'Pending', value: 12, tone: 'warn'},
      {label: 'Not on time', value: 4, tone: 'bad', mark: <Mark n={3}/>}]}/>
    <div style={{display: 'grid', gridTemplateColumns: size === 'desktop' ? '1fr 1fr' : '1fr', gap: 16}}>
      <Panel title={<span>Waiting for data <Mark n={4}/></span>} pad={false}><DataTable cardTitle="l" columns={[{key: 'l', label: 'Location'}, {key: 'f', label: 'Missing file'}, {key: 's', label: 'Since'}]}
        rows={[{key: 1, l: 'STAR GROUP · Vidisha-MP', f: 'DLR receipt data', s: 'Today'}, {key: 2, l: 'Prakash Auto · Indore-MP', f: 'Pending PO', s: '3 Nov'}]}/></Panel>
      <Panel title={<span>Order feedback not done <Mark n={5}/></span>} pad={false}><DataTable cardTitle="o" columns={[{key: 'o', label: 'Order', mono: true}, {key: 'l', label: 'Location'}, {key: 'd', label: 'Sent on'}]}
        rows={[{key: 1, o: 'ORD-26-04761', l: 'Vikas Wheels · Gwalior-MP', d: '01-11'}, {key: 2, o: 'ORD-26-04744', l: 'STAR GROUP · Satna-MP', d: '31-10'}]}/></Panel></div>
    <Ask id="CQ-13"><Panel title="Timeliness by location" sub="Orders done on time this month (next stage - Monitoring)"><div style={{display: 'grid', gap: 8}}>
      {[['Sagar-MP', 100], ['Satna-MP', 92], ['Gwalior-MP', 75], ['Indore-MP', 61]].map(([l, p]) => <div key={l} style={{display: 'grid', gridTemplateColumns: '120px 1fr 44px', gap: 10, alignItems: 'center', fontSize: 14}}>
        <span>{l}</span><span style={{height: 10, background: 'var(--wf-sunken)'}}><span style={{display: 'block', height: 10, width: p + '%', background: p < 80 ? 'var(--wf-warn)' : 'var(--wf-ok)'}}/></span><span className="wf-mono">{p}%</span></div>)}</div></Panel></Ask>
  </AppShell>;
}
WFScreen('WF-04', Screen);
})();
