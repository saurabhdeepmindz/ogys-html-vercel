/* WF-14 Same-Dealer Excess Linkage - Admin. FR-009.1-009.9. */
(function () {
function Screen() {
  const {size} = useWF();
  return <AppShell active="WF-14" title="Linked locations for a part family" subtitle="One location orders a family for both; the other's excess counts in its OOQ" actions={<OAct primary icon="check">Save linkage</OAct>}>
    <Panel title={<span>Linkage <Mark n={1}/></span>}><div style={{display: 'grid', gridTemplateColumns: size === 'desktop' ? 'repeat(4,1fr)' : '1fr 1fr', gap: 12}}>
      <Select label="Dealer" value="Punjab Motors"/><Select label="Part family" value="EV parts"/><Select label="Orders for both" value="Ludhiana (L)"/><Select label="Does not order the family" value="Ludhiana Bodyshop (LB)"/></div>
      <div style={{marginTop: 12}}><OUpload label="Parts of the family (optional list)" file="EV_parts_L_LB.xlsx" note="212 parts"/></div><Mark n={2}/></Panel>
    <Panel title={<span>What changes for the family <Mark n={3}/></span>}>
      <OFormula>OOQ EV (L) = PPO EV (L) + POIT EV (L) + EV Excess (LB)<br/>EV Excess (LB) = CS EV (LB) - MAX EV (LB) - Norm</OFormula>
      <div style={{marginTop: 10}}><OFormula>SOQ EV (L) = MAX (L) + MAX (LB) - CS (L) - CS (LB) - OOQ (L) + CBO (L) + CBO (LB)</OFormula></div>
      <div style={{fontSize: 13.5, color: 'var(--wf-muted)', marginTop: 8}}>LB's own SOQ for the family is nil. Parts outside the family: each location on its own.<Mark n={4}/></div></Panel>
    <Ask id="CQ-35"><Panel title={<span>Norm (buffer kept at LB) <Mark n={5} open/></span>}><div style={{display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', fontSize: 14}}>
      <Select value="7" style={{minWidth: 80}}/><Select value="days of average sales" style={{minWidth: 200}}/><span style={{color: 'var(--wf-muted)'}}>default 0</span></div></Panel></Ask>
  </AppShell>;
}
WFScreen('WF-14', Screen);
})();
