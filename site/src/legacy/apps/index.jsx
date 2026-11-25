/* Converted from index.html (inline page script) by scripts/convert-legacy.mjs */
import React from 'react';
import { TweakRadio, TweakSection, TweakToggle, TweaksPanel, useTweaks } from '../components/tweaks-panel.jsx';
import { getLang, lp, switchLang } from '../../lib/i18n.js';
import { doc, win } from '../../lib/env.js';
import { SiteHeader } from '../components/Header.jsx';
import { SiteHero } from '../components/Hero.jsx';
import { SiteSalesforceHome } from '../components/HomeSalesforce.jsx';
import { SiteAIHome, AiHero } from '../../components/home/HomeAI.jsx';
import { SiteFooter } from '../components/Footer.jsx';
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
      /* 'ai' (default) | 'salesforce'. The page is pre-rendered in AI mode; ?mode=salesforce switches after hydration */
      const [mode, setMode] = useState('ai');
      useEffect(() => { if (new URLSearchParams(win.location.search).get('mode') === 'salesforce') setMode('salesforce'); }, []);
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
            {/* AI view: its own futuristic hero (Bing 2026-11-25); Salesforce view keeps the photo hero */}
            {mode === 'ai'
              ? <AiHero mode={mode} onMode={setMode} onCta={openContact} />
              : <SiteHero variant={t.hero} mood={t.darkExplore ? 'dark' : 'coral'} mode={mode} onMode={setMode} onCta={openContact} onSecondary={() => doc.getElementById('cases')?.scrollIntoView({behavior:'smooth', block:'start'})} />}

            {/* ===== Sections below the hero switch with the AI / Salesforce toggle ===== */}
            {mode === 'ai' ? (
              /* ---------- AI SOLUTIONS view (default): components/home/HomeAI.jsx (plan 2026-11-25,
                   content from the Agentris proposition under the Intigris brand) ---------- */
              <React.Fragment key="view-ai">
                <SiteAIHome onCta={openContact} onMode={setMode} />
              </React.Fragment>
            ) : (
              /* ---------- SALESFORCE SOLUTIONS view: components/HomeSalesforce.jsx (redesign 2026-11) ---------- */
              <React.Fragment key="view-salesforce">
                <SiteSalesforceHome onCta={openContact} />
              </React.Fragment>
            )}

            {/* Both views end with their own 'Chat with Frank' section (Salesforce: Bing 2026-11-24; AI: 2026-11-25) */}
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

          </TweaksPanel>
        </>
      );
    }

export default App;
