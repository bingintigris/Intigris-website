// Offerings.jsx — bento grid of what we build: automation, AI-CRM, AI agents,
// app development, and system improvement. Modeled on the shared reference,
// restyled on-brand with flat brand surfaces (no gradients).
// Exposes: window.SiteOfferings

function InfoButton({ label, tone }) {
  // tone: 'dark' (dark-brown pill) | 'light' (off-white pill)
  const dark = tone !== 'light';
  return (
    <a className={'off-info ' + (dark ? 'off-info--dark' : 'off-info--light')} onClick={(e) => e.preventDefault()}>
      {label} <span aria-hidden>→</span>
    </a>
  );
}

function SiteOfferings() {
  const tx = window.tx || ((en) => en);
  return (
    <section
      id="offerings"
      className="section"
      data-screen-label="Offerings"
      style={{ background: 'var(--intigris-off-white)', borderTop: '1px solid var(--border)' }}
    >
      <div className="container-wide">
        <div className="section-head" style={{ marginBottom: 'clamp(32px, 4vw, 52px)' }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 18, color: 'var(--intigris-coral)' }}>
              {tx('WHAT WE BUILD', 'WAT WE BOUWEN')}
            </div>
            <h2 className="display-md" style={{ color: 'var(--intigris-dark-brown)', margin: 0 }}>
              {tx('Smart solutions,', 'Slimme oplossingen,')}<br/>
              {tx('end to end.', 'van begin tot eind.')}
            </h2>
          </div>
          <p className="lede">
            {tx(
              'From business automation to bespoke AI — we design, build, and improve the systems your teams run on.',
              'Van bedrijfsautomatisering tot AI op maat — we ontwerpen, bouwen en verbeteren de systemen waarop uw teams draaien.'
            )}
          </p>
        </div>

        <div className="off-grid">
          {/* 1 — Business automation (cream) */}
          <article className="off-card off-card--cream off-a">
            <div className="off-body">
              <h3 className="off-title">{tx('Business automation', 'Bedrijfsautomatisering')}</h3>
              <p className="off-desc">{tx(
                'Automate repetitive and cognitive tasks to raise efficiency and cut human error.',
                'Automatiseer repetitieve en cognitieve taken om de efficiëntie te verhogen en fouten te verminderen.'
              )}</p>
              <InfoButton label={tx('More info', 'Meer info')} tone="dark" />
            </div>
            <div className="off-media" style={{ background: 'var(--intigris-off-white-200)' }}>
              <span className="off-media-label">{tx('DASHBOARD', 'DASHBOARD')}</span>
            </div>
          </article>

          {/* 2 — AI-CRM (coral) */}
          <article className="off-card off-card--coral off-b">
            <div className="off-body">
              <h3 className="off-title">{tx('AI-CRM systems', 'AI-CRM systemen')}</h3>
              <p className="off-desc">{tx(
                'An intelligent, tailored CRM that predicts customer needs, lifts engagement, and automates what it can for faster growth.',
                'Een intelligent CRM op maat dat klantbehoeften voorspelt, engagement verbetert en zoveel mogelijk automatiseert voor snellere groei.'
              )}</p>
              <InfoButton label={tx('More info', 'Meer info')} tone="dark" />
            </div>
            <div className="off-ai-tile" aria-hidden>
              <div className="off-ai-badge">AI</div>
            </div>
          </article>

          {/* 3 — AI agents (dark brown) */}
          <article className="off-card off-card--brown off-c">
            <div className="off-body">
              <h3 className="off-title">{tx('AI agents', 'AI-agents')}</h3>
              <p className="off-desc">{tx(
                'Collect valuable data and act online with intelligent AI agents that save time and surface insight.',
                'Verzamel waardevolle data en handel online met intelligente AI-agents die tijd besparen en inzichten opleveren.'
              )}</p>
              <InfoButton label={tx('More info', 'Meer info')} tone="light" />
            </div>
            <div className="off-media" style={{ background: '#2a1700' }}>
              <span className="off-media-label" style={{ color: 'rgba(252,247,235,0.6)' }}>{tx('AGENT CONSOLE', 'AGENT CONSOLE')}</span>
            </div>
          </article>

          {/* 4 — App development (soft blue) */}
          <article className="off-card off-card--blue off-d">
            <div className="off-body">
              <h3 className="off-title">{tx('App development', 'App-ontwikkeling')}</h3>
              <p className="off-desc">{tx(
                'Custom-built applications that fit your business goals exactly.',
                'Applicaties op maat die perfect aansluiten bij uw bedrijfsdoelen.'
              )}</p>
              <InfoButton label={tx('More info', 'Meer info')} tone="light" />
            </div>
            <div className="off-media" style={{ background: 'rgba(64,35,1,0.12)' }}>
              <span className="off-media-label" style={{ color: 'rgba(64,35,1,0.55)' }}>{tx('MOBILE APP', 'MOBIELE APP')}</span>
            </div>
          </article>

          {/* 5 — Improving existing systems (cream, wide, with chart) */}
          <article className="off-card off-card--cream off-e">
            <div className="off-e-head">
              <div style={{ maxWidth: 440 }}>
                <h3 className="off-title">{tx('Improving existing systems', 'Verbetering van bestaande systemen')}</h3>
                <p className="off-desc">{tx(
                  'Give your current systems an AI upgrade. We build AI features on top of what you run — that meet your exact needs, even without APIs.',
                  'Geef uw huidige systemen een AI-upgrade. We bouwen AI-functies bovenop uw systemen die exact aansluiten — ook zonder API-mogelijkheden.'
                )}</p>
                <InfoButton label={tx('More info', 'Meer info')} tone="dark" />
              </div>
              <div className="off-e-stats">
                <div>
                  <div className="off-stat-label">{tx('Expense total', 'Totale kosten')}</div>
                  <div className="off-stat-row"><span className="off-stat-val">€12,233</span><span className="off-chip off-chip--up">↑ 14.3%</span></div>
                </div>
                <div>
                  <div className="off-stat-label">{tx('Profit total', 'Totale winst')}</div>
                  <div className="off-stat-row"><span className="off-stat-val">€50,213</span><span className="off-chip off-chip--up">↑ 25.3%</span></div>
                </div>
              </div>
            </div>
            <svg className="off-chart" viewBox="0 0 1000 220" preserveAspectRatio="none" aria-hidden>
              <polyline points="0,150 140,120 280,150 420,80 560,120 700,60 840,90 1000,30"
                fill="none" stroke="var(--intigris-soft-blue)" strokeWidth="3" />
              <polyline points="0,170 140,175 280,110 420,150 560,90 700,150 840,120 1000,150"
                fill="none" stroke="rgba(64,35,1,0.28)" strokeWidth="3" />
            </svg>
          </article>
        </div>
      </div>

      <style>{`
        #offerings .off-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: clamp(14px, 1.6vw, 22px);
        }
        #offerings .off-a { grid-column: span 5; }
        #offerings .off-b { grid-column: span 7; }
        #offerings .off-c { grid-column: span 7; }
        #offerings .off-d { grid-column: span 5; }
        #offerings .off-e { grid-column: 1 / -1; }
        #offerings .off-card {
          border-radius: 22px; overflow: hidden;
          display: flex; flex-direction: column;
          min-height: 340px;
          box-shadow: 0 22px 50px -26px rgba(64,35,1,0.45), 0 6px 16px -10px rgba(64,35,1,0.22);
        }
        #offerings .off-card--cream { background: var(--intigris-off-white); border: 1px solid var(--border); }
        #offerings .off-card--coral { background: var(--intigris-coral); }
        #offerings .off-card--brown { background: var(--intigris-dark-brown); }
        #offerings .off-card--blue  { background: var(--intigris-soft-blue); }
        #offerings .off-body { padding: clamp(24px, 2.4vw, 34px); display: flex; flex-direction: column; align-items: flex-start; gap: 14px; }
        #offerings .off-title {
          margin: 0; font-size: clamp(24px, 2.2vw, 32px);
          font-weight: var(--w-medium); letter-spacing: -0.02em; line-height: 1.08;
          color: var(--intigris-dark-brown);
        }
        #offerings .off-desc {
          margin: 0; font-size: 15px; font-weight: var(--w-light); line-height: 1.5;
          color: var(--fg-muted); max-width: 42ch;
        }
        #offerings .off-card--coral .off-title, #offerings .off-card--blue .off-title { color: var(--intigris-dark-brown); }
        #offerings .off-card--coral .off-desc { color: rgba(64,35,1,0.78); }
        #offerings .off-card--blue .off-desc { color: rgba(64,35,1,0.72); }
        #offerings .off-card--brown .off-title { color: var(--intigris-off-white); }
        #offerings .off-card--brown .off-desc { color: rgba(252,247,235,0.74); }

        #offerings .off-info {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 18px; border-radius: 999px;
          font-size: 14px; font-weight: var(--w-medium); letter-spacing: -0.005em;
          text-decoration: none; cursor: pointer;
          transition: background 160ms var(--ease-out), color 160ms var(--ease-out), gap 200ms var(--ease-out);
        }
        #offerings .off-info span { transition: transform 220ms var(--ease-out); display: inline-block; }
        #offerings .off-info:hover span { transform: translateX(3px); }
        #offerings .off-info--dark { background: var(--intigris-dark-brown); color: var(--intigris-off-white); }
        #offerings .off-info--dark:hover { background: var(--intigris-chocolate); }
        #offerings .off-info--light { background: var(--intigris-off-white); color: var(--intigris-dark-brown); }
        #offerings .off-info--light:hover { background: #fff; }

        #offerings .off-media {
          margin: 0 clamp(24px, 2.4vw, 34px) clamp(24px, 2.4vw, 34px);
          flex: 1; min-height: 150px; border-radius: 14px;
          display: grid; place-items: center;
        }
        #offerings .off-card--brown .off-media { margin-top: 0; }
        #offerings .off-media-label {
          font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
          font-weight: var(--w-medium); color: rgba(64,35,1,0.45);
        }

        /* AI tile for the coral card */
        #offerings .off-b { position: relative; }
        #offerings .off-ai-tile {
          flex: 1; display: grid; place-items: center;
          padding: 0 clamp(24px, 2.4vw, 34px) clamp(28px, 3vw, 44px);
        }
        #offerings .off-ai-badge {
          width: clamp(92px, 9vw, 128px); aspect-ratio: 1/1;
          border-radius: 26px;
          background: var(--intigris-dark-brown); color: var(--intigris-off-white);
          display: grid; place-items: center;
          font-size: clamp(34px, 3.4vw, 48px); font-weight: var(--w-medium); letter-spacing: -0.02em;
          box-shadow: 0 24px 48px -18px rgba(64,35,1,0.55);
        }

        /* Improvement (wide) card */
        #offerings .off-e { min-height: 0; }
        #offerings .off-e-head {
          display: flex; justify-content: space-between; gap: clamp(24px, 4vw, 64px);
          padding: clamp(24px, 2.4vw, 40px) clamp(24px, 2.4vw, 40px) 8px;
          flex-wrap: wrap;
        }
        #offerings .off-e-stats { display: flex; gap: clamp(24px, 3vw, 56px); align-items: flex-start; }
        #offerings .off-stat-label { font-size: 13px; color: var(--fg-muted); font-weight: var(--w-light); margin-bottom: 6px; }
        #offerings .off-stat-row { display: flex; align-items: center; gap: 10px; }
        #offerings .off-stat-val { font-size: clamp(22px, 2vw, 28px); font-weight: var(--w-medium); letter-spacing: -0.02em; color: var(--intigris-dark-brown); }
        #offerings .off-chip {
          font-size: 12px; font-weight: var(--w-medium); padding: 3px 9px; border-radius: 999px;
          background: rgba(76,105,58,0.16); color: var(--intigris-washed-green);
        }
        #offerings .off-chart { display: block; width: 100%; height: clamp(140px, 16vw, 200px); }

        @media (max-width: 900px) {
          #offerings .off-grid { grid-template-columns: 1fr; }
          #offerings .off-a, #offerings .off-b, #offerings .off-c, #offerings .off-d, #offerings .off-e { grid-column: 1; }
          #offerings .off-e-head { flex-direction: column; }
        }
      `}</style>
    </section>
  );
}

window.SiteOfferings = SiteOfferings;
