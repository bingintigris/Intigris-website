// Newsletter sign-up band, sits above the footer on the home page.
// Coral background, all-white content. Saves signups into Supabase `subscribers`.
// Exposes: window.SiteNewsletter

function SiteNewsletter() {
  const tx = window.tx || ((en) => en);
  const { useState } = React;
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const [err, setErr] = useState('');

  const sb = React.useMemo(
    () => (window.supabase && window.SUPABASE_URL ? window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY) : null),
    []
  );

  async function submit(e) {
    e.preventDefault();
    const v = email.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) { setErr(tx('Please enter a valid email.', 'Vul een geldig e-mailadres in.')); setStatus('error'); return; }
    setStatus('sending'); setErr('');

    // Never fake success: if we cannot reach the database, say so.
    if (!sb) {
      console.error('[Newsletter] Supabase client unavailable.');
      setErr(tx(
        'We could not reach our system just now. Please try again shortly.',
        'We konden ons systeem nu niet bereiken. Probeer het straks opnieuw.'
      ));
      setStatus('error');
      return;
    }

    const page = window.location.pathname.replace(/^\//, '') || 'index.html';
    const { error } = await sb.from('subscribers').insert({ email: v, source_page: page });

    // An existing address is not a real failure, just confirm it.
    if (error && !/duplicate|unique/i.test(error.message)) {
      console.error('[Newsletter] subscribe failed:', error);
      setErr(tx(
        'Something went wrong signing you up. Please try again, or email info@intigris.nl.',
        'Er ging iets mis bij het aanmelden. Probeer het opnieuw, of mail info@intigris.nl.'
      ));
      setStatus('error');
      return;
    }

    console.log('[Newsletter] subscribed ✓');
    setStatus('done'); setEmail('');
  }

  return (
    <section style={{ background: 'var(--intigris-coral)', color: 'var(--intigris-off-white)', padding: 'clamp(48px, 6vw, 88px) 0' }}>
      <div className="container-wide nl-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 'clamp(32px, 5vw, 64px)', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--intigris-off-white)' }}>
            {tx('NEWSLETTER', 'NIEUWSBRIEF')}
          </div>
          <h2 style={{ fontSize: 'clamp(34px, 4.5vw, 56px)', fontWeight: 500, letterSpacing: '-0.026em', lineHeight: 1.02, margin: '12px 0 0', color: 'var(--intigris-dark-brown)' }}>
            {tx('Stay in the ', 'Blijf op de ')}<span style={{ fontStyle: 'italic', color: 'var(--intigris-off-white)' }}>{tx('loop.', 'hoogte.')}</span>
          </h2>
          <p style={{ margin: '16px 0 0', fontSize: 17, fontWeight: 500, color: 'rgba(252,247,235,0.9)', maxWidth: 440 }}>
            {tx(
              'Get the latest insights on new product releases, Salesforce updates, and business solutions, a few times a quarter.',
              'Ontvang de laatste inzichten over nieuwe productreleases, Salesforce-updates en business solutions, een paar keer per kwartaal.'
            )}
          </p>
        </div>

        <div>
          {status === 'done' ? (
            <div>
              <div style={{ fontSize: 22, fontWeight: 500, color: 'var(--intigris-off-white)' }}>
                {tx('You’re in. ', 'Je bent aangemeld. ')}<span aria-hidden>→</span>
              </div>
              <p style={{ marginTop: 8, fontSize: 15, color: 'rgba(252,247,235,0.85)' }}>
                {tx('Thanks for subscribing, keep an eye on your inbox.', 'Bedankt voor je aanmelding, hou je inbox in de gaten.')}
              </p>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div className="nl-form" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder={tx('Please insert your email here', 'Vul hier je e-mailadres in')}
                  style={{
                    flex: 1, minWidth: 0, height: 52, borderRadius: 999, border: '1.5px solid rgba(64,35,1,0.2)',
                    background: 'var(--intigris-off-white)', padding: '0 20px', fontFamily: 'inherit',
                    fontSize: 16, color: 'var(--intigris-dark-brown)', outline: 'none',
                  }}
                />
                <button type="submit" disabled={status === 'sending'} className="btn btn-lg"
                  style={{ background: 'var(--intigris-dark-brown)', color: 'var(--intigris-off-white)' }}>
                  {status === 'sending' ? tx('Subscribing…', 'Aanmelden…') : tx('Subscribe', 'Aanmelden')} <span className="arrow">→</span>
                </button>
              </div>
              {status === 'error' && <div style={{ marginTop: 10, fontSize: 14, color: 'var(--intigris-off-white)', fontWeight: 500 }}>{err}</div>}
              <div style={{ marginTop: 12, fontSize: 13, fontWeight: 500, color: 'rgba(252,247,235,0.85)' }}>
                {tx('No spam. We respect your inbox.', 'Geen spam. We respecteren je inbox.')}
              </div>
            </form>
          )}
        </div>
      </div>
      <style>{`@media (max-width: 820px) { .nl-grid { grid-template-columns: 1fr !important; gap: 28px !important; } }`}</style>
    </section>
  );
}

window.SiteNewsletter = SiteNewsletter;
