// Services.jsx, Brief, clear overview of the four service lines.
// Exposes: window.SiteServices

const SERVICES = [
  {
    id: 'consulting',
    num: '01',
    name: 'Salesforce Consulting',
    blurb: 'Strategy, configuration, and development to optimise Salesforce and drive business outcomes.',
    bullets: [
      'Discovery, design, build, optimise',
      'Sales, Service, Marketing, Experience',
      'Roadmaps designed to deliver',
    ],
    icon: 'compass',
  },
  {
    id: 'integration',
    num: '02',
    name: 'Integration Development',
    blurb: 'Connect Salesforce to your ERP, data warehouse, and core systems with maintainable architectures.',
    bullets: [
      'Event-driven & batch architectures',
      'AWS partnership and native services',
      'Built to scale, designed to maintain',
    ],
    icon: 'plug',
  },
  {
    id: 'field-service',
    num: '03',
    name: 'Field Service Consulting',
    blurb: 'Specialists in Salesforce Field Service, from dispatch and routing to mobile and parts.',
    bullets: [
      'Routing, dispatch, mobile, parts',
      '40+ field service rollouts delivered',
      'Designed to perform in the field',
    ],
    icon: 'wrench',
  },
  {
    id: 'isa',
    num: '04',
    name: 'ISA: Salesforce Academy',
    blurb: 'Our in-house Salesforce traineeship, developing the next generation of certified consultants.',
    bullets: [
      'Six-month immersive programme',
      'Certified consultants on completion',
      'Now hiring the 2026 cohort',
    ],
    icon: 'spark',
  },
];

