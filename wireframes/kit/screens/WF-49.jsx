/* WF-49 OGS MAX & Stock Rules - Admin (reference FRD - not discussed). FR-030.1-030.5, 030.14. */
(function () {
function Screen() {
  const {size} = useWF();
  const rules = [['Rule 1', 'Mother MAX = sum of the children\'s MAX; children\'s stock not added'], ['Rule 2', 'Sum of children\'s MAX plus sum of children\'s stock'], ['Rule 3', 'Mother MAX and mother stock only'], ['Rule 4', 'To be defined by the client']];
  return <AppShell active="WF-49" title="OGS MAX and stock rules" subtitle="How a mother location's MAX and stock are counted - from the reference document" actions={<OAct primary icon="check">Save</OAct>}>
    <Note tone="warn">From the reference document; not discussed in the sessions.</Note>
    <ORuleScope applies="Mahindra - default Rule 3; STAR GROUP Sagar-MP Rule 1" mark={<Mark n={1}/>}/>
    <Ask id="CQ-48"><Panel title={<span>Rule <Mark n={2}/></span>} sub="Choose the rule for this level - not hard-coded"><div style={{display: 'grid', gridTemplateColumns: size === 'desktop' ? '1fr 1fr' : '1fr', gap: 10}}>
      {rules.map(([k, t], i) => <label key={k} style={{display: 'flex', gap: 10, alignItems: 'flex-start', padding: 12, border: '1px solid ' + (i === 0 ? 'var(--wf-accent)' : 'var(--wf-border)'), background: i === 0 ? 'var(--wf-accent-tint)' : 'var(--wf-surface)', opacity: i === 3 ? .6 : 1}}>
        <span style={{width: 18, height: 18, marginTop: 2, borderRadius: '50%', border: '2px solid var(--wf-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none'}}>{i === 0 && <i style={{width: 8, height: 8, borderRadius: '50%', background: 'var(--wf-primary)'}}/>}</span>
        <div><b>{k}</b>{i === 3 && <Mark n={3} open/>}<div style={{fontSize: 14}}>{t}</div></div></label>)}</div></Panel></Ask>
  </AppShell>;
}
WFScreen('WF-49', Screen);
})();
