/* Review page for homepage sections: each variant under a label, so Bing can compare and pick.
   Not linked from the site, noindex, excluded from the sitemap. */
import React from 'react';
import { tx, getLang, localePath } from '../../lib/i18n.js';
import { StartRolesCard, StartRoles, StartTabs, StartBento, WtsStyles } from '../home/WhereToStart.jsx';

const ROUNDS = () => [
  {
    id: 'start', title: tx('Section 4 · Where do you start?', 'Sectie 4 · Waar begin je?'),
    variants: [
      { k: 'D', name: tx('Roles + product card (A × B)', 'Rollen + productkaart (A × B)'), note: tx('NEW · Light like A; the role list on the left switches B’s card with the mini Salesforce screen.', 'NIEUW · Licht zoals A; de rollenlijst links wisselt de kaart van B met het mini Salesforce-scherm.'), C: StartRolesCard },
      { k: 'A', name: tx('Role switcher', 'Rol-kiezer'), note: tx('Visitor picks who they are; the card shows the matching product.', 'Bezoeker kiest wie hij is; de kaart toont het passende product.'), C: StartRoles },
      { k: 'B', name: tx('Product tabs + mini screen', 'Producttabs + mini-scherm'), note: tx('Dark band; each tab shows a small Salesforce screen of the product.', 'Donkere band; elke tab toont een klein Salesforce-scherm van het product.'), C: StartTabs },
      { k: 'C', name: tx('Bento grid', 'Bento-raster'), note: tx('All six at a glance; details appear on hover.', 'Alle zes in één oogopslag; details verschijnen bij hover.'), C: StartBento },
    ],
  },
];

export default function HomeSectionsReview() {
  const lang = getLang();
  const other = lang === 'nl' ? 'en' : 'nl';
  return (
    <div className="rv">
      <header className="rv-top">
        <b>Intigris · {tx('Homepage design round', 'Homepage ontwerpronde')}</b>
        <a href={localePath('/review/home-sections', other)}>{other.toUpperCase()}</a>
      </header>
      {ROUNDS().map((r) => (
        <div key={r.id}>
          <h1 className="rv-round">{r.title}</h1>
          {r.variants.map(({ k, name, note, C }) => (
            <div key={k} className="rv-variant">
              <div className="rv-label"><span>{k}</span><b>{name}</b><em>{note}</em></div>
              <C />
            </div>
          ))}
        </div>
      ))}
      <WtsStyles />
      <style dangerouslySetInnerHTML={{ __html: `
        .rv-top { position: sticky; top: 0; z-index: 50; display: flex; justify-content: space-between; align-items: center; padding: 14px 28px; background: #1d1206; color: #fff; font-size: 14px; }
        .rv-top a { color: #fff; font-weight: 600; }
        .rv-round { font-size: 15px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; margin: 0; padding: 36px 28px 8px; background: #1d1206; color: #ffb59e; }
        .rv-variant { border-top: 6px solid #1d1206; }
        .rv-label { display: flex; gap: 14px; align-items: baseline; flex-wrap: wrap; padding: 14px 28px; background: #2b1a08; color: #fff; }
        .rv-label span { display: inline-grid; place-items: center; width: 30px; height: 30px; border-radius: 99px; background: var(--intigris-coral); font-weight: 700; }
        .rv-label b { font-size: 17px; } .rv-label em { font-style: normal; opacity: .7; font-size: 14px; }
      ` }} />
    </div>
  );
}
