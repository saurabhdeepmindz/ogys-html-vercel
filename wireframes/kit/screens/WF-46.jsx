/* WF-46 Location Master - Admin edits; sales and operations view with Request to Edit. FR-028.1, 028.2, 028.5, 028.9, 028.10, FR-027.6. */
(function () {
function Screen({role}) {
  const {size} = useWF(); const view = role === 'A3' || role === 'A4';
  const g = size === 'desktop' ? 'repeat(3,1fr)' : size === 'tablet' ? '1fr 1fr' : '1fr';
  return <AppShell active={view ? 'WF-46' : 'WF-46'} title="STAR GROUP · Sagar-MP" subtitle={view ? 'Location details · view only' : 'Location master · Mahindra'}
    actions={view ? <><OAct primary icon="send">Request to edit</OAct><Mark n={6}/></> : <><OAct icon="power">Deactivate</OAct><OAct primary icon="check">Save</OAct></>}>
    {view && <Note>You can view this location. To change something, raise a request to edit - it goes to the person above you.</Note>}
    <Panel title={<span>Location <Mark n={1}/></span>}><div style={{display: 'grid', gridTemplateColumns: g, gap: 12}}>
      <Select label="Dealer" value="STAR GROUP"/><Select label="Location" value="Sagar-MP"/><Select label={<span>Zone<Mark n={2}/></span>} value="Central"/>
      <Select label="OEM location code" value="MH-LOC-40711-01"/><Select label="OEM location name" value="STAR AUTO SAGAR"/><Select label="OEM identifier (scope location)" value="SGR-01"/></div></Panel>
    <Panel title={<span>Ordering day and lead time by part category <Mark n={3}/></span>} pad={false}>
      <DataTable cardTitle="c" columns={[{key: 'c', label: 'Part category'}, {key: 'd', label: 'Ordering day'}, {key: 'oc', label: 'OC (days)', align: 'right'}, {key: 'lt', label: 'LT (days)', align: 'right'}]}
        rows={[['Spare Part', 'Thursday', 7, 4], ['Accessories', 'Monday', 15, 6], ['Oil', '1st and 15th', 15, 3]].map((r, i) => ({key: i, c: r[0], d: r[1], oc: r[2], lt: r[3]}))}/></Panel>
    <Ask id="CQ-30"><Panel title={<span>Mother and child locations <Mark n={4} open/></span>}><KV cols={size === 'mobile' ? 1 : 3} pairs={[['This location', 'Mother'], ['Children', 'Satna-MP, Vidisha-MP'], ['Set at', 'Onboarding (NM setting)']]}/></Panel></Ask>
    <Note>Ordering days are held at dealer level and, where different, at location level.<Mark n={5}/></Note>
  </AppShell>;
}
WFScreen('WF-46', Screen);
})();
