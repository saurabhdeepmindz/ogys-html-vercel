/* WF-09 Upload Dealer Files - order team. FR-002.1, FR-003.5, FR-003.7, FR-003.8, FR-014.2, FR-014.6. */
(function () {
function Screen() {
  const {size} = useWF(); const two = size === 'desktop';
  return <AppShell active="WF-09" title="Upload dealer files" subtitle="Files are stored as they arrive and used by the next order run"
    actions={<OAct icon="history">Upload history</OAct>}>
    <Panel title={<span>What you are uploading <Mark n={1}/></span>}>
      <div style={{display: 'grid', gridTemplateColumns: two ? 'repeat(4,1fr)' : size === 'tablet' ? '1fr 1fr' : '1fr', gap: 12}}>
        <Select label="Brand" value="Mahindra"/><Select label="Dealer" value="STAR GROUP"/><Select label="Data type" value="Current Stock"/>
        <label style={{display: 'flex', flexDirection: 'column', gap: 4}}><span style={{fontSize: 12.5, color: 'var(--wf-muted)'}}>Upload type<Mark n={2}/></span><OSeg options={['Fresh upload', 'Old uploaded data']} value="Fresh upload"/></label></div>
      <div style={{marginTop: 14, padding: 12, background: 'var(--wf-sunken)', fontSize: 14}}><b style={{color: 'var(--wf-heading)'}}>Required columns for Mahindra · Current Stock (26)</b><Mark n={3}/>
        <div className="wf-mono" style={{marginTop: 6, fontSize: 12.5, lineHeight: 1.7, color: 'var(--wf-ink)'}}>Part No · Part Description · Store · Opening Qty · Receipt Qty · Issue Qty · Closing Qty · MRP · Category · ... <a href="#" style={{color: 'var(--wf-heading)'}}>show all 26</a></div>
        <div style={{fontSize: 13, color: 'var(--wf-muted)', marginTop: 4}}>Columns are found by name - their order in the file does not matter; extra columns are ignored.</div></div></Panel>
    <Panel title={<span>Files (several logins combine into one) <Mark n={4}/></span>} right={<OAct small primary icon="file-up">Add files</OAct>} pad={false}>
      <Ask id="CQ-15"><DataTable cardTitle="f" columns={[{key: 'f', label: 'File', mono: true}, {key: 'loc', label: <span>Location (from file name)<Mark n={5} open/></span>}, {key: 'rows', label: 'Rows', align: 'right'}, {key: 'st', label: 'Check'}]}
        rows={[{key: 1, f: 'ClosingStock_Sagar MP_05112026.xlsx', loc: 'Sagar-MP', rows: '4,812', st: <OState s="ready"/>},
               {key: 2, f: 'ClosingStock_Satna MP_05112026.xlsx', loc: 'Satna-MP', rows: '2,104', st: <OState s="ready"/>},
               {key: 3, f: 'stock_export (3).xlsx', loc: <Select value="Choose location" style={{minWidth: 150}}/>, rows: '1,960', st: <OState s="exception"/>}]}/></Ask></Panel>
    <div style={{display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'flex-end'}}><OAct icon="x">Clear</OAct><OAct primary icon="upload">Upload and validate 3 files</OAct><Mark n={6}/></div>
  </AppShell>;
}
WFScreen('WF-09', Screen);
})();
