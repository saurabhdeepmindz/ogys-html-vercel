/* WF-21 Ordering Sequence - Admin. FR-020.1-020.3. */
(function () {
function Screen() {
  return <AppShell active="WF-21" title="Ordering sequence" subtitle="Where each line is sourced from, in order" actions={<OAct primary icon="check">Save</OAct>}>
    <ORuleScope applies="Mahindra - all dealers" mark={<Mark n={1}/>}/>
    <Ask id="CQ-42"><Panel title={<span>Sequence <Mark n={2} open/></span>} sub="Drag to change the order">
      {[['1', 'Own branches', 'Internal transfer (ITO)', 'repeat'], ['2', 'Gainer / co-dealer', 'Where the discount is better', 'handshake'], ['3', 'Company (OEM)', 'The remainder', 'factory']].map((r, i) =>
        <div key={i} style={{display: 'flex', alignItems: 'center', gap: 12, padding: 12, border: '1px solid var(--wf-border)', marginBottom: 8, background: 'var(--wf-surface)'}}>
          <Ic name="grip-vertical" size={16} color="var(--wf-muted)"/><span className="wf-mono" style={{width: 24, height: 24, borderRadius: '50%', background: 'var(--wf-primary)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12}}>{r[0]}</span>
          <Ic name={r[3]} size={18} color="var(--wf-heading)"/><div><b>{r[1]}</b><div style={{fontSize: 13, color: 'var(--wf-muted)'}}>{r[2]}</div></div></div>)}</Panel></Ask>
    <Note>Which branches and gainers may supply which parts follows the Auto Approval settings (WF-24, WF-25).<Mark n={3}/></Note>
  </AppShell>;
}
WFScreen('WF-21', Screen);
})();
