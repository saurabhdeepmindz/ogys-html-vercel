/* WF-26 ITO Allocation Settings - Admin (reference FRD - not discussed). FR-031.1-031.7. */
(function () {
function Screen() {
  return <AppShell active="WF-26" title="ITO allocation" subtitle="Sharing the mother's stock among children when it is short - from the reference document" actions={<OAct primary icon="check">Save</OAct>}>
    <Ask id="CQ-47"><Note tone="warn">From the reference document; not discussed in the sessions. Further ITO settings are left blank there for the client to define.<Mark n={1} open/></Note></Ask>
    <ORuleScope level="Dealer" applies="STAR GROUP" bulk={false}/>
    <Panel title="Allocation"><div style={{display: 'grid', gap: 12, fontSize: 14}}>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center'}}>Mother keeps at least<Select value="OC + LT days" style={{minWidth: 150}}/><Mark n={2}/></div>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center'}}>Fill each child up to<OSeg options={['MAX', 'Stock days']} value="MAX"/><Select value="30 days" style={{minWidth: 100}}/><Mark n={3}/></div>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center'}}>When the mother is very low, fill<Select value="Highest average consumption first" style={{minWidth: 260}}/><Mark n={4}/></div></div></Panel>
    <Panel pad={false} title={<span>Child priority <Mark n={5}/></span>}><DataTable cardTitle="l" columns={[{key: 'p', label: 'Priority', align: 'center'}, {key: 'l', label: 'Location'}, {key: 't', label: 'Type'}]}
      rows={[[1, 'Satna-MP', 'Own branch'], [2, 'Vidisha-MP', 'Own branch'], [3, 'Katni Auto (partner)', 'Third party']].map((r, i) => ({key: i, p: r[0], l: r[1], t: r[2]}))}/></Panel>
  </AppShell>;
}
WFScreen('WF-26', Screen);
})();
