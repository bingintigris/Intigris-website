// Testimonial.jsx, coral panel, swipeable carousel of client pull-quotes.
// Bold weight (brandbook reserves bold for quotes). Each slide carries the
// client's logo + role + a "Read the case" CTA. Swipe via drag / arrows /
// dots / keyboard arrows.
// Exposes: window.SiteTestimonial

const { useState: useTState, useRef: useTRef, useEffect: useTEffect } = React;

const QUOTES_EN = [
  {
    id: 'feenstra',
    quote: 'Intigris took the time to understand our operation before proposing a solution. The result is a Salesforce platform that finally reflects how our business actually runs.',
    name: 'Operations Director',
    org: 'Feenstra · the Netherlands',
    logo: 'assets/logos/feenstra.png',
    logoH: 40,
  },
  {
    id: 'dhg',
    quote: 'They brought deep Field Service expertise and a calm, methodical delivery. Dispatch is faster, planners trust the system, and our engineers spend more time with patients.',
    name: 'Director of Service Operations',
    org: 'Direct Healthcare Group · UK & EU',
    logo: 'assets/logos/direct-healthcare-group.png',
    logoH: 48,
  },
  {
    id: 'warmgarant',
    quote: 'A genuine partner, not a vendor. Intigris translated a messy reality into clear processes in Salesforce, and stuck around to make sure adoption actually happened.',
    name: 'Commercial Director',
    org: 'Warmgarant · the Netherlands',
    logo: 'assets/logos/warmgarant.png',
    logoH: 38,
  },
  {
    id: 'csg',
    quote: 'From the first workshop it was clear they had done this before. We went live on Service Cloud across multiple countries on time, on budget, with no drama.',
    name: 'Head of Customer Service',
    org: 'Customs Support Group · Europe',
    logo: 'assets/logos/customs-support-group.png',
    logoH: 46,
  },
  {
    id: 'bouwgroep',
    quote: 'The integrations they built between Salesforce and our ERP have been running cleanly for years. That, more than anything, is the proof of the engineering quality.',
    name: 'CIO',
    org: 'Bouwgroep Schrijver · the Netherlands',
    logo: 'assets/logos/bouwgroep-schrijver.svg',
    logoH: 42,
  },
];

const QUOTES_NL = [
  {
    id: 'feenstra',
    quote: 'Intigris nam de tijd om onze operatie te doorgronden voordat ze met een oplossing kwamen. Het resultaat is een Salesforce-platform dat eindelijk weergeeft hoe onze business werkelijk werkt.',
    name: 'Operations Director',
    org: 'Feenstra · Nederland',
    logo: 'assets/logos/feenstra.png', logoH: 40,
  },
  {
    id: 'dhg',
    quote: 'Diepgaande Field Service-expertise en een rustige, methodische aanpak. De planning is sneller, planners vertrouwen het systeem en onze monteurs hebben meer tijd voor patiënten.',
    name: 'Director of Service Operations',
    org: 'Direct Healthcare Group · UK & EU',
    logo: 'assets/logos/direct-healthcare-group.png', logoH: 48,
  },
  {
    id: 'warmgarant',
    quote: 'Een echte partner, geen leverancier. Intigris vertaalde een rommelige werkelijkheid naar heldere processen in Salesforce, en bleef erbij tot adoptie écht stond.',
    name: 'Commercieel Directeur',
    org: 'Warmgarant · Nederland',
    logo: 'assets/logos/warmgarant.png', logoH: 38,
  },
  {
    id: 'csg',
    quote: 'Vanaf de eerste workshop was duidelijk dat zij dit eerder hadden gedaan. We zijn op tijd en binnen budget live gegaan op Service Cloud in meerdere landen, zonder drama.',
    name: 'Head of Customer Service',
    org: 'Customs Support Group · Europa',
    logo: 'assets/logos/customs-support-group.png', logoH: 46,
  },
  {
    id: 'bouwgroep',
    quote: 'De integraties tussen Salesforce en ons ERP draaien al jaren feilloos. Dat is, meer dan wat dan ook, het bewijs van de kwaliteit van hun engineering.',
    name: 'CIO',
    org: 'Bouwgroep Schrijver · Nederland',
    logo: 'assets/logos/bouwgroep-schrijver.svg', logoH: 42,
  },
];

