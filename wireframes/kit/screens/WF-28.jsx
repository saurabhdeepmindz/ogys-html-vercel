/* WF-28 Dealer Readiness & Detail (covers "Dealer Readiness & Detail" and "Order Context") - FR-014.1-014.4, FR-023.4,
   FR-024.3-024.5. Order team, Full. */
(function () {
function Screen() {
  const {size} = useWF();
  const files = [
    {key: 'f1', data: 'Stock data', req: 'Yes', at: '05-11 08:12', rows: '4,812', v: <OState s="ready"/>, act: <OAct small icon="eye">View</OAct>},
    {key: 'f2', data: 'Pending purchase orders', req: 'Yes', at: '05-11 08:15', rows: '316', v: <OState s="ready"/>, act: <OAct small icon="eye">View</OAct>},
    {key: 'f3', data: 'OEM invoice data', req: 'Yes', at: '05-11 08:20', rows: '1,128', v: <OState s="exception"/>, act: <OAct small icon="eye">View</OAct>},
    {key: 'f4', data: 'DLR receipt data', req: 'Yes', at: '-', rows: '-', v: <OState s="waiting"/>, act: <OAct small primary icon="upload">Upload</OAct>}];
  const locs = [['Sagar-MP', true, true, true], ['Satna-MP', true, true, false], ['Vidisha-MP', true, false, false]];
  return <AppShell active="WF-28" crumbs="Today's scheduled orders  /  STAR GROUP" title="STAR GROUP · Sagar-MP" subtitle="Mahindra · Spare Part · ordering day today · built by Ritu S."
    actions={<><OAct icon="arrow-left">Back to list</OAct><OAct primary icon="play">Generate this order</OAct><Mark n={8}/></>}>
    <Note tone="warn" icon="circle-alert"><b>Not ready for generation</b><Mark n={1}/> - 1 file missing (DLR receipt data) and 2 exceptions to clear. The order can be generated once every required file is validated and no exception is left.</Note>
    <div style={{display: 'grid', gridTemplateColumns: size === 'desktop' ? '1.6fr 1fr' : '1fr', gap: 16, alignItems: 'start'}}>
      <div>
        <Panel pad={false} title={<span>Data this order needs <Mark n={2}/></span>} sub="From the dealer-location settings (Section 12)">
          <DataTable cardTitle="data" columns={[{key: 'data', label: 'Data'}, {key: 'at', label: 'Uploaded'}, {key: 'rows', label: 'Rows', align: 'right', mono: true},
            {key: 'v', label: 'Validation'}, {key: 'act', label: '', align: 'right'}]} rows={files}/></Panel>
        <Ask id="CQ-04"><Panel title={<span>Exceptions (2) <Mark n={3} open/></span>} sub="Listed apart from the files, so each can be cleared">
          {[['OEM invoice data', '14 invoice lines with a part number not in the brand master', 'Fix in file and re-upload'],
            ['OEM invoice data', 'Invoice date later than the upload date on 2 lines', 'Accept as is / re-upload']].map((e, i) =>
            <div key={i} style={{display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', padding: '10px 0', borderTop: i ? '1px solid var(--wf-border-soft)' : 'none'}}>
              <window.Ic name="triangle-alert" size={16} color="var(--wf-warn)"/><div style={{flex: '1 1 260px'}}><b style={{color: 'var(--wf-heading)'}}>{e[0]}</b>
                <div style={{fontSize: 14}}>{e[1]}</div></div><OAct small>{e[2]}</OAct></div>)}</Panel></Ask>
        <Panel title={<span>Stock and OOQ summary <Mark n={5}/></span>} right={<OAct small icon="badge-check">Validate manually</OAct>}>
          <Stats items={[{label: 'Current stock', value: '3,904', unit: 'parts', note: 'Rs 41.2 lakh'}, {label: 'OOQ (already on order)', value: '612', unit: 'parts', note: 'Rs 6.8 lakh'},
            {label: 'Last order · 29 Oct', value: '1.32', unit: 'lakh', note: '286 lines'}, {label: 'Order before · 22 Oct', value: '1.08', unit: 'lakh', note: '241 lines'}]}/>
          <div style={{fontSize: 13.5, color: 'var(--wf-muted)'}}>System validation: <b style={{color: 'var(--wf-ok)'}}>passed</b> for stock and pending PO · OEM invoice data has exceptions · only validated data goes to generation.</div></Panel>
      </div>
      <div>
        <Panel title={<span>Rules for this run <Mark n={4}/></span>} sub="Changeable for this run only">
          <div style={{display: 'grid', gap: 12}}>
            <Select label="OOQ calculation rule" value="Dynamic rule - Mahindra default"/>
            <Select label="Ordering sequence" value="ITO > Gainer > OEM"/>
            <Select label="TOC applicable" value="Yes - skip TOC parts"/>
            <div style={{display: 'grid', gap: 10, marginTop: 4}}><OSwitch on label="Include stock of child locations"/><OSwitch on label="Include MAX of child locations"/></div></div></Panel>
        <Panel title={<span>Locations uploaded vs required <Mark n={6}/></span>}>
          <table style={{borderCollapse: 'collapse', width: '100%', fontSize: 13.5}}><thead><tr>{['Location', 'Stock', 'Pending PO', 'DLR receipt'].map(h => <th key={h} style={{textAlign: 'left', padding: '6px 4px', color: 'var(--wf-muted)', fontWeight: 600, borderBottom: '1px solid var(--wf-border-strong)'}}>{h}</th>)}</tr></thead>
            <tbody>{locs.map(l => <tr key={l[0]}><td style={{padding: '7px 4px', borderBottom: '1px solid var(--wf-border-soft)'}}>{l[0]}</td>
              {l.slice(1).map((ok, i) => <td key={i} style={{padding: '7px 4px', borderBottom: '1px solid var(--wf-border-soft)', color: ok ? 'var(--wf-ok)' : 'var(--wf-bad)', fontWeight: 600}}>{ok ? 'Uploaded' : 'Missing'}</td>)}</tr>)}</tbody></table>
          <div style={{fontSize: 13, color: 'var(--wf-bad)', marginTop: 8}}>Balance: 3 uploads missing</div></Panel>
        <Panel title={<span>Last order feedback and CBO <Mark n={7}/></span>}>
          <KV cols={1} pairs={[['Feedback on the last order', '182 of 240 lines · given on 31 Oct'], ['CBO considered', 'No (default) · age over 7 days, value over Rs 2,000']]}/>
          <div style={{marginTop: 10}}><OAct small icon="upload">Upload feedback</OAct></div></Panel>
      </div></div>
    <Ask id="CQ-05" style={{marginTop: 6}}><Note>Manual validation records who validated and why; the reason shows in the order history.</Note></Ask>
  </AppShell>;
}
WFScreen('WF-28', Screen);
})();
