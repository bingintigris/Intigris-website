// WhyIntigris.jsx, editorial redesign of the "Why Intigris" section.
// Big stacked headline left, three pillar rows right with giant outlined numbers
// that fill on hover, plus a brandbook-style asterisk footnote and a faint
// 12-col grid motif. Off-white surface to preserve page rhythm.
// Exposes: window.SiteWhy

const { useState: useWhyState } = React;

function SiteWhy() {
  const tx = window.tx || ((en) => en);
  const [hoverIdx, setHoverIdx] = useWhyState(-1);

  const PILLARS = [
    {
      t: tx('Best quality.', 'Hoogste kwaliteit.'),
      d: tx(
        'We are committed to delivering the highest quality in our products and services to best support your business.',
        'We zijn toegewijd aan het leveren van de hoogste kwaliteit in onze producten en diensten om uw bedrijf optimaal te ondersteunen.'
      ),
    },
    {
      t: tx('On time delivery.', 'Op tijd geleverd.'),
      d: tx(
        'We understand the importance of meeting deadlines, and our team is committed to delivering your projects on schedule.',
        'We begrijpen het belang van deadlines, en ons team is toegewijd aan het op schema opleveren van uw projecten.'
      ),
    },
    {
      t: tx('Continuous support.', 'Continue ondersteuning.'),
      d: tx(
        'Our dedicated support team is always ready to assist you, providing the guidance and assistance you need for a seamless experience.',
        'Ons toegewijde supportteam staat altijd voor u klaar met de begeleiding en ondersteuning die u nodig heeft voor een soepele ervaring.'
      ),
    },
  ];

  return (
    <section
      id="why"
      data-screen-label="Why Intigris"
      style={{
        background: 'var(--intigris-off-white)',
        borderTop: '1px solid var(--border)',
        paddingTop: 'clamp(64px, 7vw, 96px)',
        paddingBottom: 'clamp(64px, 7vw, 96px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Faint 12-column grid lines, the brandbook's "structured thinking" motif */}
      <div aria-hidden style={{
        position: 'absolute',
        top: 0, bottom: 0,
        left: 'max(24px, calc((100% - var(--container-max)) / 2 + var(--container-pad, 24px)))',
        right: 'max(24px, calc((100% - var(--container-max)) / 2 + var(--container-pad, 24px)))',
        backgroundImage: 'repeating-linear-gradient(to right, var(--intigris-dark-brown) 0 1px, transparent 1px calc(100% / 12))',
        opacity: 0.05,
        pointerEvents: 'none',
      }} />

      <div className="container-wide" style={{ position: 'relative' }}>
        <div className="why-spread" style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.15fr)',
          gap: 'clamp(48px, 7vw, 96px)',
          alignItems: 'start',
        }}>
          {/* ----- LEFT: headline ----- */}
          <div className="why-headline-col">
            <div className="eyebrow" style={{ marginBottom: 28 }}>
              {tx('WHY INTIGRIS', 'WAAROM INTIGRIS')}
            </div>

            <h2 style={{
              margin: 0,
              fontSize: 'clamp(44px, 5.6vw, 84px)',
              fontWeight: 500,
              letterSpacing: '-0.03em',
              lineHeight: 0.96,
              color: 'var(--intigris-dark-brown)',
            }}>
              {tx('We breathe', 'Wij ademen')}
              <br/>
              <span style={{ color: 'var(--intigris-coral)' }}>
                {tx('Salesforce.', 'Salesforce.')}
              </span>
            </h2>
          </div>

          {/* ----- RIGHT: three editorial pillar rows ----- */}
          <div className="why-pillars-col" style={{
            display: 'flex', flexDirection: 'column',
          }}>
            {PILLARS.map((p, i) => {
              const isHover = hoverIdx === i;
              return (
                <div
                  key={i}
                  onMouseEnter={() => setHoverIdx(i)}
                  onMouseLeave={() => setHoverIdx(-1)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(96px, 0.32fr) minmax(0, 1fr) auto',
                    gap: 'clamp(20px, 3vw, 40px)',
                    alignItems: 'start',
                    padding: 'clamp(20px, 2.6vw, 30px) 0',
                    borderTop: '1px solid var(--intigris-dark-brown)',
                    borderBottom: i === PILLARS.length - 1
                      ? '1px solid var(--intigris-dark-brown)' : 'none',
                    cursor: 'default',
                    position: 'relative',
                  }}
                  className="why-pillar"
                >
                  {/* Big outlined number, fills coral on hover */}
                  <div style={{
                    fontSize: 'clamp(48px, 5.2vw, 76px)',
                    fontWeight: 500,
                    lineHeight: 0.86,
                    letterSpacing: '-0.04em',
                    color: isHover ? 'var(--intigris-coral)' : 'transparent',
                    WebkitTextStroke: isHover
                      ? '1.5px var(--intigris-coral)'
                      : '1.5px var(--intigris-dark-brown)',
                    transition: 'color 320ms var(--ease-out), -webkit-text-stroke 320ms var(--ease-out)',
                    fontVariantNumeric: 'lining-nums tabular-nums',
                    userSelect: 'none',
                  }}>
                    0{i + 1}
                  </div>

                  {/* Title + body */}
                  <div style={{ paddingTop: 4 }}>
                    <h3 style={{
                      margin: '0 0 10px 0',
                      fontSize: 'clamp(18px, 1.7vw, 22px)',
                      fontWeight: 500,
                      letterSpacing: '-0.018em',
                      lineHeight: 1.15,
                      color: 'var(--intigris-dark-brown)',
                      textWrap: 'balance',
                    }}>
                      {p.t}
                    </h3>
                    <p style={{
                      margin: 0,
                      fontSize: 14,
                      fontWeight: 400,
                      lineHeight: 1.55,
                      color: 'var(--fg-muted)',
                      maxWidth: 480,
                    }}>
                      {p.d}
                    </p>
                  </div>

                  {/* Arrow nudge */}
                  <div aria-hidden className="why-arrow" style={{
                    paddingTop: 10,
                    fontSize: 18,
                    color: isHover ? 'var(--intigris-coral)' : 'var(--intigris-dark-brown)',
                    transform: isHover ? 'translateX(6px)' : 'translateX(0)',
                    transition: 'transform 320ms var(--ease-out), color 220ms var(--ease-out)',
                    fontWeight: 400,
                  }}>
                    →
                  </div>

                  {/* Coral hairline that draws in on hover */}
                  <div aria-hidden style={{
                    position: 'absolute',
                    left: 0, bottom: -1,
                    height: 2,
                    background: 'var(--intigris-coral)',
                    width: isHover ? '100%' : '0%',
                    transition: 'width 520ms var(--ease-out)',
                    pointerEvents: 'none',
                  }} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .why-spread { grid-template-columns: 1fr !important; gap: 56px !important; }
          .why-pillar { grid-template-columns: auto 1fr !important; }
          .why-arrow { display: none !important; }
        }
        @media (max-width: 560px) {
          .why-pillar { grid-template-columns: 1fr !important; gap: 12px !important; }
        }
      `}</style>
    </section>
  );
}

window.SiteWhy = SiteWhy;
