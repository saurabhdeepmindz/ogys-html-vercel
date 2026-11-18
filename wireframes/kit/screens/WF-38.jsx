/* WF-38 Complete Order - Dealer SPM (phone-first). FR-026.1, FR-025.1, 025.3, FR-021.4. */
(function () {
const {useState} = React;
function Screen() {
  const [tab, setTab] = useState('company');
  const lines = [['0305AAB01661N', 'Brake pad set', '0305AAB01661M', 12, 'No'], ['1601CAA00091N', 'Oil filter', '-', 40, 'Yes'], ['0601BAF00141N', 'Clutch plate', '0601BAF00141P', 5, 'Yes']];
  return <AppShell active="WF-38" title="ORD-26-04812" subtitle="Sagar-MP · received 05-11 · Rs 5,02,400" actions={<><OAct icon="download">Download</OAct><OAct primary icon="message-square">Give feedback</OAct></>}>
    <Tabs value={tab} onChange={setTab} tabs={[{id: 'company', label: 'Company order', count: 214, mark: <Mark n={1}/>}, {id: 'editable', label: 'Editable', count: 23}, {id: 'gainer', label: 'Gainer', count: 6}, {id: 'ito', label: 'Internal transfer', count: 27}]}/>
    <Note>Non-editable lines are placed as suggested; on the Editable tab you decide the quantity.<Mark n={2}/></Note>
    <Panel pad={false} title={<span>Lines <Mark n={3}/></span>}><DataTable cardTitle="p" columns={[{key: 'p', label: 'Part number', mono: true}, {key: 'd', label: 'Description'}, {key: 'f', label: <span>Family part<Mark n={4}/></span>, mono: true}, {key: 'q', label: 'Qty', align: 'right'}, {key: 'e', label: 'Editable'}]}
      rows={lines.map((l, i) => ({key: i, p: l[0], d: l[1], f: l[2], q: l[3], e: l[4]}))}/></Panel>
  </AppShell>;
}
WFScreen('WF-38', Screen);
})();
