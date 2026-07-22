// Solutions.jsx — Salesforce clouds / solutions we implement.
// Dark "chocolate" theme panel for visual rhythm after the services section.
// Exposes: window.SiteSolutions

const SOLUTIONS = [
  {
    id: 'sales',
    name: 'Sales Cloud',
    blurb: 'Pipeline, forecast, and account management — the CRM foundation the rest of the platform builds on.',
    tags: ['Pipeline', 'Forecasting', 'B2B Accounts'],
  },
  {
    id: 'service',
    name: 'Service Cloud',
    blurb: 'Cases, channels, knowledge, and the agent console that holds the service operation together.',
    tags: ['Omnichannel', 'Contact Centre', 'Knowledge'],
  },
  {
    id: 'field-service',
    name: 'Field Service',
    blurb: 'Scheduling, routing, mobile, parts and contracts — our specialism, in production at scale.',
    tags: ['Dispatch', 'Mobile', 'Routing'],
    accent: true,
  },
  {
    id: 'marketing',
    name: 'Marketing Cloud',
    blurb: 'Journeys, email, mobile, and Account Engagement (Pardot) for B2B demand and lifecycle marketing.',
    tags: ['Journeys', 'Email', 'Pardot'],
  },
  {
    id: 'experience',
    name: 'Experience Cloud',
    blurb: 'Partner portals, customer self-service, and B2B commerce front-ends, fully integrated with the platform.',
    tags: ['B2B Portals', 'Self-Service'],
  },
  {
    id: 'data',
    name: 'Data 360',
    blurb: 'Unify customer data across the enterprise — the foundation for analytics, automation, and AI.',
    tags: ['Unified Profile', 'Activation'],
  },
  {
    id: 'agentforce',
    name: 'Agentforce',
    blurb: 'Salesforce AI agents that act on your processes, grounded in your own enterprise data.',
    tags: ['AI Agents', 'Automation'],
    accent: true,
  },
  {
    id: 'platform',
    name: 'Salesforce Platform',
    blurb: 'Custom applications, custom logic, and integration. We have been building on the platform since 2013.',
    tags: ['Custom Dev', 'Lightning', 'Apex'],
  },
];

