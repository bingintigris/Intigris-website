// FinalCTA.jsx + Footer — close of the home page.
// Exposes: window.SiteFinalCTA, window.SiteFooter

function SiteFinalCTA({ onCta }) {
  const tx = window.tx || ((en) => en);
  return (
    <section
      id="cta"
      data-screen-label="Contact CTA"
      style={{
        background: 'var(--intigris-chocolate)',
        color: 'var(--intigris-off-white)',
        paddingTop: 'clamp(56px, 7vw, 96px)',
        paddingBottom: 'clamp(56px, 7vw, 96px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(rgba(252,247,235,0.06) 1.2px, transparent 1.2px)',
        backgroundSize: '6px 6px', opacity: 0.6,
      }}/>

      <div className="container" style={{ position: 'relative' }}>
        <div className="cta-split" style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)',
          gap: 'clamp(40px, 6vw, 80px)',
          alignItems: 'center',
        }}>
          {/* ----- LEFT: eyebrow, headline, supporting copy ----- */}
          <div>
            <div className="eyebrow" style={{ marginBottom: 24, color: 'rgba(252,247,235,0.7)' }}>
              {tx('READY TO SMARTEN UP YOUR BUSINESS?', 'KLAAR OM UW BUSINESS SLIMMER TE MAKEN?')}
            </div>
            <h2 style={{
              fontSize: 'clamp(44px, 6vw, 88px)',
              fontWeight: 500, letterSpacing: '-0.028em',
              lineHeight: 1.0, margin: 0, color: 'var(--intigris-off-white)',
              textWrap: 'balance',
            }}>
              {tx("Let’s ", 'Laten we ')}<span style={{ color: 'var(--intigris-coral)', fontStyle: 'italic' }}>{tx('talk.', 'praten.')}</span>
            </h2>
            <p style={{
              marginTop: 24, fontSize: 17, fontWeight: 300, lineHeight: 1.55,
              color: 'rgba(252,247,235,0.8)', maxWidth: 520, margin: '24px 0 0 0',
            }}>
              {tx(
                'A 30-minute conversation with a senior consultant. We listen, ask precise questions, and give you a candid view on whether we are the right partner.',
                'Een gesprek van 30 minuten met een senior consultant. We luisteren, stellen scherpe vragen en geven u een eerlijk beeld of we de juiste partner zijn.'
              )}
            </p>
          </div>

          {/* ----- RIGHT: CTAs + trust line ----- */}
          <div className="cta-actions" style={{
            display: 'flex', flexDirection: 'column', gap: 28,
            alignItems: 'flex-start',
          }}>
            <div style={{
              display: 'flex', gap: 12, flexWrap: 'wrap',
            }}>
              <button className="btn btn-primary btn-lg" onClick={onCta}>
                {tx('Book a 30-min call', 'Plan een gesprek van 30 minuten')} <span className="arrow">→</span>
              </button>
              <button className="btn btn-outline-light btn-lg">
                info@intigris.nl
              </button>
            </div>

            <div style={{
              paddingTop: 20,
              borderTop: '1px solid rgba(252,247,235,0.18)',
              display: 'flex', flexDirection: 'column', gap: 6,
              fontSize: 12, color: 'rgba(252,247,235,0.65)', fontWeight: 400,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              alignSelf: 'stretch',
            }}>
              <span>{tx('Salesforce Consulting Partner', 'Salesforce Consulting Partner')}</span>
              <span>{tx('AWS Partner Network', 'AWS Partner Network')}</span>
              <span>{tx('Since 2010', 'Sinds 2010')}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #cta .cta-split { grid-template-columns: 1fr !important; gap: 36px !important; }
        }
      `}</style>
    </section>
  );
}

function SiteFooter() {
  const tx = window.tx || ((en) => en);
  const COL = (title, items) => (
    <div>
      <div style={{
        fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
        fontWeight: 600, color: 'var(--intigris-coral)',
        marginBottom: 18,
        display: 'inline-flex', alignItems: 'center', gap: 8,
      }}>
        <span aria-hidden style={{
          width: 18, height: 1, background: 'var(--intigris-coral)', display: 'inline-block',
        }} />
        <span style={{ color: 'var(--intigris-dark-brown)' }}>{title}</span>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((it, i) => {
          const label = typeof it === 'string' ? it : it.label;
          const href = typeof it === 'string' ? undefined : it.href;
          const external = href && /^https?:/.test(href);
          return (
            <li key={i}>
              <a
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                style={{
                  color: 'var(--intigris-dark-brown)',
                  textDecoration: 'none',
                  fontSize: 14, fontWeight: 400,
                  cursor: 'pointer',
                  transition: 'color 140ms var(--ease-out)',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--intigris-coral)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--intigris-dark-brown)'}
              >
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <footer style={{
      background: 'var(--intigris-off-white)',
      color: 'var(--intigris-dark-brown)',
      paddingTop: 88, paddingBottom: 32,
    }}>
      <div className="container-wide">
        <div className="footer-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1.7fr 1fr 1fr 1fr',
          gap: 56,
          paddingBottom: 56,
          borderBottom: '1px solid rgba(64,35,1,0.16)',
          alignItems: 'start',
        }}>
          <div>
            <img src="assets/logo-dark-brown.png" alt="intigris" style={{ height: 64, marginBottom: 28, display: 'block' }} />
            <p style={{
              fontSize: 16, fontWeight: 400, lineHeight: 1.5,
              color: 'var(--intigris-dark-brown)', maxWidth: 340,
              margin: 0,
            }}>
              {tx(
                'We bring into focus what you need, then we implement it so you can move forward.',
                'We brengen scherp in beeld wat u nodig heeft en implementeren het, zodat u vooruit kunt.'
              )}
            </p>
            <div style={{
              marginTop: 28,
              fontSize: 14, color: 'rgba(64,35,1,0.9)', lineHeight: 1.6, fontWeight: 400,
            }}>
              Kraanspoor 42<br/>
              1033 SE Amsterdam<br/>
              {tx('The Netherlands', 'Nederland')}
            </div>
            <div style={{
              marginTop: 14,
              fontSize: 14, color: 'rgba(64,35,1,0.9)', lineHeight: 1.55, fontWeight: 400,
            }}>
              <a href="mailto:info@intigris.nl" style={{ color: 'inherit', textDecoration: 'none' }}>info@intigris.nl</a>
            </div>
          </div>

          {COL(tx('SERVICES', 'DIENSTEN'), ['Sales Cloud', 'Field Service', 'Service Cloud', 'Integrations', 'Agentforce', 'Data 360', 'FieldBuddy', 'Experience Cloud'])}
          {COL(tx('SOLUTIONS', 'OPLOSSINGEN'), ['Salesforce Consulting', 'Integration Development', 'Field Service Consulting', tx('Salesforce Quickstarts', 'Salesforce Quickstarts'), 'ISA Academy'])}
          {COL(tx('COMPANY', 'BEDRIJF'), [tx('About', 'Over ons'), 'Blog', tx('Careers', 'Werken bij'), tx('Contact', 'Contact'), 'LinkedIn', { label: tx('Admin', 'Admin'), href: 'https://intigris-admin.netlify.app' }])}
        </div>

        <div style={{
          marginTop: 24,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 16,
          fontSize: 12, color: 'rgba(64,35,1,0.85)', fontWeight: 400,
        }}>
          <div>© 2026 Intigris B.V. · KvK 82252007 · Kraanspoor 42, 1033 SE Amsterdam</div>
          <div style={{ display: 'flex', gap: 24 }}>
            <a style={{ color: 'inherit', textDecoration: 'none' }}>{tx('Privacy', 'Privacy')}</a>
            <a style={{ color: 'inherit', textDecoration: 'none' }}>{tx('Cookies', 'Cookies')}</a>
            <a style={{ color: 'inherit', textDecoration: 'none' }}>{tx('Terms', 'Voorwaarden')}</a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

window.SiteFinalCTA = SiteFinalCTA;
window.SiteFooter = SiteFooter;
