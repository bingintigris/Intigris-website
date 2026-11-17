/* Converted from index.html (inline page script) by scripts/convert-legacy.mjs */
import React from 'react';
import { TweakRadio, TweakSection, TweakToggle, TweaksPanel, useTweaks } from '../components/tweaks-panel.jsx';
import { getLang, lp, switchLang } from '../../lib/i18n.js';
import { doc, win } from '../../lib/env.js';
import { SiteHeader } from '../components/Header.jsx';
import { SiteHero } from '../components/Hero.jsx';
import { SiteShowcase } from '../components/Showcase.jsx';
import { SiteOfferings } from '../components/Offerings.jsx';
import { SiteClientStories } from '../components/ClientStories.jsx';
import { SiteWhy } from '../components/WhyIntigris.jsx';
import { SitePricing } from '../components/Pricing.jsx';
import { SiteCases } from '../components/Cases.jsx';
import { SiteTestimonial } from '../components/Testimonial.jsx';
import { SiteISA } from '../components/ISA.jsx';
import { SiteSalesforceHome } from '../components/HomeSalesforce.jsx';
import { SiteFinalCTA, SiteFooter } from '../components/Footer.jsx';
import { SiteNewsletter } from '../components/Newsletter.jsx';
import { SiteCookieConsent } from '../components/CookieConsent.jsx';
import { SiteContactSheet } from '../components/ContactSheet.jsx';

    const { useState, useEffect } = React;

    const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
      "hero": "cinematic",
      "industries": "tabs",
      "accent": "coral",
      "showProofMarquee": true,
      "darkExplore": false,
      "showPricing": false,
      "showCases": false,
      "showTestimonial": true,
      "showISA": false
    }/*EDITMODE-END*/;

    /* ------- App ------- */
    function App() {
      const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
      const [contactOpen, setContactOpen] = useState(false);
      const [lang, setLang] = useState(getLang());
      const [mode, setMode] = useState(() => new URLSearchParams(win.location.search).get('mode') === 'salesforce' ? 'salesforce' : 'ai'); // 'ai' (default) | 'salesforce'
      useEffect(() => { doc.documentElement.setAttribute('lang', lang); if (win.gsap) win.gsap.registerPlugin(...['ScrollTrigger', 'SplitText', 'DrawSVGPlugin', 'MorphSVGPlugin', 'MotionPathPlugin', 'Flip', 'ScrambleTextPlugin'].map(n => win[n]).filter(Boolean)); }, []);

      // Set window.__lang SYNCHRONOUSLY so the same render's tx() reads the new value.
      const changeLang = (next) => {
        switchLang(next);
        doc.documentElement.setAttribute('lang', next);
        setLang(next);
      };

      const openContact = () => setContactOpen(true);

      return (
        <>
          <SiteHeader
            overlay={t.hero === 'cinematic'}
            megaTheme="cream"
            onNav={(r) => {
              if (r === 'contact') return openContact();
              if (r === 'blog')    return (win.location.href = lp("/blog"));
              if (r === 'about')   return (win.location.href = lp("/company"));
              if (r === 'home')    return win.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            lang={lang}
            onLang={changeLang}
          />
          <main key={lang}>
            <SiteHero variant={t.hero} mood={t.darkExplore ? 'dark' : 'coral'} mode={mode} onMode={setMode} onCta={openContact} onSecondary={() => doc.getElementById('cases')?.scrollIntoView({behavior:'smooth', block:'start'})} />

            {/* ===== Sections below the hero switch with the AI / Salesforce toggle ===== */}
            {mode === 'ai' ? (
              /* ---------- AI SOLUTIONS view (default) ---------- */
              <React.Fragment key="view-ai">
                <SiteShowcase onCta={openContact} />
                <SiteOfferings />
                <SiteClientStories />
                <SiteWhy />
                {t.showPricing && <SitePricing onCta={openContact} />}
                {t.showCases && <SiteCases />}
                {t.showTestimonial && <SiteTestimonial lang={lang} />}
                {t.showISA && <SiteISA />}
              </React.Fragment>
            ) : (
              /* ---------- SALESFORCE SOLUTIONS view: components/HomeSalesforce.jsx (redesign 2026-11) ---------- */
              <React.Fragment key="view-salesforce">
                <SiteSalesforceHome onCta={openContact} />
              </React.Fragment>
            )}

            <SiteFinalCTA onCta={openContact} />
          </main>
          <SiteNewsletter key={'nl-'+lang} />
          <SiteFooter key={'f-'+lang} />
          <SiteCookieConsent />

          <SiteContactSheet open={contactOpen} onClose={() => setContactOpen(false)} source={lp("/")} />

          <TweaksPanel title="Home page tweaks">
            <TweakSection label="Hero" />
            <TweakRadio
              label="Style"
              value={t.hero}
              options={[
                { value: 'cinematic', label: 'Cinematic' },
                { value: 'split', label: 'Split' },
                { value: 'typographic', label: 'Type' },
                { value: 'editorial', label: 'Editorial' },
              ]}
              onChange={(v) => setTweak('hero', v)}
            />

            <TweakSection label="Explore" />
            <TweakToggle label="Dark hero + orange menus" value={t.darkExplore} onChange={(v) => setTweak('darkExplore', v)} />

            <TweakSection label="Sections" />
            <TweakToggle label="Pricing" value={t.showPricing} onChange={(v) => setTweak('showPricing', v)} />
            <TweakToggle label="Cases" value={t.showCases} onChange={(v) => setTweak('showCases', v)} />
            <TweakToggle label="Testimonial" value={t.showTestimonial} onChange={(v) => setTweak('showTestimonial', v)} />
            <TweakToggle label="ISA teaser" value={t.showISA} onChange={(v) => setTweak('showISA', v)} />
          </TweaksPanel>
        </>
      );
    }

export default App;