function SiteTestimonial({ lang = 'en' } = {}) {
  const tx = window.tx || ((en) => en);
  const quotes = (window.__lang === 'nl' || lang === 'nl') ? QUOTES_NL : QUOTES_EN;

  const [i, setI] = useTState(0);
  const total = quotes.length;
  const go = (n) => setI(((n % total) + total) % total);

  // Drag / swipe
  const trackRef = useTRef(null);
  const dragRef = useTRef({ startX: 0, dragging: false, dx: 0 });
  const [dragDx, setDragDx] = useTState(0);

  const onPointerDown = (e) => {
    dragRef.current.dragging = true;
    dragRef.current.startX = e.clientX;
    dragRef.current.dx = 0;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragRef.current.dragging) return;
    const dx = e.clientX - dragRef.current.startX;
    dragRef.current.dx = dx;
    setDragDx(dx);
  };
  const onPointerUp = (e) => {
    if (!dragRef.current.dragging) return;
    dragRef.current.dragging = false;
    const dx = dragRef.current.dx;
    const w = trackRef.current?.offsetWidth || 600;
    const threshold = Math.min(120, w * 0.18);
    if (dx < -threshold) go(i + 1);
    else if (dx > threshold) go(i - 1);
    setDragDx(0);
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  // Keyboard arrows when section is hovered/focused
  useTEffect(() => {
    const handler = (e) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;
      if (e.key === 'ArrowRight') go(i + 1);
      else if (e.key === 'ArrowLeft') go(i - 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [i, total]);

  return (
    <section
      id="testimonial"
      data-screen-label="Testimonial"
      style={{
        background: 'var(--intigris-coral)',
        color: 'var(--intigris-dark-brown)',
        paddingTop: 'clamp(72px, 9vw, 128px)',
        paddingBottom: 'clamp(72px, 9vw, 128px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(to right, rgba(64,35,1,0.06) 1px, transparent 1px)',
        backgroundSize: 'calc(100% / 12) 100%',
        maskImage: 'linear-gradient(to bottom, transparent, #000 20%, #000 80%, transparent)',
      }}/>

      <div className="container-wide" style={{ position: 'relative' }}>

        {/* Section head */}
        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          gap: 24, flexWrap: 'wrap', marginBottom: 'clamp(40px, 5vw, 64px)',
        }}>
          <div className="eyebrow" style={{ color: 'rgba(64,35,1,0.7)' }}>
            {tx('CLIENT TESTIMONIALS', 'KLANTERVARINGEN')}
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
            <NavArrow dir="left"  onClick={() => go(i - 1)} />
            <span style={{
              fontSize: 13, fontWeight: 500, color: 'rgba(64,35,1,0.7)',
              fontVariantNumeric: 'tabular-nums', minWidth: 48, textAlign: 'center',
            }}>
              {String(i + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <NavArrow dir="right" onClick={() => go(i + 1)} />
          </div>
        </div>

        {/* Swipeable track */}
        <div
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{
            overflow: 'hidden',
            cursor: dragRef.current.dragging ? 'grabbing' : 'grab',
            touchAction: 'pan-y',
            userSelect: 'none',
          }}
        >
          <div style={{
            display: 'flex',
            transform: `translateX(calc(${-i * 100}% + ${dragDx}px))`,
            transition: dragRef.current.dragging ? 'none' : 'transform 520ms var(--ease-out)',
          }}>
            {quotes.map((q, n) => (
              <QuoteSlide key={q.id} q={q} active={n === i} tx={tx} />
            ))}
          </div>
        </div>

        {/* Dots */}
        <div style={{
          marginTop: 32, display: 'flex', justifyContent: 'center', gap: 10,
        }}>
          {quotes.map((q, n) => (
            <button
              key={q.id}
              aria-label={`Go to testimonial ${n + 1}`}
              onClick={() => go(n)}
              style={{
                appearance: 'none',
                border: 0,
                cursor: 'pointer',
                background: 'transparent',
                padding: 6,
              }}
            >
              <span style={{
                display: 'block',
                width: n === i ? 28 : 8,
                height: 8,
                borderRadius: 999,
                background: n === i ? 'var(--intigris-dark-brown)' : 'rgba(64,35,1,0.3)',
                transition: 'width 220ms var(--ease-out), background 220ms var(--ease-out)',
              }} />
            </button>
          ))}
        </div>
      </div>

      <style>{`
        #testimonial .quote-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 2.4fr);
          gap: 56px;
          align-items: center;
        }
        #testimonial .logo-card {
          aspect-ratio: 1 / 1;
          max-width: 320px;
          width: 100%;
          border-radius: 24px;
          background: var(--intigris-off-white);
          display: grid;
          place-items: center;
          padding: 40px;
          border: 1px solid rgba(64,35,1,0.10);
        }
        #testimonial .logo-card img {
          max-width: 100%;
          max-height: 100%;
          width: auto;
          object-fit: contain;
          display: block;
          -webkit-user-drag: none;
          user-select: none;
        }
        @media (max-width: 900px) {
          #testimonial .quote-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
          #testimonial .logo-card { max-width: 200px !important; padding: 28px !important; }
        }
      `}</style>
    </section>
  );
}

function QuoteSlide({ q, active, tx }) {
  return (
    <div style={{
      flex: '0 0 100%',
      minWidth: 0,
      padding: '0 4px',
      opacity: active ? 1 : 0.55,
      transition: 'opacity 360ms var(--ease-out)',
    }}>
      <div className="quote-grid">
        {/* Logo card */}
        <div className="logo-card">
          <img src={q.logo} alt={q.org} style={{ maxHeight: Math.min(q.logoH * 2.4, 140) }} draggable={false} />
        </div>

        {/* Quote */}
        <div>
          <svg width="40" height="32" viewBox="0 0 40 32" aria-hidden style={{ marginBottom: 16, color: 'rgba(64,35,1,0.35)' }}>
            <path d="M0 32 V18 C0 8 6 2 16 0 L18 5 C12 7 9 11 9 16 H16 V32 Z M22 32 V18 C22 8 28 2 38 0 L40 5 C34 7 31 11 31 16 H38 V32 Z" fill="currentColor"/>
          </svg>
          <blockquote style={{
            fontSize: 'clamp(24px, 2.9vw, 40px)',
            fontWeight: 700,
            letterSpacing: '-0.022em',
            lineHeight: 1.18,
            margin: 0,
            color: 'var(--intigris-dark-brown)',
            textWrap: 'pretty',
          }}>
            {q.quote}
          </blockquote>
          <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--intigris-dark-brown)' }}>{q.name}</div>
              <div style={{ fontSize: 13, fontWeight: 400, color: 'rgba(64,35,1,0.7)' }}>{q.org}</div>
            </div>
            <div style={{ height: 28, width: 1, background: 'rgba(64,35,1,0.25)' }} />
            <button className="btn" style={{
              background: 'var(--intigris-dark-brown)',
              color: 'var(--intigris-off-white)',
            }}>
              {tx('Read the case', 'Lees de case')} <span className="arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavArrow({ dir, onClick }) {
  const [hover, setHover] = useTState(false);
  return (
    <button
      aria-label={dir === 'left' ? 'Previous' : 'Next'}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        appearance: 'none',
        width: 44, height: 44, borderRadius: 999,
        background: hover ? 'var(--intigris-dark-brown)' : 'transparent',
        color: hover ? 'var(--intigris-off-white)' : 'var(--intigris-dark-brown)',
        border: '1.5px solid var(--intigris-dark-brown)',
        display: 'grid', placeItems: 'center',
        cursor: 'pointer',
        transition: 'background 160ms var(--ease-out), color 160ms var(--ease-out)',
      }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{
        transform: dir === 'left' ? 'scaleX(-1)' : 'none',
      }}>
        <path d="M3 7 H11 M7 3 L11 7 L7 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}

window.SiteTestimonial = SiteTestimonial;
