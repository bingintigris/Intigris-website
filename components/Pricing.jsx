// Pricing.jsx — 3-tier packages, middle tier highlighted coral (Folioblox-inspired).
// Exposes: window.SitePricing

function PriceCheck({ tone = 'coral' }) {
  const c = tone === 'brown' ? 'var(--intigris-dark-brown)' : 'var(--intigris-coral)';
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" style={{ flexShrink: 0, marginTop: 2 }} aria-hidden>
      <circle cx="9" cy="9" r="9" fill={tone === 'brown' ? 'rgba(64,35,1,0.14)' : 'var(--intigris-coral-100)'} />
      <path d="M5.4 9.2 L7.8 11.6 L12.6 6.4" stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PriceArrow({ solid = false }) {
  return (
    <span className="price-arrow" aria-hidden style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 34, height: 34, borderRadius: 999,
      background: solid ? 'var(--intigris-dark-brown)' : 'var(--intigris-coral)',
      color: solid ? 'var(--intigris-off-white)' : 'var(--intigris-dark-brown)',
      fontSize: 15, transition: 'transform var(--t-base) var(--ease-out)',
    }}>→</span>
  );
}

function SitePricing({ onCta }) {
  const tx = window.tx || ((en) => en);

  const TIERS = [
    {
      key: 'kickstart',
      name: tx('Kickstart', 'Kickstart'),
      price: '€7.500',
      unit: tx('fixed scope', 'vaste scope'),
      blurb: tx(
        'A focused audit and quick-win setup to get your Salesforce org healthy and pointed in the right direction.',
        'Een gerichte audit en quick-win setup om uw Salesforce-org gezond te maken en de juiste kant op te zetten.'
      ),
      features: [
        tx('Org & data health check', 'Org- & datacheck'),
        tx('One cloud configured', 'Eén cloud ingericht'),
        tx('Up to 3 weeks', 'Tot 3 weken'),
        tx('Handover & training', 'Overdracht & training'),
      ],
      cta: tx('Start small', 'Klein beginnen'),
    },
    {
      key: 'momentum',
      name: tx('Momentum', 'Momentum'),
      price: '€24.500',
      unit: tx('from', 'vanaf'),
      badge: tx('Most chosen', 'Meest gekozen'),
      highlight: true,
      blurb: tx(
        'A full implementation across your priority clouds — configured, integrated, and adopted by your team.',
        'Een volledige implementatie op uw belangrijkste clouds — ingericht, geïntegreerd en geadopteerd door uw team.'
      ),
      features: [
        tx('Multi-cloud implementation', 'Multi-cloud implementatie'),
        tx('Integrations (AWS & more)', 'Integraties (AWS & meer)'),
        tx('Dedicated Intigrant team', 'Vast Intigrant-team'),
        tx('Adoption & enablement', 'Adoptie & enablement'),
        tx('8–16 week programme', 'Programma van 8–16 weken'),
      ],
      cta: tx("Let's talk", 'Neem contact op'),
    },
    {
      key: 'partner',
      name: tx('Partner', 'Partner'),
      price: tx('Custom', 'Op maat'),
      unit: tx('retainer', 'retainer'),
      blurb: tx(
        'Ongoing partnership — we stay close as your managed Salesforce team, releasing improvements every sprint.',
        'Doorlopend partnerschap — we blijven dichtbij als uw managed Salesforce-team en leveren elke sprint verbeteringen.'
      ),
      features: [
        tx('Managed service & support', 'Managed service & support'),
        tx('Continuous roadmap', 'Doorlopende roadmap'),
        tx('Field Service & FieldBuddy', 'Field Service & FieldBuddy'),
        tx('Quarterly business reviews', 'Kwartaalreviews'),
      ],
      cta: tx('Scale with us', 'Samen opschalen'),
    },
  ];

  return (
    <section className="section" style={{ background: 'var(--intigris-off-white)', position: 'relative', overflow: 'hidden' }}>
      <div className="grid-bg" aria-hidden />
      <div className="container" style={{ position: 'relative' }}>
        <div className="section-head">
          <div>
            <div className="eyebrow" style={{ marginBottom: 20 }}>{tx('PRICING', 'PRIJZEN')}</div>
            <h2 className="display-sm" style={{ color: 'var(--intigris-dark-brown)' }}>
              {tx('Simple packages for', 'Heldere pakketten voor')}<br />
              {tx('every stage.', 'elke fase.')}
            </h2>
          </div>
          <p className="lede">
            {tx(
              'No mystery quotes. Pick the engagement that fits where you are — and we scope the rest together.',
              'Geen vage offertes. Kies het traject dat past bij waar u nu staat — de rest bepalen we samen.'
            )}
          </p>
        </div>

        <div className="pricing-grid">
          {TIERS.map((t) => {
            const hi = t.highlight;
            return (
              <div
                key={t.key}
                className={'price-card' + (hi ? ' price-card--hi' : '')}
                style={{
                  position: 'relative',
                  display: 'flex', flexDirection: 'column',
                  borderRadius: 'var(--radius-lg)',
                  padding: hi ? '36px 32px' : '32px',
                  background: hi ? 'var(--intigris-coral)' : 'var(--bg-elevated)',
                  color: 'var(--intigris-dark-brown)',
                  boxShadow: hi
                    ? '0 24px 60px -22px rgba(64,35,1,0.42), 0 6px 16px -8px rgba(64,35,1,0.2)'
                    : 'var(--shadow-1)',
                  transform: hi ? 'translateY(-12px)' : 'none',
                  transition: 'box-shadow var(--t-base) var(--ease-out), transform var(--t-base) var(--ease-out)',
                }}
              >
                {t.badge && (
                  <span className="chip chip--brown" style={{ position: 'absolute', top: 20, right: 24, height: 28 }}>
                    {t.badge}
                  </span>
                )}
                <div style={{
                  fontSize: 13, fontWeight: 'var(--w-medium)', letterSpacing: 'var(--tracking-overline)',
                  textTransform: 'uppercase',
                  color: hi ? 'var(--intigris-dark-brown)' : 'var(--fg-muted)',
                }}>
                  {t.name}
                </div>

                <div style={{ marginTop: 18, display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 48, fontWeight: 500, letterSpacing: '-0.028em', lineHeight: 1 }}>
                    {t.price}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 300, opacity: hi ? 0.7 : 0.6 }}>{t.unit}</span>
                </div>

                <p style={{
                  marginTop: 16, marginBottom: 24,
                  fontSize: 15, lineHeight: 1.5, fontWeight: 300,
                  color: hi ? 'rgba(64,35,1,0.82)' : 'var(--fg-muted)',
                }}>
                  {t.blurb}
                </p>

                <div style={{
                  height: 1,
                  background: hi ? 'rgba(64,35,1,0.22)' : 'var(--border)',
                  marginBottom: 22,
                }} />

                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 13, flex: 1 }}>
                  {t.features.map((f, i) => (
                    <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 15, fontWeight: 300, lineHeight: 1.4 }}>
                      <PriceCheck tone={hi ? 'brown' : 'coral'} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={onCta}
                  className="btn price-cta"
                  style={{
                    marginTop: 28,
                    justifyContent: 'space-between',
                    paddingRight: 8,
                    width: '100%',
                    background: hi ? 'var(--intigris-dark-brown)' : 'var(--intigris-off-white)',
                    color: hi ? 'var(--intigris-off-white)' : 'var(--intigris-dark-brown)',
                    border: hi ? '0' : '1.5px solid var(--intigris-dark-brown)',
                  }}
                >
                  <span>{t.cta}</span>
                  <PriceArrow solid={!hi} />
                </button>
              </div>
            );
          })}
        </div>

        <p style={{
          marginTop: 32, textAlign: 'center',
          fontSize: 14, fontWeight: 300, color: 'var(--fg-muted)',
        }}>
          {tx(
            'All engagements are scoped with a real Intigrant, not a bot.* Prices exclude VAT and Salesforce licences.',
            'Elk traject wordt bepaald met een echte Intigrant, geen bot.* Prijzen zijn excl. btw en Salesforce-licenties.'
          )}
        </p>
      </div>

      <style>{`
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
          align-items: start;
        }
        .price-card:not(.price-card--hi):hover {
          box-shadow: var(--shadow-3);
          transform: translateY(-4px);
        }
        .price-cta:hover .price-arrow { transform: translateX(3px); }
        @media (max-width: 900px) {
          .pricing-grid { grid-template-columns: 1fr; max-width: 460px; margin: 0 auto; }
          .price-card--hi { transform: none !important; }
        }
      `}</style>
    </section>
  );
}

window.SitePricing = SitePricing;
