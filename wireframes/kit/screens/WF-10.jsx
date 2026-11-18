/* WF-10 Validation Results - order team. FR-003.1-003.3, FR-003.6, FR-003.8, FR-014.3. */
(function () {
function Screen() {
  const {size} = useWF();
  const cols = [['Part No', true], ['Part Description', true], ['Store', true], ['Opening Qty', true], ['Receipt Qty', true], ['Issue Qty', false], ['Closing Qty', true], ['MRP', true], ['Category', false]];
  return <AppShell active="WF-10" title="Validation results" subtitle="STAR GROUP · Mahindra · Current Stock · uploaded 05-11 08:12 by Ritu S."
    actions={<><OAct icon="arrow-left">Back</OAct><OAct primary icon="upload">Re-upload corrected file</OAct></>}>
    <Note tone="bad" icon="circle-x"><b>Not accepted</b> - 2 required columns were not found in stock_export (3).xlsx. The other 2 files passed.<Mark n={1}/></Note>
    <Stats items={[{label: 'Files checked', value: 3}, {label: 'Passed', value: 2, tone: 'ok'}, {label: 'Failed', value: 1, tone: 'bad'}, {label: 'Rows read', value: '8,876', mark: <Mark n={2}/>}]}/>
    <Panel title={<span>Required columns - stock_export (3).xlsx <Mark n={3}/></span>} sub="Found by name; the order of columns in the file does not matter">
      <div style={{display: 'grid', gridTemplateColumns: size === 'mobile' ? '1fr 1fr' : 'repeat(5,1fr)', gap: 8}}>
        {cols.map(([c, ok]) => <div key={c} style={{padding: '8px 10px', border: '1px solid ' + (ok ? 'var(--wf-border)' : 'var(--wf-bad)'), background: ok ? 'var(--wf-surface)' : 'var(--wf-bad-bg)', fontSize: 13.5,
          color: ok ? 'var(--wf-ink)' : 'var(--wf-bad)', fontWeight: ok ? 400 : 600, display: 'flex', alignItems: 'center', gap: 6}}><Ic name={ok ? 'check' : 'x'} size={14}/>{c}</div>)}
        <div style={{padding: '8px 10px', fontSize: 13, color: 'var(--wf-muted)'}}>+ 17 more found</div></div>
      <div style={{marginTop: 12, fontSize: 13.5, color: 'var(--wf-muted)'}}>Extra columns in the file (ignored): <span className="wf-mono">Bin Location, Last GRN Date</span><Mark n={4}/></div></Panel>
    <Panel title="Files in this upload" pad={false}><DataTable cardTitle="f" columns={[{key: 'f', label: 'File', mono: true}, {key: 'r', label: 'Result'}, {key: 'm', label: 'Message'}]}
      rows={[{key: 1, f: 'ClosingStock_Sagar MP_05112026.xlsx', r: <OState s="ready"/>, m: 'All 26 columns found'},
             {key: 2, f: 'ClosingStock_Satna MP_05112026.xlsx', r: <OState s="ready"/>, m: 'All 26 columns found'},
             {key: 3, f: 'stock_export (3).xlsx', r: <OState s="exception"/>, m: <span style={{color: 'var(--wf-bad)'}}>Missing: Issue Qty, Category</span>}]}/></Panel>
    <Ask id="CQ-16"><Note>When every file passes, the dealer location shows as validated on today's list.<Mark n={5}/></Note></Ask>
  </AppShell>;
}
WFScreen('WF-10', Screen);
})();
