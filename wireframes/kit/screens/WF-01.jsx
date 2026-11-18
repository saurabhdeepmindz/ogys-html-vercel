/* WF-01 Login - every role that signs in. FR-027.1, FR-027.7, FR-027.8. Clickable (pilot): sign in by password or a
   one-time code, forgot password, and the landing page of the chosen role opens. */
(function () {
const {useState} = React;
function Screen({role}) {
  const {size, annotated} = useWF(); const narrow = size === 'mobile';
  const data = window.WF_DATA || {};
  const roles = Object.entries(data.roles || {}).map(([id, r]) => ({value: id, label: r.actor}));
  const [who, setWho] = useState(roles.some(r => r.value === role) ? role : (roles[0] || {}).value);
  const [id, setId] = useState(''); const [pw, setPw] = useState(''); const [otp, setOtp] = useState(false);
  const [code, setCode] = useState(''); const [sent, setSent] = useState(false); const [err, setErr] = useState({});
  const [busy, setBusy] = useState(false);
  const signIn = () => {
    const e = {};
    if (!id.trim()) e.id = 'Enter your registered mobile number or e-mail ID.';
    else if (!/^[0-9 +]{10,14}$/.test(id.trim()) && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(id.trim())) e.id = 'That is not a mobile number or an e-mail ID.';
    if (otp ? !/^\d{6}$/.test(code) : !pw) e.pw = otp ? 'Enter the 6-digit code.' : 'Enter your password.';
    if (otp && !sent) e.pw = 'Send the code first.';
    setErr(e); if (Object.keys(e).length) return;
    if (/inactive/i.test(id)) return setErr({all: 'inactive'});
    setBusy(true);
    const land = ((data.roles || {})[who] || {}).landing;
    setTimeout(() => land ? WFGo(land, {role: who}) : wfNotBuilt('Landing page'), 500);
  };
  const forgot = async () => {
    const v = await wfConfirm({title: 'Reset your password', body: 'A reset link is sent to the mobile number or e-mail ID registered for you.', ok: 'Send reset link',
      input: {label: 'Mobile number or e-mail ID', value: id}});
    if (v) wfToast('ok', 'Reset link sent to ' + v + ' (sample - nothing is sent)');
  };
  return <div style={{minHeight: 720, display: 'grid', gridTemplateColumns: narrow ? '1fr' : size === 'tablet' ? '1fr 1fr' : '1.1fr 1fr', background: 'var(--wf-page)'}}>
    {!narrow && <div style={{background: 'var(--grad-hero, var(--wf-nav-bg))', color: '#fff', padding: '56px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 12}}><img src="ds/assets/logo-mark.png" alt="" style={{height: 34, filter: 'brightness(0) invert(1)'}}/>
        <span style={{font: '700 26px var(--wf-font-display)'}}>SpareCare</span></div>
      <div><div style={{font: '700 40px/1.1 var(--wf-font-display)', maxWidth: 460}}>OGYS - the right order, for every location, on its day</div>
        <p style={{opacity: .85, maxWidth: 440, lineHeight: 1.6}}>Order generation for the dealer network. Sign in with the mobile number or e-mail ID registered for you.</p></div>
      <div style={{fontSize: 12.5, opacity: .7}}>SpareCare · Order Generation System</div></div>}
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: narrow ? '32px 20px' : 48}}>
      <div style={{width: '100%', maxWidth: 400}}>
        {narrow && <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28}}><img src="ds/assets/logo-mark.png" alt="" style={{height: 30}}/><span style={{font: '700 24px var(--wf-font-display)', color: 'var(--wf-heading)'}}>SpareCare OGYS</span></div>}
        <h1 style={{margin: '0 0 6px', font: '700 30px var(--wf-font-display)', color: 'var(--wf-heading)'}}>Sign in</h1>
        <p style={{margin: '0 0 24px', color: 'var(--wf-muted)', fontSize: 14.5}}>Use your registered mobile number or e-mail ID.</p>
        <div style={{display: 'grid', gap: 16}}>
          <Input label={<span>Mobile number or e-mail ID <Mark n={1}/></span>} value={id} onChange={v => { setId(v); setErr({}); }} placeholder="98260 41377" mono error={err.id}/>
          <Ask id="CQ-10"><div>
            {otp ? <div style={{display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, alignItems: 'end'}}>
                <Input label={<span>One-time code <Mark n={2} open/></span>} value={code} onChange={v => setCode(v.replace(/\D/g, '').slice(0, 6))} placeholder="6 digits" mono error={err.pw}/>
                <OAct small onClick={() => { if (!id.trim()) return setErr({id: 'Enter your mobile number or e-mail ID first.'}); setSent(true); wfToast('ok', 'Code sent - use any 6 digits in this mockup'); }}>{sent ? 'Send again' : 'Send code'}</OAct></div>
              : <Input label={<span>Password <Mark n={2} open/></span>} type="password" value={pw} onChange={v => { setPw(v); setErr({}); }} placeholder="Your password" error={err.pw}/>}
            <div style={{display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', marginTop: 8, fontSize: 13.5}}>
              <a href="#" data-wf-nav="1" onClick={e => { e.preventDefault(); setOtp(!otp); setErr({}); }} style={{color: 'var(--wf-heading)'}}>{otp ? 'Sign in with a password instead' : 'Sign in with a one-time code instead'}</a>
              <a href="#" data-wf-nav="1" onClick={e => { e.preventDefault(); forgot(); }} style={{color: 'var(--wf-heading)'}}>Forgot password<Mark n={4}/></a></div></div></Ask>
          <Select label="Sign in as (mockup only - the role comes from the user's profile)" value={who} options={roles} onChange={setWho}/>
          <OAct primary icon="log-in" onClick={signIn} disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</OAct>
          {(err.all === 'inactive' || annotated) && <Note tone="warn"><b>This user is inactive.</b> Ask your administrator to reactivate the account.<Mark n={3}/>
            {annotated && err.all !== 'inactive' && <div style={{fontSize: 12.5, marginTop: 4}}>Shown here for review; in the mockup it appears for an ID containing "inactive".</div>}</Note>}
          <div style={{fontSize: 13, color: 'var(--wf-muted)', lineHeight: 1.5}}>After sign-in you see only the brands, dealers and locations assigned to you.<Mark n={5}/></div></div></div></div></div>;
}
WFScreen('WF-01', Screen);
})();
