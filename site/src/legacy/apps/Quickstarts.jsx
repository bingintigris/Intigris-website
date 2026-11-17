/* Converted from Quickstarts.html (inline page script) by scripts/convert-legacy.mjs */
import React from 'react';
import { doc, win } from '../../lib/env.js';
import { lp, switchLang, tx, getLang } from '../../lib/i18n.js';
import { QsOthers, QsQuotes, QuickstartStyles } from '../components/Quickstart.jsx';
import { SiteHeader } from '../components/Header.jsx';
import { SiteNewsletter } from '../components/Newsletter.jsx';
import { SiteFooter } from '../components/Footer.jsx';
import { SiteCookieConsent } from '../components/CookieConsent.jsx';
import { SiteContactSheet } from '../components/ContactSheet.jsx';

    const { useState } = React;
    /* ?lang=nl opens the page in Dutch. */

    const VALUES = () => [
      { t: tx('Fast implementation', 'Snelle implementatie'), d: tx('Four weeks from kick-off to go-live; two for the Agentforce Kickstart.', 'Vier weken van kick-off tot livegang; twee voor de Agentforce Kickstart.') },
      { t: tx('Better ROI', 'Beter rendement'), d: tx('Fixed scope and a fixed price, so your team starts using Salesforce instead of planning it.', 'Vaste scope en een vaste prijs, zodat je team Salesforce gaat gebruiken in plaats van plannen.') },
      { t: tx('Proven success', 'Bewezen succes'), d: tx('Salesforce partner since 2010, with the same approach behind every quickstart.', 'Salesforce-partner sinds 2010, met dezelfde aanpak achter elke quickstart.') },
    ];

    function QuickstartsPage({ onCta }) {
      return (
        <main style={{ background: 'var(--intigris-off-white)' }}>
          <section className="sc-hero">
            <div aria-hidden className="sc-hero-photo" />
            <div aria-hidden className="sc-hero-fade" />
            <div className="container-wide sc-hero-inner">
              <div className="sc-hero-grid">
                <div>
                  <div className="eyebrow eyebrow--dark" style={{ marginBottom: 22 }}>SALESFORCE QUICKSTARTS</div>
                  <h1 className="sc-h1">{tx('Running on Salesforce', 'Draaien op Salesforce')} <span>{tx('in weeks, not months.', 'in weken, niet maanden.')}</span></h1>
                  <p className="sc-lede-dark">
                    {tx('Our Quickstarts get a Salesforce solution live fast: configured around how you work today, built in your own org, with a fixed scope and price. Start small, see it work, then grow.',
                        'Met onze Quickstarts staat een Salesforce-oplossing snel live: ingericht op hoe je nu werkt, gebouwd in je eigen org, met een vaste scope en prijs. Begin klein, zie het werken en groei daarna.')}
                  </p>
                  <div style={{ marginTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <button className="btn sc-btn-dark" onClick={onCta}>{tx('Book a 30-min call', 'Plan een gesprek van 30 min')} <span className="arrow">→</span></button>
                    <a className="btn btn-outline-light" href="#all">{tx('See the quickstarts', 'Bekijk de quickstarts')} <span className="arrow">↓</span></a>
                  </div>
                </div>
                <div className="qs-hero-card">
                  <div className="qs-hero-eyebrow">{tx('WHY A QUICKSTART', 'WAAROM EEN QUICKSTART')}</div>
                  <ul>{VALUES().map((v, i) => <li key={i}>{v.t}</li>)}</ul>
                </div>
              </div>
            </div>
          </section>

          <section id="all" className="container-wide sc-section">
            <div className="section-head sc-head">
              <div>
                <div className="eyebrow" style={{ marginBottom: 20 }}>{tx('OUR QUICKSTARTS', 'ONZE QUICKSTARTS')}</div>
                <h2 className="display-md">{tx('Pick where', 'Kies waar')} <span style={{ color: 'var(--intigris-coral)' }}>{tx('you start.', 'je begint.')}</span></h2>
              </div>
            </div>
            <QsOthers current="" />
          </section>

          <section className="sc-section sc-section--rule">
            <div className="container-wide">
              <div className="qs-benefits">
                {VALUES().map((v, i) => (
                  <div key={i} className="qs-benefit"><span className="sc-ba-check" aria-hidden>✓</span><div><b>{v.t}</b><span>{v.d}</span></div></div>
                ))}
              </div>
            </div>
          </section>

          <section className="sc-section sc-section--coral">
            <div className="container-wide">
              <div className="section-head sc-head">
                <div>
                  <div className="eyebrow eyebrow--dark" style={{ marginBottom: 20 }}>{tx('CUSTOMERS', 'KLANTEN')}</div>
                  <h2 className="display-md">{tx('Our customers', 'Onze klanten')} <span style={{ color: 'var(--intigris-off-white)', fontStyle: 'italic' }}>{tx('love what we do.', 'over ons werk.')}</span></h2>
                </div>
              </div>
              <QsQuotes ids={['opcharge', 'alpha', 'atag']} />
            </div>
          </section>
          <QuickstartStyles />
          <style dangerouslySetInnerHTML={{ __html: `.qs-quotes { grid-template-columns: repeat(3, minmax(0, 1fr)); } @media (max-width: 980px) { .qs-quotes { grid-template-columns: 1fr; } }` }} />
        </main>
      );
    }

    function App() {
      const [lang, setLang] = useState(getLang());
      const [contactOpen, setContactOpen] = useState(false);
      function changeLang(l){ switchLang(l); doc.documentElement.setAttribute('lang', l); setLang(l); }
      function nav(r){
        if (r === 'contact') return setContactOpen(true);
        return (win.location.href = lp("/"));
      }
      return (
        <>
          <SiteHeader overlay={true} megaTheme="cream" lang={lang} onLang={changeLang} onNav={nav} />
          <QuickstartsPage key={'qo-' + lang} onCta={() => setContactOpen(true)} />
          <SiteNewsletter key={'nl-' + lang} />
          <SiteFooter key={'f-' + lang} />
          <SiteCookieConsent />
          <SiteContactSheet open={contactOpen} onClose={() => setContactOpen(false)} source={lp("/quickstarts")} />
        </>
      );
    }

export default App;
