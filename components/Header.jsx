// Header.jsx, sticky top nav with mega-menu hint for Services + Industries
// Exposes: window.SiteHeader

const { useState: useHeaderState, useEffect: useHeaderEffect } = React;

// Industries shown in the big header dropdown (photos live in assets/industries/).
const HEADER_INDUSTRIES = [
  { id: 'energy',        en: 'Energy',        nl: 'Energie',    tagEn: 'Operations for the energy transition.',       tagNl: 'Operations voor de energietransitie.' },
  { id: 'manufacturing', en: 'Manufacturing', nl: 'Industrie',  tagEn: 'Connect the shop floor to commerce.',          tagNl: 'Verbind de werkvloer met commercie.' },
  { id: 'installation',  en: 'Installation',  nl: 'Installatie',tagEn: 'First quote to final acceptance, in one system.', tagNl: 'Van offerte tot oplevering, in één systeem.' },
  { id: 'healthcare',    en: 'Healthcare',    nl: 'Zorg',       tagEn: 'A member experience that actually works.',     tagNl: 'Een leden-ervaring die écht werkt.' },
  { id: 'logistics',     en: 'Logistics',     nl: 'Logistiek',  tagEn: 'Every shipment and case on one platform.',     tagNl: 'Iedere zending en case op één platform.' },
  { id: 'technology',    en: 'Technology',    nl: 'Technologie',tagEn: 'A revenue platform that scales with you.',      tagNl: 'Een revenue-platform dat meegroeit.' },
];

function AIScanGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M20 20l-4.2-4.2" />
      <path d="M10.5 7.4l0.75 1.85 1.85 0.75-1.85 0.75-0.75 1.85-0.75-1.85-1.85-0.75 1.85-0.75z" />
    </svg>
  );
}

