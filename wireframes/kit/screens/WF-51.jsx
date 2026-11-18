/* WF-51 Sister Order Rules - Admin (reference FRD - not discussed). FR-030.10-030.13, 030.15, 030.16, 030.18-030.26. */
(function () {
function Screen() {
  const {size} = useWF();
  return <AppShell active="WF-51" title="Sister order rules" subtitle="How a sister group plans, checks excess and orders - from the reference document" actions={<OAct primary icon="check">Save</OAct>}>
    <Note tone="warn">From the reference document; not discussed in the sessions. Kept apart from the OGS MAX and stock rules.<Mark n={1}/></Note>
    <ORuleScope applies="MP Central sister group" mark={<Mark n={2}/>}/>
    <Panel title={<span>Planning <Mark n={3}/></span>}><OSeg options={['By location', 'By part list', 'Combined']} value="Combined"/>
      <div style={{fontSize: 13.5, color: 'var(--wf-muted)', marginTop: 8}}>Combined: plans from the location with the highest consumption over the last three months.</div></Panel>
    <Ask id="CQ-50"><Panel title={<span>Excess inside the group <Mark n={4} open/></span>}><OFormula>Excess = stock - MAX - factor</OFormula>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', marginTop: 10, fontSize: 14}}>Factor<Select value="2" style={{minWidth: 70}}/><Select value="units" style={{minWidth: 110}}/>
        <span style={{color: 'var(--wf-muted)'}}>Transfers follow Auto Approval; the rest goes to the OEM; the same stock is never given twice.</span></div></Panel></Ask>
    <Panel title={<span>Order <Mark n={5}/></span>}><OSwitch on label="Club sister parts into the location's normal order (order type recorded)"/></Panel>
  </AppShell>;
}
WFScreen('WF-51', Screen);
})();
