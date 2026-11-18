/* WF-40 Update Feedback (covers Feedback Checks) - Dealer SPM, phone-first. FR-026.2-026.5, FR-019.1, 019.2. */
(function () {
function Screen() {
  const {size} = useWF();
  const lines = [['0305AAB01661N', 12, 12, '', 'ok'], ['1601CAA00091N', 40, 25, 'Not required / not moving', 'short'], ['0601BAF00141N', 5, 0, '', 'notplaced'], ['2201XYZ00011N', 0, 6, '', 'excess']];
  const tag = {ok: ['ok', 'As suggested'], short: ['warn', 'Placed short'], notplaced: ['bad', 'Not placed'], excess: ['warn', 'Excess']};
  return <AppShell active="WF-40" title="Order feedback" subtitle="ORD-26-04812 · tell us what you actually placed" actions={<OAct primary icon="send">Submit feedback</OAct>}>
    <Panel title={<span>How <Mark n={1}/></span>}><div style={{display: 'grid', gridTemplateColumns: size === 'mobile' ? '1fr' : '1fr 1fr', gap: 12}}>
      <OAct icon="pencil">Line by line, here</OAct><OAct icon="upload">Upload the edited order file</OAct></div>
      <div style={{marginTop: 12}}><Select label={<span>Company PO number<Mark n={2}/></span>} value="POA-7781201"/></div></Panel>
    <Ask id="CQ-53"><Panel pad={false} title={<span>Lines that need a reason <Mark n={3}/></span>} sub="Excess, short and not-placed lines need a predefined remark">
      <DataTable cardTitle="p" rowTone={r => r._t === 'notplaced' ? 'bad' : r._t === 'ok' ? null : 'warn'} columns={[{key: 'p', label: 'Part', mono: true}, {key: 's', label: 'Suggested', align: 'right'}, {key: 'pl', label: 'Placed', align: 'right'}, {key: 't', label: 'Check'}, {key: 'r', label: <span>Reason<Mark n={4} open/></span>, wide: true}]}
        rows={lines.map((l, i) => ({key: i, _t: l[4], p: l[0], s: l[1], pl: l[2], t: <window.Pill tone={tag[l[4]][0]}>{tag[l[4]][1]}</window.Pill>, r: l[4] === 'ok' ? '-' : <Select value={l[3] || 'Choose a reason'} style={{minWidth: 200}}/>}))}/></Panel></Ask>
    <Note tone="warn">Alternate part placed: 0305AAB01661M instead of 0305AAB01661N - please confirm it is the family part.<Mark n={5}/></Note>
    <Note>The same feedback is given for the editable, gainer and internal transfer orders.<Mark n={6}/></Note>
  </AppShell>;
}
WFScreen('WF-40', Screen);
})();
