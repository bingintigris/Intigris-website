// Industries.jsx, Leading section: interactive tabs of industries we serve.
// The whole point: visitors immediately see "is Intigris for my industry?"
// Exposes: window.SiteIndustries

const { useState: useIndState } = React;

const INDUSTRIES = [
  {
    id: 'energy',
    name: 'Energy',
    photoClass: 'photo photo--blue',
    photoLabel: 'Grid · infrastructure',
    headline: 'Customer operations built for the energy transition.',
    description: 'High volumes, complex regulated products, and a shifting market. We build Salesforce-based service and engagement operations that absorb the load and remain compliant.',
    pains: ['Spikes in customer demand', 'Compliance & audit trails', 'Legacy billing integration'],
    services: ['Service Cloud', 'Marketing Cloud', 'Data 360', 'Agentforce'],
    cases: '6 energy programs · 3.2M+ customer interactions per year',
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    photoClass: 'photo',
    photoLabel: 'Production floor',
    headline: 'Connect the shop floor to the commercial team.',
    description: 'From quote-to-cash on configurable products to real-time service capacity, we integrate Salesforce with ERP and MES so every team operates on the same data.',
    pains: ['Disconnected ERP and CRM', 'Long quote cycles for configurable products', 'No visibility on service profitability'],
    services: ['Sales Cloud', 'Service Cloud', 'Platform', 'Integration'],
    cases: '12 manufacturing clients · average 38% faster quote cycle',
  },
  {
    id: 'installation',
    name: 'Installation',
    photoClass: 'photo photo--chocolate',
    photoLabel: 'Installer · on site',
    headline: 'From first quote to final acceptance, in one system.',
    description: 'Installer businesses run on hand-offs between sales, planning, engineers and finance. We connect them inside Salesforce so jobs flow end-to-end with no spreadsheets in between.',
    pains: ['Hand-offs between sales and operations', 'Slow site surveys and quoting', 'Acceptance and invoicing delays'],
    services: ['Sales Cloud', 'Field Service', 'Service Cloud', 'Integration'],
    cases: 'Installer rollouts across HVAC, solar, and security verticals',
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    photoClass: 'photo photo--meadow',
    photoLabel: 'Healthcare member services',
    headline: 'A patient and member experience that actually works.',
    description: 'For payers, providers, and life-sciences organisations, we deliver Salesforce solutions that respect regulatory boundaries while improving every patient or member touchpoint.',
    pains: ['Fragmented member data', 'Compliance and privacy requirements', 'Multiple intake channels'],
    services: ['Service Cloud', 'Experience Cloud', 'Data 360', 'Marketing Cloud'],
    cases: 'Implementations for healthcare and life-sciences organisations',
  },
  {
    id: 'logistics',
    name: 'Logistics',
    photoClass: 'photo',
    photoLabel: 'Logistics · in transit',
    headline: 'Move every shipment, customer, and case through one platform.',
    description: 'For transport, freight forwarding, and supply chain operators, we connect Salesforce to TMS, customs, and tracking systems, so commercial, planning, and customer service teams work from the same shipment data.',
    pains: ['Disjointed shipment visibility', 'Manual customer-service hand-offs', 'Slow quote-to-booking cycles'],
    services: ['Sales Cloud', 'Service Cloud', 'Integration', 'Data 360'],
    cases: 'Customs and freight programs across NL and Benelux',
  },
  {
    id: 'technology',
    name: 'Technology',
    photoClass: 'photo photo--blue',
    photoLabel: 'Technology · product teams',
    headline: 'A revenue platform that scales as fast as your product.',
    description: 'For SaaS, fintech, and platform businesses, we build Salesforce environments that keep up with product launches, pricing changes, and a constantly evolving go-to-market motion.',
    pains: ['Sales and CS running on different data', 'Manual provisioning and renewals', 'Reporting that can’t keep up with the roadmap'],
    services: ['Sales Cloud', 'Service Cloud', 'Platform', 'Integration'],
    cases: 'Implementations for SaaS, fintech, and platform companies',
  },
];

