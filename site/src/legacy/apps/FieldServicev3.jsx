/* Converted from FieldService-v3.html (inline page script) by scripts/convert-legacy.mjs */
import { doc, win } from '../../lib/env.js';
import React from 'react';
import { lp, switchLang, getLang } from '../../lib/i18n.js';
import { SiteHeader } from '../components/Header.jsx';
import { FieldServiceV3 } from '../components/CloudPagesV3.jsx';
import { SiteNewsletter } from '../components/Newsletter.jsx';
import { SiteFooter } from '../components/Footer.jsx';
import { SiteCookieConsent } from '../components/CookieConsent.jsx';
import { SiteContactSheet } from '../components/ContactSheet.jsx';

    function App() {
      const [lang, setLang] = React.useState(getLang());
      const [contactOpen, setContactOpen] = React.useState(false);
      function changeLang(l){ switchLang(l); doc.documentElement.setAttribute('lang', l); setLang(l); }
      function nav(r){ if (r === 'contact') return setContactOpen(true); return (win.location.href = lp("/")); }
      return (
        <>
          <SiteHeader overlay={true} megaTheme="cream" lang={lang} onLang={changeLang} onNav={nav} />
          <FieldServiceV3 key={'p-' + lang} onCta={() => setContactOpen(true)} />
          <SiteNewsletter key={'nl-' + lang} />
          <SiteFooter key={'f-' + lang} />
          <SiteCookieConsent />
          <SiteContactSheet open={contactOpen} onClose={() => setContactOpen(false)} source={lp("/quickstarts/field-service")} />
        </>
      );
    }

export default App;
