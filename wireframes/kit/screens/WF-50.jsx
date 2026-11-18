/* WF-50 Sister Location Mapping - Admin (reference FRD - not discussed). FR-030.6-030.9, 030.17. */
(function () {
function Screen() {
  return <AppShell active="WF-50" title="Sister location mapping" subtitle="Which locations plan together, and which is the mother" actions={<OAct primary icon="check">Save mapping</OAct>}>
    <Note tone="warn">From the reference document; not discussed in the sessions.</Note>
    <Panel title={<span>Sister group - MP Central <Mark n={1}/></span>} sub="Locations may belong to dealers with different names">
      <div style={{display: 'grid', gap: 6, fontSize: 14}}>{[[0, 'Main sister: MP Central', ''], [1, 'Sub sister: STAR GROUP', ''], [2, 'Sagar-MP', 'Mother'], [2, 'Satna-MP', 'Child'], [2, 'Vidisha-MP', 'Child'], [1, 'Sub sister: Katni Auto', ''], [2, 'Katni-MP', 'Single']].map((r, i) =>
        <div key={i} style={{display: 'flex', alignItems: 'center', gap: 8, paddingLeft: r[0] * 20}}><Ic name={r[0] < 2 ? 'folder-tree' : 'map-pin'} size={15} color="var(--wf-muted)"/>{r[1]}{r[2] && <window.Pill tone={r[2] === 'Mother' ? 'info' : 'neutral'} dot={false}>{r[2]}</window.Pill>}</div>)}<Mark n={2}/></div></Panel>
    <Ask id="CQ-49"><Panel pad={false} title={<span>Counts toward the sister MAX <Mark n={3}/></span>}><DataTable cardTitle="l" columns={[{key: 'l', label: 'Location'}, {key: 'r', label: 'Role'}, {key: 's', label: 'Stock counted', align: 'center'}, {key: 'o', label: 'OOQ counted', align: 'center'}, {key: 'own', label: <span>Orders on its own<Mark n={4} open/></span>, align: 'center'}]}
      rows={[['Sagar-MP', 'Mother', 1, 1, 1], ['Satna-MP', 'Child', 1, 1, 0], ['Vidisha-MP', 'Child', 1, 0, 0], ['Katni-MP', 'Single', 1, 1, 1]].map((r, i) => ({key: i, l: r[0], r: r[1], s: <Check on={!!r[2]}/>, o: <Check on={!!r[3]}/>, own: <Check on={!!r[4]}/>}))}/></Panel></Ask>
  </AppShell>;
}
WFScreen('WF-50', Screen);
})();
