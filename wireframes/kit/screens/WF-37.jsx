/* WF-37 Feedback Status - order team (assumed). FR-026.3, FR-026.5, FR-019.2. */
(function () {
function Screen() {
  return <AppShell active="WF-37" title="Order feedback status" subtitle="Which dealers have reported what they actually placed" actions={<OAct icon="bell">Remind dealers (5)</OAct>}>
    <Stats items={[{label: 'Feedback done', value: 41, tone: 'ok', mark: <Mark n={1}/>}, {label: 'Not done', value: 5, tone: 'bad'}, {label: 'Lines to explain', value: 23, tone: 'warn', mark: <Mark n={2}/>}, {label: 'Alternate part alerts', value: 2, tone: 'warn', mark: <Mark n={3}/>}]}/>
    <Ask id="CQ-22"><Panel pad={false} title="Orders"><DataTable cardTitle="o" columns={[{key: 'o', label: 'Order', mono: true}, {key: 'l', label: 'Dealer · location'}, {key: 'fb', label: 'Feedback'},
      {key: 'ex', label: 'Excess', align: 'right'}, {key: 'sh', label: 'Short', align: 'right'}, {key: 'np', label: 'Not placed', align: 'right'}, {key: 'alt', label: 'Alternate placed', align: 'right'}]}
      rows={[['ORD-26-04761', 'Vikas Wheels · Gwalior-MP', 'notsent', '-', '-', '-', '-'], ['ORD-26-04744', 'STAR GROUP · Satna-MP', 'notsent', '-', '-', '-', '-'],
             ['ORD-26-04698', 'STAR GROUP · Vidisha-MP', 'approved', 3, 5, 2, 1], ['ORD-26-04690', 'Prakash Auto · Bhopal-MP', 'approved', 0, 4, 9, 1]]
        .map((r, i) => ({key: i, o: r[0], l: r[1], fb: r[2] === 'approved' ? <window.Pill tone="ok">Done</window.Pill> : <window.Pill tone="bad">Not done</window.Pill>, ex: r[3], sh: r[4], np: r[5], alt: r[6]}))}/></Panel></Ask>
    <Note>Every excess, short or not-placed line needs a predefined remark from the dealer; the remarks shape the next suggestions.<Mark n={4}/></Note>
  </AppShell>;
}
WFScreen('WF-37', Screen);
})();
