/* WF-44 Dealer Contact Management - Admin. FR-027.4, 027.5. */
(function () {
function Screen() {
  const {size} = useWF();
  const levels = ['DP', 'CEO', 'VP (Service / Operations / Spares)', 'GM', 'WM', 'SPM', 'SPE'];
  return <AppShell active="WF-44" title="Dealer contacts" subtitle="STAR GROUP · contacts at dealer and location level" actions={<OAct primary icon="user-plus">Add contact</OAct>}>
    <FilterBar filters={[{label: 'Dealer', value: 'STAR GROUP'}, {label: <span>Level<Mark n={1}/></span>, value: 'Dealer and locations'}]}/>
    <div style={{display: 'grid', gridTemplateColumns: size === 'desktop' ? '1.6fr 1fr' : '1fr', gap: 16, alignItems: 'start'}}>
      <Panel pad={false} title={<span>Contacts <Mark n={2}/></span>}><Ask id="CQ-28"><DataTable cardTitle="n" columns={[{key: 'n', label: 'Name'}, {key: 'd', label: 'Designation'}, {key: 'l', label: 'Level'}, {key: 'mob', label: 'Mobile', mono: true, hide: 'tablet'}, {key: 'v', label: 'Verified'}, {key: 'lg', label: <span>Signs in<Mark n={5} open/></span>}]}
        rows={[['R. K. Jain', 'CEO', 'Dealer', '98270 10021', 1, 0], ['Sanjay Rai', 'Service GM', 'Dealer', '98260 41300', 1, 0], ['Manoj Patel', 'SPM', 'Sagar-MP', '98260 41377', 1, 1], ['Deepak S.', 'SPM', 'Satna-MP', '97550 21876', 0, 1], ['Anil T.', 'WM', 'Sagar-MP', '94250 66231', 1, 0]]
          .map((c, i) => ({key: i, n: c[0], d: c[1], l: c[2], mob: c[3], v: c[4] ? <window.Pill tone="ok">Mail · mobile</window.Pill> : <window.Pill tone="warn">Mobile pending</window.Pill>, lg: c[5] ? 'Yes' : '-'}))}/></Ask></Panel>
      <div>
        <Panel title={<span>Hierarchy <Mark n={3}/></span>}>{levels.map((l, i) => <div key={l} style={{display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', paddingLeft: i * 12, fontSize: 14}}><Ic name={i ? 'corner-down-right' : 'building-2'} size={14} color="var(--wf-muted)"/>{l}</div>)}</Panel>
        <Panel title={<span>Designations <Mark n={4}/></span>}><KV cols={2} pairs={[['SPM', 'Spare parts manager'], ['WM', 'Works manager'], ['GM', 'General manager'], ['CEO', 'Chief executive']]}/></Panel></div></div>
  </AppShell>;
}
WFScreen('WF-44', Screen);
})();
