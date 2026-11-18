/* WF-43 Profiles & Page Rights - Admin. FR-027.2, 027.3, 027.6, 027.9. */
(function () {
function Screen() {
  const {size} = useWF();
  const pages = ['Scheduled orders', 'Dealer readiness', 'Adjustments', 'Order Day Tracker', 'Location master', 'OOQ rules', 'SOQ rules'];
  const r = {View: [1, 1, 1, 1, 1, 1, 1], Edit: [0, 0, 0, 0, 0, 0, 0], Download: [1, 0, 0, 1, 0, 0, 0], 'Request to Edit': [0, 0, 0, 0, 1, 0, 0]};
  return <AppShell active="WF-43" title="Profiles and page rights" subtitle="What each profile may do on each page" actions={<OAct primary icon="plus">Add profile</OAct>}>
    <div style={{display: 'grid', gridTemplateColumns: size === 'desktop' ? '280px 1fr' : '1fr', gap: 16, alignItems: 'start'}}>
      <Panel pad={false} title={<span>Profiles <Mark n={1}/></span>}><DataTable cardTitle="n" columns={[{key: 'c', label: 'Code', mono: true}, {key: 'n', label: 'Name'}, {key: 'a', label: ''}]}
        rows={[['ADM', 'Admin'], ['ORD', 'Order team'], ['BDM', 'BDM'], ['ZBDM', 'ZBDM'], ['OC', 'OC'], ['BM', 'BM']].map((p, i) => ({key: i, c: p[0], n: i === 2 ? <b>{p[1]}</b> : p[1], a: <window.Pill tone="ok" dot={false}>Active</window.Pill>}))}/></Panel>
      <div>
        <Panel title={<span>Rights - BDM <Mark n={2}/></span>} sub="View, Edit, Download, Request to Edit per page" pad={false}>
          <DataTable cardTitle="p" columns={[{key: 'p', label: 'Page'}].concat(Object.keys(r).map(k => ({key: k, label: k, align: 'center'})))}
            rows={pages.map((p, i) => Object.assign({key: i, p}, ...Object.keys(r).map(k => ({[k]: <Check on={!!r[k][i]}/>}))))}/></Panel>
        <div style={{display: 'grid', gridTemplateColumns: size === 'mobile' ? '1fr' : '1fr 1fr', gap: 16}}>
          <Panel title={<span>Extra rights for one person <Mark n={3}/></span>}><KV cols={1} pairs={[['Vivek Jain (BDM)', 'Edit on Location master']]}/><div style={{marginTop: 10}}><OAct small icon="plus">Add</OAct></div></Panel>
          <Panel title={<span>Functional roles <Mark n={4}/></span>}><KV cols={1} pairs={[['Order builder', 'Order team'], ['Order approver', 'Order team'], ['Key accounts', 'BDM']]}/></Panel></div>
        <Ask id="CQ-27"><Panel title={<span>Requests to edit (3) <Mark n={5}/></span>} pad={false}><DataTable cardTitle="who" columns={[{key: 'who', label: 'From'}, {key: 'pg', label: 'Page · record'}, {key: 'to', label: 'Goes to'}, {key: 'x', label: '', align: 'right'}]}
          rows={[{key: 1, who: 'Vivek Jain (BDM)', pg: 'Location master · Satna-MP', to: 'ZBDM (above in hierarchy)', x: <span style={{display: 'inline-flex', gap: 6}}><OAct small primary>Approve</OAct><OAct small>Reject</OAct></span>}]}/></Panel></Ask></div></div>
  </AppShell>;
}
WFScreen('WF-43', Screen);
})();
