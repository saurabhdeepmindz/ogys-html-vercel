/* WF-15 Cancellable OOQ - Admin. FR-010.1-010.6. */
(function () {
function Screen() {
  return <AppShell active="WF-15" title="Cancellable OOQ" subtitle="Pending company orders the company will not supply - left out of OOQ" actions={<OAct primary icon="check">Save</OAct>}>
    <ORuleScope applies="Mahindra - all dealers" mark={<Mark n={1}/>}/>
    <OConds title="Leave a pending order out of OOQ when" mark={<Mark n={2}/>} sub="Any condition true - the order is not counted"
      rows={[['ORDER_AGE_DAYS', '>', '15 days (general guideline)', 'Not counted'], ['ORDER_TYPE', 'IN', 'Recall campaign', 'Not counted'], ['ORDER_STATUS', '=', 'Cancelled by OEM', 'Not counted']]}/>
    <Note>Conditions are built from the brand's parameters, so a brand-specific case can be added without a change to the system.<Mark n={3}/></Note>
    <Ask id="CQ-36"><Panel title={<span>More conditions in the workbook <Mark n={4} open/></span>} sub="Listed, not discussed - available but switched off">
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 10}}>{['Price', 'Excess days', 'Non-stockable with no open job line', 'Job card', 'CBO'].map(c => <span key={c} style={{display: 'inline-flex', gap: 6, alignItems: 'center', padding: '6px 10px', border: '1px dashed var(--wf-border-strong)', fontSize: 13.5}}><Check on={false}/>{c}</span>)}</div></Panel></Ask>
  </AppShell>;
}
WFScreen('WF-15', Screen);
})();
