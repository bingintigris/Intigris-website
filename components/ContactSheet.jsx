// ContactSheet.jsx, the shared "Let's talk" panel used across the site.
// Saves every submission into the Supabase `inquiries` table so it shows up
// in the admin portal under Inquiries.
// Exposes: window.SiteContactSheet
//
// Props:
//   open      : boolean
//   onClose   : () => void
//   subject   : optional pre-filled subject (e.g. 'AI readiness scan')
//   message   : optional pre-filled message
//   source    : optional label stored as source_page (defaults to the URL path)

function SiteContactSheet({ open, onClose, subject = '', message = '', source }) {
  const { useState, useEffect, useMemo } = React;
  const tx = window.tx || ((en) => en);

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');

  const sb = useMemo(
    () => (window.supabase && window.SUPABASE_URL
      ? window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY)
      : null),
    []
  );

  // Reset (and apply any pre-filled subject/message) each time it opens.
  useEffect(() => {
    if (open) {
      setForm({ name: '', email: '', subject: subject || '', message: message || '' });
      setSent(false); setErr(''); setSending(false);
    }
  }, [open, subject, message]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setErr(tx('Please add your name and email.', 'Vul uw naam en e-mailadres in.'));
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) {
      setErr(tx('Please enter a valid email address.', 'Vul een geldig e-mailadres in.'));
      return;
    }
    setSending(true); setErr('');

    // Never fake success: if we cannot reach the database, say so.
    if (!sb) {
      console.error('[ContactSheet] Supabase client unavailable. window.supabase:', !!window.supabase, 'SUPABASE_URL:', !!window.SUPABASE_URL);
      setSending(false);
      setErr(tx(
        'We could not reach our system just now. Please email info@intigris.nl and we will pick it up right away.',
        'We konden ons systeem nu niet bereiken. Mail info@intigris.nl en we pakken het direct op.'
      ));
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim() || null,
      message: form.message.trim() || null,
      source_page: source || (window.location.pathname.replace(/^\//, '') || 'index.html'),
    };
    console.log('[ContactSheet] saving inquiry…', payload);

    // Note: no .select() here. Reading the row back would also require a
    // public read permission, which we deliberately do not grant.
    const { error } = await sb.from('inquiries').insert(payload);

    setSending(false);
    if (error) {
      console.error('[ContactSheet] insert failed:', error);
      setErr(tx(
        'Something went wrong sending your message: ',
        'Er ging iets mis bij het verzenden: '
      ) + error.message);
      return;
    }
    console.log('[ContactSheet] inquiry saved ✓');
    setSent(true);
  }

  if (!open) return null;

  const fieldStyle = (multiline) => ({
    fontFamily: 'inherit', fontSize: 16, fontWeight: 400,
    color: 'var(--intigris-dark-brown)',
    minHeight: multiline ? 110 : 50,
    padding: multiline ? '14px 16px' : '0 16px',
    background: 'var(--intigris-paper)',
    border: '1.5px solid var(--border)',
    borderRadius: 10, outline: 'none', resize: 'vertical',
  });

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(64,35,1,0.42)', backdropFilter: 'blur(4px)',
      display: 'flex', justifyContent: 'flex-end',
      animation: 'fadeIn 220ms cubic-bezier(0.22,0.61,0.36,1)',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: 'var(--intigris-off-white)', width: '100%', maxWidth: 520, height: '100%',
        padding: 56, overflowY: 'auto', boxShadow: '-20px 0 60px rgba(0,0,0,0.18)',
        animation: 'slideRight 320ms cubic-bezier(0.22,0.61,0.36,1)', position: 'relative',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 20, right: 20, width: 36, height: 36, borderRadius: 999,
          background: 'transparent', border: '1px solid var(--border)', cursor: 'pointer',
          color: 'var(--intigris-dark-brown)', fontSize: 18,
        }} aria-label="Close">×</button>

        {!sent ? (
          <>
            <div className="eyebrow" style={{ marginBottom: 16 }}>{tx('CONTACT · WE GOT YOU', 'CONTACT · WE ZIJN ER VOOR U')}</div>
            <h3 style={{ fontSize: 44, fontWeight: 500, letterSpacing: '-0.022em', lineHeight: 1.04, margin: 0 }}>
              {tx("Let's ", 'Laten we ')}<span style={{ color: 'var(--intigris-coral)' }}>{tx('talk.', 'praten.')}</span>
            </h3>
            <p style={{ marginTop: 14, fontSize: 16, fontWeight: 400, color: 'var(--fg-muted)' }}>
              {tx(
                "Tell us briefly what you're working on. We'll get back within a working day.",
                'Vertel ons kort waar u mee bezig bent. We reageren binnen één werkdag.'
              )}
            </p>

            <form onSubmit={submit} style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span className="eyebrow eyebrow--bare">{tx('Name', 'Naam')}</span>
                <input value={form.name} onChange={(e) => set('name', e.target.value)}
                  placeholder="Anna de Vries" style={fieldStyle(false)} />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span className="eyebrow eyebrow--bare">{tx('Work email', 'Zakelijk e-mailadres')}</span>
                <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)}
                  placeholder="u@uwbedrijf.nl" style={fieldStyle(false)} />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span className="eyebrow eyebrow--bare">{tx('Subject', 'Onderwerp')}</span>
                <input value={form.subject} onChange={(e) => set('subject', e.target.value)}
                  placeholder={tx('What is your message about?', 'Waar gaat uw bericht over?')} style={fieldStyle(false)} />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span className="eyebrow eyebrow--bare">{tx('What can we help with?', 'Waar kunnen we u mee helpen?')}</span>
                <textarea rows={4} value={form.message} onChange={(e) => set('message', e.target.value)}
                  placeholder={tx('Salesforce implementation, integration, field service…', 'Salesforce-implementatie, integratie, field service…')}
                  style={fieldStyle(true)} />
              </label>

              {err && (
                <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.45, color: 'var(--intigris-coral-700)' }}>{err}</div>
              )}

              <button type="submit" disabled={sending} className="btn btn-primary btn-lg"
                style={{ alignSelf: 'flex-start', marginTop: 12, color: 'var(--intigris-off-white)', opacity: sending ? 0.6 : 1, cursor: sending ? 'wait' : 'pointer' }}>
                {sending ? tx('Sending…', 'Verzenden…') : tx('Send', 'Verstuur')} <span className="arrow">→</span>
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="eyebrow" style={{ marginBottom: 16 }}>{tx('THANK YOU', 'BEDANKT')}</div>
            <h3 style={{ fontSize: 44, fontWeight: 500, letterSpacing: '-0.022em', lineHeight: 1.04, margin: 0 }}>
              {tx('We got you.', 'We zijn er voor u.')} <span style={{ color: 'var(--intigris-coral)' }}>→</span>
            </h3>
            <p style={{ marginTop: 14, fontSize: 16, fontWeight: 400, color: 'var(--fg-muted)' }}>
              {tx(
                'Your submission has been received. An Intigrant will reach out within a working day.',
                'We hebben uw bericht ontvangen. Een Intigrant neemt binnen één werkdag contact met u op.'
              )}
            </p>
            <button onClick={onClose} className="btn btn-secondary" style={{ marginTop: 28 }}>
              {tx('Back to the site', 'Terug naar de site')}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

window.SiteContactSheet = SiteContactSheet;
