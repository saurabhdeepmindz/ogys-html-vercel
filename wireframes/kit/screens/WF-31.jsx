/* WF-31 Order Day Tracker (covers "Order Day Tracker" for the order team and "Orders of My Locations (view)" for sales
   and operations) - FR-023.6-023.8, FR-024.4. Order team Full; sales / operations View. */
(function () {
const {useState} = React;
function Screen({role}) {
  const {ORDERS} = window.OGYS; const {size} = useWF();
  const viewOnly = role === 'A3' || role === 'A4';
  const [open, setOpen] = useState('o1');
  const list = viewOnly ? ORDERS.filter(o => o.dealer === 'STAR GROUP' || o.dealer === 'Prakash Auto') : ORDERS;
  const rows = list.map(o => ({key: o.key, _s: o.status,
    no: <span className="wf-mono" style={{color: 'var(--wf-heading)', fontWeight: 600}}>{o.no}</span>,
    dealer: <span><b>{o.dealer}</b><div style={{fontSize: 13, color: 'var(--wf-muted)'}}>{o.loc}</div></span>,
    cons: o.cons, st: <OState s={o.status}/>, due: o.due, next: o.next, lastMax: o.lastMax,
    qty: o.qty, value: o.value,
    check: o.status === 'flagged' ? <span style={{color: 'var(--wf-warn-fg)', fontWeight: 600, fontSize: 13.5}}>Rs {o.value} vs usual {o.usual}</span> : <span style={{fontSize: 13.5, color: 'var(--wf-muted)'}}>In line</span>,
    title: o.no + ' · ' + o.dealer}));
  const o = ORDERS.find(x => x.key === open) || ORDERS[0];
  return <AppShell active="WF-31" title="Order Day Tracker" subtitle={viewOnly ? 'Orders of my locations · read-only' : 'Generated orders waiting for review · 5 November 2026'}
    actions={<OAct icon="download">Export list</OAct>}>
    {viewOnly && <Ask id="CQ-09"><Note>You see the orders of your locations. Approving and marking Not Sent is done by the order team.</Note></Ask>}
    <Stats items={[{label: 'Generated', value: 12, mark: <Mark n={1}/>}, {label: 'Flagged', value: 3, tone: 'warn'}, {label: 'Approved', value: 7, tone: 'ok'}, {label: 'Not sent', value: 1, tone: 'bad'}]}/>
    <FilterBar count={1} search="Order number or dealer" filters={[{label: 'Brand', value: 'All'}, {label: 'Status', value: 'All'}, {label: 'Order due', value: 'Today'}]}/>
    <Panel pad={false} title={<span>Orders <Mark n={2}/></span>}>
      <DataTable cardTitle="title" onRow={r => setOpen(r.key)} rowTone={r => r._s === 'flagged' ? 'warn' : r._s === 'notsent' ? 'bad' : null}
        columns={[{key: 'no', label: 'Order number', nowrap: true}, {key: 'dealer', label: 'Dealer · location'}, {key: 'cons', label: 'Consignee', hide: 'tablet'},
          {key: 'st', label: 'Status'}, {key: 'due', label: 'Order due', hide: 'tablet', nowrap: true}, {key: 'next', label: 'Next due', hide: 'tablet', nowrap: true},
          {key: 'lastMax', label: 'Last MAX modified', hide: 'tablet', nowrap: true}, {key: 'qty', label: 'Qty', align: 'right'},
          {key: 'value', label: 'Value (Rs)', align: 'right', nowrap: true}, {key: 'check', label: <span>Validation<Mark n={3} open/></span>, wide: true}]}
        rows={rows}/></Panel>
    <Panel title={`${o.no} · ${o.dealer} · ${o.loc}`} sub="Selected order"
      right={!viewOnly && <span style={{display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center'}}><Mark n={6}/><OAct primary icon="check">Approve</OAct>
        <OAct icon="upload">Upload &amp; Approve</OAct><OAct icon="refresh-cw">Regenerate</OAct><OAct icon="ban">Not Sent</OAct></span>}>
      <div style={{display: 'grid', gridTemplateColumns: size === 'desktop' ? '1.2fr 1fr 1fr' : '1fr', gap: 18}}>
        <Ask id="CQ-08"><div><b style={{color: 'var(--wf-heading)'}}>Why it is flagged</b>
          <p style={{margin: '6px 0 0', fontSize: 14, lineHeight: 1.55}}>This order is <b>Rs 5.0 lakh</b>; the dealer's past orders were usually <b>Rs 1.0 - 1.5 lakh</b>. Basis: order value against the last 3 orders.</p>
          <p style={{margin: '6px 0 0', fontSize: 13.5, color: 'var(--wf-muted)'}}>Correct the data and regenerate - the summary updates automatically.</p></div></Ask>
        <div><b style={{color: 'var(--wf-heading)'}}>Category summary <Mark n={4} open/></b>
          <table style={{borderCollapse: 'collapse', width: '100%', fontSize: 13.5, marginTop: 6}}><thead><tr>{['', 'Runner', 'Repeater', 'Stranger'].map(h => <th key={h} style={{textAlign: 'right', padding: '4px', color: 'var(--wf-muted)', fontWeight: 600}}>{h}</th>)}</tr></thead>
            <tbody><tr><td style={{padding: 4}}>This run</td><td style={{textAlign: 'right'}}>42</td><td style={{textAlign: 'right'}}>118</td><td style={{textAlign: 'right'}}>9</td></tr>
              <tr><td style={{padding: 4}}>Last run</td><td style={{textAlign: 'right'}}>38</td><td style={{textAlign: 'right'}}>96</td><td style={{textAlign: 'right'}}>4</td></tr></tbody></table></div>
        <div><b style={{color: 'var(--wf-heading)'}}>Downloads <Mark n={5}/></b>
          <div style={{display: 'grid', gap: 6, marginTop: 6}}>{['Generated order', 'Latest MAX', "Today's opening stock", 'Pending PO GRN', 'Pending stock transfer'].map(d =>
            <a key={d} href="#" onClick={e => e.preventDefault()} style={{display: 'flex', alignItems: 'center', gap: 8, color: 'var(--wf-heading)', fontSize: 14, minHeight: 32}}><window.Ic name="file-down" size={15}/>{d}</a>)}</div></div></div>
      {!viewOnly && <div style={{marginTop: 16, padding: 12, border: '1px solid var(--wf-border)', background: 'var(--wf-sunken)'}}>
        <label style={{display: 'block', fontSize: 13.5, fontWeight: 600, color: 'var(--wf-heading)'}}>Remark - required to mark Not Sent <Mark n={7}/></label>
        <div style={{marginTop: 6, minHeight: 64, background: 'var(--wf-surface)', border: '1px solid var(--wf-border-strong)', borderRadius: 'var(--wf-radius-field)', padding: 8, fontSize: 14, color: 'var(--wf-muted)'}}>e.g. Dealer asked to hold the order until the new MAX is uploaded</div></div>}
      {viewOnly && <div style={{marginTop: 12}}><Mark n={8}/><span style={{fontSize: 13.5, color: 'var(--wf-muted)'}}>Read-only for sales and operations.</span></div>}
    </Panel>
  </AppShell>;
}
WFScreen('WF-31', Screen);
})();
