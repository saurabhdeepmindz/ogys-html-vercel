/* WF-22 Editable / Non-Editable Orders - Admin. FR-025.1-025.4. */
(function () {
function Screen() {
  return <AppShell active="WF-22" title="Editable and non-editable orders" subtitle="Split the order so the dealer decides only where judgement is needed" actions={<OAct primary icon="check">Save</OAct>}>
    <ORuleScope applies="Mahindra - STAR GROUP, Shivam Motors" mark={<Mark n={4}/>}/>
    <Panel title={<span>Split the order <Mark n={1}/></span>}><OSeg options={['Two orders', 'One order']} value="Two orders"/>
      <div style={{fontSize: 13.5, color: 'var(--wf-muted)', marginTop: 8}}>Two orders: non-editable (placed as suggested) and editable (the dealer sets the quantity).<Mark n={2}/></div></Panel>
    <Ask id="CQ-43"><OConds title="A line goes to the editable order when" mark={<Mark n={3} open/>} rows={[['CBO_DAYS', '>', '30 days'], ['MOQ_VALUE', '>', 'Rs 25,000'], ['LINE_VALUE', '>', 'Rs 50,000'], ['UNIT_COST', '>', 'Rs 10,000']]}/></Ask>
  </AppShell>;
}
WFScreen('WF-22', Screen);
})();