function ServicesMega({ onNav, tx, onEnter, onLeave, theme = 'brown' }) {
  const items = window.PRODUCTS || [];
  const copy = window.productCopy ? window.productCopy(tx) : {};
  const Glyph = window.ProductGlyph || (() => null);
  return (
    <div className={'svc-mega' + (theme === 'coral' ? ' svc-mega--coral' : theme === 'cream' ? ' svc-mega--cream' : '')} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <div className="svc-mega-card">
        <div className="svc-mega-body">
          {/* LEFT, Salesforce stack (2 columns × 4 rows) */}
          <div className="svc-mega-col">
            <div className="svc-mega-head">
              <div>
                <div className="svc-mega-eyebrow">{tx('WHAT WE DO', 'WAT WIJ DOEN')}</div>
                <div className="svc-mega-title">{tx('Across the Salesforce stack.', 'Op de hele Salesforce-stack.')}</div>
              </div>
              <a className="svc-mega-all" onClick={() => onNav?.('services')}>
                {tx('All services', 'Alle diensten')} <span aria-hidden>→</span>
              </a>
            </div>
            <div className="svc-mega-grid">
              {items.map((p) => (
                <a key={p.id} className="svc-mega-item" onClick={() => onNav?.('services')}>
                  <div className="svc-mega-icon"><Glyph id={p.id} /></div>
                  <div className="svc-mega-copy">
                    <div className="svc-mega-name">
                      {copy[p.id]?.name || p.name}
                      <span className="svc-mega-arrow" aria-hidden>→</span>
                    </div>
                    <div className="svc-mega-desc">{copy[p.id]?.short}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* SEPARATOR */}
          <div className="svc-mega-sep" aria-hidden />

          {/* RIGHT, AI stack */}
          <div className="svc-mega-col">
            <div className="svc-mega-head">
              <div>
                <div className="svc-mega-eyebrow">{tx('NEW', 'NIEUW')}</div>
                <div className="svc-mega-title">{tx('Across the AI stack.', 'Op de hele AI-stack.')}</div>
              </div>
              <a className="svc-mega-all" onClick={() => (window.location.href = 'AIReadinessScan.html')}>
                {tx('All services', 'Alle diensten')} <span aria-hidden>→</span>
              </a>
            </div>
            <div className="svc-mega-ai">
              <a className="svc-mega-item" onClick={() => (window.location.href = 'AIReadinessScan.html')}>
                <div className="svc-mega-icon"><AIScanGlyph /></div>
                <div className="svc-mega-copy">
                  <div className="svc-mega-name">
                    {tx('AI readiness scan', 'AI-readiness scan')}
                    <span className="svc-mega-arrow" aria-hidden>→</span>
                  </div>
                  <div className="svc-mega-desc">{tx('See where AI can move the needle in your business.', 'Ontdek waar AI het verschil kan maken in uw business.')}</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .svc-mega {
          position: fixed;
          top: 76px; left: 50%; transform: translateX(-50%);
          width: calc(min(100vw, 1360px) - 2 * var(--container-pad));
          z-index: 60; padding-top: 12px;
          animation: svcMegaIn 260ms cubic-bezier(0.22,0.61,0.36,1) both;
        }
        @keyframes svcMegaIn { from { opacity: 0; transform: translate(-50%, 6px); } to { opacity: 1; transform: translate(-50%, 0); } }
        .svc-mega-card {
          background: var(--intigris-dark-brown);
          color: var(--intigris-off-white);
          border-radius: 24px; padding: 28px;
          box-shadow: 0 30px 80px -24px rgba(64,35,1,0.62), 0 8px 22px -10px rgba(64,35,1,0.4);
          border: 1px solid rgba(252,247,235,0.08);
        }
        .svc-mega-body { display: grid; grid-template-columns: minmax(0, 1.75fr) 1px minmax(0, 1fr); gap: 28px; align-items: stretch; }
        .svc-mega-col { min-width: 0; }
        .svc-mega-sep { width: 1px; align-self: stretch; background: rgba(252,247,235,0.14); }
        .svc-mega-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; margin-bottom: 22px; }
        .svc-mega-eyebrow { font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; font-weight: 500; color: var(--intigris-coral); margin-bottom: 8px; }
        .svc-mega-title { font-size: 24px; font-weight: 500; letter-spacing: -0.02em; line-height: 1.05; color: var(--intigris-off-white); }
        .svc-mega-all {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 14px; font-weight: 500; letter-spacing: -0.005em;
          color: var(--intigris-off-white); text-decoration: none; cursor: pointer;
          padding: 9px 18px; border-radius: 999px; border: 1.5px solid rgba(252,247,235,0.4);
          transition: background 160ms var(--ease-out), color 160ms var(--ease-out), border-color 160ms var(--ease-out);
          white-space: nowrap; flex-shrink: 0;
        }
        .svc-mega-all span { transition: transform 220ms var(--ease-out); display: inline-block; }
        .svc-mega-all:hover { background: var(--intigris-coral); color: var(--intigris-dark-brown); border-color: var(--intigris-coral); }
        .svc-mega-all:hover span { transform: translateX(4px); }
        .svc-mega-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 12px; }
        .svc-mega-ai { display: grid; grid-template-columns: 1fr; gap: 12px; }
        .svc-mega-item {
          display: flex; gap: 14px; align-items: flex-start;
          text-decoration: none; color: inherit; cursor: pointer;
          padding: 14px; border-radius: 14px; border: 1px solid transparent;
          transition: background 180ms var(--ease-out), border-color 180ms var(--ease-out), transform 220ms var(--ease-out);
        }
        .svc-mega-item:hover { background: rgba(252,247,235,0.07); border-color: rgba(252,247,235,0.16); transform: translateY(-3px); }
        .svc-mega-icon {
          flex-shrink: 0; width: 44px; height: 44px; border-radius: 11px;
          display: grid; place-items: center;
          background: rgba(252,247,235,0.08); color: var(--intigris-off-white);
          transition: background 180ms var(--ease-out), color 180ms var(--ease-out);
        }
        .svc-mega-item:hover .svc-mega-icon { background: var(--intigris-coral); color: var(--intigris-dark-brown); }
        .svc-mega-name {
          display: flex; align-items: center; gap: 8px;
          font-size: 16px; font-weight: 500; letter-spacing: -0.014em; line-height: 1.15;
          color: var(--intigris-off-white); transition: color 160ms var(--ease-out);
        }
        .svc-mega-arrow { color: var(--intigris-coral); font-size: 14px; transition: transform 220ms var(--ease-out); }
        .svc-mega-item:hover .svc-mega-name { color: var(--intigris-coral); }
        .svc-mega-item:hover .svc-mega-arrow { transform: translateX(4px); }
        .svc-mega-desc { margin-top: 5px; font-size: 12.5px; font-weight: 400; line-height: 1.4; color: rgba(252,247,235,0.78); }
        @media (max-width: 980px) {
          .svc-mega-body { grid-template-columns: 1fr; gap: 20px; }
          .svc-mega-sep { display: none; }
          .svc-mega-grid { grid-template-columns: repeat(2, 1fr); }
        }
        /* Coral theme */
        .svc-mega--coral .svc-mega-sep { background: rgba(64,35,1,0.18); }
        .svc-mega--coral .svc-mega-card { background: var(--intigris-coral); color: var(--intigris-dark-brown); border-color: rgba(64,35,1,0.14); }
        .svc-mega--coral .svc-mega-eyebrow { color: var(--intigris-dark-brown); }
        .svc-mega--coral .svc-mega-title { color: var(--intigris-dark-brown); }
        .svc-mega--coral .svc-mega-all { color: var(--intigris-dark-brown); border-color: rgba(64,35,1,0.4); }
        .svc-mega--coral .svc-mega-all:hover { background: var(--intigris-dark-brown); color: var(--intigris-off-white); border-color: var(--intigris-dark-brown); }
        .svc-mega--coral .svc-mega-item:hover { background: rgba(64,35,1,0.08); border-color: rgba(64,35,1,0.18); }
        .svc-mega--coral .svc-mega-icon { background: rgba(64,35,1,0.1); color: var(--intigris-dark-brown); }
        .svc-mega--coral .svc-mega-item:hover .svc-mega-icon { background: var(--intigris-dark-brown); color: var(--intigris-off-white); }
        .svc-mega--coral .svc-mega-name { color: var(--intigris-dark-brown); }
        .svc-mega--coral .svc-mega-arrow { color: var(--intigris-dark-brown); }
        .svc-mega--coral .svc-mega-item:hover .svc-mega-name { color: var(--intigris-dark-brown); }
        .svc-mega--coral .svc-mega-desc { color: rgba(64,35,1,0.7); }
        /* Cream theme */
        .svc-mega--cream .svc-mega-sep { background: var(--border); }
        .svc-mega--cream .svc-mega-card { background: var(--intigris-off-white); color: var(--intigris-dark-brown); border-color: var(--border); }
        .svc-mega--cream .svc-mega-title { color: var(--intigris-dark-brown); }
        .svc-mega--cream .svc-mega-all { background: var(--intigris-coral); color: var(--intigris-off-white); border-color: transparent; }
        .svc-mega--cream .svc-mega-all:hover { background: var(--intigris-coral-700); color: var(--intigris-off-white); border-color: transparent; }
        .svc-mega--cream .svc-mega-item:hover { background: var(--intigris-coral); border-color: transparent; box-shadow: 0 12px 26px -12px rgba(64,35,1,0.4); }
        .svc-mega--cream .svc-mega-icon { background: var(--intigris-coral); color: var(--intigris-off-white); }
        .svc-mega--cream .svc-mega-item:hover .svc-mega-icon { background: var(--intigris-off-white); color: var(--intigris-coral); }
        .svc-mega--cream .svc-mega-item:hover .svc-mega-name { color: var(--intigris-off-white); }
        .svc-mega--cream .svc-mega-item:hover .svc-mega-arrow { color: var(--intigris-off-white); }
        .svc-mega--cream .svc-mega-item:hover .svc-mega-desc { color: var(--intigris-dark-brown); font-weight: 400; }
        .svc-mega--cream .svc-mega-name { color: var(--intigris-dark-brown); }
        .svc-mega--cream .svc-mega-desc { color: rgba(64,35,1,0.82); }
      `}</style>
    </div>
  );
}

function IndustriesMega({ onNav, tx, onEnter, onLeave, theme = 'brown' }) {
  return (
    <div className={'ind-mega' + (theme === 'coral' ? ' ind-mega--coral' : theme === 'cream' ? ' ind-mega--cream' : '')} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <div className="ind-mega-card">
        <div className="ind-mega-head">
          <div>
            <div className="ind-mega-eyebrow">{tx('INDUSTRIES WE SERVE', 'BRANCHES DIE WE BEDIENEN')}</div>
            <div className="ind-mega-title">{tx('Which sector are you in?', 'In welke sector zit u?')}</div>
          </div>
          <a className="ind-mega-all" onClick={() => onNav?.('industries')}>
            {tx('View all industries', 'Alle branches')} <span aria-hidden>→</span>
          </a>
        </div>
        <div className="ind-mega-grid">
          {HEADER_INDUSTRIES.map((i) => (
            <a key={i.id} className="ind-mega-item" onClick={() => onNav?.('industries')}>
              <img className="ind-mega-img" src={`assets/industries/${i.id}.jpg`} alt={tx(i.en, i.nl)} loading="lazy" />
              <span className="ind-mega-scrim" aria-hidden></span>
              <div className="ind-mega-overlay">
                <div className="ind-mega-name">
                  {tx(i.en, i.nl)}
                  <span className="ind-mega-arrow" aria-hidden>→</span>
                </div>
                <div className="ind-mega-tag">{tx(i.tagEn, i.tagNl)}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
      <style>{`
        .ind-mega {
          position: fixed;
          top: 76px; left: 50%; transform: translateX(-50%);
          width: calc(min(100vw, 1360px) - 2 * var(--container-pad));
          z-index: 60;
          padding-top: 12px;
          animation: indMegaIn 260ms cubic-bezier(0.22,0.61,0.36,1) both;
        }
        @keyframes indMegaIn { from { opacity: 0; transform: translate(-50%, 6px); } to { opacity: 1; transform: translate(-50%, 0); } }
        .ind-mega-card {
          background: var(--intigris-dark-brown);
          color: var(--intigris-off-white);
          border-radius: 24px;
          padding: 22px;
          box-shadow: 0 30px 80px -24px rgba(64,35,1,0.62), 0 8px 22px -10px rgba(64,35,1,0.4);
          border: 1px solid rgba(252,247,235,0.08);
          max-height: calc(100vh - 96px);
          overflow-y: auto;
        }
        .ind-mega-head {
          display: flex; align-items: flex-end; justify-content: space-between; gap: 20px;
          margin-bottom: 16px;
        }
        .ind-mega-eyebrow {
          font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em;
          font-weight: 500; color: var(--intigris-coral); margin-bottom: 8px;
        }
        .ind-mega-title {
          font-size: 24px; font-weight: 500; letter-spacing: -0.02em; line-height: 1.05;
          color: var(--intigris-off-white);
        }
        .ind-mega-all {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 14px; font-weight: 500; letter-spacing: -0.005em;
          color: var(--intigris-off-white); text-decoration: none; cursor: pointer;
          padding: 9px 18px; border-radius: 999px;
          border: 1.5px solid rgba(252,247,235,0.4);
          transition: background 160ms var(--ease-out), color 160ms var(--ease-out), border-color 160ms var(--ease-out);
          white-space: nowrap; flex-shrink: 0;
        }
        .ind-mega-all span { transition: transform 220ms var(--ease-out); display: inline-block; }
        .ind-mega-all:hover { background: var(--intigris-coral); color: var(--intigris-dark-brown); border-color: var(--intigris-coral); }
        .ind-mega-all:hover span { transform: translateX(4px); }
        .ind-mega-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; }
        .ind-mega-item {
          position: relative; display: block; overflow: hidden;
          border-radius: 14px; cursor: pointer; aspect-ratio: 20 / 9;
          text-decoration: none; color: inherit;
        }
        .ind-mega-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 520ms var(--ease-out); }
        .ind-mega-item:hover .ind-mega-img { transform: scale(1.06); }
        .ind-mega-scrim {
          position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(180deg, rgba(64,35,1,0.05) 20%, rgba(64,35,1,0.80) 100%);
        }
        .ind-mega-overlay { position: absolute; left: 15px; right: 15px; bottom: 12px; pointer-events: none; }
        .ind-mega-name {
          display: flex; align-items: center; gap: 8px;
          font-size: 17px; font-weight: 500; letter-spacing: -0.016em; line-height: 1.12;
          color: var(--intigris-off-white);
        }
        .ind-mega-arrow { color: var(--intigris-coral); font-size: 15px; transition: transform 220ms var(--ease-out); }
        .ind-mega-item:hover .ind-mega-arrow { transform: translateX(4px); }
        .ind-mega-tag {
          margin-top: 3px; font-size: 12.5px; font-weight: 400; line-height: 1.3;
          color: rgba(252,247,235,0.9);
        }
        @media (max-width: 980px) { .ind-mega-grid { grid-template-columns: repeat(2, 1fr); } }
        /* Coral theme */
        .ind-mega--coral .ind-mega-card { background: var(--intigris-coral); color: var(--intigris-dark-brown); border-color: rgba(64,35,1,0.14); }
        .ind-mega--coral .ind-mega-eyebrow { color: var(--intigris-dark-brown); }
        .ind-mega--coral .ind-mega-title { color: var(--intigris-dark-brown); }
        .ind-mega--coral .ind-mega-all { color: var(--intigris-dark-brown); border-color: rgba(64,35,1,0.4); }
        .ind-mega--coral .ind-mega-all:hover { background: var(--intigris-dark-brown); color: var(--intigris-off-white); border-color: var(--intigris-dark-brown); }
        /* Cream theme */
        .ind-mega--cream .ind-mega-card { background: var(--intigris-off-white); color: var(--intigris-dark-brown); border-color: var(--border); }
        .ind-mega--cream .ind-mega-title { color: var(--intigris-dark-brown); }
        .ind-mega--cream .ind-mega-all { background: var(--intigris-coral); color: var(--intigris-off-white); border-color: transparent; }
        .ind-mega--cream .ind-mega-all:hover { background: var(--intigris-coral-700); color: var(--intigris-off-white); border-color: transparent; }
      `}</style>
    </div>
  );
}

// Careers sections shown in the header dropdown (mirrors the live site).
const HEADER_CAREERS = [
  { id: 'overview',    en: 'Overview',              nl: 'Overzicht',              dEn: 'The big picture on life at Intigris.',             dNl: 'Het grote plaatje van werken bij Intigris.' },
  { id: 'vacancies',   en: 'Vacancies',             nl: 'Vacatures',              dEn: 'Explore open roles and apply.',                    dNl: 'Bekijk openstaande functies en solliciteer.' },
  { id: 'culture',     en: 'Our culture',           nl: 'Onze cultuur',           dEn: 'Feel at home from day one.',                       dNl: 'Voel je thuis vanaf dag één.' },
  { id: 'benefits',    en: 'Benefits',              nl: 'Arbeidsvoorwaarden',     dEn: 'What makes working here worthwhile.',              dNl: 'Wat werken bij Intigris de moeite waard maakt.' },
  { id: 'isa',         en: 'ISA',                   nl: 'ISA',                    dEn: 'Our academy, start with zero Salesforce experience.', dNl: 'Onze academy, begin zonder Salesforce-ervaring.' },
  { id: 'application', en: 'Application procedure', nl: 'Sollicitatieprocedure',  dEn: 'What to expect, step by step.',                    dNl: 'Wat je kunt verwachten, stap voor stap.' },
];

function CareerGlyph({ id }) {
  const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const svg = (children) => <svg width="22" height="22" viewBox="0 0 24 24" {...P} aria-hidden>{children}</svg>;
  switch (id) {
    case 'overview':    return svg(<><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/></>);
    case 'vacancies':   return svg(<><rect x="3" y="7.5" width="18" height="12.5" rx="2"/><path d="M8 7.5V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1.5"/><path d="M3 12.5h18"/></>);
    case 'culture':     return svg(<><circle cx="9" cy="8" r="3"/><path d="M3.5 19.5c0-3 2.4-5 5.5-5s5.5 2 5.5 5"/><path d="M16 5.2a3 3 0 0 1 0 5.6"/><path d="M20.5 19.5c0-2.2-1.1-3.9-3-4.6"/></>);
    case 'benefits':    return svg(<><rect x="3.5" y="9" width="17" height="11.5" rx="1.5"/><path d="M3.5 13h17"/><path d="M12 9v11.5"/><path d="M12 9S10.7 4.8 8.3 5.6 12 9 12 9z"/><path d="M12 9s1.3-4.2 3.7-3.4S12 9 12 9z"/></>);
    case 'isa':         return svg(<><path d="M12 4 2.5 8.5 12 13l9.5-4.5z"/><path d="M6.5 10.5v4.2c0 1.4 2.6 2.8 5.5 2.8s5.5-1.4 5.5-2.8v-4.2"/><path d="M21.5 8.5v5"/></>);
    case 'application': return svg(<><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9.5 4h5v2.5h-5z"/><path d="M8.5 12l1.6 1.6L13.5 10"/><path d="M8.5 17h7"/></>);
    default: return null;
  }
}

function CareersMega({ onNav, tx, onEnter, onLeave, theme = 'brown' }) {
  return (
    <div className={'car-mega' + (theme === 'coral' ? ' car-mega--coral' : theme === 'cream' ? ' car-mega--cream' : '')} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <div className="car-mega-card">
        <div className="car-mega-inner">
          <div className="car-mega-intro">
            <div className="car-mega-eyebrow">{tx('CAREERS AT INTIGRIS', 'WERKEN BIJ INTIGRIS')}</div>
            <div className="car-mega-title">{tx('Master your skills, grow your impact.', 'Ontwikkel jezelf, vergroot je impact.')}</div>
            <p className="car-mega-sub">{tx('Collaborate with the friendliest and brightest minds in the field.', 'Werk samen met de aardigste en slimste mensen uit het vak.')}</p>
            <a className="car-mega-cta" onClick={() => (window.location.href = 'Vacancies.html')}>
              {tx('Check our vacancies', 'Bekijk onze vacatures')} <span aria-hidden>→</span>
            </a>
          </div>
          <div className="car-mega-grid">
            {HEADER_CAREERS.map((c) => (
              <a key={c.id} className="car-mega-item" onClick={() => c.id === 'vacancies' ? (window.location.href = 'Vacancies.html') : c.id === 'overview' ? (window.location.href = 'Careers.html') : c.id === 'culture' ? (window.location.href = 'Culture.html') : c.id === 'benefits' ? (window.location.href = 'Benefits.html') : c.id === 'isa' ? (window.location.href = 'ISA.html') : c.id === 'application' ? (window.location.href = 'ApplicationProcedure.html') : onNav?.('careers')}>
                <div className="car-mega-icon"><CareerGlyph id={c.id} /></div>
                <div className="car-mega-copy">
                  <div className="car-mega-name">
                    {tx(c.en, c.nl)}
                    <span className="car-mega-arrow" aria-hidden>→</span>
                  </div>
                  <div className="car-mega-desc">{tx(c.dEn, c.dNl)}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        .car-mega {
          position: fixed;
          top: 76px; left: 50%; transform: translateX(-50%);
          width: calc(min(100vw, 1360px) - 2 * var(--container-pad));
          z-index: 60; padding-top: 12px;
          animation: carMegaIn 260ms cubic-bezier(0.22,0.61,0.36,1) both;
        }
        @keyframes carMegaIn { from { opacity: 0; transform: translate(-50%, 6px); } to { opacity: 1; transform: translate(-50%, 0); } }
        .car-mega-card {
          background: var(--intigris-dark-brown);
          color: var(--intigris-off-white);
          border-radius: 24px; padding: 28px;
          box-shadow: 0 30px 80px -24px rgba(64,35,1,0.62), 0 8px 22px -10px rgba(64,35,1,0.4);
          border: 1px solid rgba(252,247,235,0.08);
          max-height: calc(100vh - 96px); overflow-y: auto;
        }
        .car-mega-inner { display: grid; grid-template-columns: 0.82fr 1.5fr; gap: 44px; align-items: start; }
        .car-mega-eyebrow { font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; font-weight: 600; color: var(--intigris-coral); margin-bottom: 10px; }
        .car-mega-title { font-size: 28px; font-weight: 500; letter-spacing: -0.022em; line-height: 1.04; color: var(--intigris-off-white); }
        .car-mega-sub { margin-top: 14px; font-size: 14.5px; font-weight: 400; line-height: 1.5; color: rgba(252,247,235,0.78); max-width: 280px; }
        .car-mega-cta {
          display: inline-flex; align-items: center; gap: 8px; margin-top: 22px;
          font-size: 14px; font-weight: 500; padding: 10px 18px; border-radius: 999px;
          cursor: pointer; text-decoration: none;
          background: var(--intigris-coral); color: var(--intigris-dark-brown); border: 1.5px solid transparent;
          transition: background 160ms var(--ease-out), color 160ms var(--ease-out);
        }
        .car-mega-cta span { transition: transform 220ms var(--ease-out); display: inline-block; }
        .car-mega-cta:hover span { transform: translateX(4px); }
        .car-mega-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 10px; }
        .car-mega-item {
          display: flex; gap: 14px; align-items: flex-start;
          text-decoration: none; color: inherit; cursor: pointer;
          padding: 14px; border-radius: 14px; border: 1px solid transparent;
          transition: background 180ms var(--ease-out), border-color 180ms var(--ease-out), transform 220ms var(--ease-out);
        }
        .car-mega-item:hover { background: rgba(252,247,235,0.07); border-color: rgba(252,247,235,0.16); transform: translateY(-3px); }
        .car-mega-icon {
          flex-shrink: 0; width: 44px; height: 44px; border-radius: 11px;
          display: grid; place-items: center;
          background: rgba(252,247,235,0.08); color: var(--intigris-off-white);
          transition: background 180ms var(--ease-out), color 180ms var(--ease-out);
        }
        .car-mega-item:hover .car-mega-icon { background: var(--intigris-coral); color: var(--intigris-dark-brown); }
        .car-mega-name {
          display: flex; align-items: center; gap: 8px;
          font-size: 16px; font-weight: 500; letter-spacing: -0.014em; line-height: 1.15;
          color: var(--intigris-off-white); transition: color 160ms var(--ease-out);
        }
        .car-mega-arrow { color: var(--intigris-coral); font-size: 14px; transition: transform 220ms var(--ease-out); }
        .car-mega-item:hover .car-mega-name { color: var(--intigris-coral); }
        .car-mega-item:hover .car-mega-arrow { transform: translateX(4px); }
        .car-mega-desc { margin-top: 5px; font-size: 12.5px; font-weight: 400; line-height: 1.4; color: rgba(252,247,235,0.78); }
        @media (max-width: 980px) { .car-mega-inner { grid-template-columns: 1fr; gap: 24px; } }
        @media (max-width: 620px) { .car-mega-grid { grid-template-columns: 1fr; } }
        /* Cream theme */
        .car-mega--cream .car-mega-card { background: var(--intigris-off-white); color: var(--intigris-dark-brown); border-color: var(--border); }
        .car-mega--cream .car-mega-title { color: var(--intigris-dark-brown); }
        .car-mega--cream .car-mega-sub { color: var(--fg-muted); }
        .car-mega--cream .car-mega-cta { background: var(--intigris-coral); color: var(--intigris-off-white); }
        .car-mega--cream .car-mega-cta:hover { background: var(--intigris-coral-700); }
        .car-mega--cream .car-mega-item:hover { background: var(--intigris-coral); border-color: transparent; box-shadow: 0 12px 26px -12px rgba(64,35,1,0.4); }
        .car-mega--cream .car-mega-icon { background: var(--intigris-coral); color: var(--intigris-off-white); }
        .car-mega--cream .car-mega-item:hover .car-mega-icon { background: var(--intigris-off-white); color: var(--intigris-coral); }
        .car-mega--cream .car-mega-name { color: var(--intigris-dark-brown); }
        .car-mega--cream .car-mega-item:hover .car-mega-name { color: var(--intigris-off-white); }
        .car-mega--cream .car-mega-item:hover .car-mega-arrow { color: var(--intigris-off-white); }
        .car-mega--cream .car-mega-desc { color: var(--fg-muted); }
        .car-mega--cream .car-mega-item:hover .car-mega-desc { color: var(--intigris-dark-brown); }
        /* Coral theme */
        .car-mega--coral .car-mega-card { background: var(--intigris-coral); color: var(--intigris-dark-brown); border-color: rgba(64,35,1,0.14); }
        .car-mega--coral .car-mega-title { color: var(--intigris-dark-brown); }
        .car-mega--coral .car-mega-sub { color: rgba(64,35,1,0.72); }
        .car-mega--coral .car-mega-cta { background: var(--intigris-dark-brown); color: var(--intigris-off-white); }
        .car-mega--coral .car-mega-item:hover { background: rgba(64,35,1,0.08); border-color: rgba(64,35,1,0.18); }
        .car-mega--coral .car-mega-icon { background: rgba(64,35,1,0.1); color: var(--intigris-dark-brown); }
        .car-mega--coral .car-mega-item:hover .car-mega-icon { background: var(--intigris-dark-brown); color: var(--intigris-off-white); }
        .car-mega--coral .car-mega-name { color: var(--intigris-dark-brown); }
        .car-mega--coral .car-mega-arrow { color: var(--intigris-dark-brown); }
        .car-mega--coral .car-mega-item:hover .car-mega-name { color: var(--intigris-dark-brown); }
        .car-mega--coral .car-mega-desc { color: rgba(64,35,1,0.72); }
      `}</style>
    </div>
  );
}

