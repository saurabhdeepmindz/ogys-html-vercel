/* WF-29 Non-Scheduled Orders - order team. FR-023.9, FR-024.2 (ad hoc target in Adjustments). */
(function () {
const {useState} = React;
function Screen() {
  const {size} = useWF(); const [view, setView] = useState('build');
  const grid = size === 'desktop' ? 'repeat(3,1fr)' : size === 'tablet' ? '1fr 1fr' : '1fr';
  return <AppShell active="WF-29" title="Non-scheduled order" subtitle="An order outside the schedule - built from the latest validated data"
    actions={<OAct primary icon="play">Generate order</OAct>}>
    <Tabs value={view} onChange={setView} tabs={[{id: 'build', label: 'Build an order'}, {id: 'sched', label: 'Scheduled orders view', mark: <Mark n={5}/>}]}/>
    <Panel title={<span>Filters <Mark n={1}/></span>} sub="Each filter takes several values">
      <div style={{display: 'grid', gridTemplateColumns: grid, gap: 12}}>
        <Select label={<span>Category<Mark n={2}/></span>} value={['Spares', 'Oil']} multi/>
        <Select label={<span>Order type<Mark n={3}/></span>} value={['Ad hoc order']} multi/>
        <Select label="Brand" value={['Mahindra']} multi/><Select label="Dealer" value={['STAR GROUP']} multi/><Select label="Location" value={['Sagar-MP', 'Satna-MP']} multi/></div>
      <div style={{fontSize: 13, color: 'var(--wf-muted)', marginTop: 10}}>Order types: stock order · ad hoc order · sister order · ITO order</div></Panel>
    <Ask id="CQ-18"><Panel title="Data the order will use" pad={false}><DataTable cardTitle="loc" columns={[{key: 'loc', label: 'Location'}, {key: 's', label: 'Stock data'}, {key: 'p', label: 'Pending PO'}, {key: 'st', label: 'Readiness'}]}
      rows={[{key: 1, loc: 'Sagar-MP', s: '05-11 08:12', p: '05-11 08:15', st: <OState s="ready"/>}, {key: 2, loc: 'Satna-MP', s: '05-11 08:12', p: '29-10 17:30', st: <OState s="waiting"/>}]}/></Panel></Ask>
    <Note>For an ad hoc order to a target value, set the value and the parts to include or exclude in Adjustments first.<Mark n={4}/></Note>
  </AppShell>;
}
WFScreen('WF-29', Screen);
})();
