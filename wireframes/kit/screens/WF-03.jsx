/* WF-03 Order Generation - Today: landing page of the order team. FR-014.4, FR-023.1-023.3, 023.5, 023.6, FR-026.5 (assembled - assumed). */
(function () {
function Screen() {
  const {size} = useWF(); const two = size === 'desktop';
  return <AppShell active="WF-03" title="Good morning, Ritu" subtitle="Order Generation - Today · Thursday 5 November 2026"
    actions={<OAct primary icon="list-checks">Open today's list</OAct>}>
    <Ask id="CQ-12"><Stats items={[{label: 'Scheduled today', value: 50, mark: <Mark n={1}/>}, {label: 'Ready to generate', value: 31, tone: 'ok', mark: <Mark n={2}/>}, {label: 'Carried forward', value: 6, tone: 'warn', mark: <Mark n={3}/>},
      {label: 'Flagged after validation', value: 3, tone: 'bad', mark: <Mark n={4}/>}]}/></Ask>
    <div style={{display: 'grid', gridTemplateColumns: two ? '1.3fr 1fr' : '1fr', gap: 16}}>
      <Panel title="My dealers today" sub="Scheduled for me, with the data each order needs" pad={false}>
        <DataTable cardTitle="d" columns={[{key: 'd', label: 'Dealer · location'}, {key: 'need', label: 'Data expected', hide: 'tablet'}, {key: 'st', label: 'Readiness'}, {key: 's', label: 'Sister', align: 'center'}]}
          rows={window.OGYS.DEALERS.slice(0, 5).map(d => ({key: d.key, d: <span><b>{d.dealer}</b> · {d.loc}</span>, need: d.data, st: <OState s={d.ready}/>, s: d.sister ? 'Yes' : '-'}))}/></Panel>
      <div>
        <Panel title={<span>Needs attention <Mark n={5}/></span>}>
          {[['triangle-alert', 'warn', 'ORD-26-04812 STAR GROUP Sagar-MP flagged: Rs 5.0 lakh vs usual 1.0-1.5 lakh'], ['clock', 'warn', 'Indore-MP carried forward since 3 Nov - waiting for pending PO file'],
            ['git-fork', 'info', '4 dealers also need a sister-location order today'], ['message-square', 'bad', 'Order feedback not done: 5 orders older than 2 days']].map((a, i) =>
            <div key={i} style={{display: 'flex', gap: 10, padding: '9px 0', borderTop: i ? '1px solid var(--wf-border-soft)' : 'none', fontSize: 14}}>
              <Ic name={a[0]} size={16} color={a[1] === 'bad' ? 'var(--wf-bad)' : a[1] === 'warn' ? 'var(--wf-warn)' : 'var(--wf-accent)'} style={{marginTop: 2}}/>{a[2]}</div>)}</Panel>
        <Panel title="Shortcuts"><div style={{display: 'flex', flexWrap: 'wrap', gap: 8}}><OAct small icon="upload">Upload dealer files</OAct><OAct small icon="sliders-horizontal">Adjustments</OAct><OAct small icon="badge-check">Order Day Tracker</OAct></div></Panel></div></div>
  </AppShell>;
}
WFScreen('WF-03', Screen);
})();
