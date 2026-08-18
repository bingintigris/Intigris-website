/* =============================================================================
   Cookie consent  (window.SiteCookieConsent)
   -----------------------------------------------------------------------------
   Nothing is tracked until the visitor agrees. The only cookie set before
   consent is the one remembering their choice, which is exempt from consent.

   TO SWITCH ON GOOGLE ANALYTICS 4
   Paste your measurement ID into GA4_ID below (looks like 'G-ABC123XYZ').
   That is the only edit needed. GA4 then loads for visitors who accept
   analytics, and never for those who don't.

   TO ADD A MARKETING TAG LATER (LinkedIn, Google Ads, Meta)
   Add it inside loadMarketing() near the bottom. It will only ever fire for
   visitors who accept marketing.
   ========================================================================== */

// Paste your GA4 measurement ID here when ready. Empty means no analytics
// script is loaded at all, for anyone.
const GA4_ID = window.GA4_MEASUREMENT_ID || '';

(function () {
  const COOKIE = 'intigris_consent';
  const DAYS = 180;          // re-ask after six months
  const VERSION = 1;         // bump to re-ask everyone after a policy change

  /* ----------------------------- cookie helpers ---------------------------- */
  function readCookie(name) {
    const hit = document.cookie.split('; ').find((c) => c.startsWith(name + '='));
    return hit ? hit.slice(name.length + 1) : null;
  }

  function writeCookie(name, value, days) {
    const exp = new Date(Date.now() + days * 864e5).toUTCString();
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${name}=${value}; Expires=${exp}; Path=/; SameSite=Lax${secure}`;
  }

  /* ------------------------------ consent state ---------------------------- */
  function read() {
    try {
      const raw = readCookie(COOKIE);
      if (!raw) return null;
      const parsed = JSON.parse(decodeURIComponent(raw));
      if (parsed.v !== VERSION) return null;   // stale, ask again
      return { necessary: true, analytics: !!parsed.a, marketing: !!parsed.m, at: parsed.t };
    } catch (e) {
      return null;
    }
  }

  const listeners = new Set();
  function emit() { listeners.forEach((fn) => { try { fn(read()); } catch (e) { console.error(e); } }); }

  function write(analytics, marketing) {
    const payload = { v: VERSION, a: !!analytics, m: !!marketing, t: new Date().toISOString() };
    writeCookie(COOKIE, encodeURIComponent(JSON.stringify(payload)), DAYS);
    apply(read());
    emit();
  }

  /* ------------------------- Google Consent Mode v2 ------------------------ */
  // Defaults are set to denied straight away, before any Google tag exists, so
  // that if one is ever added it starts from a compliant state.
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500,
  });

  let ga4Loaded = false;
  function loadAnalytics() {
    if (ga4Loaded || !GA4_ID) return;
    ga4Loaded = true;
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA4_ID);
    document.head.appendChild(s);
    gtag('js', new Date());
    // IP anonymisation is on by default in GA4; this keeps it explicit.
    gtag('config', GA4_ID, { anonymize_ip: true });
  }

  let marketingLoaded = false;
  function loadMarketing() {
    if (marketingLoaded) return;
    marketingLoaded = true;
    /* Add marketing tags here when you need them, for example the LinkedIn
       Insight Tag or a Google Ads conversion tag. Anything placed here only
       runs for visitors who accepted marketing cookies. */
  }

  function apply(state) {
    if (!state) return;
    gtag('consent', 'update', {
      analytics_storage: state.analytics ? 'granted' : 'denied',
      ad_storage: state.marketing ? 'granted' : 'denied',
      ad_user_data: state.marketing ? 'granted' : 'denied',
      ad_personalization: state.marketing ? 'granted' : 'denied',
    });
    if (state.analytics) loadAnalytics();
    if (state.marketing) loadMarketing();
  }

  // Honour a choice made on a previous visit, before React mounts.
  apply(read());

  /* -------------------------------- public API ----------------------------- */
  window.IntigrisConsent = {
    get: read,
    set: write,
    acceptAll: () => write(true, true),
    rejectAll: () => write(false, false),
    open: () => listeners.forEach((fn) => fn(read(), true)),
    onChange: (fn) => { listeners.add(fn); return () => listeners.delete(fn); },
    hasChoice: () => read() !== null,
  };
})();

/* ============================== UI component ============================== */
function SiteCookieConsent() {
  const { useState, useEffect } = React;
  const [state, setState] = useState(() => window.IntigrisConsent.get());
  const [panel, setPanel] = useState(false);       // preferences panel open
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const tx = window.tx;

  useEffect(() => {
    return window.IntigrisConsent.onChange((next, forceOpen) => {
      setState(next);
      if (forceOpen) {
        setAnalytics(!!(next && next.analytics));
        setMarketing(!!(next && next.marketing));
        setPanel(true);
      }
    });
  }, []);

  useEffect(() => {
    if (!panel) return;
    const onKey = (e) => { if (e.key === 'Escape') setPanel(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [panel]);

  const needsBanner = state === null;
  if (!needsBanner && !panel) return null;

  const save = () => { window.IntigrisConsent.set(analytics, marketing); setPanel(false); };

  return (
    <>
      <style>{`
        .cc-wrap { position: fixed; inset: auto 0 0 0; z-index: 1200; display: flex; justify-content: center;
          padding: clamp(12px, 2vw, 24px); pointer-events: none; }
        .cc-card { pointer-events: auto; width: 100%; max-width: 940px; background: var(--intigris-off-white);
          border: 1px solid var(--border); border-radius: 22px; box-shadow: 0 18px 48px rgba(64,35,1,0.18);
          padding: clamp(20px, 2.6vw, 30px); }
        .cc-title { font-size: 18px; font-weight: 500; letter-spacing: -0.014em; color: var(--intigris-dark-brown); margin: 0 0 8px; }
        .cc-body { font-size: 14.5px; line-height: 1.6; color: var(--fg-muted); margin: 0 0 18px; max-width: 720px; }
        .cc-body a { color: var(--intigris-coral); }
        .cc-actions { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
        .cc-btn { border-radius: 999px; font-family: inherit; font-size: 14.5px; font-weight: 500; cursor: pointer;
          padding: 11px 22px; border: 1.5px solid transparent; transition: background 140ms var(--ease-out),
          border-color 140ms var(--ease-out), color 140ms var(--ease-out); }
        .cc-primary { background: var(--intigris-coral); color: var(--intigris-off-white); }
        .cc-primary:hover { background: var(--intigris-coral-700); }
        .cc-ghost { background: transparent; border-color: var(--border); color: var(--intigris-dark-brown); }
        .cc-ghost:hover { border-color: var(--intigris-coral); }
        .cc-link { background: transparent; border: 0; color: var(--fg-muted); font-family: inherit; font-size: 14px;
          text-decoration: underline; cursor: pointer; padding: 11px 4px; }
        .cc-link:hover { color: var(--intigris-coral); }

        .cc-scrim { position: fixed; inset: 0; z-index: 1300; background: rgba(64,35,1,0.42);
          display: flex; align-items: center; justify-content: center; padding: clamp(12px, 3vw, 32px); }
        .cc-panel { width: 100%; max-width: 620px; max-height: 88vh; overflow-y: auto; background: var(--intigris-off-white);
          border-radius: 24px; padding: clamp(22px, 3vw, 34px); box-shadow: 0 24px 60px rgba(64,35,1,0.28); }
        .cc-row { display: flex; gap: 16px; align-items: flex-start; justify-content: space-between;
          padding: 18px 0; border-bottom: 1px solid var(--border); }
        .cc-row:last-of-type { border-bottom: 0; }
        .cc-row h4 { margin: 0 0 5px; font-size: 15.5px; font-weight: 500; color: var(--intigris-dark-brown); }
        .cc-row p { margin: 0; font-size: 13.5px; line-height: 1.55; color: var(--fg-muted); }
        .cc-sw { flex: none; width: 46px; height: 26px; border-radius: 999px; border: 0; cursor: pointer; position: relative;
          background: rgba(64,35,1,0.18); transition: background 160ms var(--ease-out); }
        .cc-sw[data-on="1"] { background: var(--intigris-coral); }
        .cc-sw[data-locked="1"] { background: rgba(64,35,1,0.28); cursor: not-allowed; }
        .cc-sw span { position: absolute; top: 3px; left: 3px; width: 20px; height: 20px; border-radius: 999px;
          background: var(--intigris-off-white); transition: transform 180ms var(--ease-out); }
        .cc-sw[data-on="1"] span { transform: translateX(20px); }
        @media (max-width: 620px) { .cc-actions { flex-direction: column; align-items: stretch; } .cc-btn { width: 100%; } }
      `}</style>

      {needsBanner && !panel && (
        <div className="cc-wrap" role="dialog" aria-live="polite"
             aria-label={tx('Cookie choices', 'Cookiekeuzes')}>
          <div className="cc-card">
            <p className="cc-title">{tx('A quick word on cookies.', 'Even over cookies.')}</p>
            <p className="cc-body">
              {tx(
                'We keep this simple. Nothing is measured or tracked unless you say yes. The only thing we store either way is your choice below, so we do not have to ask again.',
                'We houden het simpel. We meten of volgen niets tenzij u ja zegt. Het enige dat we hoe dan ook opslaan is uw keuze hieronder, zodat we het niet opnieuw hoeven te vragen.'
              )}{' '}
              <a href="Cookies.html">{tx('Read our cookie notice', 'Lees ons cookiebeleid')}</a>.
            </p>
            <div className="cc-actions">
              <button className="cc-btn cc-primary" onClick={() => window.IntigrisConsent.acceptAll()}>
                {tx('Accept all', 'Alles accepteren')}
              </button>
              <button className="cc-btn cc-ghost" onClick={() => window.IntigrisConsent.rejectAll()}>
                {tx('Necessary only', 'Alleen noodzakelijk')}
              </button>
              <button className="cc-link" onClick={() => { setAnalytics(false); setMarketing(false); setPanel(true); }}>
                {tx('Choose what you share', 'Kies wat u deelt')}
              </button>
            </div>
          </div>
        </div>
      )}

      {panel && (
        <div className="cc-scrim" role="dialog" aria-modal="true"
             aria-label={tx('Cookie preferences', 'Cookievoorkeuren')}
             onClick={(e) => { if (e.target === e.currentTarget) setPanel(false); }}>
          <div className="cc-panel">
            <h3 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 500, letterSpacing: '-0.018em', color: 'var(--intigris-dark-brown)' }}>
              {tx('Cookie preferences', 'Cookievoorkeuren')}
            </h3>
            <p style={{ margin: '0 0 6px', fontSize: 14.5, lineHeight: 1.6, color: 'var(--fg-muted)' }}>
              {tx(
                'Turn on only what you are comfortable with. You can change this at any time from the link in our footer.',
                'Zet alleen aan waar u zich prettig bij voelt. U kunt dit altijd wijzigen via de link in onze footer.'
              )}
            </p>

            <div className="cc-row">
              <div>
                <h4>{tx('Strictly necessary', 'Strikt noodzakelijk')}</h4>
                <p>{tx(
                  'Needed for the site to work: remembering this choice, keeping forms secure, and signing you in to our portal. Never used to track you.',
                  'Nodig om de site te laten werken: deze keuze bewaren, formulieren beveiligen en inloggen op ons portaal. Nooit gebruikt om u te volgen.'
                )}</p>
              </div>
              <button className="cc-sw" data-on="1" data-locked="1" disabled
                      aria-label={tx('Always on', 'Altijd aan')}><span /></button>
            </div>

            <div className="cc-row">
              <div>
                <h4>{tx('Analytics', 'Analytics')}</h4>
                <p>{tx(
                  'Helps us see which pages are useful and which are not, so we can improve them. Aggregated numbers, not individual profiles.',
                  'Helpt ons te zien welke pagina’s nuttig zijn en welke niet, zodat we ze kunnen verbeteren. Geaggregeerde cijfers, geen individuele profielen.'
                )}</p>
              </div>
              <button className="cc-sw" data-on={analytics ? '1' : '0'} onClick={() => setAnalytics((v) => !v)}
                      role="switch" aria-checked={analytics} aria-label={tx('Analytics cookies', 'Analytics-cookies')}><span /></button>
            </div>

            <div className="cc-row">
              <div>
                <h4>{tx('Marketing', 'Marketing')}</h4>
                <p>{tx(
                  'Lets us measure whether our ads reach the right people, and show you relevant ones elsewhere. Off by default.',
                  'Laat ons meten of onze advertenties de juiste mensen bereiken en u elders relevante advertenties tonen. Standaard uit.'
                )}</p>
              </div>
              <button className="cc-sw" data-on={marketing ? '1' : '0'} onClick={() => setMarketing((v) => !v)}
                      role="switch" aria-checked={marketing} aria-label={tx('Marketing cookies', 'Marketing-cookies')}><span /></button>
            </div>

            <div className="cc-actions" style={{ marginTop: 22 }}>
              <button className="cc-btn cc-primary" onClick={save}>
                {tx('Save my choices', 'Mijn keuzes opslaan')}
              </button>
              <button className="cc-btn cc-ghost" onClick={() => { window.IntigrisConsent.acceptAll(); setPanel(false); }}>
                {tx('Accept all', 'Alles accepteren')}
              </button>
              <button className="cc-link" onClick={() => setPanel(false)}>
                {tx('Close', 'Sluiten')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

window.SiteCookieConsent = SiteCookieConsent;
