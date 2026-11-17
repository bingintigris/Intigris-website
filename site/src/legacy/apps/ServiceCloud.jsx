/* Converted from ServiceCloud.html (inline page script) by scripts/convert-legacy.mjs */
import React from 'react';
import { doc, win } from '../../lib/env.js';
import { lp, switchLang, getLang } from '../../lib/i18n.js';
import { SiteHeader } from '../components/Header.jsx';
import { QuickstartPage } from '../components/Quickstart.jsx';
import { SiteNewsletter } from '../components/Newsletter.jsx';
import { SiteFooter } from '../components/Footer.jsx';
import { SiteCookieConsent } from '../components/CookieConsent.jsx';
import { SiteContactSheet } from '../components/ContactSheet.jsx';

    const { useState } = React;
    /* ?lang=nl opens the page in Dutch. */

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
          <QuickstartPage key={'qs-' + lang} product="service" onCta={() => setContactOpen(true)} />
          <SiteNewsletter key={'nl-' + lang} />
          <SiteFooter key={'f-' + lang} />
          <SiteCookieConsent />
          <SiteContactSheet open={contactOpen} onClose={() => setContactOpen(false)} source={lp("/quickstarts/service-cloud")} />
        </>
      );
    }

export default App;
