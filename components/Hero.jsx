// Hero.jsx, Bold stacked headline + warm editorial composition right.
// Exposes: window.SiteHero

const { useState: useHeroState, useEffect: useHeroEffect } = React;

const HERO_INDUSTRIES_EN = ['Business', 'Sales', 'Field Service', 'Integrations', 'Data', 'Service', 'AI'];
const HERO_INDUSTRIES_NL = ['Business', 'Sales', 'Field Service', 'Integraties', 'Data', 'Service', 'AI'];
const getHeroIndustries = () => (window.__lang === 'nl' ? HERO_INDUSTRIES_NL : HERO_INDUSTRIES_EN);

function SiteHero({ onCta, onSecondary, variant = 'split', mood = 'coral', mode = 'ai', onMode }) {
  const [idx, setIdx] = useHeroState(0);
  const tx = window.tx || ((en) => en);
  const HERO_INDUSTRIES = getHeroIndustries();

  useHeroEffect(() => {
    // "Business" (index 0) lingers twice as long as the rest, it's the
    // canonical tagline, the others rotate underneath.
    const t = setTimeout(
      () => setIdx(i => (i + 1) % HERO_INDUSTRIES.length),
      idx === 0 ? 4800 : 2400
    );
    return () => clearTimeout(t);
  }, [idx, HERO_INDUSTRIES.length]);

  if (variant === 'cinematic')   return <HeroCinematic onCta={onCta} onSecondary={onSecondary} idx={idx} HERO_INDUSTRIES={HERO_INDUSTRIES} tx={tx} mood={mood} mode={mode} onMode={onMode} />;
  if (variant === 'typographic') return <HeroTypographic onCta={onCta} onSecondary={onSecondary} idx={idx} HERO_INDUSTRIES={HERO_INDUSTRIES} tx={tx} />;
  if (variant === 'editorial')   return <HeroEditorial  onCta={onCta} onSecondary={onSecondary} idx={idx} HERO_INDUSTRIES={HERO_INDUSTRIES} tx={tx} />;
  return <HeroSplit onCta={onCta} onSecondary={onSecondary} idx={idx} HERO_INDUSTRIES={HERO_INDUSTRIES} tx={tx} />;
}

/* ---------- Rotating word in headline ---------- */
function RotatingWord({ words, idx, color = 'var(--intigris-coral)' }) {
  // Width tracks the active word so layout stays tight but doesn't jump.
  // Hidden ghost spans size the container to whichever word is widest among the
  // currently visible cycle; we measure via inline-block + max-content trick.
  return (
    <span style={{
      position: 'relative',
      display: 'inline-block',
      verticalAlign: 'baseline',
      color: color,
      whiteSpace: 'nowrap',
    }}>
      {/* invisible widest word to reserve space */}
      <span aria-hidden style={{ visibility: 'hidden', display: 'inline-block' }}>
        {words.reduce((a, b) => (b.length > a.length ? b : a), '')}.
      </span>
      {words.map((w, i) => (
        <span
          key={w}
          aria-hidden={i !== idx}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            transform: i === idx ? 'translateY(0)' : (i < idx ? 'translateY(-18%)' : 'translateY(18%)'),
            opacity: i === idx ? 1 : 0,
            transition: 'opacity 420ms var(--ease-out), transform 420ms var(--ease-out)',
            whiteSpace: 'nowrap',
          }}
        >
          {w}.
        </span>
      ))}
    </span>
  );
}

