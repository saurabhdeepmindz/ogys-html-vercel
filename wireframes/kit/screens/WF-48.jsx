/* WF-48 Dealer / Location Upload - Admin. FR-028.4 (method open - OI-055). */
(function () {
function Screen() {
  const {size} = useWF();
  return <AppShell active="WF-48" title="Upload dealers and locations" subtitle="Several locations at once, from a template" actions={<OAct icon="file-down">Download template</OAct>}>
    <Panel title={<span>What you are uploading <Mark n={1}/></span>}>
      <OSeg options={['Basic details', 'Rule settings (OOQ / OGS / SOQ)']} value="Basic details"/>
      <div style={{fontSize: 13.5, color: 'var(--wf-muted)', margin: '10px 0 12px'}}>Basic details: location details, sales team, ordering day, OC / LT.</div>
      <OUpload label="Dealer and location file" file="locations_central_nov.xlsx" note="read 24 rows"/></Panel>
    <Panel title={<span>Check before saving <Mark n={2}/></span>} pad={false}>
      <Ask id="CQ-31"><DataTable cardTitle="loc" rowTone={r => r._e ? 'bad' : null} columns={[{key: 'row', label: 'Row', align: 'right'}, {key: 'loc', label: 'Dealer · location'}, {key: 'res', label: 'Result'}, {key: 'msg', label: 'Message'}]}
        rows={[{key: 1, row: 2, loc: 'STAR GROUP · Damoh-MP', res: <window.Pill tone="ok">New</window.Pill>, msg: 'Will be added'},
               {key: 2, row: 3, loc: 'STAR GROUP · Sagar-MP', res: <window.Pill tone="info">Update</window.Pill>, msg: 'Ordering day Thursday to Friday'},
               {key: 3, _e: 1, row: 7, loc: 'Prakash Auto · Ujjain-MP', res: <window.Pill tone="bad">Error</window.Pill>, msg: 'Dealer not found - create the dealer first'}]}/></Ask></Panel>
    <div style={{display: 'flex', justifyContent: 'flex-end', gap: 10}}><OAct icon="x">Cancel</OAct><OAct primary icon="check">Save 23 rows (skip 1 error)</OAct><Mark n={3}/></div>
  </AppShell>;
}
WFScreen('WF-48', Screen);
})();
