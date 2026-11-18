/* WF-13 Inter-Location OOQ (Exception) - Admin. FR-007.1-007.7, FR-008.1-008.3. */
(function () {
function Screen() {
  const {size} = useWF();
  return <AppShell active="WF-13" title="Inter-location OOQ (exception)" subtitle="One location orders from the company for its branches - OOQ is counted per branch" actions={<OAct primary icon="check">Save exception</OAct>}>
    <Note>An exception inside the OOQ rules of the dealer - no separate settings area.<Mark n={1}/></Note>
    <ORuleScope level="Dealer" applies="STAR GROUP" bulk={false}/>
    <div style={{display: 'grid', gridTemplateColumns: size === 'desktop' ? '1fr 1fr' : '1fr', gap: 16}}>
      <Panel title={<span>Ordering location and its branches <Mark n={2}/></span>}>
        <Select label="Places company orders" value="Sagar-MP (X)"/>
        <div style={{marginTop: 12, display: 'grid', gap: 6}}>{['Satna-MP', 'Vidisha-MP', 'Damoh-MP'].map(b => <div key={b} style={{display: 'flex', gap: 8, alignItems: 'center', fontSize: 14}}><Check on/>{b}</div>)}</div>
        <div style={{fontSize: 13, color: 'var(--wf-muted)', marginTop: 10}}>X places a separate company order for each branch; OGYS gives each its own Sparecare order number.<Mark n={3}/></div></Panel>
      <Panel title={<span>How OOQ is counted <Mark n={4}/></span>}>
        <KV cols={1} pairs={[['General case', 'Distinct by part number'], ['This exception', 'Distinct by part number and location - the location from the PO number']]}/></Panel></div>
    <Ask id="CQ-34"><Panel title={<span>PO to branch map <Mark n={5}/></span>} sub="Filled from the company PO file (WF-36); pending POs are attributed through it" pad={false}>
      <DataTable cardTitle="s" columns={[{key: 's', label: 'Sparecare order', mono: true}, {key: 'po', label: 'Company PO', mono: true}, {key: 'b', label: 'Branch'}]}
        rows={[['ORD-AA', 'POA', 'Satna-MP'], ['ORD-AB', 'POB', 'Vidisha-MP'], ['ORD-AC', 'POC', 'Damoh-MP'], ['-', 'POX', <span style={{color: 'var(--wf-warn-fg)', fontWeight: 600}}>Not matched - flagged</span>]].map((r, i) => ({key: i, s: r[0], po: r[1], b: r[2]}))}/></Panel></Ask>
  </AppShell>;
}
WFScreen('WF-13', Screen);
})();
