/* WF-42 User Management - Admin. FR-027.1, 027.7, 027.8, 027.10. */
(function () {
function Screen() {
  const {size} = useWF();
  const users = [['Ritu Sharma', '98260 41377', 'ritu.s@sparecare.in', 'Order consultant', 'Order team', 'Mahindra · Central', 1], ['Aman Kumar', '99770 22811', 'aman.k@sparecare.in', 'Order consultant', 'Order team', 'Tata · Central', 1],
    ['Vivek Jain', '98930 77120', 'vivek.j@sparecare.in', 'BDM', 'Sales', 'Mahindra · 18 locations', 1], ['Neha Gupta', '97520 11904', 'neha.g@sparecare.in', 'Administrator', 'Admin', 'All', 1], ['Rohit Verma', '98270 55613', 'rohit.v@sparecare.in', 'OC', 'Operations', 'Tata · 9 locations', 0]];
  return <AppShell active="WF-42" title="Users" subtitle="61 active · 4 inactive" actions={<OAct primary icon="user-plus">Add user</OAct>}>
    <FilterBar search="Name, mobile or mail" filters={[{label: 'Profile', value: 'All'}, {label: 'Status', value: 'Active'}]}/>
    <div style={{display: 'grid', gridTemplateColumns: size === 'desktop' ? '1.5fr 1fr' : '1fr', gap: 16, alignItems: 'start'}}>
      <Panel pad={false} title={<span>User list <Mark n={1}/></span>}><DataTable cardTitle="n" rowTone={r => r._a ? null : 'warn'} columns={[{key: 'n', label: 'Name'}, {key: 'm', label: 'Mobile', mono: true, hide: 'tablet'}, {key: 'p', label: 'Profile'}, {key: 's', label: 'Data scope', hide: 'tablet'}, {key: 'a', label: 'Status'}]}
        rows={users.map((u, i) => ({key: i, _a: u[6], n: <span><b>{u[0]}</b><div style={{fontSize: 12.5, color: 'var(--wf-muted)'}}>{u[3]}</div></span>, m: u[1], p: u[4], s: u[5], a: u[6] ? <window.Pill tone="ok">Active</window.Pill> : <window.Pill tone="neutral">Inactive</window.Pill>}))}/></Panel>
      <Panel title={<span>Edit user - Ritu Sharma <Mark n={2}/></span>}>
        <div style={{display: 'grid', gap: 10}}>
          <KV cols={2} pairs={[['Mobile', <span>98260 41377 <window.Pill tone="ok">Verified</window.Pill></span>], ['Mail', <span>ritu.s@sparecare.in <window.Pill tone="ok">Verified</window.Pill></span>]]}/>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10}}><Select label="Designation" value="Order consultant"/><Ask id="CQ-26"><Select label={<span>Sequence no.<Mark n={6} open/></span>} value="14"/></Ask></div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10}}><Select label={<span>Profile<Mark n={3}/></span>} value="Order team"/><Select label="Functional role" value="Order builder"/></div>
          <Select label={<span>Data scope - brand / dealer / location<Mark n={4}/></span>} value={['Mahindra', 'Central zone']} multi/>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4}}><OSwitch on label="Active"/><Mark n={5}/><OAct primary small icon="check">Save</OAct></div></div></Panel></div>
  </AppShell>;
}
WFScreen('WF-42', Screen);
})();
