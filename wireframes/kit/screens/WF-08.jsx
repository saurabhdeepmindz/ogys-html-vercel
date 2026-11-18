/* WF-08 Upload Validation Rules - Admin. FR-003.1-003.8. */
(function () {
function Screen() {
  const {size} = useWF();
  return <AppShell active="WF-08" title="Upload validation rules" subtitle="What every upload of a data type must contain" actions={<OAct primary icon="check">Save rules</OAct>}>
    <FilterBar filters={[{label: 'Brand', value: 'Mahindra'}, {label: 'Data type', value: 'Current Stock'}]}/>
    <div style={{display: 'grid', gridTemplateColumns: size === 'desktop' ? '1.3fr 1fr' : '1fr', gap: 16, alignItems: 'start'}}>
      <Panel pad={false} title={<span>Required columns (26) <Mark n={1}/></span>} sub="Found by name - position in the file does not matter" right={<OAct small icon="plus">Add column</OAct>}>
        <Ask id="CQ-25"><DataTable cardTitle="c" columns={[{key: 'c', label: 'Column name', mono: true}, {key: 'al', label: <span>Also accepted as<Mark n={2} open/></span>, mono: true}, {key: 'r', label: 'Required'}]}
          rows={[['PART_NUM', 'PART NO, PARTNO'], ['STOR_NAME', 'STORE'], ['OPEN_QTY', '-'], ['RECPT_QTY', 'RECEIPT_QTY'], ['ISS_QTY', 'ISSUE_QTY'], ['MRP', '-']].map((r, i) => ({key: i, c: r[0], al: r[1], r: <window.Pill tone="info">Required</window.Pill>}))}/></Ask></Panel>
      <div>
        <Panel title={<span>Several logins <Mark n={3}/></span>}><OSwitch on label="Combine files from several logins into one"/><div style={{fontSize: 13, color: 'var(--wf-muted)', marginTop: 8}}>Mahindra provides stock through 7 logins - appended one below the other.</div></Panel>
        <Panel title={<span>Location from the file name <Mark n={4}/></span>}><div className="wf-mono" style={{padding: 10, background: 'var(--wf-sunken)', fontSize: 13.5}}>ClosingStock_&#123;Location&#125;_&#123;ddMMyyyy&#125;.xlsx</div>
          <div style={{fontSize: 13, color: 'var(--wf-muted)', marginTop: 6}}>Example: ClosingStock_Sagar MP_05112026.xlsx gives Sagar-MP (feasibility AI-002)</div></Panel>
        <Panel title={<span>Extra columns <Mark n={5}/></span>}><OSwitch on label="Ignore extra or re-ordered columns"/></Panel></div></div>
  </AppShell>;
}
WFScreen('WF-08', Screen);
})();