function CloudGlyph({ id, accent }) {
  const stroke = accent ? 'var(--intigris-dark-brown)' : 'var(--intigris-coral)';
  const fg = accent ? 'var(--intigris-dark-brown)' : 'var(--intigris-off-white)';
  const props = { width: 22, height: 22, viewBox: '0 0 22 22', fill: 'none', stroke: fg, strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (id) {
    case 'sales':       return <svg {...props}><path d="M3 16 L8 11 L12 14 L19 6"/><path d="M14 6 H19 V11"/></svg>;
    case 'service':     return <svg {...props}><path d="M3 11 a8 8 0 0 1 16 0"/><rect x="3" y="11" width="4" height="6" rx="1.5"/><rect x="15" y="11" width="4" height="6" rx="1.5"/><path d="M19 17 V18 a3 3 0 0 1 -3 3 H12"/></svg>;
    case 'field-service': return <svg {...props}><path d="M17 4 L19 6 L13 12 L11 10 Z"/><path d="M11 10 L4 17 a1.4 1.4 0 0 0 2 2 L13 12"/></svg>;
    case 'marketing':   return <svg {...props}><path d="M4 8 L18 4 V18 L4 14 Z"/><path d="M4 14 V18"/></svg>;
    case 'experience':  return <svg {...props}><circle cx="11" cy="11" r="8"/><path d="M3 11 H19 M11 3 a13 13 0 0 1 0 16 M11 3 a13 13 0 0 0 0 16"/></svg>;
    case 'cpq':         return <svg {...props}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="12" y="3" width="7" height="7" rx="1"/><rect x="3" y="12" width="7" height="7" rx="1"/><path d="M12 16 H19 M15.5 12.5 V19"/></svg>;
    case 'data':        return <svg {...props}><ellipse cx="11" cy="5" rx="7" ry="2.5"/><path d="M4 5 V11 a7 2.5 0 0 0 14 0 V5"/><path d="M4 11 V17 a7 2.5 0 0 0 14 0 V11"/></svg>;
    case 'agentforce':  return <svg {...props}><circle cx="11" cy="11" r="3"/><path d="M11 4 V6 M11 16 V18 M4 11 H6 M16 11 H18 M5.5 5.5 L7 7 M15 15 L16.5 16.5 M5.5 16.5 L7 15 M15 7 L16.5 5.5"/></svg>;
    case 'platform':    return <svg {...props}><rect x="3" y="5" width="16" height="12" rx="1.5"/><path d="M3 9 H19 M7 5 V3 M15 5 V3"/></svg>;
    default: return null;
  }
}

function SiteSolutions() {
  const tx = window.tx || ((en) => en);
  return (
    <section
      id="solutions"
      data-screen-label="Solutions"
      className="theme-brown"
      style={{
        background: 'var(--intigris-dark-brown)',
        color: 'var(--intigris-off-white)',
        paddingTop: 'clamp(64px, 9vw, 128px)',
        paddingBottom: 'clamp(64px, 9vw, 128px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle grid hint */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(to right, rgba(252,247,235,0.05) 1px, transparent 1px)',
        backgroundSize: 'calc(100% / 12) 100%',
        maskImage: 'linear-gradient(to bottom, transparent, #000 18%, #000 82%, transparent)',
      }}/>

      <div className="container-wide" style={{ position: 'relative' }}>
        <div className="section-head" style={{ alignItems: 'end' }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 20, color: 'rgba(252,247,235,0.7)' }}>
              {tx('SALESFORCE SOLUTIONS WE IMPLEMENT', 'SALESFORCE-OPLOSSINGEN DIE WIJ IMPLEMENTEREN')}
            </div>
            <h2 className="display-md" style={{ color: 'var(--intigris-off-white)' }}>
              {tx('The Salesforce stack —', 'De Salesforce-stack —')}<br/>
              <span style={{ color: 'var(--intigris-coral)' }}>{tx('configured, integrated, in production.', 'geconfigureerd, geïntegreerd, in productie.')}</span>
            </h2>
          </div>
          <p className="lede" style={{ color: 'rgba(252,247,235,0.7)' }}>
            {tx(
              'We work across the Salesforce platform. These are the products we deliver most frequently, on programmes that demonstrably return their investment within a year.',
              'Wij werken op het volledige Salesforce-platform. Dit zijn de producten die we het vaakst opleveren — in programma’s die zich aantoonbaar binnen een jaar terugverdienen.'
            )}
          </p>
        </div>

        {/* Solutions grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: 1,
          background: 'rgba(252,247,235,0.16)',
          borderRadius: 24,
          overflow: 'hidden',
          border: '1px solid rgba(252,247,235,0.16)',
        }}>
          {SOLUTIONS.map(sol => (
            <SolutionCell key={sol.id} sol={sol} />
          ))}
        </div>

        {/* footer row */}
        <div style={{
          marginTop: 48,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 24,
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              fontSize: 14, color: 'rgba(252,247,235,0.7)', fontWeight: 300, maxWidth: 460,
              lineHeight: 1.5,
            }}>
              {tx('Working with another cloud, or in need of a custom build?', 'Werkt u met een andere cloud, of heeft u een custom build nodig?')}
              <a className="txt-link" style={{ color: 'var(--intigris-coral)', textDecoration: 'underline', marginLeft: 6 }}>
                {tx('We very likely cover that as well →', 'Daar dekken we vrijwel zeker ook →')}
              </a>
            </div>
          </div>
          <button className="btn btn-on-brown btn-lg">
            {tx('See all solutions', 'Bekijk alle oplossingen')} <span className="arrow">→</span>
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #solutions .section-head { grid-template-columns: 1fr; }
          #solutions > div > div > div:nth-of-type(2) { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        }
        @media (max-width: 560px) {
          #solutions > div > div > div:nth-of-type(2) { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function SolutionCell({ sol }) {
  const [hover, setHover] = React.useState(false);
  const accent = sol.accent;
  const bg = accent
    ? (hover ? 'var(--intigris-coral-700)' : 'var(--intigris-coral)')
    : (hover ? '#2b1700' : 'var(--intigris-dark-brown)');
  const fg = accent ? 'var(--intigris-dark-brown)' : 'var(--intigris-off-white)';
  const mutedFg = accent ? 'rgba(64,35,1,0.7)' : 'rgba(252,247,235,0.65)';

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: bg,
        color: fg,
        padding: '32px 28px 28px',
        minHeight: 240,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        cursor: 'pointer',
        transition: 'background 220ms var(--ease-out)',
      }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: accent ? 'rgba(64,35,1,0.12)' : 'rgba(252,247,235,0.08)',
          display: 'grid', placeItems: 'center',
        }}>
          <CloudGlyph id={sol.id} accent={accent} />
        </div>
        <div style={{
          fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
          fontWeight: 500, color: mutedFg,
        }}>
          Salesforce
        </div>
      </div>

      <h3 style={{
        fontSize: 24, fontWeight: 500, letterSpacing: '-0.018em',
        margin: 0, color: fg, lineHeight: 1.1,
      }}>
        {sol.name}
      </h3>

      <p style={{
        fontSize: 14, fontWeight: 300, lineHeight: 1.5,
        margin: 0, color: mutedFg,
      }}>
        {sol.blurb}
      </p>

      <div style={{
        marginTop: 'auto',
        display: 'flex', flexWrap: 'wrap', gap: 6,
      }}>
        {sol.tags.map(t => (
          <span key={t} style={{
            fontSize: 11, fontWeight: 500, letterSpacing: '0.04em',
            padding: '4px 10px', borderRadius: 999,
            border: `1px solid ${accent ? 'rgba(64,35,1,0.25)' : 'rgba(252,247,235,0.22)'}`,
            color: fg,
          }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

window.SiteSolutions = SiteSolutions;
