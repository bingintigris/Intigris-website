/* /contact (EN) and /nl/contact: the "Let's talk" form inline, plus who to reach and where we are.
   Submissions go to Supabase `inquiries` (same as the slide-in contact sheet on every page). */
import React from 'react';
import { tx, lp, switchLang, getLang } from '../../lib/i18n.js';
import { SiteHeader } from '../../legacy/components/Header.jsx';
import { SiteFooter } from '../../legacy/components/Footer.jsx';
import { SiteCookieConsent } from '../../legacy/components/CookieConsent.jsx';
import { SiteContactSheet } from '../../legacy/components/ContactSheet.jsx';

function InfoBlock({ label, children }) {
  return (
    <div className="ct-info">
      <div className="eyebrow eyebrow--bare">{label}</div>
      <div className="ct-info-body">{children}</div>
    </div>
  );
}

export default function ContactPage() {
  const lang = getLang();
  const nav = (r) => {
    if (r === 'contact') return document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (r === 'blog') return (window.location.href = lp('/blog'));
    if (r === 'about') return (window.location.href = lp('/company'));
    return (window.location.href = lp('/'));
  };
  return (
    <>
      <SiteHeader overlay={false} megaTheme="cream" lang={lang} onLang={switchLang} onNav={nav} />
      <main className="ct">
        <section className="container ct-grid">
          <div className="ct-intro">
            <div className="eyebrow">{tx('CONTACT', 'CONTACT')}</div>
            <h1 className="ct-title">
              {tx('Tell us what you', 'Vertel ons wat je')} <span className="ct-accent">{tx('want to improve.', 'wilt verbeteren.')}</span>
            </h1>
            <p className="ct-lede">
              {tx(
                'A new Salesforce implementation, a stuck project, an integration or a first step with Agentforce: you talk to a consultant, not a call centre. We reply within one working day.',
                'Een nieuwe Salesforce-implementatie, een vastgelopen project, een koppeling of een eerste stap met Agentforce: je spreekt een consultant, geen callcenter. We reageren binnen één werkdag.'
              )}
            </p>

            <div className="ct-person">
              <img src="/assets/team/frank-timmer.jpg" alt="Frank Timmer" width="72" height="72" loading="lazy" />
              <div>
                <b>Frank Timmer</b>
                <span>{tx('Sales Manager · your first point of contact', 'Sales Manager · je eerste aanspreekpunt')}</span>
                <a href="mailto:franktimmer@intigris.nl">franktimmer@intigris.nl</a>
              </div>
            </div>

            <div className="ct-infos">
              <InfoBlock label={tx('Office', 'Kantoor')}>
                Asterweg 71, 1031 HM Amsterdam<br />
                <a href="https://www.google.com/maps/search/?api=1&query=Asterweg+71+1031+HM+Amsterdam" target="_blank" rel="noopener">{tx('Route', 'Route')} →</a>
              </InfoBlock>
              <InfoBlock label={tx('General', 'Algemeen')}>
                <a href="mailto:info@intigris.nl">info@intigris.nl</a>
              </InfoBlock>
              <InfoBlock label={tx('Existing customers', 'Bestaande klanten')}>
                <a href="mailto:support@intigris.nl">support@intigris.nl</a>
              </InfoBlock>
              <InfoBlock label={tx('Working at Intigris', 'Werken bij Intigris')}>
                <a href={lp('/vacancies')}>{tx('See our vacancies', 'Bekijk de vacatures')} →</a>
              </InfoBlock>
            </div>
          </div>

          <div id="contact-form" className="ct-card">
            <SiteContactSheet inline source={lp('/contact')} />
          </div>
        </section>
      </main>
      <SiteFooter />
      <SiteCookieConsent />
      <style dangerouslySetInnerHTML={{ __html: `
        .ct { background: var(--intigris-off-white); }
        .ct-grid { display: grid; grid-template-columns: 1.05fr 1fr; gap: 72px; align-items: start; padding-top: 148px; padding-bottom: 112px; }
        .ct-title { font-size: clamp(40px, 5.2vw, 72px); font-weight: 500; letter-spacing: -0.03em; line-height: 1.02; margin: 18px 0 0; }
        .ct-accent { color: var(--intigris-coral); }
        .ct-lede { font-size: 18px; line-height: 1.55; color: var(--fg-muted); margin: 22px 0 0; max-width: 34em; }
        .ct-person { display: flex; gap: 18px; align-items: center; margin-top: 40px; padding: 18px 20px; background: var(--intigris-paper); border: 1px solid var(--border); border-radius: 18px; max-width: 460px; }
        .ct-person img { width: 72px; height: 72px; border-radius: 999px; object-fit: cover; flex: none; }
        .ct-person b { display: block; font-size: 17px; font-weight: 600; }
        .ct-person span { display: block; font-size: 14px; color: var(--fg-muted); margin-top: 2px; }
        .ct-person a { display: inline-block; margin-top: 6px; font-size: 15px; color: var(--intigris-coral-700); text-decoration: none; }
        .ct-infos { display: grid; grid-template-columns: 1fr 1fr; gap: 26px 32px; margin-top: 44px; }
        .ct-info-body { margin-top: 8px; font-size: 16px; line-height: 1.55; }
        .ct-info-body a { color: var(--intigris-dark-brown); text-decoration: underline; text-underline-offset: 3px; text-decoration-color: rgba(64,35,1,.3); }
        .ct-info-body a:hover { color: var(--intigris-coral-700); }
        .ct-card { background: var(--intigris-paper); border: 1px solid var(--border); border-radius: 28px; padding: 48px; box-shadow: 0 30px 60px -40px rgba(43,23,0,.35); scroll-margin-top: 110px; }
        .ct-card .contact-inline h3 { font-size: 36px !important; }
        @media (max-width: 960px) {
          .ct-grid { grid-template-columns: 1fr; gap: 48px; padding-top: 120px; padding-bottom: 72px; }
          .ct-card { padding: 28px; border-radius: 22px; }
          .ct-infos { grid-template-columns: 1fr; }
        }
      ` }} />
    </>
  );
}
