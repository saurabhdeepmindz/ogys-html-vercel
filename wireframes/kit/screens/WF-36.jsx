/* WF-36 Company PO File Upload - order team. FR-001.5, FR-007.5, FR-008.1-008.3. */
(function () {
function Screen() {
  const {size} = useWF();
  return <AppShell active="WF-36" title="Company PO file" subtitle="Links each company PO number to the Sparecare order and the location it was for"
    actions={<OAct primary icon="check">Save mapping</OAct>}>
    <Panel title={<span>Upload <Mark n={1}/></span>}>
      <div style={{display: 'grid', gridTemplateColumns: size === 'mobile' ? '1fr' : '1fr 2fr', gap: 12, alignItems: 'end'}}>
        <Select label="Sparecare order number" value="ORD-26-04812"/><OUpload label="Company PO file" file="STARGROUP_PO_06112026.xlsx" note="PO no. · part · alternate part · placed qty"/></div></Panel>
    <Panel title={<span>PO to order and location <Mark n={2}/></span>} sub="Filled from the file; correct a row if it is wrong" pad={false}>
      <Ask id="CQ-21"><DataTable cardTitle="po" rowTone={r => r._u ? 'warn' : null} columns={[{key: 'po', label: 'Company PO number', mono: true}, {key: 'ord', label: 'Sparecare order', mono: true}, {key: 'loc', label: 'Location'},
        {key: 'l', label: 'Lines', align: 'right'}, {key: 'x', label: '', align: 'right'}]}
        rows={[{key: 1, po: 'POA-7781201', ord: 'ORD-26-04812', loc: 'Sagar-MP', l: 196, x: <OAct small icon="pencil">Edit</OAct>},
               {key: 2, po: 'POB-7781202', ord: 'ORD-26-04813', loc: 'Satna-MP', l: 41, x: <OAct small icon="pencil">Edit</OAct>},
               {key: 3, _u: 1, po: 'POX-7780990', ord: <span style={{color: 'var(--wf-warn-fg)', fontWeight: 600}}>Not matched<Mark n={3} open/></span>, loc: <Select value="Choose location" style={{minWidth: 150}}/>, l: 6, x: <OAct small primary icon="link">Link</OAct>}]}/></Ask></Panel>
    <Note tone="warn">A PO that matches no Sparecare order is held here for you instead of being counted against the placing location.</Note>
  </AppShell>;
}
WFScreen('WF-36', Screen);
})();
