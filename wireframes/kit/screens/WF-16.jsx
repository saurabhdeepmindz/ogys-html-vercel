/* WF-16 SOQ Formula - Admin. FR-006.1-006.4. */
(function () {
function Screen() {
  return <AppShell active="WF-16" title="SOQ formula" subtitle="The suggested order quantity, per part, per location" actions={<OAct primary icon="check">Save as new version</OAct>}>
    <OVersion v="v3" eff="01-11-2026"/>
    <ORuleScope applies="Mahindra - all dealers"/>
    <Panel title={<span>Formula <Mark n={1}/></span>}><OFormula>SOQ = MAX - Current Stock - OOQ + CBO</OFormula>
      <div style={{fontSize: 13.5, color: 'var(--wf-muted)', marginTop: 8}}>OOQ comes from the OOQ rule of the location. A term the brand does not supply is left out.<Mark n={2}/></div></Panel>
    <Panel title={<span>Terms resolved for Mahindra <Mark n={3}/></span>} pad={false}><DataTable cardTitle="t" columns={[{key: 't', label: 'Term'}, {key: 'p', label: 'From parameter', mono: true}, {key: 's', label: 'Status'}]}
      rows={[['MAX', 'MAX (dealer MAX file)', 1], ['Current Stock', 'CLOSE_QTY', 1], ['OOQ', 'OOQ rule v7', 1], ['CBO', 'CBO (considered: No)', 0]].map((r, i) => ({key: i, t: r[0], p: r[1], s: r[2] ? <window.Pill tone="ok">Used</window.Pill> : <window.Pill tone="neutral">Off</window.Pill>}))}/></Panel>
    <Ask id="CQ-37"><Note>When SOQ is zero or negative, no order line is suggested for the part.<Mark n={4} open/></Note></Ask>
    <Panel title="Worked example"><OFormula>MAX 20 - stock 6 - OOQ 5 + CBO 3 = 12 to order</OFormula></Panel>
  </AppShell>;
}
WFScreen('WF-16', Screen);
})();
