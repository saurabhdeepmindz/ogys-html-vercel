/* WF-52 Monitoring Dashboard - next stage. Admin full; order team, sales and operations view their scope. FR-029.1-029.3. */
(function () {
function Screen({role}) {
  const {size} = useWF(); const two = size === 'desktop';
  const scope = role === 'A1' ? 'All brands' : role === 'A2' ? 'My dealers' : 'My locations';
  return <AppShell active="WF-52" title="Monitoring" subtitle={'Next stage · ' + scope + ' · this month'} actions={<><Select value="This month" style={{minWidth: 140}}/><OAct icon="download">One Pager</OAct><Mark n={5} open/></>}>
    <Ask id="CQ-54"><Stats items={[{label: 'Scheduled', value: 612, mark: <Mark n={1}/>}, {label: 'Generated', value: 571, tone: 'ok'}, {label: 'Pending', value: 41, tone: 'warn'}, {label: 'On time', value: '88%', tone: 'ok', mark: <Mark n={3}/>}]}/></Ask>
    <div style={{display: 'grid', gridTemplateColumns: two ? '1.3fr 1fr' : '1fr', gap: 16}}>
      <Panel title={<span>By level <Mark n={2}/></span>} right={<window.Tabs value="brand" tabs={[{id: 'brand', label: 'Brand'}, {id: 'team', label: 'Team'}, {id: 'person', label: 'Person'}]}/>} pad={false}>
        <DataTable cardTitle="b" columns={[{key: 'b', label: 'Brand'}, {key: 's', label: 'Scheduled', align: 'right'}, {key: 'g', label: 'Generated', align: 'right'}, {key: 'p', label: 'Pending', align: 'right'}, {key: 't', label: 'On time', align: 'right'}]}
          rows={[['Mahindra', 318, 301, 17, '91%'], ['Tata', 204, 190, 14, '86%'], ['JCB', 90, 80, 10, '79%']].map((r, i) => ({key: i, b: r[0], s: r[1], g: r[2], p: r[3], t: r[4]}))}/></Panel>
      <Panel title={<span>Trend <Mark n={4}/></span>}><div style={{display: 'flex', alignItems: 'flex-end', gap: 10, height: 140}}>
        {[70, 82, 78, 88, 91, 86, 88].map((v, i) => <div key={i} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}><div style={{width: '100%', height: v * 1.3, background: v < 80 ? 'var(--wf-warn)' : 'var(--wf-accent)'}}/><span style={{fontSize: 11, color: 'var(--wf-muted)'}}>W{i + 1}</span></div>)}</div>
        <div style={{fontSize: 12.5, color: 'var(--wf-muted)', marginTop: 6}}>Orders done on time, by week</div></Panel></div>
    <Panel pad={false} title={<span>Data not arriving on time <Mark n={3}/></span>}><DataTable cardTitle="l" columns={[{key: 'l', label: 'Dealer · location'}, {key: 'f', label: 'File'}, {key: 'late', label: 'Late on', align: 'right'}, {key: 'd', label: 'Orders delayed', align: 'right'}]}
      rows={[['Prakash Auto · Indore-MP', 'Pending PO', '4 of 4 days', 4], ['Vikas Wheels · Gwalior-MP', 'Current stock', '2 of 4 days', 2]].map((r, i) => ({key: i, l: r[0], f: r[1], late: r[2], d: r[3]}))}/></Panel>
  </AppShell>;
}
WFScreen('WF-52', Screen);
})();
