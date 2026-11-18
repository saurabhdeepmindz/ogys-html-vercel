/* WF-17 TOC Parts - Admin. FR-015.1-015.6. */
(function () {
function Screen() {
  const {size} = useWF();
  return <AppShell active="WF-17" title="TOC parts" subtitle="Parts the company replenishes itself - skipped, or ordered only when they run low" actions={<OAct primary icon="check">Save</OAct>}>
    <ORuleScope brand="JCB" applies="JCB - all dealers" mark={<Mark n={1}/>}/>
    <Panel title="Settings"><div style={{display: 'grid', gap: 14}}>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center'}}><b style={{minWidth: 160}}>TOC applicable<Mark n={2}/></b><OSeg options={['Yes', 'No']} value="Yes"/></div>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center'}}><b style={{minWidth: 160}}>Generate SOQ for TOC parts<Mark n={3}/></b><OSeg options={['Yes', 'No']} value="Yes"/></div>
      <Ask id="CQ-38"><div style={{display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', fontSize: 14}}>Only when (stock + OOQ) days is nil or below<Select value="10" style={{minWidth: 80}}/>days<Mark n={4} open/></div></Ask></div></Panel>
    <Panel title={<span>TOC part list per location <Mark n={5}/></span>} pad={false}><DataTable cardTitle="l" columns={[{key: 'l', label: 'Location'}, {key: 'n', label: 'Parts', align: 'right'}, {key: 'u', label: 'Updated'}, {key: 'x', label: '', align: 'right'}]}
      rows={[['Rajdhani Motors · Bhopal', '1,512', '02-11'], ['Rajdhani Motors · Indore', '1,488', '02-11']].map((r, i) => ({key: i, l: r[0], n: r[1], u: r[2], x: <OAct small icon="upload">Replace list</OAct>}))}/></Panel>
    <Note>Where TOC is not applicable, SOQ is generated for all parts.</Note>
  </AppShell>;
}
WFScreen('WF-17', Screen);
})();
