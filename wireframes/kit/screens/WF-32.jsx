/* WF-32 Order Output Format - Admin. FR-021.2, 021.3, 021.5, 021.6. */
(function () {
function Screen() {
  const {size} = useWF(); const two = size === 'desktop';
  const sheets = [['Order to OEM', 1], ['Pending from OEM', 1], ['Internal transfer', 1], ['Sheet explanation', 1], ['Non-AOP TOC order to OEM', 0]];
  const cols = [['Order number', 1], ['Location', 1], ['Part number', 1], ['Description', 1], ['Category', 1], ['Rate', 1], ['Opening stock', 1], ['OOQ', 1], ['Customer orders', 1], ['Suggested qty', 1], ['Order qty', 1], ['Dealer remark', 1], ['Family part', 1], ['TOC qty', 0], ['Average sales', 0], ['N1 / N2 / N3', 0]];
  return <AppShell active="WF-32" title="Order output format" subtitle="Brand layout; the location chooses its sheets and columns per order type" actions={<OAct primary icon="check">Save format</OAct>}>
    <Panel title={<span>Format for <Mark n={1}/></span>}><div style={{display: 'grid', gridTemplateColumns: two ? 'repeat(4,1fr)' : '1fr 1fr', gap: 12}}>
      <Select label="Brand layout" value="Mahindra"/><Select label="Dealer" value="STAR GROUP"/><Select label="Location" value="Sagar-MP"/><Select label={<span>Order type<Mark n={2}/></span>} value="Regular"/></div>
      <div style={{fontSize: 13, color: 'var(--wf-muted)', marginTop: 8}}>Order types: regular · sister · CBO · co-branch</div></Panel>
    <div style={{display: 'grid', gridTemplateColumns: two ? '1fr 2fr' : '1fr', gap: 16, alignItems: 'start'}}>
      <Panel title={<span>Sheets <Mark n={3}/></span>}>{sheets.map(([n, on]) => <div key={n} style={{display: 'flex', gap: 10, alignItems: 'center', padding: '7px 0', fontSize: 14}}><Check on={!!on}/>{n}</div>)}</Panel>
      <Ask id="CQ-51"><Panel title={<span>Order to OEM - columns <Mark n={4} open/></span>} sub="Drag to change the order; optional columns can be switched on for this location">
        <div style={{display: 'grid', gridTemplateColumns: size === 'mobile' ? '1fr' : '1fr 1fr', gap: '4px 18px'}}>{cols.map(([n, on]) => <div key={n} style={{display: 'flex', gap: 10, alignItems: 'center', padding: '5px 0', fontSize: 14, color: on ? 'var(--wf-ink)' : 'var(--wf-muted)'}}><Ic name="grip-vertical" size={14} color="var(--wf-muted)"/><Check on={!!on}/>{n}</div>)}</div></Panel></Ask></div>
    <Panel title={<span>Message with the order <Mark n={5}/></span>}><div style={{fontSize: 14, lineHeight: 1.7, padding: 12, background: 'var(--wf-sunken)'}}>
      Order <b>ORD-26-04812</b> for Sagar-MP is ready - download link. Please check the order against the gainer list before placing it on the company, and review pending company orders - cancel what is no longer needed. Sheet explanation attached.</div></Panel>
  </AppShell>;
}
WFScreen('WF-32', Screen);
})();
