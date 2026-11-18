/* WF-06 Data Upload Settings (master) - Admin. FR-001.1-001.5. */
(function () {
const {useState} = React;
const TYPES = ['PO', 'Current Stock', 'MRN Done', 'MRN Pending', 'STN In', 'STN Out', 'STN Pending', 'OE Back Order', 'Company Back Order', 'OE In-Transit', 'CBO', 'CBO / Co-Dealer In-Transit', 'Order Feedback'];
function Screen() {
  const {size} = useWF(); const [sel, setSel] = useState('Order Feedback');
  const cols = {'Order Feedback': ['Company PO number', 'Part number', 'Alternate part', 'Placed quantity', 'Sparecare order number'], 'Current Stock': ['Part number', 'Store', 'Opening qty', 'Receipt qty', 'Issue qty', 'Closing qty']}[sel] || ['Part number', 'Quantity', 'Date'];
  return <AppShell active="WF-06" title="Data upload settings" subtitle="The data types each brand uploads, and the columns captured for each" actions={<OAct primary icon="plus">Add data type</OAct>}>
    <Ask id="CQ-23"><FilterBar filters={[{label: <span>Brand<Mark n={1}/></span>, value: 'Mahindra'}, {label: <span>Type<Mark n={2} open/></span>, value: 'Spare Part'}]}/></Ask>
    <div style={{display: 'grid', gridTemplateColumns: size === 'desktop' ? '1.1fr 1fr' : '1fr', gap: 16, alignItems: 'start'}}>
      <Panel pad={false} title={<span>Data types <Mark n={3}/></span>} sub="13 types available"><DataTable cardTitle="t" onRow={r => setSel(r.t)} columns={[{key: 't', label: 'Data type'}, {key: 'c', label: 'Columns', align: 'right'}, {key: 'a', label: 'Used'}]}
        rows={TYPES.map((t, i) => ({key: t, t: t === sel ? <b style={{color: 'var(--wf-heading)'}}>{t}</b> : t, c: [5, 6, 4][i % 3], a: i < 11 ? <window.Pill tone="ok">Active</window.Pill> : <window.Pill tone="neutral">Not used</window.Pill>}))}/></Panel>
      <Panel title={<span>{sel} - columns captured <Mark n={4}/></span>} sub="Mapped to the database through Data Upload Mapping" right={<OAct small icon="plus">Add column</OAct>}>
        {cols.map((c, i) => <div key={c} style={{display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderTop: i ? '1px solid var(--wf-border-soft)' : 'none', fontSize: 14}}>
          <Ic name="grip-vertical" size={15} color="var(--wf-muted)"/><span style={{flex: 1}}>{c}</span><span className="wf-mono" style={{fontSize: 12, color: 'var(--wf-muted)'}}>{c.toUpperCase().replace(/ /g, '_')}</span></div>)}
        <Note>These columns become parameters - the reference set every OOQ and SOQ rule is built from.<Mark n={5}/></Note></Panel></div>
  </AppShell>;
}
WFScreen('WF-06', Screen);
})();
