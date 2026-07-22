// Showcase.jsx — "Behind the work" band: split heading + intro, then a row of
// three black-and-white photos. Modeled on the Folioblox "Shaping Experiences"
// section, restyled on-brand (off-white surface, coral accents).
// Exposes: window.SiteShowcase

const SHOWCASE_PHOTOS = [
  { src: 'assets/showcase/showcase-1.jpg', altEn: 'A field service professional at work', altNl: 'Een field-service professional aan het werk' },
  { src: 'assets/showcase/showcase-2.jpg', altEn: 'Working with data on a device',        altNl: 'Werken met data op een apparaat' },
  { src: 'assets/showcase/showcase-3.jpg', altEn: 'Hands-on operations in the field',      altNl: 'Praktisch werk op locatie' },
];

function SiteShowcase({ onCta }) {
  const tx = window.tx || ((en) => en);
  return (
    <section
      id="showcase"
      className="section"
      data-screen-label="Showcase"
      style={{ background: 'var(--intigris-off-white)', borderTop: '1px solid var(--border)' }}
    >
      <div className="container-wide">
        {/* Top — split intro */}
        <div className="showcase-head">
          <div>
            <div className="eyebrow" style={{ marginBottom: 20, color: 'var(--intigris-coral)' }}>
              {tx('BEHIND THE WORK', 'ACHTER HET WERK')}
            </div>
            <h2 className="display-md" style={{ color: 'var(--intigris-dark-brown)', margin: 0 }}>
              {tx('Smart solutions', 'Slimme oplossingen')}<br/>
              {tx('for real operations.', 'voor echte operaties.')}
            </h2>
          </div>
          <div className="showcase-intro">
            <p style={{ margin: 0, fontSize: 'clamp(19px, 1.6vw, 22px)', fontWeight: 300, lineHeight: 1.4, color: 'var(--intigris-dark-brown)' }}>
              {tx(
                'We bring focus to what your business needs, then build it on Salesforce so your teams can move forward.',
                'We brengen focus aan in wat uw bedrijf nodig heeft en bouwen het op Salesforce, zodat uw teams verder kunnen.'
              )}
            </p>
            <div className="showcase-cta-row">
              <span style={{ fontSize: 14, fontWeight: 300, color: 'var(--fg-muted)', lineHeight: 1.35 }}>
                {tx('Curious what we can do', 'Benieuwd wat we kunnen doen')}<br/>
                {tx('for your team?', 'voor uw team?')}
              </span>
              <button className="btn btn-primary showcase-cta" onClick={onCta}>
                {tx("Let's talk", 'Neem contact op')}
                <span className="showcase-arrow" aria-hidden>→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Three black-and-white photos */}
        <div className="showcase-grid">
          {SHOWCASE_PHOTOS.map((p, i) => (
            <figure key={i} className="showcase-photo">
              <img src={p.src} alt={tx(p.altEn, p.altNl)} loading="lazy" />
            </figure>
          ))}
        </div>
      </div>

      <style>{`
        #showcase .showcase-head {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
          gap: clamp(32px, 6vw, 88px);
          align-items: end;
          margin-bottom: clamp(40px, 5vw, 64px);
        }
        #showcase .showcase-intro { display: flex; flex-direction: column; gap: 28px; padding-bottom: 6px; }
        #showcase .showcase-cta-row { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
        #showcase .showcase-cta { display: inline-flex; align-items: center; gap: 10px; }
        #showcase .showcase-cta .showcase-arrow {
          display: inline-flex; align-items: center; justify-content: center;
          width: 30px; height: 30px; border-radius: 999px;
          background: var(--intigris-off-white); color: var(--intigris-coral);
          font-size: 14px; transition: transform var(--t-base) var(--ease-out);
        }
        #showcase .showcase-cta:hover .showcase-arrow { transform: translateX(3px); }
        #showcase .showcase-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(16px, 2vw, 24px);
        }
        #showcase .showcase-photo {
          margin: 0; overflow: hidden; border-radius: 18px;
          aspect-ratio: 4 / 5; background: var(--intigris-off-white-200);
        }
        #showcase .showcase-photo img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          filter: grayscale(1) contrast(1.02);
          transform: scale(1);
          transition: filter 420ms var(--ease-out), transform 620ms var(--ease-out);
        }
        #showcase .showcase-photo:hover img { filter: grayscale(0) contrast(1); transform: scale(1.04); }
        @media (max-width: 900px) {
          #showcase .showcase-head { grid-template-columns: 1fr; align-items: start; }
          #showcase .showcase-grid { grid-template-columns: 1fr; max-width: 460px; margin: 0 auto; }
        }
      `}</style>
    </section>
  );
}

window.SiteShowcase = SiteShowcase;
