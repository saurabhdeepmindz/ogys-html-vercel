/* WF-18 CBO & Pending Transfers - Admin. FR-016.1-016.4, FR-017.1-017.5. */
(function () {
function Screen() {
  const {size} = useWF();
  return <AppShell active="WF-18" title="CBO and pending transfers" subtitle="Which customer back orders and child needs the order counts" actions={<OAct primary icon="check">Save</OAct>}>
    <ORuleScope level="Location" applies="STAR GROUP · Sagar-MP (CBO rules are set per location)" bulk={false} mark={<Mark n={4}/>}/>
    <Panel title={<span>Consider CBO <Mark n={1}/></span>}><div style={{display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center'}}><OSeg options={['Yes', 'No']} value="Yes"/><span style={{fontSize: 13.5, color: 'var(--wf-muted)'}}>Default No</span></div></Panel>
    <OConds title="Count a back order when" mark={<Mark n={2}/>} sub="From the dealer's CBO data and MAX" rows={[['PARTY_TYPE', 'IN', 'Retail, Workshop'], ['ORDER_DAYS_OLD', '<=', '30'], ['PART_PRICE', '>=', 'Rs 2,000'], ['STOCKABLE', '=', 'Yes']]}/>
    <Panel title={<span>Only these parts or parties <Mark n={3}/></span>}><div style={{display: 'grid', gridTemplateColumns: size === 'mobile' ? '1fr' : '1fr 1fr', gap: 12}}><OUpload label="Part list" note="optional"/><OUpload label="Party list (distributors)" note="optional"/></div></Panel>
    <Panel title={<span>Child locations <Mark n={5}/></span>} sub="The mother orders for its children's pending indents and under-stocking">
      <div style={{display: 'grid', gap: 12}}><OSwitch on label="Count child pending indents as CBO"/>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', fontSize: 14}}>Pending ITO list available<OSeg options={['Yes', 'No']} value="No"/></div>
        <Ask id="CQ-39"><div style={{display: 'grid', gap: 8}}><b style={{fontSize: 14}}>Without a pending ITO list<Mark n={6} open/></b>
          {[['A', 'Generate SOQ directly'], ['B', 'First the transfers to the children, then SOQ on the balance stock']].map(([k, t]) => <label key={k} style={{display: 'flex', gap: 10, alignItems: 'center', fontSize: 14}}>
            <span style={{width: 18, height: 18, borderRadius: '50%', border: '2px solid var(--wf-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}>{k === 'B' && <i style={{width: 8, height: 8, borderRadius: '50%', background: 'var(--wf-primary)'}}/>}</span><b>{k}</b> {t}</label>)}</div></Ask></div></Panel>
  </AppShell>;
}
WFScreen('WF-18', Screen);
})();