function SiteIndustries() {
  const [active, setActive] = useIndState(INDUSTRIES[0].id);
  const ind = INDUSTRIES.find(i => i.id === active);
  const tx = window.tx || ((en) => en);

  // Translated copy lookup per industry id
  const I = {
    energy: {
      name: tx('Energy', 'Energie'),
      headline: tx('Customer operations built for the energy transition.', 'Customer operations gebouwd voor de energietransitie.'),
      description: tx(
        'High volumes, complex regulated products, and a shifting market. We build Salesforce-based service and engagement operations that absorb the load and remain compliant.',
        'Hoge volumes, complexe gereguleerde producten en een veranderende markt. We bouwen Salesforce-gestuurde service- en engagement-operaties die de druk opvangen en compliant blijven.'
      ),
      cases: tx('6 energy programs · 3.2M+ customer interactions per year', '6 energieprogramma’s · 3,2M+ klantinteracties per jaar'),
      pains: [
        tx('Spikes in customer demand', 'Pieken in klantvraag'),
        tx('Compliance & audit trails', 'Compliance en audit trails'),
        tx('Legacy billing integration', 'Legacy billing-integratie'),
      ],
    },
    manufacturing: {
      name: tx('Manufacturing', 'Industrie'),
      headline: tx('Connect the shop floor to the commercial team.', 'Verbind de werkvloer met het commerciële team.'),
      description: tx(
        'From quote-to-cash on configurable products to real-time service capacity, we integrate Salesforce with ERP and MES so every team operates on the same data.',
        'Van quote-to-cash op configureerbare producten tot real-time servicecapaciteit, we integreren Salesforce met ERP en MES, zodat ieder team op dezelfde data werkt.'
      ),
      cases: tx('12 manufacturing clients · average 38% faster quote cycle', '12 industriële klanten · gemiddeld 38% snellere quote-cyclus'),
      pains: [
        tx('Disconnected ERP and CRM', 'Niet-verbonden ERP en CRM'),
        tx('Long quote cycles for configurable products', 'Lange quote-cycli voor configureerbare producten'),
        tx('No visibility on service profitability', 'Geen zicht op service-rentabiliteit'),
      ],
    },
    installation: {
      name: tx('Installation', 'Installatie'),
      headline: tx('From first quote to final acceptance, in one system.', 'Van eerste offerte tot oplevering, in één systeem.'),
      description: tx(
        'Installer businesses run on hand-offs between sales, planning, engineers and finance. We connect them inside Salesforce so jobs flow end-to-end with no spreadsheets in between.',
        'Installatiebedrijven draaien op overdrachten tussen sales, planning, monteurs en finance. We verbinden deze in Salesforce, zodat klussen end-to-end doorlopen, zonder spreadsheets ertussen.'
      ),
      cases: tx('Installer rollouts across HVAC, solar, and security verticals', 'Implementaties bij installateurs in HVAC, zonne-energie en beveiliging'),
      pains: [
        tx('Hand-offs between sales and operations', 'Overdrachten tussen sales en operatie'),
        tx('Slow site surveys and quoting', 'Trage opname en offertes'),
        tx('Acceptance and invoicing delays', 'Vertraging in oplevering en facturatie'),
      ],
    },
    healthcare: {
      name: tx('Healthcare', 'Zorg'),
      headline: tx('A patient and member experience that actually works.', 'Een patiënt- en leden-ervaring die werkt.'),
      description: tx(
        'For payers, providers, and life-sciences organisations, we deliver Salesforce solutions that respect regulatory boundaries while improving every patient or member touchpoint.',
        'Voor zorgverzekeraars, zorgaanbieders en life-sciences leveren we Salesforce-oplossingen die binnen de regelgeving blijven én iedere patiënt- of leden-touchpoint verbeteren.'
      ),
      cases: tx('Implementations for healthcare and life-sciences organisations', 'Implementaties voor zorg- en life-sciences organisaties'),
      pains: [
        tx('Fragmented member data', 'Versplinterde leden-data'),
        tx('Compliance and privacy requirements', 'Compliance- en privacy-eisen'),
        tx('Multiple intake channels', 'Meerdere intake-kanalen'),
      ],
    },
    logistics: {
      name: tx('Logistics', 'Logistiek'),
      headline: tx('Move every shipment, customer, and case through one platform.', 'Iedere zending, klant en case op één platform.'),
      description: tx(
        'For transport, freight forwarding, and supply chain operators, we connect Salesforce to TMS, customs, and tracking systems, so commercial, planning, and customer service teams work from the same shipment data.',
        'Voor transport, expediteurs en supply chain-operators verbinden we Salesforce met TMS, douane- en tracking-systemen, zodat commercie, planning en customer service vanuit dezelfde zendingdata werken.'
      ),
      cases: tx('Customs and freight programs across NL and Benelux', 'Douane- en freightprogramma’s in NL en de Benelux'),
      pains: [
        tx('Disjointed shipment visibility', 'Gefragmenteerd zicht op zendingen'),
        tx('Manual customer-service hand-offs', 'Handmatige overdrachten in customer service'),
        tx('Slow quote-to-booking cycles', 'Trage quote-to-booking cycli'),
      ],
    },
    technology: {
      name: tx('Technology', 'Technologie'),
      headline: tx('A revenue platform that scales as fast as your product.', 'Een revenue-platform dat meegroeit met uw product.'),
      description: tx(
        'For SaaS, fintech, and platform businesses, we build Salesforce environments that keep up with product launches, pricing changes, and a constantly evolving go-to-market motion.',
        'Voor SaaS-, fintech- en platformbedrijven bouwen we Salesforce-omgevingen die meebewegen met productlanceringen, prijswijzigingen en een continu evoluerende go-to-market.'
      ),
      cases: tx('Implementations for SaaS, fintech, and platform companies', 'Implementaties voor SaaS-, fintech- en platformbedrijven'),
      pains: [
        tx('Sales and CS running on different data', 'Sales en CS op verschillende data'),
        tx('Manual provisioning and renewals', 'Handmatige provisioning en verlengingen'),
        tx('Reporting that can’t keep up with the roadmap', 'Rapportages die de roadmap niet bijhouden'),
      ],
    },
  };
  const indCopy = I[ind.id];

  return (
    <section
      id="industries"
      className="section"
      data-screen-label="Industries"
      style={{ background: 'var(--intigris-off-white-200)', borderTop: '1px solid var(--border)' }}
    >
      <div className="container-wide" style={{ position: 'relative' }}>
        {/* Section head */}
        <div className="section-head" style={{ gridTemplateColumns: '1fr' }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 20 }}>{tx('INDUSTRIES WE SERVE', 'BRANCHES DIE WE BEDIENEN')}</div>
            <h2 className="display-md">
              {tx('Domain expertise for the', 'Domein-expertise voor de')}<br/>
              {tx('sectors that ', 'sectoren die ')}<span style={{ color: 'var(--intigris-coral)' }}>{tx('run on service.', 'draaien op service.')}</span>
            </h2>
          </div>
        </div>

        {/* Two-column layout: industry list (left) + detail panel (right).
           Two distinct sections with breathing room between them. */}
        <div className="ind-layout" style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 0.85fr) minmax(0, 1.4fr)',
          gap: 40,
          alignItems: 'start',
          position: 'relative',
        }}>
          {/* LEFT, stacked industry cards */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 12,
            position: 'relative', zIndex: 2,
          }}>
            {INDUSTRIES.map((i, idx) => {
              const isActive = i.id === active;
              const num = String(idx + 1).padStart(2, '0');
              return (
                <button
                  key={i.id}
                  onClick={() => setActive(i.id)}
                  aria-pressed={isActive}
                  style={{
                    appearance: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    padding: '18px 26px',
                    background: isActive ? 'var(--intigris-coral)' : 'var(--intigris-off-white)',
                    color: isActive ? 'var(--intigris-off-white)' : 'var(--intigris-dark-brown)',
                    border: isActive
                      ? '1.5px solid var(--intigris-coral)'
                      : '1px solid var(--border)',
                    borderRadius: 18,
                    transition: 'background 220ms var(--ease-out), color 220ms var(--ease-out), border-color 220ms var(--ease-out), box-shadow 220ms var(--ease-out), transform 220ms var(--ease-out)',
                    transform: isActive ? 'translateX(4px)' : 'translateX(0)',
                    boxShadow: isActive ? 'var(--shadow-2)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: 4,
                    position: 'relative',
                  }}
                >
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                    marginBottom: 2,
                  }}>
                    <div style={{
                      fontSize: 26,
                      fontWeight: 500,
                      letterSpacing: '-0.02em',
                      lineHeight: 1.05,
                    }}>
                      {I[i.id].name}
                    </div>
                    <span aria-hidden style={{
                      width: 22, height: 22,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      color: isActive ? 'var(--intigris-off-white)' : 'var(--fg-muted)',
                      transition: 'transform 280ms var(--ease-out), color 220ms var(--ease-out)',
                      transform: isActive ? 'translateX(4px)' : 'translateX(0)',
                      fontSize: 18,
                      flexShrink: 0,
                    }}>
                      →
                    </span>
                  </div>
                  <div style={{
                    fontSize: 13,
                    fontWeight: 400,
                    lineHeight: 1.4,
                    color: isActive ? 'rgba(252,247,235,0.88)' : 'var(--fg-muted)',
                  }}>
                    {I[i.id].headline}
                  </div>
                </button>
              );
            })}
          </div>

          {/* RIGHT, detail panel: bordered card, distinct from the cards on the left */}
          <div style={{
            background: 'var(--intigris-off-white)',
            border: '1.5px solid var(--intigris-dark-brown)',
            borderRadius: 24,
            padding: 32,
            position: 'relative',
            zIndex: 1,
            minHeight: 480,
          }}>
            <div key={ind.id} style={{
              animation: 'indFade 360ms var(--ease-out) both',
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 0.95fr) minmax(0, 1fr)',
              gap: 28,
              alignItems: 'start',
            }}>
            {/* Photo + track record */}
            <div style={{ position: 'relative' }}>
              <div className={ind.photoClass} style={{ aspectRatio: '4 / 5', borderRadius: 20 }}>
                <div className="photo-label">{ind.photoLabel}</div>
              </div>
              <div style={{
                position: 'absolute',
                bottom: 16, left: 16, right: 16,
                background: 'var(--intigris-off-white)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: '12px 16px',
                boxShadow: 'var(--shadow-2)',
              }}>
                <div className="eyebrow eyebrow--bare" style={{ marginBottom: 4 }}>{tx('TRACK RECORD', 'TRACK RECORD')}</div>
                <div style={{ fontSize: 14, fontWeight: 500, letterSpacing: '-0.005em', color: 'var(--intigris-dark-brown)' }}>
                  {indCopy.cases}
                </div>
              </div>
            </div>

            {/* Detail content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              <h3 style={{
                fontSize: 'clamp(28px, 2.6vw, 36px)',
                fontWeight: 500,
                letterSpacing: '-0.022em',
                lineHeight: 1.1,
                margin: 0,
                color: 'var(--intigris-dark-brown)',
              }}>
                {indCopy.headline}
              </h3>
              <p style={{ fontSize: 16, lineHeight: 1.55, fontWeight: 400, color: 'var(--fg-muted)', margin: 0 }}>
                {indCopy.description}
              </p>

              {/* Pain points */}
              <div>
                <div className="eyebrow" style={{ marginBottom: 12 }}>{tx('WHAT WE TYPICALLY ADDRESS', 'WAT WE VAAK OPLOSSEN')}</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {indCopy.pains.map((p, i) => (
                    <li key={i} style={{
                      display: 'flex', alignItems: 'flex-start', gap: 12,
                      fontSize: 15, fontWeight: 400, lineHeight: 1.45,
                      color: 'var(--intigris-dark-brown)',
                    }}>
                      <span style={{
                        marginTop: 7, flexShrink: 0,
                        width: 7, height: 7, borderRadius: 999,
                        background: 'var(--intigris-coral)',
                      }}/>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Services applied */}
              <div>
                <div className="eyebrow" style={{ marginBottom: 10 }}>{tx('SALESFORCE STACK', 'SALESFORCE-STACK')}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {ind.services.map((s, i) => (
                    <span key={i} className="chip chip--filled">{s}</span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
                <button className="btn btn-primary">
                  {tx('View a case study', 'Bekijk een case study')} <span className="arrow">→</span>
                </button>
                <button className="btn btn-ghost">
                  {tx(`Talk to a ${indCopy.name} specialist`, `Spreek een ${indCopy.name}-specialist`)} <span className="arrow">→</span>
                </button>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes indFade {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 900px) {
          #industries .section-head { grid-template-columns: 1fr; }
          #industries .ind-layout { grid-template-columns: 1fr !important; }
          #industries .ind-layout > div:nth-child(2) { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

window.SiteIndustries = SiteIndustries;

/* ===========================================================================
   SiteIndustriesGrid, alternative layout of the same six industries, using
   the same visual language as the "Selected cases" section: 3×2 grid of photo
   cards with tags + chips. Lives directly under the tabbed Industries section
   so the team can compare both treatments side-by-side.
   =========================================================================== */

function SiteIndustriesGrid() {
  const tx = window.tx || ((en) => en);

  const I = {
    energy: {
      name: tx('Energy', 'Energie'),
      headline: tx('Customer operations built for the energy transition.', 'Customer operations gebouwd voor de energietransitie.'),
    },
    manufacturing: {
      name: tx('Manufacturing', 'Industrie'),
      headline: tx('Connect the shop floor to the commercial team.', 'Verbind de werkvloer met het commerciële team.'),
    },
    installation: {
      name: tx('Installation', 'Installatie'),
      headline: tx('From first quote to final acceptance, in one system.', 'Van eerste offerte tot oplevering, in één systeem.'),
    },
    healthcare: {
      name: tx('Healthcare', 'Zorg'),
      headline: tx('A patient and member experience that actually works.', 'Een patiënt- en leden-ervaring die werkt.'),
    },
    logistics: {
      name: tx('Logistics', 'Logistiek'),
      headline: tx('Move every shipment, customer, and case through one platform.', 'Iedere zending, klant en case op één platform.'),
    },
    technology: {
      name: tx('Technology', 'Technologie'),
      headline: tx('A revenue platform that scales as fast as your product.', 'Een revenue-platform dat meegroeit met uw product.'),
    },
  };

  return (
    <section
      id="industries-grid"
      data-screen-label="Industries grid"
      className="section"
      style={{
        background: 'var(--intigris-off-white)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div className="container-wide">
        <div className="section-head">
          <div>
            <div className="eyebrow" style={{ marginBottom: 20 }}>{tx('INDUSTRIES WE THRIVE IN', 'BRANCHES WAARIN WIJ EXCELLEREN')}</div>
            <h2 className="display-md" style={{ color: 'var(--intigris-dark-brown)', whiteSpace: 'nowrap' }}>
              {tx('Choose your ', 'Kies uw ')}
              <span style={{ color: 'var(--intigris-coral)' }}>{tx('industry.', 'branche.')}</span>
            </h2>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: 28,
        }}>
          {INDUSTRIES.map((ind, i) => (
            <IndustryGridCard key={ind.id} ind={ind} copy={I[ind.id]} />
          ))}
        </div>

        <div style={{
          marginTop: 36,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
        }}>
          <span style={{
            fontSize: 15, fontWeight: 400, color: 'var(--fg-muted)',
          }}>
            {tx(
              'Don’t see your industry?',
              'Staat uw branche er niet bij?'
            )}
          </span>
          <a
            href="#contact"
            style={{
              fontSize: 15,
              fontWeight: 500,
              color: 'var(--intigris-dark-brown)',
              textDecoration: 'underline',
              textDecorationColor: 'var(--intigris-coral)',
              textUnderlineOffset: 4,
              cursor: 'pointer',
            }}
          >
            {tx(
              'We’ve probably done it. Let’s talk →',
              'We hebben het waarschijnlijk gedaan. Neem contact op →'
            )}
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #industries-grid > div > div:nth-child(2) { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          #industries-grid > div > div:nth-child(2) { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function IndustryGridCard({ ind, copy }) {
  const [hover, setHover] = React.useState(false);
  const tx = window.tx || ((en) => en);
  return (
    <a
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        textDecoration: 'none', color: 'inherit', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', gap: 16,
      }}
    >
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 18, aspectRatio: '4 / 3' }}>
        <img
          src={`assets/industries/${ind.id}.jpg`}
          alt={copy.name}
          loading="lazy"
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover',
            display: 'block',
            transform: hover ? 'scale(1.04)' : 'scale(1)',
            transition: 'transform 520ms var(--ease-out)',
          }}
        />

        {/* Soft coral tint that sits on top of every photo so the section
            reads on-brand even when the source photos vary in tone. */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0,
          background: 'var(--intigris-coral)',
          opacity: 0.18,
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }} />

        {/* Warm scrim that fades in on hover to make the CTA pop */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(64,35,1,0) 40%, rgba(64,35,1,0.55) 100%)',
          opacity: hover ? 1 : 0,
          transition: 'opacity 280ms var(--ease-out)',
          pointerEvents: 'none',
        }} />

        {/* CTA pill, slides up from the bottom-right on hover */}
        <span style={{
          position: 'absolute',
          right: 16, bottom: 16,
          transform: hover
            ? 'translate(0, 0)'
            : 'translate(0, 12px)',
          opacity: hover ? 1 : 0,
          transition: 'opacity 240ms var(--ease-out), transform 320ms var(--ease-spring)',
          background: 'var(--intigris-coral)',
          color: 'var(--intigris-off-white)',
          padding: '12px 22px',
          borderRadius: 999,
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: '-0.005em',
          whiteSpace: 'nowrap',
          boxShadow: '0 12px 28px -8px rgba(64,35,1,0.4)',
          display: 'inline-flex', alignItems: 'center', gap: 8,
          pointerEvents: 'none',
        }}>
          {tx(`Explore ${copy.name}`, `Ontdek ${copy.name}`)}
          <span aria-hidden style={{ fontSize: 16, lineHeight: 1 }}>→</span>
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <h3 style={{
          fontSize: 'clamp(28px, 2.4vw, 36px)',
          fontWeight: 500,
          letterSpacing: '-0.024em',
          lineHeight: 1.05,
          margin: 0,
          color: hover ? 'var(--intigris-coral)' : 'var(--intigris-dark-brown)',
          transition: 'color 160ms var(--ease-out)',
        }}>
          {copy.name}
        </h3>
        <p style={{
          margin: 0,
          fontSize: 15, fontWeight: 400, lineHeight: 1.45,
          color: 'var(--fg-muted)',
        }}>
          {copy.headline}
        </p>
      </div>
    </a>
  );
}

window.SiteIndustriesGrid = SiteIndustriesGrid;
