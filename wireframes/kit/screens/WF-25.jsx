/* WF-25 Location Specific Rule (buyer side) - Admin. FR-013.1-013.10; S03 today. */
(function () {
function Screen() {
  const {size} = useWF();
  return <AppShell active="WF-25" title="Location specific rule (buyer side)" subtitle="Should this location take the part - from a branch or a gainer?" actions={<><OAct icon="eraser">Clear</OAct><OAct primary icon="check">Submit rule</OAct></>}>
    <Panel title={<span>Rule <Mark n={1}/></span>}><div style={{display: 'grid', gridTemplateColumns: size === 'desktop' ? 'repeat(4,1fr)' : '1fr 1fr', gap: 12}}>
      <Select label="Brand" value="Mahindra"/><Select label="Dealer" value="STAR GROUP"/><Select label="Location" value="Satna-MP"/><Select label="Rule type" value="Gainer"/>
      <Select label={<span>Rule for<Mark n={2}/></span>} value={['Counter Sale', 'Stock']} multi/></div></Panel>
    <Panel title={<span>Build a condition <Mark n={3}/></span>}><div style={{display: 'grid', gridTemplateColumns: size === 'desktop' ? '2fr 1fr 2fr auto' : '1fr', gap: 12, alignItems: 'end'}}>
      <Select label="Parameter (incl. uploaded parameters)" value="FREE_STOCK"/><Select label="Compare operator" value=">"/>
      <label style={{display: 'flex', flexDirection: 'column', gap: 4}}><span style={{fontSize: 12.5, color: 'var(--wf-muted)'}}>Value - number or formula<Mark n={4}/></span><OSeg options={['Number', 'Formula']} value="Number"/></label><OAct icon="plus">Add</OAct></div></Panel>
    <Panel title={<span>Final rule <Mark n={5}/></span>}><OFormula>IF FREE_STOCK &gt; 0 THEN Reject - "Issue From Stock"</OFormula></Panel>
    <Ask id="CQ-46"><OConds title="Conditions" add={false} mark={<Mark n={6}/>} rows={[['FREE_STOCK', '>', '0', 'Reject · Issue From Stock'], ['AVG_SALES_3M', '<', '1', 'Reject · Low Consumption - Take Approval'], ['PART_PRICE', '>=', 'Rs 250', 'Approve']]}/></Ask>
  </AppShell>;
}
WFScreen('WF-25', Screen);
})();
