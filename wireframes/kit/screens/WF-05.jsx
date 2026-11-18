/* WF-05 Dealer View - My Orders: landing page of the dealer's SPM. FR-022.2, FR-026.5, FR-021.5 (assembled - assumed). */
(function () {
function Screen() {
  const {size} = useWF();
  return <AppShell active="WF-05" title="My orders" subtitle="STAR GROUP · Mahindra · 3 locations">
    <Stats items={[{label: 'Orders this week', value: 3, mark: <Mark n={1}/>}, {label: 'Waiting for my feedback', value: 2, tone: 'warn', mark: <Mark n={2}/>}, {label: 'Alternate part alerts', value: 1, tone: 'bad', mark: <Mark n={3}/>}]}/>
    <Panel title="Latest order per location" pad={false}><DataTable cardTitle="loc" columns={[{key: 'loc', label: 'Location'}, {key: 'no', label: 'Order', mono: true}, {key: 'd', label: 'Received'},
      {key: 'v', label: 'Value (Rs)', align: 'right'}, {key: 'fb', label: 'Feedback'}, {key: 'go', label: '', align: 'right'}]}
      rows={[{key: 1, loc: 'Sagar-MP', no: 'ORD-26-04812', d: '05-11', v: '5,02,400', fb: <window.Pill tone="warn">Feedback due</window.Pill>, go: <OAct small primary icon="chevron-right">Open</OAct>},
             {key: 2, loc: 'Satna-MP', no: 'ORD-26-04813', d: '05-11', v: '1,18,750', fb: <window.Pill tone="warn">Feedback due</window.Pill>, go: <OAct small primary icon="chevron-right">Open</OAct>},
             {key: 3, loc: 'Vidisha-MP', no: 'ORD-26-04698', d: '29-10', v: '88,200', fb: <window.Pill tone="ok">Feedback done</window.Pill>, go: <OAct small icon="chevron-right">Open</OAct>}]}/></Panel>
    <Ask id="CQ-14"><Panel title={<span>Pending from OEM <Mark n={4}/></span>} sub="For reference - you may cancel excess pending orders with the company; no action is required here">
      <KV cols={3} pairs={[['Pending lines', '214'], ['Value', 'Rs 3.1 lakh'], ['Older than 30 days', '38 lines']]}/></Panel></Ask>
  </AppShell>;
}
WFScreen('WF-05', Screen);
})();
