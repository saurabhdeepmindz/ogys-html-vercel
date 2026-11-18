/* WF-35 Notifications Sent - order team (assumed). FR-022.1, FR-022.3, FR-022.7. */
(function () {
function Screen() {
  return <AppShell active="WF-35" title="Notifications sent" subtitle="Every message, with time, channel and result" actions={<OAct icon="refresh-cw">Resend failed (2)</OAct>}>
    <FilterBar search="Order number or recipient" filters={[{label: <span>Channel<Mark n={1} open/></span>, value: 'All'}, {label: 'Result', value: 'All'}, {label: 'Date', value: 'Today'}]}/>
    <Ask id="CQ-20"><Panel pad={false} title={<span>Send log <Mark n={2}/></span>}>
      <DataTable cardTitle="o" rowTone={r => r._r === 'failed' ? 'bad' : null} columns={[{key: 'when', label: 'Time', nowrap: true}, {key: 'o', label: 'Order', mono: true}, {key: 'c', label: 'Channel'},
        {key: 'to', label: <span>Recipient · purpose<Mark n={3}/></span>}, {key: 'r', label: 'Result'}, {key: 'x', label: '', align: 'right'}]}
        rows={[['11:21', 'ORD-26-04812', 'E-mail', 'spm.sagar@stargroup.in · order file', 'sent'], ['11:21', 'ORD-26-04812', 'WhatsApp', '98260 41377 · service GM - order value for payment', 'sent'],
               ['11:22', 'ORD-26-04812', 'E-mail', 'stores.satna@stargroup.in · internal transfer', 'failed'], ['10:05', 'ORD-26-04814', 'E-mail', 'parts@prakashauto.in · order file', 'sent']]
          .map((r, i) => ({key: i, _r: r[4], when: r[0], o: r[1], c: r[2], to: r[3], r: r[4] === 'sent' ? <OState s="approved"/> : <OState s="notsent"/>,
            x: r[4] === 'failed' ? <OAct small icon="refresh-cw">Resend</OAct> : ''}))}/></Panel></Ask>
  </AppShell>;
}
WFScreen('WF-35', Screen);
})();
