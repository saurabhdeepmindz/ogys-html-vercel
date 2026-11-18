/* WF-39 Download Order - Dealer SPM. FR-021.2, 021.3, 021.5. */
(function () {
function Screen() {
  return <AppShell active="WF-39" title="Download order" subtitle="ORD-26-04812 · Sagar-MP - the same file as sent by e-mail">
    <Panel title={<span>Order file <Mark n={1}/></span>}>
      {[['Order to OEM', 'Place this on the company - editable and non-editable lines'], ['Pending from OEM', 'For reference: you may cancel excess pending orders'], ['Internal transfer', 'Lines to receive from your branches'], ['Sheet explanation', 'What each column means']].map((r, i) =>
        <div key={i} style={{display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 0', borderTop: i ? '1px solid var(--wf-border-soft)' : 'none'}}><Ic name="sheet" size={18} color="var(--wf-heading)" style={{marginTop: 2}}/>
          <div><b>{r[0]}</b>{i === 1 && <Mark n={2}/>}<div style={{fontSize: 13.5, color: 'var(--wf-muted)'}}>{r[1]}</div></div></div>)}
      <div style={{marginTop: 12}}><OAct primary icon="download">Download Excel (4 sheets)</OAct></div></Panel>
    <Note>Before placing the order on the company, check it against the gainer list.<Mark n={3}/></Note>
  </AppShell>;
}
WFScreen('WF-39', Screen);
})();
