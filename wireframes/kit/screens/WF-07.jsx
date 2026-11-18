/* WF-07 Data Upload Mapping - Admin. FR-002.1-002.12 (S01 today in Excel). */
(function () {
function Screen() {
  const {size} = useWF(); const two = size === 'desktop';
  const params = [['STOR_NAME', 'Store', true], ['PART_NUM', 'Part number', true], ['OPEN_QTY', '-', false], ['RECPT_QTY', '-', false], ['ISS_QTY', '-', false], ['CLOSE_QTY (derived)', 'Closing quantity', true], ['PART_CAT (from master file)', 'Part category', true]];
  return <AppShell active="WF-07" title="Data upload mapping" subtitle="Mahindra · Current Stock · sample file Jabalpur MP" actions={<><OAct icon="upload">New sample file</OAct><OAct primary icon="check">Save mapping</OAct></>}>
    <div style={{display: 'grid', gridTemplateColumns: two ? '1fr 1fr' : '1fr', gap: 16, alignItems: 'start'}}>
      <Panel pad={false} title={<span>Parameters from the file <Mark n={1}/></span>} sub="Every column becomes a parameter; pick the ones used and link each to the system">
        <DataTable cardTitle="p" columns={[{key: 'u', label: 'Use'}, {key: 'p', label: 'Column', mono: true}, {key: 'to', label: <span>Feeds<Mark n={2}/></span>}]}
          rows={params.map((r, i) => ({key: i, u: <Check on={r[2]}/>, p: r[0], to: r[1]}))}/></Panel>
      <div>
        <Panel title={<span>Stores used <Mark n={3}/></span>} sub="A location with several stores: choose which stores count">
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>{[['JBP WS', 1], ['JBP LMM', 1], ['SPARE', 1], ['GADARWARA STORE', 0], ['UMARIA BRANCH STORE', 0]].map(([n, on]) => <span key={n} style={{display: 'inline-flex', gap: 6, alignItems: 'center', padding: '6px 10px', border: '1px solid var(--wf-border-strong)', fontSize: 13.5}}><Check on={!!on}/>{n}</span>)}</div></Panel>
        <Panel title={<span>Derived column <Mark n={4}/></span>}>
          <div className="wf-mono" style={{padding: 10, background: 'var(--wf-sunken)', fontSize: 14}}>CLOSE_QTY = OPEN_QTY + RECPT_QTY - ISS_QTY</div>
          <div style={{fontSize: 13, color: 'var(--wf-muted)', marginTop: 6}}>Operators + - x / %, number or percentage; compare = != &gt; &lt; &gt;= &lt;= in, not in</div></Panel>
        <Panel title={<span>Condition used as stock input <Mark n={5}/></span>}>
          <div style={{fontSize: 14, lineHeight: 1.7}}><span className="wf-mono">PART_CAT</span> = Spares <b>and</b> <span className="wf-mono">CLOSE_QTY</span> &gt; 0 <b>and</b> <span className="wf-mono">STOR_NAME</span> not in (Umaria Branch Store)</div>
          <div style={{fontSize: 13, color: 'var(--wf-muted)', marginTop: 6}}>Part category matched from the brand master file by part number<Mark n={6}/></div></Panel>
        <Ask id="CQ-24"><Panel title={<span>Applies to <Mark n={7}/></span>}><KV cols={2} pairs={[['Brand', 'Mahindra - all dealers'], ['Dealer exceptions', 'Shivam Motors (SAP export) - own mapping']]}/></Panel></Ask></div></div>
  </AppShell>;
}
WFScreen('WF-07', Screen);
})();
