/* WF-20 Dealer Feedback Rules - Admin. FR-019.1-019.5. */
(function () {
function Screen() {
  return <AppShell active="WF-20" title="Dealer feedback rules" subtitle="How long a dealer's reason for not ordering is respected" actions={<OAct primary icon="check">Save</OAct>}>
    <ORuleScope applies="All brands"/>
    <Ask id="CQ-41"><Panel pad={false} title={<span>Feedback types <Mark n={1} open/></span>} sub="The reason a dealer gives against a part" right={<OAct small icon="plus">Add type</OAct>}>
      <DataTable cardTitle="t" columns={[{key: 't', label: 'Reason'}, {key: 'v', label: <span>Valid for<Mark n={2}/></span>}, {key: 'td', label: 'or T-DOS'}, {key: 'e', label: 'Effect on next SOQ'}]}
        rows={[['Not required / not moving', '2 months', '-', 'Part left out'], ['Consumption from own / test-drive vehicles', '2 months', '-', 'Part left out'], ['On demand only', '6 months', '-', 'Ordered only against CBO'], ['Higher quantity ordered', '1 month', '45 days', 'Kept as placed']]
          .map((r, i) => ({key: i, t: r[0], v: r[1], td: r[2], e: r[3]}))}/></Panel></Ask>
    <Panel pad={false} title={<span>Standing feedback per part <Mark n={3}/></span>} sub="Applied every time SOQ is generated for the part"><DataTable cardTitle="p" columns={[{key: 'p', label: 'Part', mono: true}, {key: 'l', label: 'Location'}, {key: 'r', label: 'Instruction'}]}
      rows={[['0305AAB01661N', 'Sagar-MP', 'Keep only one piece'], ['1601CAA00091N', 'Satna-MP', 'Always keep 25 days of stock']].map((r, i) => ({key: i, p: r[0], l: r[1], r: r[2]}))}/></Panel>
    <Note>Feedback older than its validity is no longer considered.<Mark n={4}/></Note>
  </AppShell>;
}
WFScreen('WF-20', Screen);
})();
