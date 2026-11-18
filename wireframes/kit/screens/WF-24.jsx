/* WF-24 Setting Master / Add New Setting (Auto Approval, sender side) - Admin. FR-011.1-011.7, FR-012.1-012.12; S02 today. */
(function () {
function Screen() {
  const {size} = useWF();
  return <AppShell active="WF-24" title="Auto approval - internal transfer setting" subtitle="When a location may give a part to another location of the dealer" actions={<OAct primary icon="check">Save setting</OAct>}>
    <Panel title={<span>Setting <Mark n={1}/></span>}><div style={{display: 'grid', gridTemplateColumns: size === 'desktop' ? 'repeat(5,1fr)' : '1fr 1fr', gap: 12}}>
      <Select label="Level" value="Dealer"/><Select label="Dealer" value="STAR GROUP"/><Select label="Allowed category" value={['Spare Part', 'Oil']} multi/><Select label="Duplicate order check (days)" value="7"/><Select label="Gainer stock check" value="Yes"/></div></Panel>
    <Ask id="CQ-45"><Panel title={<span>Location sets <Mark n={2}/></span>}><KV cols={size === 'mobile' ? 1 : 3} pairs={[['First set', 'Sagar-MP, Satna-MP, Vidisha-MP'], ['Sister set', 'Damoh-MP, Katni-MP'], ['Overall sister', 'All MP locations']]}/></Panel></Ask>
    <Panel pad={false} title={<span>Internal transfers - one row per sender and stock quality <Mark n={3}/></span>} right={<OAct small icon="plus">Add row</OAct>}>
      <DataTable cardTitle="s" columns={[{key: 's', label: 'Sender'}, {key: 'q', label: 'Stock quality'}, {key: 'r', label: <span>Value at least<Mark n={4}/></span>, align: 'right'}, {key: 'e', label: <span>Excess days at least<Mark n={5}/></span>, align: 'right'},
        {key: 'a', label: <span>Keep back (days)<Mark n={6}/></span>, align: 'right'}, {key: 'p', label: <span>Exclude recent<Mark n={7}/></span>, hide: 'tablet'}]}
        rows={[['Sagar-MP', 'Moving', 'Rs 250', 45, 30, '3-month purchase · last-month arrival'], ['Sagar-MP', 'Non-moving', 'Rs 100', 1, 0, '-'], ['Sagar-MP', 'Non-stockable', 'Rs 250', 60, 0, 'Last-month arrival']].map((r, i) => ({key: i, s: r[0], q: r[1], r: r[2], e: r[3], a: r[4], p: r[5]}))}/></Panel>
    <Panel pad={false} title={<span>Clusters <Mark n={8}/></span>}><DataTable cardTitle="c" columns={[{key: 'c', label: 'Cluster'}, {key: 'q', label: 'Stock quality'}, {key: 'g', label: 'Group non-stockable'}, {key: 'd', label: 'Raised demand mandatory'}, {key: 'x', label: 'Discount at least', align: 'right'}]}
      rows={[{key: 1, c: 'MP Central', q: 'Moving', g: 'N', d: 'Y', x: '-'}, {key: 2, c: 'MP Central', q: 'Non-moving', g: 'Y', d: 'N', x: '5 %'}]}/></Panel>
    <Note>Outcome per part: whether the sender can give it and what quantity - the category is mapped and stock quality checked first.</Note>
  </AppShell>;
}
WFScreen('WF-24', Screen);
})();
