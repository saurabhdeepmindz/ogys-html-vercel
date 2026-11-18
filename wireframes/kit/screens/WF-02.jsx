/* WF-02 Admin Dashboard - landing page of the Sparecare Admin. Tiles from FR-022.7, FR-027, FR-028, FR-029, FR-004.6 (assumed).
   Clickable (pilot): the dealer figures come from the dealer master sample (WF-45) and open it filtered; brands and
   recent changes open the rule or notification screen; the tiles of other roles' screens say so. */
(function () {
function Screen() {
  const {size} = useWF(); const two = size === 'desktop';
  const [dealers] = useStore('dealers', OGYS.MASTER);
  const act = dealers.filter(d => d.active), ina = dealers.filter(d => !d.active);
  const locs = act.reduce((n, d) => n + d.locs.length, 0);
  const zones = [...new Set(act.map(d => d.zone))];
  const today = new Date().toLocaleDateString('en-GB', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'});
  const brand = b => { const n = dealers.filter(d => d.brand === b).length; return n; };
  const set = (on, go) => <a href="#" data-wf-nav="1" onClick={e => { e.preventDefault(); go(); }} style={{textDecoration: 'none'}}>{on ? <window.Pill tone="ok">Set</window.Pill> : <window.Pill tone="neutral">Not set</window.Pill>}</a>;
  const changes = [{key: 1, when: '05-11 09:40', what: 'OOQ rule - Mahindra: pending PO age limit 20 to 15 days', who: 'Admin (Neha)', v: 'v7', to: 'WF-12'},
                   {key: 2, when: '04-11 17:12', what: 'Location Specific Rule - Satna-MP added as buyer', who: 'Admin (Neha)', v: 'v3', to: 'WF-25'},
                   {key: 3, when: '03-11 11:05', what: 'Notification rule - STAR GROUP: WhatsApp to service GM', who: 'Admin (Rahul)', v: 'v2', to: 'WF-33'}];
  return <AppShell active="WF-02" title="Admin dashboard" subtitle={today + ' · all brands'} actions={<OAct icon="settings">Settings</OAct>}>
    <Ask id="CQ-11"><Stats items={[{label: 'Orders today: scheduled', value: 50, mark: <Mark n={1}/>, note: 'Order team screens'}, {label: 'Generated', value: 12, tone: 'ok'}, {label: 'Pending', value: 38, tone: 'warn'},
      {label: 'Notifications failed', value: 2, tone: 'bad', mark: <Mark n={4}/>, onClick: () => WFGo('WF-33'), hint: 'Notification rules'}]}/></Ask>
    <div style={{display: 'grid', gridTemplateColumns: two ? '1fr 1fr 1fr' : '1fr', gap: 16}}>
      <Panel title={<span>Dealers and locations <Mark n={2}/></span>} sub="From the dealer master (sample)">
        <Stats items={[{label: 'Dealers active', value: act.length, tone: 'ok', onClick: () => WFGo('WF-45', {hash: 'status=Active'}), hint: 'Show them'},
                       {label: 'Inactive', value: ina.length, onClick: () => WFGo('WF-45', {hash: 'status=Inactive'}), hint: 'Show them'}]}/>
        <KV cols={2} pairs={[['Locations active', String(locs)], ['Zones', zones.join(' · ')]]}/>
        <div style={{marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap'}}><OAct small icon="store" onClick={() => WFGo('WF-45')}>Dealer master</OAct><OAct small icon="plus" onClick={() => WFGo('WF-45', {hash: 'new'})}>Add dealer</OAct></div></Panel>
      <Panel title={<span>Users <Mark n={3}/></span>}><KV cols={2} pairs={[['Active users', '61'], ['Inactive', '4'], ['Profiles', 'Admin · Order team · BDM · ZBDM · OC · BM'], ['Requests to edit', '3 waiting']]}/>
        <div style={{marginTop: 12}}><OAct small icon="users" onClick={() => WFGo('WF-42')}>User management</OAct></div></Panel>
      <Panel title="Brands configured" pad={false}><DataTable cardTitle="b" columns={[{key: 'b', label: 'Brand'}, {key: 'n', label: 'Dealers', align: 'right'}, {key: 'u', label: 'Upload settings'}, {key: 'r', label: 'Rules'}]}
        rows={[{key: 1, b: 'Mahindra', n: brand('Mahindra'), u: set(true, () => WFGo('WF-06')), r: set(true, () => WFGo('WF-12'))},
               {key: 2, b: 'Tata', n: brand('Tata'), u: set(true, () => WFGo('WF-06')), r: set(false, () => WFGo('WF-12'))},
               {key: 3, b: 'JCB', n: brand('JCB'), u: set(false, () => WFGo('WF-06')), r: set(false, () => WFGo('WF-12'))}]}/></Panel></div>
    <Panel pad={false} title={<span>Recent rule and setting changes <Mark n={5}/></span>} sub="Version log - every change kept with who and when · select a row to open the screen">
      <DataTable cardTitle="what" onRow={r => WFGo(r.to)} columns={[{key: 'when', label: 'When', nowrap: true}, {key: 'what', label: 'Change'}, {key: 'who', label: 'By'}, {key: 'v', label: 'Version', mono: true}]}
        rows={changes}/></Panel>
  </AppShell>;
}
WFScreen('WF-02', Screen);
})();
