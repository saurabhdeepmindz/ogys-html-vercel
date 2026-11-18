/* WF-23 MOQ Rules & SOQ Validation - Admin (reference FRD - not discussed). FR-032.1, FR-032.2. */
(function () {
function Screen() {
  return <AppShell active="WF-23" title="MOQ rules and SOQ validation" subtitle="From the reference document - not discussed in the sessions" actions={<OAct primary icon="check">Save</OAct>}>
    <Ask id="CQ-44"><Note tone="warn">These settings come from the reference document and were never discussed. Confirm they are wanted before build.<Mark n={1} open/></Note></Ask>
    <OConds title="MOQ - after internal transfer and gainer" mark={<Mark n={2}/>} sub="Per location" rows={[['PART_PRICE', '<', 'Rs 500', 'Round up to MOQ'], ['TDOS', '>', '60 days', 'Keep below MOQ'], ['ORDER_VALUE', '>', 'Rs 5 lakh', 'Consider at group level']]}/>
    <Panel title={<span>Part-level SOQ validation <Mark n={3}/></span>}><OFormula>Variance % = (last stock + last OOQ + last order - current stock - current OOQ) vs average consumption</OFormula>
      <div style={{display: 'flex', gap: 10, alignItems: 'center', marginTop: 10, fontSize: 14}}>Flag a line above<Select value="40 %" style={{minWidth: 90}}/></div></Panel>
  </AppShell>;
}
WFScreen('WF-23', Screen);
})();
