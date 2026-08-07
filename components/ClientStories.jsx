// ClientStories.jsx, auto-scrolling marquee of client success stories.
// Tall photo cards drift right-to-left in a seamless loop, each tagged with a
// client name + one-line result. Modeled on the shared "Een greep uit onze
// klanten" reference, restyled on-brand.
// Exposes: window.SiteClientStories

const CLIENT_STORIES = [
  { img: 'assets/clients/client-1.jpg', name: 'Zorgplein',    en: 'Faster patient intake with Service Cloud',      nl: 'Snellere patiëntintake met Service Cloud' },
  { img: 'assets/clients/client-4.jpg', name: 'EasyFinance',  en: 'Automated reconciliation, zero backlog',        nl: 'Geautomatiseerde afstemming, geen achterstand' },
  { img: 'assets/showcase/showcase-2.jpg', name: 'Capisoft CRM', en: 'A single console for 800 field engineers',    nl: 'Eén console voor 800 buitendienst-engineers' },
  { img: 'assets/clients/client-3.jpg', name: 'Nova Energy',   en: '3x demand absorbed without new headcount',      nl: '3x meer vraag opgevangen zonder extra mensen' },
  { img: 'assets/showcase/showcase-3.jpg', name: 'Bouwgroep', en: 'Work orders digitized end to end',              nl: 'Werkorders volledig gedigitaliseerd' },
  { img: 'assets/clients/client-2.jpg', name: 'Cyclovriend',  en: 'Quote cycle cut from days to minutes',          nl: 'Offertecyclus van dagen naar minuten' },
];

function ClientCard({ s, tx }) {
  return (
    <a className="cs-card" onClick={(e) => e.preventDefault()}>
      <img src={s.img} alt={s.name} loading="lazy" />
      <div className="cs-scrim" aria-hidden></div>
      <div className="cs-meta">
        <div className="cs-name">{s.name}</div>
        <div className="cs-result">{tx(s.en, s.nl)}</div>
      </div>
    </a>
  );
}

function SiteClientStories() {
  const tx = window.tx || ((en) => en);
  // Duplicate the list so the marquee can loop seamlessly.
  const loop = [...CLIENT_STORIES, ...CLIENT_STORIES];
  return (
    <section
      id="client-stories"
      className="section"
      data-screen-label="Client stories"
      style={{ background: 'var(--intigris-off-white)', overflow: 'hidden' }}
    >
      <div className="container-wide" style={{ marginBottom: 'clamp(36px, 4vw, 56px)' }}>
        <div className="eyebrow" style={{ marginBottom: 20, color: 'var(--intigris-coral)' }}>
          {tx('CUSTOMER SUCCESS', 'KLANTVERHALEN')}
        </div>
        <h2 className="display-md" style={{ color: 'var(--intigris-dark-brown)', margin: 0 }}>
          {tx('A selection of our clients.', 'Een greep uit onze klanten.')}
        </h2>
        <p style={{ marginTop: 20, maxWidth: 560, fontSize: 'clamp(17px, 1.4vw, 20px)', fontWeight: 400, lineHeight: 1.45, color: 'var(--fg-muted)' }}>
          {tx(
            'See how businesses across sectors move forward with our Salesforce and AI solutions.',
            'Ontdek hoe bedrijven uit verschillende sectoren vooruitkomen met onze Salesforce- en AI-oplossingen.'
          )}
        </p>
      </div>

      <div className="cs-marquee">
        <div className="cs-track">
          {loop.map((s, i) => (
            <ClientCard key={i} s={s} tx={tx} />
          ))}
        </div>
      </div>

      <style>{`
        #client-stories .cs-marquee {
          position: relative;
          -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 6%, #000 94%, transparent 100%);
          mask-image: linear-gradient(90deg, transparent 0, #000 6%, #000 94%, transparent 100%);
        }
        #client-stories .cs-track {
          display: flex; gap: clamp(16px, 1.6vw, 24px);
          width: max-content;
          padding: 0 clamp(20px, 4vw, 64px);
          animation: csScroll 56s linear infinite;
        }
        #client-stories .cs-marquee:hover .cs-track { animation-play-state: paused; }
        @keyframes csScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        #client-stories .cs-card {
          position: relative; flex: 0 0 auto;
          width: clamp(280px, 24vw, 340px);
          aspect-ratio: 3 / 4;
          border-radius: 20px; overflow: hidden;
          background: var(--intigris-off-white-200);
          text-decoration: none; cursor: pointer;
          box-shadow: 0 18px 40px -22px rgba(64,35,1,0.4);
        }
        #client-stories .cs-card img {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; display: block;
          transform: scale(1); transition: transform 700ms var(--ease-out);
        }
        #client-stories .cs-card:hover img { transform: scale(1.05); }
        #client-stories .cs-scrim {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(64,35,1,0) 42%, rgba(64,35,1,0.78) 100%);
        }
        #client-stories .cs-meta {
          position: absolute; left: 20px; right: 20px; bottom: 20px;
          display: flex; flex-direction: column; gap: 6px;
        }
        #client-stories .cs-name {
          font-size: 22px; font-weight: 500; letter-spacing: -0.02em; line-height: 1.05;
          color: var(--intigris-off-white);
        }
        #client-stories .cs-result {
          font-size: 14px; font-weight: 400; line-height: 1.35;
          color: rgba(252,247,235,0.82);
        }
      `}</style>
    </section>
  );
}

window.SiteClientStories = SiteClientStories;