function SiteHeader({ onNav, theme, overlay = false, lang = 'en', onLang, megaTheme = 'brown' }) {
  const [scrolled, setScrolled] = useHeaderState(false);
  const [hidden, setHidden] = useHeaderState(false);
  const [coralBg, setCoralBg] = useHeaderState(false);
  const [open, setOpen] = useHeaderState(null);
  const closeTimer = React.useRef(null);
  const openMenu = (name) => { clearTimeout(closeTimer.current); setOpen(name); };
  const scheduleClose = () => { clearTimeout(closeTimer.current); closeTimer.current = setTimeout(() => setOpen(null), 180); };
  const tx = window.tx || ((en) => en);

  useHeaderEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY;
        setScrolled(y > 8);
        // Near the top: always visible, transparent.
        // Scrolling down: fade out AND stay transparent.
        // Scrolling up past the top: bring back with a solid coral background.
        if (y < 80) {
          setHidden(false);
          setCoralBg(false);
        } else if (delta > 4) {
          setHidden(true);
          setCoralBg(false);
        } else if (delta < -4) {
          setHidden(false);
          setCoralBg(true);
        }
        lastY = y;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Header now lives on coral, per brandbook pairing, coral surface
  // takes dark-brown ink for highest contrast. In `overlay` mode it starts
  // transparent (floating over the cinematic hero) and turns solid coral once
  // the user scrolls past the top.
  const solid = !overlay;
  // In overlay mode the header floats transparent over the hero and while
  // scrolling down. It only takes the solid coral background when the user
  // scrolls back up past the top section (coralBg), for legible contrast.
  const onCoral = solid || coralBg;
  const surface = onCoral ? 'var(--intigris-coral)' : 'transparent';

  // When scrolling DOWN past the hero, the header eases out (translates up
  // + fades). When the user scrolls UP, it snaps back into place fully
  // opaque on coral so it reads as a confident solid bar over the content.
  const headerStyle = {
    position: overlay ? 'fixed' : 'sticky',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    background: surface,
    borderBottom: onCoral && scrolled && !hidden ? '1px solid rgba(64,35,1,0.16)' : '1px solid transparent',
    transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
    opacity: hidden ? 0 : 1,
    pointerEvents: hidden ? 'none' : 'auto',
    transition: [
      'background 280ms var(--ease-out)',
      'border-color 220ms var(--ease-out)',
      'transform 320ms var(--ease-out)',
      'opacity 280ms var(--ease-out)',
    ].join(', '),
    willChange: 'transform, opacity',
  };

  const linkStyle = {
    color: 'var(--intigris-off-white)',
    fontWeight: 600,
    fontSize: 15,
    letterSpacing: '-0.005em',
    textDecoration: 'none',
    cursor: 'pointer',
    padding: '6px 0',
    transition: 'color 140ms var(--ease-out)',
    textShadow: '0 1px 0 rgba(64,35,1,0.18)',
  };

  const Caret = () => (
    <svg width="10" height="10" viewBox="0 0 10 10" style={{ marginLeft: 4, opacity: 0.7 }}>
      <path d="M2 3.5 L5 6.5 L8 3.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <>
      {open && (
        <div
          onClick={() => setOpen(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 45,
            background: 'radial-gradient(130% 120% at 50% 0%, rgba(64,35,1,0.14) 0%, rgba(40,22,2,0.34) 100%)',
            backdropFilter: 'blur(3px) saturate(1.05)',
            WebkitBackdropFilter: 'blur(3px) saturate(1.05)',
            animation: 'fadeIn 220ms cubic-bezier(0.22,0.61,0.36,1)',
            cursor: 'pointer',
          }}
        />
      )}
      <header style={headerStyle}>
      <div className="container-wide" style={{ position: 'relative', zIndex: 46, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 76 }}>
        <a onClick={() => onNav?.('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img src="assets/logo-off-white-tight.png" alt="intigris" style={{ height: 40, width: 'auto', maxWidth: 'none', flexShrink: 0, display: 'block' }} />
        </a>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <div
            style={{ position: 'static' }}
            onMouseEnter={() => openMenu('services')}
            onMouseLeave={scheduleClose}
          >
            <a style={{ ...linkStyle, display: 'inline-flex', alignItems: 'center' }}>
              {tx('Services', 'Diensten')}<Caret />
            </a>
            {open === 'services' && <ServicesMega onNav={onNav} tx={tx} theme={megaTheme} onEnter={() => openMenu('services')} onLeave={scheduleClose} />}
          </div>

          <div
            style={{ position: 'static' }}
            onMouseEnter={() => openMenu('industries')}
            onMouseLeave={scheduleClose}
          >
            <a style={{ ...linkStyle, display: 'inline-flex', alignItems: 'center' }}>
              {tx('Industries', 'Branches')}<Caret />
            </a>
            {open === 'industries' && <IndustriesMega onNav={onNav} tx={tx} theme={megaTheme} onEnter={() => openMenu('industries')} onLeave={scheduleClose} />}
          </div>

          <a className="header-navlink" style={linkStyle} onClick={() => onNav?.('about')}>{tx('About', 'Over ons')}</a>
          <a className="header-navlink" style={linkStyle} onClick={() => onNav?.('blog')}>{tx('Blog', 'Blog')}</a>

          <div
            style={{ position: 'static' }}
            onMouseEnter={() => openMenu('careers')}
            onMouseLeave={scheduleClose}
          >
            <a style={{ ...linkStyle, display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => (window.location.href = 'Careers.html')}>
              {tx('Careers', 'Werken bij')}<Caret />
            </a>
            {open === 'careers' && <CareersMega onNav={onNav} tx={tx} theme={megaTheme} onEnter={() => openMenu('careers')} onLeave={scheduleClose} />}
          </div>
          <style>{`
            .header-navlink:hover { color: var(--intigris-dark-brown) !important; }
          `}</style>

          <button
            className="btn btn-sm header-cta-cine"
            onClick={() => onNav?.('contact')}
          >
            {tx("Let's talk", 'Neem contact op')} <span className="cine-arrow" aria-hidden>→</span>
          </button>
          <style>{`
            .header-cta-cine {
              background: var(--intigris-off-white);
              color: var(--intigris-dark-brown);
              padding-right: 6px;
              transition: background var(--t-base) var(--ease-out);
            }
            .header-cta-cine:hover { background: #fff; }
            .header-cta-cine .cine-arrow {
              display: inline-flex; align-items: center; justify-content: center;
              width: 28px; height: 28px; border-radius: 999px;
              background: var(--intigris-coral); color: var(--intigris-off-white);
              font-size: 14px; transition: transform var(--t-base) var(--ease-out);
            }
            .header-cta-cine:hover .cine-arrow { transform: translateX(3px); }
          `}</style>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 2,
            padding: 3,
            marginLeft: 4,
            background: 'rgba(252,247,235,0.14)',
            WebkitBackdropFilter: 'blur(16px)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(252,247,235,0.38)',
            boxShadow: '0 20px 44px -18px rgba(64,35,1,0.5), inset 0 1px 0 rgba(252,247,235,0.25)',
            borderRadius: 999,
          }}>
            {[
              { code: 'en', label: 'EN' },
              { code: 'nl', label: 'NL' },
            ].map(({ code, label }) => {
              const active = lang === code;
              return (
                <a
                  key={code}
                  onClick={() => onLang?.(code)}
                  style={{
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    padding: '5px 12px',
                    borderRadius: 999,
                    textDecoration: 'none',
                    transition: 'background 160ms var(--ease-out), color 160ms var(--ease-out)',
                    background: active ? 'var(--intigris-off-white)' : 'transparent',
                    color: active ? 'var(--intigris-dark-brown)' : 'var(--intigris-off-white)',
                  }}
                >
                  {label}
                </a>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
    </>
  );
}

const megaStyle = {
  position: 'absolute',
  top: 'calc(100% + 6px)',
  left: '-20px',
  background: 'var(--intigris-paper)',
  border: '1px solid var(--border)',
  borderRadius: 18,
  padding: 24,
  minWidth: 520,
  boxShadow: '0 4px 8px rgba(64,35,1,0.08), 0 16px 32px rgba(64,35,1,0.10)',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 32,
};
const megaCol = { display: 'flex', flexDirection: 'column', gap: 6 };
const megaLink = {
  padding: '8px 10px',
  borderRadius: 8,
  color: 'var(--intigris-dark-brown)',
  fontSize: 14,
  fontWeight: 400,
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'background 140ms var(--ease-out), color 140ms var(--ease-out)',
};

window.SiteHeader = SiteHeader;
