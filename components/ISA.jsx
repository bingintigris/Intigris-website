// ISA.jsx, Salesforce Academy / careers teaser.
// Exposes: window.SiteISA

function SiteISA() {
  return (
    <section
      id="isa"
      data-screen-label="ISA"
      className="section"
      style={{ background: 'var(--intigris-off-white)' }}
    >
      <div className="container-wide">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.1fr)',
          gap: 48,
          alignItems: 'stretch',
          background: 'var(--intigris-paper)',
          border: '1px solid var(--border)',
          borderRadius: 28,
          overflow: 'hidden',
          minHeight: 480,
        }}>
          {/* Left, photo */}
          <div className="photo photo--meadow" style={{
            borderRadius: 0,
            minHeight: 480,
            position: 'relative',
          }}>
            <div className="photo-label">ISA cohort · 2025</div>

            {/* Floating cohort meta */}
            <div style={{
              position: 'absolute',
              top: 24, left: 24,
              background: 'var(--intigris-off-white)',
              borderRadius: 12,
              padding: '12px 16px',
              boxShadow: 'var(--shadow-2)',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 10, height: 10, borderRadius: 999,
                background: 'var(--intigris-coral)',
                boxShadow: '0 0 0 4px rgba(255,95,54,0.18)',
              }}/>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--intigris-dark-brown)' }}>
                Now open: 2026 cohort
              </div>
            </div>

            {/* Stat overlays */}
            <div style={{
              position: 'absolute', bottom: 24, right: 24,
              background: 'var(--intigris-dark-brown)',
              color: 'var(--intigris-off-white)',
              borderRadius: 14,
              padding: '18px 22px',
              minWidth: 200,
            }}>
              <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.7, marginBottom: 6 }}>
                ISA · INTIGRIS SALESFORCE ACADEMY
              </div>
              <div style={{ display: 'flex', gap: 20 }}>
                <div>
                  <div style={{ fontSize: 32, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1 }}>6mo</div>
                  <div style={{ fontSize: 12, opacity: 0.75 }}>program</div>
                </div>
                <div>
                  <div style={{ fontSize: 32, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1 }}>100%</div>
                  <div style={{ fontSize: 12, opacity: 0.75 }}>certified</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right, copy */}
          <div style={{ padding: 'clamp(32px, 4vw, 56px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 24 }}>
            <div className="eyebrow">ISA · CAREERS</div>
            <h2 className="display-sm" style={{ color: 'var(--intigris-dark-brown)' }}>
              Start your<br/>
              Salesforce career<br/>
              with the <span style={{ color: 'var(--intigris-coral)' }}>Intigrants.</span>
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.55, fontWeight: 400, color: 'var(--fg-muted)', maxWidth: 480 }}>
              The Intigris Salesforce Academy is our in-house traineeship, six months
              of immersive Salesforce training, real client work, and senior mentorship.
              You finish certified. We finish with a new Intigrant.
            </p>

            <ul style={{
              listStyle: 'none', padding: 0, margin: '8px 0',
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
            }}>
              {['Salesforce certifications', 'Real client work', 'Senior mentorship', 'Permanent contract after'].map((t, i) => (
                <li key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  fontSize: 14, color: 'var(--intigris-dark-brown)',
                }}>
                  <svg width="14" height="14" viewBox="0 0 14 14">
                    <path d="M2 7 L5.5 10.5 L12 4" stroke="var(--intigris-coral)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {t}
                </li>
              ))}
            </ul>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
              <button className="btn btn-primary">Apply for ISA 2026 <span className="arrow">→</span></button>
              <button className="btn btn-secondary">All vacancies</button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #isa > div > div { grid-template-columns: 1fr !important; }
          #isa .photo { min-height: 360px !important; }
        }
      `}</style>
    </section>
  );
}

window.SiteISA = SiteISA;