function ServiceIcon({ kind }) {
  const common = { width: 32, height: 32, viewBox: '0 0 32 32', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (kind) {
    case 'compass':
      return (
        <svg {...common}>
          <circle cx="16" cy="16" r="12"/>
          <path d="M20.5 11.5 L17 17 L11.5 20.5 L15 15 Z" fill="currentColor" stroke="none"/>
        </svg>
      );
    case 'plug':
      return (
        <svg {...common}>
          <path d="M11 4 V 9"/>
          <path d="M21 4 V 9"/>
          <rect x="8" y="9" width="16" height="8" rx="2"/>
          <path d="M16 17 V 22"/>
          <path d="M12 22 H 20"/>
          <path d="M14 26 V 28"/>
          <path d="M18 26 V 28"/>
          <path d="M12 22 V 26 H 20 V 22"/>
        </svg>
      );
    case 'wrench':
      return (
        <svg {...common}>
          <path d="M22 5 a 5 5 0 0 0 -5 8 L 6 24 a 2 2 0 0 0 0 3 l 0 0 a 2 2 0 0 0 3 0 L 20 16 a 5 5 0 0 0 8 -5 l -3 3 -3 -3 Z"/>
        </svg>
      );
    case 'spark':
      return (
        <svg {...common}>
          <path d="M16 4 L 18.5 12.5 L 27 15 L 18.5 17.5 L 16 26 L 13.5 17.5 L 5 15 L 13.5 12.5 Z"/>
        </svg>
      );
    default:
      return null;
  }
}

function SiteServices() {
  const tx = window.tx || ((en) => en);
  const localized = SERVICES.map(s => {
    const map = {
      consulting: {
        name: tx('Salesforce Consulting', 'Salesforce Consulting'),
        blurb: tx(
          'Strategy, configuration, and development to optimise Salesforce and drive business outcomes.',
          'Strategie, configuratie en development om Salesforce te optimaliseren en business-resultaten te realiseren.'
        ),
        bullets: [
          tx('Discovery, design, build, optimise', 'Discovery, design, build, optimaliseren'),
          tx('Sales, Service, Marketing, Experience', 'Sales, Service, Marketing, Experience'),
          tx('Roadmaps designed to deliver', 'Roadmaps gericht op resultaat'),
        ],
      },
      integration: {
        name: tx('Integration Development', 'Integration Development'),
        blurb: tx(
          'Connect Salesforce to your ERP, data warehouse, and core systems with maintainable architectures.',
          'Koppel Salesforce aan ERP, data warehouse en kernsystemen, met onderhoudbare architecturen.'
        ),
        bullets: [
          tx('Event-driven & batch architectures', 'Event-driven en batch-architecturen'),
          tx('AWS partnership and native services', 'AWS-partnership en native services'),
          tx('Built to scale, designed to maintain', 'Gebouwd om te schalen, ontworpen om te onderhouden'),
        ],
      },
      'field-service': {
        name: tx('Field Service Consulting', 'Field Service Consulting'),
        blurb: tx(
          'Specialists in Salesforce Field Service, from dispatch and routing to mobile and parts.',
          'Specialisten in Salesforce Field Service, van dispatch en routing tot mobile en parts.'
        ),
        bullets: [
          tx('Routing, dispatch, mobile, parts', 'Routing, dispatch, mobile, parts'),
          tx('40+ field service rollouts delivered', '40+ field service-implementaties opgeleverd'),
          tx('Designed to perform in the field', 'Ontworpen om in het veld te presteren'),
        ],
      },
      isa: {
        name: tx('ISA: Salesforce Academy', 'ISA: Salesforce Academy'),
        blurb: tx(
          'Our in-house Salesforce traineeship, developing the next generation of certified consultants.',
          'Ons interne Salesforce-traineeship dat de volgende generatie gecertificeerde consultants opleidt.'
        ),
        bullets: [
          tx('Six-month immersive programme', 'Zesmaands immersive programma'),
          tx('Certified consultants on completion', 'Gecertificeerde consultants na afronding'),
          tx('Now hiring the 2026 cohort', 'Werving voor cohort 2026 is open'),
        ],
      },
    };
    return { ...s, ...map[s.id] };
  });

  return (
    <section
      id="services"
      className="section"
      data-screen-label="Services"
      style={{
        background: 'var(--intigris-off-white)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div className="container-wide">
        <div className="section-head">
          <div>
            <div className="eyebrow" style={{ marginBottom: 20 }}>{tx('OUR SERVICES', 'ONZE DIENSTEN')}</div>
            <h2 className="display-md">
              {tx('What we ', 'Wat wij ')}
              <span style={{ color: 'var(--intigris-coral)' }}>{tx('do.', 'doen.')}</span>
            </h2>
          </div>
          <p className="lede">
            {tx(
              'Four engagement models, each with the same outcome: a Salesforce platform that advances your business. Choose the closest fit, and we will shape the engagement from there.',
              'Vier engagement-modellen met hetzelfde doel: een Salesforce-platform dat uw business vooruit helpt. Kies wat het beste past en we bouwen het traject samen.'
            )}
          </p>
        </div>

        {/* Service grid, compact "what we do" cards */}
        <CompactProductsGrid tx={tx} />

        {/* Bottom row CTA */}
        <div style={{
          marginTop: 56,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 24,
          flexWrap: 'wrap',
        }}>
          <p style={{ fontSize: 16, fontWeight: 400, color: 'var(--fg-muted)', maxWidth: 540 }}>
            {tx(
              'Not sure which engagement fits? Most programmes begin with a 30-minute call where we determine that together.',
              'Niet zeker welk engagement past? De meeste programma’s beginnen met een gesprek van 30 minuten waarin we dat samen bepalen.'
            )}
          </p>
          <button className="btn btn-primary">{tx('Book a 30-min call', 'Plan een gesprek van 30 minuten')} <span className="arrow">→</span></button>
        </div>
      </div>
    </section>
  );
}

/* ---------- Products row, Salesforce stack we implement ---------- */
const PRODUCTS = [
  {
    id: 'sales', num: '01', name: 'Sales Cloud',
    blurb: 'The core CRM for pipeline, forecasting, and account management, configured to match how your team actually sells.',
    bullets: [
      'Pipeline, forecast, opportunities',
      'Accounts, contacts, activity',
      'Sales productivity & reporting',
    ],
  },
  {
    id: 'field-service', num: '02', name: 'Field Service',
    blurb: 'Our deepest specialism, Salesforce Field Service from dispatch and routing to mobile, parts and assets.',
    bullets: [
      'Dispatch, scheduling, routing',
      'Mobile, offline, work orders',
      'Parts, assets, maintenance',
    ],
  },
  {
    id: 'service', num: '03', name: 'Service Cloud',
    blurb: 'Case management and omnichannel service across email, chat, voice and self-service, one agent console.',
    bullets: [
      'Cases, queues, omni-routing',
      'Knowledge & self-service',
      'Console, macros, SLAs',
    ],
  },
  {
    id: 'integrations', num: '04', name: 'Integrations',
    blurb: 'Connect Salesforce to your ERP, data warehouse and core systems with patterns built to scale and to maintain.',
    bullets: [
      'Event-driven & batch architectures',
      'AWS-native services & MuleSoft',
      'Built to scale, designed to maintain',
    ],
  },
  {
    id: 'agentforce', num: '05', name: 'Agentforce',
    blurb: 'Salesforce AI agents grounded in your data, designed, deployed and governed for real customer-facing work.',
    bullets: [
      'Agents on your trusted data',
      'Guardrails & approvals built in',
      'For service, sales & operations',
    ],
  },
  {
    id: 'data', num: '06', name: 'Data 360',
    blurb: 'Unify customer data from every system into one profile, then activate it across Sales, Service and Marketing.',
    bullets: [
      'Unified customer profile',
      'Identity resolution at scale',
      'Activation across clouds',
    ],
  },
  {
    id: 'fieldbuddy', num: '07', name: 'FieldBuddy',
    blurb: 'Our in-house service-ops app on the Salesforce platform, extended and integrated for your operation.',
    bullets: [
      'Service-ops on the platform',
      'Pre-built integration patterns',
      'Built and maintained by us',
    ],
  },
  {
    id: 'experience', num: '08', name: 'Experience Cloud',
    blurb: 'Customer, partner and self-service portals on the platform, branded, secure, and easy to evolve.',
    bullets: [
      'Customer & partner portals',
      'Self-service & case deflection',
      'B2B commerce surfaces',
    ],
  },
];

function ProductGlyph({ id }) {
  const props = { width: 32, height: 32, viewBox: '0 0 32 32', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (id) {
    case 'sales':         return <svg {...props}><path d="M4 24 L12 16 L18 21 L28 9"/><path d="M21 9 H28 V16"/></svg>;
    case 'service':       return <svg {...props}><path d="M5 17 a11 11 0 0 1 22 0"/><rect x="5" y="17" width="5" height="8" rx="1.5"/><rect x="22" y="17" width="5" height="8" rx="1.5"/><path d="M27 25 V26 a4 4 0 0 1 -4 4 H18"/></svg>;
    case 'field-service': return <svg {...props}><path d="M24 5 L27 8 L18 17 L15 14 Z"/><path d="M15 14 L5 24 a2 2 0 0 0 3 3 L18 17"/></svg>;
    case 'integrations':  return <svg {...props}><circle cx="9" cy="9" r="3.5"/><circle cx="23" cy="23" r="3.5"/><path d="M12.5 9 H18 a4 4 0 0 1 4 4 V19.5"/><path d="M19.5 23 H14 a4 4 0 0 1 -4 -4 V12.5"/></svg>;
    case 'experience':    return <svg {...props}><circle cx="16" cy="16" r="11"/><path d="M5 16 H27 M16 5 a16 16 0 0 1 0 22 M16 5 a16 16 0 0 0 0 22"/></svg>;
    case 'data':          return <svg {...props}><ellipse cx="16" cy="7" rx="10" ry="3"/><path d="M6 7 V16 a10 3 0 0 0 20 0 V7"/><path d="M6 16 V25 a10 3 0 0 0 20 0 V16"/></svg>;
    case 'agentforce':    return <svg {...props}><circle cx="16" cy="16" r="4.5"/><path d="M16 5 V8 M16 24 V27 M5 16 H8 M24 16 H27 M8 8 L10 10 M22 22 L24 24 M8 24 L10 22 M22 10 L24 8"/></svg>;
    case 'fieldbuddy':    return <svg {...props}><rect x="4" y="9" width="24" height="17" rx="2"/><path d="M4 14 H28"/><path d="M11 9 V6 M21 9 V6"/><circle cx="16" cy="20" r="2.2"/></svg>;
    default: return null;
  }
}

function ProductsRow({ tx, headless = false }) {
  return (
    <div style={{ marginTop: headless ? 0 : 'clamp(56px, 7vw, 88px)' }}>
      {!headless && (
        <div className="section-head" style={{ marginBottom: 32 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 20 }}>
              {tx('PRODUCTS WE IMPLEMENT', 'PRODUCTEN DIE WIJ IMPLEMENTEREN')}
            </div>
            <h2 className="display-md">
              {tx('Across the ', 'Op de hele ')}
              <span style={{ color: 'var(--intigris-coral)' }}>{tx('Salesforce stack.', 'Salesforce-stack.')}</span>
            </h2>
          </div>
          <p className="lede">
            {tx(
              'The Salesforce products we deliver most frequently, configured, integrated, and running in production at our clients.',
              'De Salesforce-producten die we het vaakst opleveren, geconfigureerd, geïntegreerd en in productie bij onze klanten.'
            )}
          </p>
        </div>
      )}

      <div className="products-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gap: 0,
        border: '1px solid var(--border)',
        borderRadius: 24,
        overflow: 'hidden',
        background: 'var(--intigris-paper)',
      }}>
        {PRODUCTS.map((p, i) => (
          <ProductCell key={p.id} p={p} idx={i} total={PRODUCTS.length} cols={4} tx={tx} />
        ))}
      </div>

      <style>{`
        @media (max-width: 980px) {
          .products-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          /* Reset JS-computed desktop borders, then rebuild a clean 2-col grid */
          .products-grid > [data-cols="4"] {
            border-right: none !important;
            border-bottom: 1px solid var(--border) !important;
          }
          /* Right border between the two columns */
          .products-grid > [data-cols="4"]:nth-child(odd) {
            border-right: 1px solid var(--border) !important;
          }
          /* Last row: drop bottom border */
          .products-grid > [data-cols="4"]:nth-last-child(-n+2) {
            border-bottom: none !important;
          }
        }
        @media (max-width: 560px) {
          .products-grid { grid-template-columns: 1fr !important; }
          /* One per row → separator below each except the last */
          .products-grid > [data-cols="4"] {
            border-right: none !important;
            border-bottom: 1px solid var(--border) !important;
          }
          .products-grid > [data-cols="4"]:last-child {
            border-bottom: none !important;
          }
        }
      `}</style>
    </div>
  );
}

function ProductCell({ p, idx, total, cols, tx }) {
  const [hover, setHover] = React.useState(false);

  // Borders: right border between cols, bottom border between rows.
  // We compute desktop assuming 4 cols; mobile breakpoints just collapse to 1.
  const isLastCol  = (idx + 1) % cols === 0;
  const isLastRow  = idx >= total - cols;

  // Hover applies a soft coral "filter", less intense than full coral
  // and shifts the title + icon glyph to cream so they pop as the
  // hero elements of the card. Body copy stays in dark-brown ink so the
  // detail remains easy to read against the warm fill.
  const hoverBg    = 'color-mix(in oklab, var(--intigris-coral) 80%, var(--intigris-off-white))';
  const inkMuted   = hover ? 'rgba(64,35,1,0.78)' : 'var(--fg-muted)';
  const ruleColor  = hover ? 'rgba(64,35,1,0.22)' : 'var(--border)';
  const tickColor  = hover ? 'var(--intigris-dark-brown)' : 'var(--intigris-coral)';

  return (
    <div
      data-cols={cols}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        padding: '40px 32px 32px',
        borderRight:  !isLastCol ? `1px solid ${ruleColor}` : 'none',
        borderBottom: !isLastRow ? `1px solid ${ruleColor}` : 'none',
        background: hover ? hoverBg : 'transparent',
        transition: 'background 220ms var(--ease-out), border-color 220ms var(--ease-out)',
        minHeight: 360,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        cursor: 'pointer',
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 999,
          background: hover ? 'var(--intigris-dark-brown)' : 'var(--intigris-off-white-200)',
          display: 'grid', placeItems: 'center',
          color: hover ? 'var(--intigris-off-white)' : 'var(--intigris-dark-brown)',
          transition: 'background 220ms var(--ease-out), color 220ms var(--ease-out)',
        }}>
          <ProductGlyph id={p.id} />
        </div>
        <div style={{
          fontSize: 12, letterSpacing: '0.18em',
          color: inkMuted, fontWeight: 500,
          transition: 'color 220ms var(--ease-out)',
        }}>
          {p.num}
        </div>
      </div>

      <h3 style={{
        fontSize: 26, fontWeight: 500, letterSpacing: '-0.02em',
        lineHeight: 1.1, margin: 0,
        color: hover ? 'var(--intigris-off-white)' : 'var(--intigris-dark-brown)',
        transition: 'color 220ms var(--ease-out)',
      }}>
        {p.name}
      </h3>

      <p style={{
        fontSize: 15, fontWeight: 400, lineHeight: 1.5,
        color: inkMuted,
        margin: 0,
        transition: 'color 220ms var(--ease-out)',
      }}>
        {p.blurb}
      </p>

      <ul style={{
        marginTop: 'auto',
        listStyle: 'none', padding: 0,
        display: 'flex', flexDirection: 'column', gap: 6,
        borderTop: `1px solid ${ruleColor}`,
        paddingTop: 16,
        transition: 'border-color 220ms var(--ease-out)',
      }}>
        {p.bullets.map((b, i) => (
          <li key={i} style={{
            fontSize: 13, fontWeight: 400,
            color: 'var(--intigris-dark-brown)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" style={{ flexShrink: 0 }}>
              <path d="M2 6 L 5 9 L 10 3" stroke={tickColor} strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {b}
          </li>
        ))}
      </ul>

      <div style={{
        fontSize: 14, fontWeight: 500,
        color: hover ? 'var(--intigris-off-white)' : 'var(--intigris-dark-brown)',
        display: 'inline-flex', alignItems: 'center', gap: 6,
        alignSelf: 'flex-start',
        transition: 'color 220ms var(--ease-out)',
      }}>
        <span style={{
          borderBottom: '1px solid',
          borderBottomColor: hover ? 'var(--intigris-off-white)' : 'transparent',
          paddingBottom: 2,
          transition: 'border-color 220ms var(--ease-out)',
        }}>
          {tx('Read more', 'Lees meer')}
        </span>
        <span style={{
          display: 'inline-block',
          transform: hover ? 'translateX(4px)' : 'translateX(0)',
          transition: 'transform 220ms var(--ease-out)',
        }}>→</span>
      </div>
    </div>
  );
}

function ServiceCell({ s, idx, total, tx }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        padding: '40px 32px 32px',
        borderRight: idx < total - 1 ? '1px solid var(--border)' : 'none',
        background: hover ? 'var(--intigris-off-white-200)' : 'transparent',
        transition: 'background 220ms var(--ease-out)',
        minHeight: 360,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        cursor: 'pointer',
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 999,
          background: hover ? 'var(--intigris-coral)' : 'var(--intigris-off-white-200)',
          display: 'grid', placeItems: 'center',
          color: 'var(--intigris-dark-brown)',
          transition: 'background 220ms var(--ease-out)',
        }}>
          <ServiceIcon kind={s.icon} />
        </div>
        <div style={{
          fontSize: 12, letterSpacing: '0.18em',
          color: 'var(--fg-muted)', fontWeight: 500,
        }}>
          {s.num}
        </div>
      </div>

      <h3 style={{
        fontSize: 26, fontWeight: 500, letterSpacing: '-0.02em',
        lineHeight: 1.1, margin: 0,
        color: 'var(--intigris-dark-brown)',
      }}>
        {s.name}
      </h3>

      <p style={{
        fontSize: 15, fontWeight: 400, lineHeight: 1.5,
        color: 'var(--fg-muted)',
        margin: 0,
      }}>
        {s.blurb}
      </p>

      <ul style={{
        marginTop: 'auto',
        listStyle: 'none', padding: 0,
        display: 'flex', flexDirection: 'column', gap: 6,
        borderTop: '1px solid var(--border)',
        paddingTop: 16,
      }}>
        {s.bullets.map((b, i) => (
          <li key={i} style={{
            fontSize: 13, fontWeight: 400,
            color: 'var(--intigris-dark-brown)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" style={{ flexShrink: 0 }}>
              <path d="M2 6 L 5 9 L 10 3" stroke="var(--intigris-coral)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {b}
          </li>
        ))}
      </ul>

      <div style={{
        fontSize: 14, fontWeight: 500,
        color: hover ? 'var(--intigris-coral)' : 'var(--intigris-dark-brown)',
        display: 'inline-flex', alignItems: 'center', gap: 6,
        transition: 'color 140ms var(--ease-out)',
      }}>
        {tx('Read more', 'Lees meer')}
        <span style={{
          display: 'inline-block',
          transform: hover ? 'translateX(4px)' : 'translateX(0)',
          transition: 'transform 220ms var(--ease-out)',
        }}>→</span>
      </div>
    </div>
  );
}

window.SiteServices = SiteServices;

/* ---------- Localized short copy shared by header mega + compact grid ---------- */
function productCopy(tx) {
  return {
    sales:          { name: tx('Sales Cloud', 'Sales Cloud'),               short: tx('Pipeline, forecasting & CRM that fits how you sell.', 'Pipeline, forecasting & CRM die past bij hoe u verkoopt.') },
    'field-service':{ name: tx('Field Service', 'Field Service'),           short: tx('Dispatch, routing, mobile & parts, our deepest specialism.', 'Dispatch, routing, mobile & parts, ons grootste specialisme.') },
    service:        { name: tx('Service Cloud', 'Service Cloud'),           short: tx('Omnichannel case management in one console.', 'Omnichannel casemanagement in één console.') },
    integrations:   { name: tx('Integrations', 'Integraties'),              short: tx('Salesforce connected to ERP, data & core systems.', 'Salesforce gekoppeld aan ERP, data & kernsystemen.') },
    agentforce:     { name: tx('Agentforce', 'Agentforce'),                 short: tx('Salesforce AI agents grounded in your data.', 'Salesforce AI-agents op basis van uw data.') },
    data:           { name: tx('Data 360', 'Data 360'),                     short: tx('One unified customer profile, activated everywhere.', 'Één uniform klantprofiel, overal geactiveerd.') },
    fieldbuddy:     { name: tx('FieldBuddy', 'FieldBuddy'),                 short: tx('Our in-house service-ops app on the platform.', 'Onze eigen service-ops app op het platform.') },
    experience:     { name: tx('Experience Cloud', 'Experience Cloud'),     short: tx('Customer, partner & self-service portals.', 'Klant-, partner- & self-serviceportalen.') },
  };
}

/* ---------- Compact "what we do" grid (small cards, homepage) ---------- */
function CompactProductsGrid({ tx }) {
  const copy = productCopy(tx);
  return (
    <div className="svc-compact-grid">
      {PRODUCTS.map((p) => (
        <CompactProductCard key={p.id} p={p} copy={copy[p.id]} tx={tx} />
      ))}
      <style>{`
        .svc-compact-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 16px; }
        @media (max-width: 980px) { .svc-compact-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 520px) { .svc-compact-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}

function CompactProductCard({ p, copy, tx }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', flexDirection: 'column', gap: 16,
        textDecoration: 'none', cursor: 'pointer',
        background: 'var(--bg-elevated)',
        border: '1px solid ' + (hover ? 'var(--intigris-coral)' : 'var(--border)'),
        borderRadius: 16,
        padding: 24,
        boxShadow: hover ? 'var(--shadow-2)' : 'none',
        transform: hover ? 'translateY(-3px)' : 'none',
        transition: 'border-color 200ms var(--ease-out), box-shadow 220ms var(--ease-out), transform 220ms var(--ease-out)',
      }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        display: 'grid', placeItems: 'center',
        background: hover ? 'var(--intigris-coral)' : 'var(--intigris-off-white-200)',
        color: 'var(--intigris-dark-brown)',
        transition: 'background 200ms var(--ease-out)',
      }}>
        <ProductGlyph id={p.id} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 19, fontWeight: 500, letterSpacing: '-0.018em', lineHeight: 1.1,
          color: hover ? 'var(--intigris-coral)' : 'var(--intigris-dark-brown)',
          transition: 'color 160ms var(--ease-out)',
        }}>
          {copy?.name || p.name}
          <span aria-hidden style={{
            color: 'var(--intigris-coral)', fontSize: 15,
            transform: hover ? 'translateX(4px)' : 'translateX(0)',
            transition: 'transform 220ms var(--ease-out)',
          }}>→</span>
        </div>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 400, lineHeight: 1.45, color: 'var(--fg-muted)' }}>
          {copy?.short}
        </p>
      </div>
    </a>
  );
}

window.PRODUCTS = PRODUCTS;
window.ProductGlyph = ProductGlyph;
window.productCopy = productCopy;
