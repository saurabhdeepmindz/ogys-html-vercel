/* WF-30 Adjustments - variance stock list, OOQ exclusion list, ad hoc order to a target value. FR-024.1, FR-024.2,
   FR-023.10, FR-023.11. Order team, Full. */
(function () {
const {useState} = React;
function Screen() {
  const {size} = useWF();
  const [v1, setV1] = useState('Only today'); const [v2, setV2] = useState('Always');
  const two = size === 'desktop';
  return <AppShell active="WF-30" title="Adjustments for today's run" subtitle="Applied to the next generation of the dealer locations they name"
    actions={<><OAct icon="arrow-left">Back to list</OAct><OAct primary icon="check">Save adjustments</OAct></>}>
    <div style={{display: 'grid', gridTemplateColumns: two ? '1fr 1fr' : '1fr', gap: 16, alignItems: 'start'}}>
      <Ask id="CQ-06"><Panel title={<span>Variance stock list <Mark n={1} open/></span>} sub="Parts whose system stock differs from physical stock"
        right={<span style={{display: 'inline-flex', alignItems: 'center', gap: 6}}><OSeg options={['Always', 'Only today']} value={v1} onChange={setV1}/><Mark n={6}/></span>}>
        <OUpload label="Variance stock file" file="variance_STAR-GROUP_05-11.xlsx" note="read 128 rows"/>
        <div style={{margin: '12px 0'}}><Stats items={[{label: 'Parts', value: 128, mark: <Mark n={2}/>}, {label: 'Net value', value: '-2.34', unit: 'lakh'}, {label: 'Updated on', value: '05-11', note: '09:10 by Ritu S.'}]}/></div>
        <DataTable cardTitle="part" columns={[{key: 'part', label: 'Part number', mono: true}, {key: 'loc', label: 'Location'}, {key: 'sys', label: 'System', align: 'right'},
          {key: 'phy', label: 'Physical', align: 'right'}, {key: 'diff', label: 'Difference', align: 'right'}]}
          rows={[{key: 1, part: '0305AAB01661N', loc: 'Sagar-MP', sys: 12, phy: 8, diff: <b style={{color: 'var(--wf-bad)'}}>-4</b>},
                 {key: 2, part: '1601CAA00091N', loc: 'Sagar-MP', sys: 0, phy: 3, diff: <b style={{color: 'var(--wf-ok)'}}>+3</b>},
                 {key: 3, part: '0601BAF00141N', loc: 'Satna-MP', sys: 25, phy: 19, diff: <b style={{color: 'var(--wf-bad)'}}>-6</b>}]}/></Panel></Ask>
      <Panel title={<span>OOQ exclusion list <Mark n={3}/></span>} sub="Pending orders to leave out of OOQ, beyond the age rule (older than 15 days)"
        right={<OSeg options={['Always', 'Only today']} value={v2} onChange={setV2}/>}>
        <OUpload label="OOQ exclusion file" file="ooq_exclusion_05-11.xlsx" note="read 9 rows"/>
        <div style={{marginTop: 12}}><DataTable cardTitle="po" columns={[{key: 'po', label: 'PO number', mono: true}, {key: 'part', label: 'Part number', mono: true, hide: 'tablet'},
          {key: 'loc', label: 'Location'}, {key: 'age', label: 'Age', align: 'right'}, {key: 'x', label: '', align: 'right'}]}
          rows={[{key: 1, po: 'PO-MH-778120', part: '0305AAB01661N', loc: 'Sagar-MP', age: '11 days', x: <OAct small icon="x">Remove</OAct>},
                 {key: 2, po: 'PO-MH-778344', part: '0601BAF00141N', loc: 'Satna-MP', age: '9 days', x: <OAct small icon="x">Remove</OAct>}]}/></div></Panel>
    </div>
    <Ask id="CQ-07"><Panel title={<span>Ad hoc order to a target value <Mark n={4}/></span>} sub="The system raises or reduces quantities to reach the target, within the parts allowed">
      <div style={{display: 'grid', gridTemplateColumns: two ? 'repeat(4,1fr)' : size === 'tablet' ? '1fr 1fr' : '1fr', gap: 12, marginBottom: 14}}>
        <Select label="Dealer" value="STAR GROUP"/><Select label="Location" value="Sagar-MP"/>
        <label style={{display: 'flex', flexDirection: 'column', gap: 4}}><span style={{fontSize: 12.5, color: 'var(--wf-muted)'}}>Target order value (Rs)</span>
          <span className="wf-mono" style={{minHeight: 40, display: 'flex', alignItems: 'center', padding: '0 10px', border: '1px solid var(--wf-border-strong)', borderRadius: 'var(--wf-radius-field)', background: 'var(--wf-surface)'}}>5,00,000</span></label>
        <Select label="Category" value="Spare Part"/></div>
      <div style={{display: 'grid', gridTemplateColumns: two ? '1fr 1fr' : '1fr', gap: 12}}>
        <OUpload label="Parts to include" file="include_list.xlsx" note="42 parts"/><OUpload label="Parts to exclude" note="optional"/></div>
      <div style={{marginTop: 14, padding: 12, background: 'var(--wf-sunken)', fontSize: 14}}><b style={{color: 'var(--wf-heading)'}}>Increase / decrease rules</b><Mark n={5} open/>
        <div style={{marginTop: 4}}>Raise in parts below <span className="wf-mono">N1</span> days of stock, by average sales up to MAX; reduce in parts above <span className="wf-mono">N2</span> days, keeping TDOS. Set by the Admin - read-only here.</div></div>
    </Panel></Ask>
  </AppShell>;
}
WFScreen('WF-30', Screen);
})();