/* ---------- Cinematic: full-bleed coral hero, transparent overlay header ---------- */
function HeroCinematic({ onCta, onSecondary, idx, HERO_INDUSTRIES, tx, mood = 'coral', mode = 'ai', onMode }) {
  const dark = mood === 'dark';
  const services = [
    { n: '01', label: tx('Sales Cloud', 'Sales Cloud') },
    { n: '02', label: tx('Field Service', 'Field Service') },
    { n: '03', label: tx('Service Cloud', 'Service Cloud') },
    { n: '04', label: tx('Integrations', 'Integraties') },
  ];
  return (
    <>
    <section style={{
      position: 'relative',
      overflow: 'hidden',
      background: dark
        ? 'linear-gradient(120deg, #52300a 0%, var(--intigris-dark-brown) 52%, #2a1700 100%)'
        : 'linear-gradient(90deg, #ff9166 0%, var(--intigris-coral) 44%, var(--intigris-coral-700) 80%, #9e300d 100%)',
      borderBottomLeftRadius: 'clamp(24px, 4vw, 56px)',
      borderBottomRightRadius: 'clamp(24px, 4vw, 56px)',
      isolation: 'isolate',
    }}>
      {/* Photo layer, warm silhouette emerging from the right */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: 'url("assets/hero-team.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center right',
        mixBlendMode: dark ? 'overlay' : 'multiply',
        opacity: dark ? 0.42 : 0.5,
        WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, transparent 30%, #000 72%)',
        maskImage: 'linear-gradient(90deg, transparent 0%, transparent 30%, #000 72%)',
      }} />
      {/* Deepen toward bottom-right for the numbered row */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: 'linear-gradient(180deg, rgba(64,35,1,0) 40%, rgba(64,35,1,0.28) 100%)',
      }} />

      <div className="container-wide" style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: 'min(92vh, 860px)',
        paddingTop: 'clamp(120px, 15vh, 180px)',
        paddingBottom: 'clamp(28px, 4vh, 44px)',
      }}>
        {/* Top block, headline + right statement */}
        <div className="hero-cine-top" style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 1fr)',
          gap: 'clamp(32px, 5vw, 72px)',
          alignItems: 'end',
          flex: 1,
        }}>
          <div style={{ alignSelf: 'center' }}>
            <div className="eyebrow" style={{ marginBottom: 24, color: dark ? 'var(--intigris-off-white)' : 'var(--intigris-dark-brown)' }}>
              {tx('Salesforce Implementation Partner', 'Salesforce Implementation Partner')}
            </div>
            <h1 className="display-stack" style={{ color: 'var(--intigris-off-white)' }}>
              <span style={{ display: 'block', whiteSpace: 'nowrap' }}>{tx('Smarten up', 'Maak uw')}</span>
              <span style={{ display: 'block', whiteSpace: 'nowrap' }}>
                {tx('your ', '')}
                <RotatingWord words={HERO_INDUSTRIES} idx={idx} color={dark ? 'var(--intigris-coral)' : 'var(--intigris-dark-brown)'} />
              </span>
            </h1>
            <div style={{ marginTop: 'clamp(28px, 4vh, 40px)' }}>
              <div className="mode-toggle" data-mode={mode} role="tablist" aria-label={tx('Choose solutions view', 'Kies weergave')}>
                <span className="mode-thumb" data-mode={mode} aria-hidden />
                <button
                  type="button" role="tab" aria-selected={mode === 'ai'}
                  className={'mode-opt' + (mode === 'ai' ? ' is-active' : '')}
                  onClick={() => onMode && onMode('ai')}
                >
                  {tx('AI solutions', 'AI-oplossingen')}
                </button>
                <button
                  type="button" role="tab" aria-selected={mode === 'salesforce'}
                  className={'mode-opt' + (mode === 'salesforce' ? ' is-active' : '')}
                  onClick={() => onMode && onMode('salesforce')}
                >
                  {tx('Salesforce solutions', 'Salesforce-oplossingen')}
                </button>
              </div>
            </div>
          </div>

          {/* Right, glassy credentials cell, bottom-aligned */}
          <div style={{ justifySelf: 'end', paddingBottom: 8, width: '100%', maxWidth: 420 }}>
            <HeroStats tx={tx} glass />
          </div>
        </div>
      </div>

      <style>{`
        .btn-cine-primary {
          background: var(--intigris-off-white);
          color: var(--intigris-dark-brown);
          padding-right: 8px;
        }
        .btn-cine-primary:hover { background: #fff; }
        .btn-cine-primary .cine-arrow {
          display: inline-flex; align-items: center; justify-content: center;
          width: 34px; height: 34px; border-radius: 999px;
          background: var(--intigris-coral); color: var(--intigris-dark-brown);
          font-size: 15px; transition: transform var(--t-base) var(--ease-out);
        }
        .btn-cine-primary:hover .cine-arrow { transform: translateX(3px); }

        /* Segmented AI / Salesforce toggle */
        .mode-toggle {
          position: relative;
          display: inline-grid;
          grid-template-columns: 1fr 1fr;
          padding: 5px;
          border-radius: 999px;
          background: var(--intigris-off-white);
          border: 1px solid rgba(64,35,1,0.12);
          box-shadow: 0 6px 20px rgba(64,35,1,0.14);
          max-width: 100%;
        }
        .mode-thumb {
          position: absolute;
          top: 5px; bottom: 5px; left: 5px;
          width: calc((100% - 10px) / 2);
          border-radius: 999px;
          background: var(--intigris-coral);
          box-shadow: 0 4px 14px rgba(214,67,27,0.35);
          transition: transform 300ms cubic-bezier(0.22,0.61,0.36,1),
                      background-color 300ms var(--ease-out),
                      box-shadow 300ms var(--ease-out);
          z-index: 0;
        }
        .mode-thumb[data-mode="salesforce"] {
          transform: translateX(100%);
          background: var(--intigris-soft-blue);
          box-shadow: 0 4px 14px rgba(154,184,226,0.5);
        }
        .mode-opt {
          position: relative; z-index: 1;
          border: 0; background: transparent; cursor: pointer;
          padding: 13px clamp(18px, 3vw, 32px);
          border-radius: 999px;
          font-family: inherit; font-size: 15px; font-weight: 500;
          letter-spacing: -0.005em; white-space: nowrap;
          color: var(--intigris-dark-brown);
          transition: color 220ms var(--ease-out);
        }
        .mode-opt.is-active { color: var(--intigris-off-white); }
        .mode-opt:focus-visible { outline: none; box-shadow: var(--focus-ring); border-radius: 999px; }
        @media (max-width: 460px) {
          .mode-opt { padding: 12px 16px; font-size: 13.5px; }
        }
        @media (max-width: 860px) {
          .hero-cine-top { grid-template-columns: 1fr !important; align-items: start !important; gap: 32px !important; }
          .hero-cine-top > div:last-child { justify-self: start !important; }
        }
        @media (max-width: 620px) {
          .hero-cine-top { }
        }
      `}</style>
    </section>
    <ProofMarquee />
    </>
  );
}

