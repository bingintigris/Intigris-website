// Cases.jsx — featured cases teaser, 3-up.
// Exposes: window.SiteCases

const CASES = [
  {
    photoClass: 'photo',
    industry: 'Manufacturing',
    title: 'Reducing the quote cycle for configurable products from days to minutes',
    client: 'Industrial manufacturer · NL',
    stat: '−68% quote cycle',
    services: ['Sales Cloud', 'Platform'],
  },
  {
    photoClass: 'photo photo--meadow',
    industry: 'Field Service',
    title: 'Orchestrating 800 engineers from a single dispatch console',
    client: 'National service provider',
    stat: '+22% first-time fix',
    services: ['Field Service', 'Mobile'],
  },
  {
    photoClass: 'photo photo--blue',
    industry: 'Energy',
    title: 'Absorbing 3x customer demand without adding headcount',
    client: 'Energy supplier · NL',
    stat: 'NPS 41 → 64',
    services: ['Service Cloud', 'Agentforce'],
  },
];

function SiteCases() {
  const tx = window.tx || ((en) => en);
  const localized = CASES.map(c => ({
    ...c,
    industry: tx(c.industry, ({ 'Manufacturing': 'Industrie', 'Field Service': 'Field Service', 'Energy': 'Energie' })[c.industry] || c.industry),
    title: tx(c.title, ({
      'Reducing the quote cycle for configurable products from days to minutes': 'Een quote-cyclus voor configureerbare producten teruggebracht van dagen naar minuten',
      'Orchestrating 800 engineers from a single dispatch console': '800 monteurs aansturen vanuit één dispatch-console',
      'Absorbing 3x customer demand without adding headcount': '3x meer klantvraag verwerken zonder uitbreiding van het team',
    })[c.title] || c.title),
    client: tx(c.client, ({
      'Industrial manufacturer · NL': 'Industriële fabrikant · NL',
      'National service provider': 'Landelijke serviceorganisatie',
      'Energy supplier · NL': 'Energieleverancier · NL',
    })[c.client] || c.client),
    stat: tx(c.stat, ({
      '−68% quote cycle': '−68% quote-cyclus',
      '+22% first-time fix': '+22% first-time fix',
      'NPS 41 → 64': 'NPS 41 → 64',
    })[c.stat] || c.stat),
  }));
  return (
    <section
      id="cases"
      data-screen-label="Cases"
      className="section"
      style={{ background: 'var(--intigris-off-white)', borderTop: '1px solid var(--border)' }}
    >
      <div className="container-wide">
        <div className="section-head">
          <div>
            <div className="eyebrow" style={{ marginBottom: 20 }}>{tx('SELECTED CASES', 'GESELECTEERDE CASES')}</div>
            <h2 className="display-md" style={{ color: 'var(--intigris-dark-brown)' }}>
              {tx('Outcomes we have', 'Resultaten die we')}<br/>
              {tx('delivered for clients.', 'leverden voor klanten.')}
            </h2>
          </div>
          <p className="lede">
            {tx(
              'Three representative engagements drawn from over 250 Salesforce programmes delivered across the Netherlands.',
              'Drie representatieve trajecten, geselecteerd uit meer dan 250 Salesforce-programma’s in Nederland.'
            )}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: 28,
        }}>
          {localized.map((c, i) => <CaseCard key={i} c={c} />)}
        </div>

        <div style={{ marginTop: 48, display: 'flex', justifyContent: 'center' }}>
          <a className="link-arrow">
            {tx('See all cases', 'Bekijk alle cases')} <span className="arrow">→</span>
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #cases > div > div:nth-child(2) { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function CaseCard({ c }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        textDecoration: 'none', color: 'inherit', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', gap: 18,
      }}
    >
      <div style={{ position: 'relative' }}>
        <div className={c.photoClass} style={{
          aspectRatio: '4 / 5', borderRadius: 18,
          transform: hover ? 'scale(1.01)' : 'scale(1)',
          transition: 'transform 420ms var(--ease-out)',
        }}>
          <div className="photo-label">{c.client}</div>
        </div>
        {/* Stat overlay */}
        <div style={{
          position: 'absolute', top: 16, right: 16,
          background: 'var(--intigris-off-white)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '8px 14px',
          fontSize: 13, fontWeight: 500, color: 'var(--intigris-dark-brown)',
        }}>
          {c.stat}
        </div>
        {/* Industry tag */}
        <div style={{
          position: 'absolute', top: 16, left: 16,
          background: 'rgba(64,35,1,0.85)',
          color: 'var(--intigris-off-white)',
          borderRadius: 999,
          padding: '6px 12px',
          fontSize: 11, fontWeight: 500, letterSpacing: '0.04em',
        }}>
          {c.industry}
        </div>
      </div>

      <h3 style={{
        fontSize: 22, fontWeight: 500, letterSpacing: '-0.018em',
        lineHeight: 1.18, margin: 0,
        color: hover ? 'var(--intigris-coral)' : 'var(--intigris-dark-brown)',
        transition: 'color 140ms var(--ease-out)',
      }}>
        {c.title}
      </h3>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {c.services.map((s, i) => (
          <span key={i} className="chip">{s}</span>
        ))}
      </div>
    </a>
  );
}

window.SiteCases = SiteCases;
