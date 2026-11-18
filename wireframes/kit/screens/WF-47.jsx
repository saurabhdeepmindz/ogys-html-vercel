/* WF-47 Location Teams & Rules View - Admin. FR-028.2, 028.3, 028.8. */
(function () {
function Screen() {
  const {size} = useWF(); const two = size === 'desktop';
  const team = (title, mark, rows) => <Panel title={<span>{title} {mark}</span>} right={<OAct small icon="user-plus">Add member</OAct>} pad={false}>
    <DataTable cardTitle="n" columns={[{key: 'n', label: 'Name'}, {key: 'r', label: 'Role'}, {key: 'x', label: '', align: 'right'}]} rows={rows.map((r, i) => ({key: i, n: r[0], r: r[1], x: <OAct small icon="x">Remove</OAct>}))}/></Panel>;
  return <AppShell active="WF-47" title="Teams and rules - STAR GROUP · Sagar-MP" subtitle="Who looks after this location, and the rules that apply to it">
    <div style={{display: 'grid', gridTemplateColumns: two ? '1fr 1fr' : '1fr', gap: 16}}>
      {team('Sales team', <Mark n={1}/>, [['Vivek Jain', 'BDM'], ['Kunal M.', 'FS'], ['S. Tiwari', 'ZBDM']])}
      {team('Operations team', <Mark n={2}/>, [['Rohit Verma', 'OC'], ['P. Nair', 'BM']])}</div>
    <Panel title={<span>Settings by category <Mark n={3}/></span>} pad={false}><DataTable cardTitle="c" columns={[{key: 'c', label: 'Part category'}, {key: 'mg', label: 'MAX generation (by sale type)'}, {key: 'nm', label: 'NM setting'}, {key: 'mx', label: 'MAX setting'}]}
      rows={[['Spare Part', 'Workshop + counter', 'Mother', 'Location MAX'], ['Accessories', 'Counter', 'Own', 'Location MAX'], ['Oil', 'Workshop', 'Own', 'Fixed MAX']].map((r, i) => ({key: i, c: r[0], mg: r[1], nm: r[2], mx: r[3]}))}/></Panel>
    <Panel title={<span>Rules that apply <Mark n={4}/></span>} sub="Read-only - each opens its rule screen"><div style={{display: 'grid', gridTemplateColumns: two ? 'repeat(3,1fr)' : '1fr', gap: 12}}>
      {[['OOQ calculation', 'Dynamic rule - Mahindra default', 'sliders-horizontal'], ['OGS rule', 'Mother MAX - children Satna, Vidisha', 'git-fork'], ['SOQ rules', 'TOC skip · CBO off · ITO > Gainer > OEM', 'calculator']].map(r =>
        <div key={r[0]} style={{border: '1px solid var(--wf-border)', padding: 12}}><div style={{display: 'flex', gap: 8, alignItems: 'center', fontWeight: 600, color: 'var(--wf-heading)'}}><Ic name={r[2]} size={16}/>{r[0]}</div>
          <div style={{fontSize: 14, marginTop: 6}}>{r[1]}</div></div>)}</div></Panel>
  </AppShell>;
}
WFScreen('WF-47', Screen);
})();
