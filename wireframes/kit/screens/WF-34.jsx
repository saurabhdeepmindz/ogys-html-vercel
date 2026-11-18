/* WF-34 Order Output - order team. FR-021.1-021.6, FR-025.3, FR-031.6, FR-022.2. */
(function () {
function Screen() {
  const {size} = useWF(); const two = size === 'desktop';
  return <AppShell active="WF-34" title="Order output · ORD-26-04812" subtitle="STAR GROUP · Sagar-MP · approved 05-11 11:20"
    actions={<><OAct icon="download">Download order file</OAct><OAct primary icon="send">Send to dealer</OAct><Mark n={6}/></>}>
    <div style={{display: 'grid', gridTemplateColumns: two ? '1fr 1fr' : '1fr', gap: 16}}>
      <Panel title={<span>Outputs of this order <Mark n={1}/></span>} pad={false}><DataTable cardTitle="o" columns={[{key: 'o', label: 'Output'}, {key: 'to', label: 'Goes to'}, {key: 'l', label: 'Lines', align: 'right'}, {key: 'v', label: 'Value (Rs)', align: 'right'}]}
        rows={[{key: 1, o: 'Suggested order to OEM', to: 'Dealer - to place on the company', l: 214, v: '4,61,900'}, {key: 2, o: 'Internal transfer - Satna-MP', to: 'Satna-MP', l: 18, v: '24,300'},
               {key: 3, o: 'Internal transfer - Vidisha-MP', to: 'Vidisha-MP', l: 9, v: '16,200'}]}/></Panel>
      <Ask id="CQ-19"><Panel title={<span>Order file - sheets <Mark n={2} open/></span>} sub="Brand layout; columns and sheets chosen for this location">
        {['Order to OEM - editable and non-editable lines', 'Pending from OEM - for reference', 'Internal transfer - by location', 'Sheet explanation'].map((s, i) =>
          <div key={i} style={{display: 'flex', gap: 8, alignItems: 'center', padding: '7px 0', borderTop: i ? '1px solid var(--wf-border-soft)' : 'none', fontSize: 14}}><Ic name="sheet" size={15} color="var(--wf-heading)"/>{s}</div>)}</Panel></Ask></div>
    <Panel title={<span>Order to OEM - preview <Mark n={3}/></span>} sub="First lines of the sheet" pad={false}>
      <DataTable cardTitle="p" columns={[{key: 'p', label: 'Part number', mono: true}, {key: 'd', label: 'Description', hide: 'tablet'}, {key: 'fam', label: <span>Family part<Mark n={4}/></span>, mono: true},
        {key: 'os', label: 'Opening stock', align: 'right', hide: 'tablet'}, {key: 'ooq', label: 'OOQ', align: 'right', hide: 'tablet'}, {key: 'sq', label: 'Suggested qty', align: 'right'}, {key: 'ed', label: <span>Editable<Mark n={5}/></span>}]}
        rows={[{key: 1, p: '0305AAB01661N', d: 'Brake pad set', fam: '0305AAB01661M', os: 8, ooq: 4, sq: 12, ed: 'No'}, {key: 2, p: '1601CAA00091N', d: 'Oil filter', fam: '-', os: 3, ooq: 0, sq: 40, ed: 'Yes'},
               {key: 3, p: '0601BAF00141N', d: 'Clutch plate', fam: '0601BAF00141P', os: 19, ooq: 6, sq: 5, ed: 'Yes'}]}/></Panel>
    <Note>The order is also visible on the dealer's side of OGYS, whether or not the e-mail is read.</Note>
  </AppShell>;
}
WFScreen('WF-34', Screen);
})();
