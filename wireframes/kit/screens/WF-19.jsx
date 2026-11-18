/* WF-19 Excess at Child Locations - Admin. FR-018.1-018.6. */
(function () {
function Screen() {
  return <AppShell active="WF-19" title="Excess at child locations" subtitle="Spare stock at a child lowers the mother's order" actions={<OAct primary icon="check">Save</OAct>}>
    <ORuleScope level="Location" applies="STAR GROUP · Sagar-MP (mother)" bulk={false}/>
    <Panel title={<span>Excess at a child <Mark n={1}/></span>}><OFormula>Excess = Free stock - MAX - buffer</OFormula>
      <div style={{display: 'flex', gap: 10, alignItems: 'center', marginTop: 10, fontSize: 14}}>Buffer kept at the child<Select value="15" style={{minWidth: 80}}/>days of stock</div></Panel>
    <Panel title={<span>Transfer back to the mother <Mark n={2}/></span>}><OSeg options={['Yes', 'No']} value="No"/>
      <div style={{fontSize: 13.5, color: 'var(--wf-muted)', marginTop: 8}}>Yes - the mother's SOQ is reduced by the excess and the transfer follows the internal-transfer settings.<Mark n={3}/></div></Panel>
    <Ask id="CQ-40"><OConds title="When transfer back is No - still adjust" mark={<Mark n={4} open/>} sub="By part price and stock quality"
      rows={[['PART_PRICE', '>', 'Rs 1,00,000', 'Transfer'], ['PART_PRICE', 'between', 'Rs 5,000 - 50,000', 'Reduce SOQ, transfer when needed'], ['STOCK_QUALITY', '=', 'Non-moving', 'Transfer']]}/></Ask>
    <Note>When excess goes to several locations in one run, stock allocated earlier in the run is taken off first.<Mark n={5}/></Note>
  </AppShell>;
}
WFScreen('WF-19', Screen);
})();