/* ---------- A. Split: headline left, layered composition right ---------- */
function HeroSplit({ onCta, onSecondary, idx, HERO_INDUSTRIES, tx }) {
  return (
    <section style={{
      position: 'relative',
      overflow: 'hidden',
      // Background photo with warm cream wash on top for legibility.
      // Three stacked backgrounds: cream tint → soft right-side fade → photo.
      backgroundImage: [
        'linear-gradient(180deg, rgba(252,247,235,0.78) 0%, rgba(252,247,235,0.62) 60%, rgba(252,247,235,0.82) 100%)',
        'linear-gradient(90deg, rgba(252,247,235,0.55) 0%, rgba(252,247,235,0.15) 55%, rgba(252,247,235,0.0) 100%)',
        'url("assets/hero-team.jpg")',
      ].join(', '),
      backgroundSize: 'cover, cover, cover',
      backgroundPosition: 'center, center, center right',
      backgroundRepeat: 'no-repeat, no-repeat, no-repeat',
    }}>
      <div className="container-wide" style={{ paddingTop: 72, paddingBottom: 96, position: 'relative' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr)',
          gap: 56,
          alignItems: 'center',
          minHeight: 520,
        }}>
          {/* LEFT */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div className="eyebrow" style={{ marginBottom: 28 }}>
              {tx(
                'Salesforce Implementation Partner',
                'Salesforce Implementation Partner'
              )}
            </div>
            <h1 className="display-stack">
              <span style={{ display: 'block', whiteSpace: 'nowrap' }}>{tx('Smarten up', 'Maak uw')}</span>
              <span style={{ display: 'block', whiteSpace: 'nowrap' }}>
                {tx('your ', '')}
                <RotatingWord words={HERO_INDUSTRIES} idx={idx} />
              </span>
            </h1>
            <p style={{
              marginTop: 32, maxWidth: 520,
              fontSize: 19, lineHeight: 1.5, fontWeight: 400,
              color: 'var(--intigris-dark-brown)',
            }}>
              {tx(
                'The Salesforce implementation partner for ambitious organisations in the Netherlands. We bring into focus what you need, then implement it so your business can move forward.',
                'Dé Salesforce-implementatiepartner voor ambitieuze organisaties in Nederland. We brengen scherp in beeld wat u nodig heeft en implementeren het, zodat uw business vooruit kan.'
              )}
            </p>

            <div style={{ marginTop: 36, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <button className="btn btn-primary btn-lg" onClick={onCta}>
                {tx("Let's talk", 'Neem contact op')} <span className="arrow">→</span>
              </button>
              <button className="btn btn-secondary btn-lg" onClick={onSecondary}>
                {tx('See our work', 'Bekijk onze cases')}
              </button>
            </div>
          </div>

          {/* RIGHT, Summit Partner badge anchored top-right, credentials card bottom-right */}
          <div style={{
            position: 'relative', zIndex: 1,
            display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between', alignItems: 'flex-end',
            alignSelf: 'stretch',
            gap: 32,
          }}>
            <img
              src="assets/salesforce-summit-partner.webp"
              alt="Salesforce Consulting Summit Partner"
              style={{
                width: '18%',
                height: 'auto',
                display: 'block',
                borderRadius: 14,
                boxShadow: 'var(--shadow-3)',
              }}
            />
            <HeroStats tx={tx} />
          </div>
        </div>
      </div>

      {/* Bottom marquee, already a peek of social proof */}
      <ProofMarquee />
    </section>
  );
}

/* ---------- B. Typographic, no photo, type-led with grid hint ---------- */
function HeroTypographic({ onCta, onSecondary, idx, HERO_INDUSTRIES, tx }) {
  return (
    <section style={{ background: 'var(--intigris-off-white)', position: 'relative', overflow: 'hidden' }}>
      <div className="grid-bg" aria-hidden />
      <div className="container" style={{ paddingTop: 96, paddingBottom: 96, position: 'relative' }}>
        <div className="eyebrow" style={{ marginBottom: 32 }}>
          {tx(
            'Salesforce Implementation Partner',
            'Salesforce Implementation Partner'
          )}
        </div>
        <h1 style={{
          fontSize: 'clamp(64px, 11vw, 168px)',
          fontWeight: 500,
          lineHeight: 0.94,
          letterSpacing: '-0.034em',
          margin: 0,
          color: 'var(--intigris-dark-brown)',
        }}>
          {tx('Smarten up', 'Maak uw business')}<br/>
          {tx('your ', '')}
          <span style={{ position: 'relative', display: 'inline-block' }}>
            <span style={{ color: 'var(--intigris-coral)' }}>{tx('business', 'slimmer')}</span>
            <svg viewBox="0 0 320 24" preserveAspectRatio="none" style={{
              position: 'absolute', left: 0, bottom: -2, width: '100%', height: 18,
            }}>
              <path d="M2 14 Q 80 4, 160 12 T 318 10" stroke="var(--intigris-coral)" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
          </span>
          .
        </h1>

        <div style={{
          marginTop: 56,
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
          gap: 64,
          alignItems: 'end',
        }}>
          <p style={{
            fontSize: 22, lineHeight: 1.45, fontWeight: 400, maxWidth: 720,
            color: 'var(--intigris-dark-brown)',
          }}>
            {tx(
              'The Salesforce implementation partner for ambitious organisations in the Netherlands. From Sales Cloud to Field Service, we deliver Salesforce programmes that move your business forward.',
              'Dé Salesforce-implementatiepartner voor ambitieuze organisaties in Nederland. Van Sales Cloud tot Field Service: wij leveren Salesforce-programma’s die uw business meetbaar vooruit helpen.'
            )}
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <button className="btn btn-primary btn-lg" onClick={onCta}>{tx("Let's talk", 'Neem contact op')} <span className="arrow">→</span></button>
            <button className="btn btn-secondary btn-lg" onClick={onSecondary}>{tx('See our work', 'Bekijk onze cases')}</button>
          </div>
        </div>
      </div>
      <ProofMarquee />
    </section>
  );
}

/* ---------- C. Editorial, magazine style ---------- */
function HeroEditorial({ onCta, onSecondary, idx, HERO_INDUSTRIES, tx }) {
  return (
    <section style={{ background: 'var(--intigris-off-white)', position: 'relative', overflow: 'hidden' }}>
      <div className="container-wide" style={{ paddingTop: 56, paddingBottom: 80, position: 'relative' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.4fr 1fr',
          gap: 32,
          minHeight: 620,
        }}>
          {/* Left col, credentials stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="eyebrow" style={{ marginTop: 8 }}>{tx('EST. 2010 · AMSTERDAM', 'OPGERICHT 2010 · AMSTERDAM')}</div>
            <div style={{
              borderTop: '1px solid var(--border)',
              paddingTop: 20,
              fontSize: 14, fontWeight: 400, color: 'var(--fg-muted)', lineHeight: 1.5,
            }}>
              {tx(
                'Salesforce Implementation Partner serving ambitious organisations across the Netherlands. 250+ projects delivered since 2010.',
                'Salesforce-implementatiepartner voor ambitieuze organisaties in heel Nederland. 250+ projecten geleverd sinds 2010.'
              )}
            </div>
            <div className="photo photo--blue" style={{ aspectRatio: '3/4', marginTop: 12 }}>
              <div className="photo-label">Strategy session</div>
            </div>
          </div>

          {/* Middle col, headline */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
            <h1 style={{
              fontSize: 'clamp(56px, 8vw, 124px)',
              fontWeight: 500, lineHeight: 0.92,
              letterSpacing: '-0.03em', margin: 0,
              color: 'var(--intigris-dark-brown)',
            }}>
              {tx('Smarten', 'Maak')}<br/>
              <em style={{
                fontStyle: 'italic', fontWeight: 500,
                color: 'var(--intigris-coral)',
              }}>{tx('up', 'slim')}</em> {tx('your', 'uw')}<br/>
              {tx('business.', 'business.')}
            </h1>
            <p style={{
              marginTop: 32,
              fontSize: 17, fontWeight: 400, lineHeight: 1.5,
              color: 'var(--fg-muted)', maxWidth: 440, marginLeft: 'auto', marginRight: 'auto',
            }}>
              {tx(
                'We bring into focus what you need, then we implement it so you can move forward.',
                'We brengen scherp in beeld wat u nodig heeft en implementeren het, zodat u vooruit kunt.'
              )}
            </p>
            <div style={{ marginTop: 28, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary btn-lg" onClick={onCta}>{tx("Let's talk", 'Neem contact op')} <span className="arrow">→</span></button>
              <button className="btn btn-secondary btn-lg" onClick={onSecondary}>{tx('See our work', 'Bekijk onze cases')}</button>
            </div>
          </div>

          {/* Right col, industry feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="photo" style={{ aspectRatio: '3/4' }}>
              <div className="photo-label">Implementation team</div>
            </div>
            <div style={{
              background: 'var(--intigris-dark-brown)',
              color: 'var(--intigris-off-white)',
              borderRadius: 14,
              padding: '20px 22px',
            }}>
              <div className="eyebrow eyebrow--bare" style={{ marginBottom: 10, color: 'rgba(252,247,235,0.7)' }}>{tx('WE WORK WITH', 'WIJ WERKEN VOOR')}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {HERO_INDUSTRIES.slice(0, 4).map((name, i) => (
                  <div key={name} style={{
                    fontSize: 16, fontWeight: 500, letterSpacing: '-0.01em',
                    color: i === idx % 4 ? 'var(--intigris-coral)' : 'var(--intigris-off-white)',
                    transition: 'color 320ms var(--ease-out)',
                  }}>
                    {name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Credentials card, three stats with hairline dividers ---------- */
function HeroStats({ tx, glass = false }) {
  const STATS = [
    { num: '15+',  label: tx('Years Salesforce partner', 'Jaar Salesforce-partner') },
    { num: '250+', label: tx('Projects completed',       'Projecten opgeleverd') },
    { num: '4.8',  star: true, label: tx('Customer satisfaction', 'Klanttevredenheid') },
  ];
  const numColor   = glass ? 'var(--intigris-off-white)' : 'var(--intigris-coral)';
  const labelColor = glass ? 'rgba(252,247,235,0.85)' : 'var(--intigris-dark-brown)';
  const dividerBg  = glass
    ? 'linear-gradient(180deg, rgba(252,247,235,0) 0%, rgba(252,247,235,0.35) 18%, rgba(252,247,235,0.35) 82%, rgba(252,247,235,0) 100%)'
    : 'linear-gradient(180deg, rgba(64,35,1,0) 0%, rgba(64,35,1,0.18) 18%, rgba(64,35,1,0.18) 82%, rgba(64,35,1,0) 100%)';
  return (
    <div
      className="hero-stats"
      style={glass ? {
        display: 'flex',
        width: '100%',
        alignItems: 'stretch',
        background: 'rgba(252,247,235,0.14)',
        WebkitBackdropFilter: 'blur(16px)',
        backdropFilter: 'blur(16px)',
        color: 'var(--intigris-off-white)',
        border: '1px solid rgba(252,247,235,0.38)',
        borderRadius: 18,
        padding: '16px 6px',
        boxShadow: '0 20px 44px -18px rgba(64,35,1,0.5), inset 0 1px 0 rgba(252,247,235,0.25)',
        animation: 'heroStatsIn 520ms cubic-bezier(0.22,0.61,0.36,1) 200ms both',
      } : {
        display: 'inline-flex',
        alignItems: 'stretch',
        background: 'var(--intigris-off-white)',
        color: 'var(--intigris-dark-brown)',
        border: '1.5px solid var(--intigris-coral)',
        borderRadius: 14,
        padding: '12px 4px',
        boxShadow: '0 14px 32px -14px rgba(64,35,1,0.22), 0 3px 10px -4px rgba(64,35,1,0.1)',
        animation: 'heroStatsIn 520ms cubic-bezier(0.22,0.61,0.36,1) 200ms both',
      }}
    >
      {STATS.map((s, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <div aria-hidden style={{
              width: 1,
              background: dividerBg,
            }} />
          )}
          <div style={{
            padding: '2px 16px',
            flex: '1 1 0',
            minWidth: 0,
            display: 'flex', flexDirection: 'column', gap: 4,
          }}>
            <div style={{
              fontSize: 38, fontWeight: 500,
              letterSpacing: '-0.025em', lineHeight: 1.02,
              color: numColor,
              display: 'flex', alignItems: 'baseline', gap: 2,
            }}>
              <span>{s.num}</span>
              {s.star && (
                <>
                  <span aria-hidden style={{ fontSize: 20, lineHeight: 1, transform: 'translateY(-3px)', marginLeft: 4, color: 'var(--intigris-coral)' }}>★</span>
                  <span style={{ fontSize: 22, fontWeight: 400, opacity: 0.55, letterSpacing: '-0.02em', marginLeft: 2 }}>/5</span>
                </>
              )}
            </div>
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              lineHeight: 1.3,
              letterSpacing: '-0.005em',
              color: labelColor,
            }}>
              {s.label}
            </div>
          </div>
        </React.Fragment>
      ))}
      <style>{`
        @keyframes heroStatsIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 720px) {
          .hero-stats { padding: 10px 2px; border-radius: 12px; }
          .hero-stats > div { padding: 2px 10px !important; }
        }
      `}</style>
    </div>
  );
}

/* ---------- Tiny logo-strip marquee that lives inside the hero ---------- */
function ProofMarquee() {
  const LOGOS = [
    { src: 'assets/logos/warmgarant.png',              alt: 'Warmgarant',              h: 38 },
    { src: 'assets/logos/feenstra.png',                alt: 'Feenstra',                h: 36 },
    { src: 'assets/logos/direct-healthcare-group.png', alt: 'Direct Healthcare Group', h: 44 },
    { src: 'assets/logos/customs-support-group.png',   alt: 'Customs Support Group',   h: 46 },
    { src: 'assets/logos/wetransfer.png',              alt: 'WeTransfer',              h: 30 },
    { src: 'assets/logos/cyclovriend.svg',             alt: 'Cyclovriend',             h: 40 },
    { src: 'assets/logos/bouwgroep-schrijver.svg',     alt: 'Bouwgroep Schrijver',     h: 40 },
  ];
  const tx = window.tx || ((en) => en);
  return (
    <div style={{
      paddingTop: 22, paddingBottom: 28,
      background: 'var(--intigris-off-white)',
      position: 'relative',
    }}>
      <div className="container-wide" style={{
        display: 'flex', justifyContent: 'flex-start',
        marginBottom: 14,
      }}>
        <div className="eyebrow" style={{
          fontSize: 11,
          color: 'var(--fg-muted)',
        }}>
          {tx('TRUSTED BY', 'VERTROUWD DOOR')}
        </div>
      </div>
      <div className="marquee">
        <div className="marquee-track" style={{ alignItems: 'center', gap: 72 }}>
          {[...LOGOS, ...LOGOS].map((logo, i) => (
            <img
              key={i}
              src={logo.src}
              alt={logo.alt}
              style={{
                height: logo.h,
                width: 'auto',
                display: 'block',
                flexShrink: 0,
                objectFit: 'contain',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

window.SiteHero = SiteHero;
