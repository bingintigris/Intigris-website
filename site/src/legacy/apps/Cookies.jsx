/* Converted from Cookies.html (inline page script) by scripts/convert-legacy.mjs */
import React from 'react';
import { win } from '../../lib/env.js';
import { lp, switchLang, getLang } from '../../lib/i18n.js';
import { SiteHeader } from '../components/Header.jsx';
import { SiteFooter } from '../components/Footer.jsx';
import { SiteContactSheet } from '../components/ContactSheet.jsx';
import { SiteCookieConsent } from '../components/CookieConsent.jsx';

    const { useState, useEffect } = React;

    /* English only, matching the notice it replaces. */

    /* Shows the visitor their current choice, and lets them change it. */
    function ConsentStatus() {
      const [state, setState] = useState(() => win.IntigrisConsent.get());
      useEffect(() => win.IntigrisConsent.onChange((next) => setState(next)), []);

      const yes = (on) => (
        <span style={{ color: on ? 'var(--intigris-washed-green)' : 'var(--fg-muted)', fontWeight: 500 }}>
          {on ? 'Accepted' : 'Not accepted'}
        </span>
      );

      return (
        <div className="legal-note">
          {state === null ? (
            <p><strong>You have not made a choice yet.</strong> Until you do, only the strictly
            necessary cookie below is set.</p>
          ) : (
            <>
              <p style={{ marginBottom: 10 }}><strong>Your current choice.</strong>{' '}
                Analytics: {yes(state.analytics)}. Marketing: {yes(state.marketing)}.
              </p>
              <p style={{ marginBottom: 14, fontSize: 14 }}>
                Saved on {new Date(state.at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}.
              </p>
            </>
          )}
          <button className="btn btn-primary btn-sm" onClick={() => win.IntigrisConsent.open()}>
            Change my cookie preferences
          </button>
        </div>
      );
    }

    function Cookies() {
      return (
        <main style={{ background: 'var(--intigris-off-white)' }}>
          <article className="container" style={{ paddingTop: 132, paddingBottom: 96 }}>
            <div className="legal">
              <div className="eyebrow" style={{ color: 'var(--intigris-coral)' }}>LEGAL</div>
              <h1 style={{ fontSize: 'clamp(32px,4vw,52px)', fontWeight: 500, letterSpacing: '-0.026em', lineHeight: 1.04, margin: '14px 0 10px' }}>
                Cookie notice.
              </h1>
              <p className="legal-meta">Last updated 18 August 2026</p>

              <div className="legal-note">
                <p><strong>The short version.</strong> This site currently sets one cookie, and its
                only job is to remember whether you said yes to the others. No analytics, no
                advertising, no tracking across other websites. If you accept nothing, nothing
                happens.</p>
              </div>

              <p>A cookie is a small file a website stores on your device. Some are needed for a site
              to function at all. Others watch what you do so someone can measure or advertise to
              you. European law lets us set the first kind without asking, and requires your consent
              for the rest. We take that distinction seriously rather than burying it.</p>

              <h2>Your choice right now</h2>
              <ConsentStatus />

              <h2>What is set before you choose anything</h2>
              <div className="legal-table-wrap">
                <table className="legal-table">
                  <thead>
                    <tr>
                      <th>Cookie</th>
                      <th>Purpose</th>
                      <th>Expires</th>
                      <th>Set by</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>intigris_consent</td>
                      <td>Remembers which cookie categories you accepted, so the banner does not
                          reappear on every page. Contains only your choice and the date you made
                          it. No identifier, nothing that describes you.</td>
                      <td>6 months</td>
                      <td>Intigris (first party)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>That is the complete list. This cookie is strictly necessary and cannot be turned
              off, because refusing it would mean asking you the same question on every page.</p>

              <h3>If you log in to our portal</h3>
              <p>Our internal admin portal, used only by Intigris staff, sets a session cookie to
              keep you signed in. It is strictly necessary, and it never appears for ordinary
              visitors to this website.</p>

              <h2>What is set only if you agree</h2>
              <p>Both categories below are switched off unless you turn them on. We are listing them
              because we intend to use analytics, and want this page to be accurate on the day we
              switch it on rather than a month later.</p>

              <h3>Analytics</h3>
              <p>We plan to use Google Analytics 4 to see which pages people find useful and where
              they came from. It is not running yet. Once it is, accepting this category sets the
              cookies below. Declining means the Google script is never loaded at all, not merely
              loaded and told to behave.</p>
              <div className="legal-table-wrap">
                <table className="legal-table">
                  <thead>
                    <tr>
                      <th>Cookie</th>
                      <th>Purpose</th>
                      <th>Expires</th>
                      <th>Set by</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>_ga</td>
                      <td>Distinguishes one visitor from another so visits are not double counted.</td>
                      <td>2 years</td>
                      <td>Google Analytics</td>
                    </tr>
                    <tr>
                      <td>_ga_&lt;id&gt;</td>
                      <td>Keeps track of the current session for the specific property.</td>
                      <td>2 years</td>
                      <td>Google Analytics</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>Where Google Analytics is active we ask it to truncate IP addresses, and we do not
              use it to build advertising audiences.</p>

              <h3>Marketing</h3>
              <p>Cookies that measure whether our advertising reaches the right people, and that let
              a platform such as LinkedIn or Google show you our ads elsewhere. <strong>We do not
              currently use any.</strong> If that changes, this table will list each one before it
              is switched on, and the category stays off until you choose otherwise.</p>

              <h2>Things we do not do</h2>
              <ul>
                <li>We do not use pre-ticked boxes. Analytics and marketing start off.</li>
                <li>We do not treat scrolling or continued browsing as consent.</li>
                <li>We do not make refusing harder than accepting. "Necessary only" is one click,
                    exactly like "Accept all".</li>
                <li>We do not use tracking pixels in our newsletter to see whether you opened it in
                    order to profile you.</li>
                <li>We do not use Flash cookies. Flash has not existed since 2020.</li>
              </ul>

              <h2>Changing your mind</h2>
              <p>Use the button further up this page, or the <strong>Cookie preferences</strong> link
              in the footer of any page. Your choice applies immediately. Turning a category off
              stops anything new being set, though a cookie already on your device stays until it
              expires or you clear it.</p>
              <p>We ask again after six months, so a decision you made long ago does not follow you
              around indefinitely.</p>

              <h3>Clearing cookies in your browser</h3>
              <p>You can also delete or block cookies in your browser settings, which works
              regardless of what any website asks you. Each browser puts this in a slightly
              different place, so look for "Cookies" or "Privacy and security" in its settings.
              Blocking everything may break parts of some websites, though it will not break this
              one.</p>

              <h2>Questions</h2>
              <p>Email <a href="mailto:info@intigris.nl">info@intigris.nl</a>. For the wider picture
              of what we do with personal information, see our
              <a href={lp("/privacy")}> privacy notice</a>.</p>
            </div>
          </article>
        </main>
      );
    }

    function App() {
      const [lang, setLang] = useState(getLang());
      const [contact, setContact] = useState(null);
      function changeLang(l){ switchLang(l); setLang(l); }
      function nav(r){
        if (r === 'contact') return setContact({ subject: '', message: '' });
        if (r === 'blog') return (win.location.href = lp("/blog"));
        return (win.location.href = lp("/"));
      }
      return (
        <>
          <SiteHeader overlay={false} megaTheme="cream" lang={lang} onLang={changeLang} onNav={nav} />
          <Cookies />
          <SiteFooter />
          <SiteContactSheet
            open={!!contact}
            onClose={() => setContact(null)}
            subject={contact ? contact.subject : ''}
            message={contact ? contact.message : ''}
            source={lp("/cookies")}
          />
          <SiteCookieConsent />
        </>
      );
    }

export default App;
