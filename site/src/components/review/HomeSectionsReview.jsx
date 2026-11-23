/* Review page for homepage sections: each variant under a label, so Bing can compare and pick.
   Not linked from the site, noindex, excluded from the sitemap. */
import React from 'react';
import { tx, getLang, localePath } from '../../lib/i18n.js';
import { StartRolesCard, StartRoles, StartTabs, StartBento, WtsStyles } from '../home/WhereToStart.jsx';
import { HowTimeline, HowPinned, HowCards, HwwStyles } from '../home/HowWeWork.jsx';
import { ClStyles } from '../home/CloudsOverview.jsx';
import { CloudsChaos, CloudsShowcase, CloudsDeck, CpStyles } from '../home/CloudsPick.jsx';

const ROUNDS = () => [
  {
    id: 'clouds', title: tx('Section 2 · What we implement (round 2: list left, animated card right)', 'Sectie 2 · Wat we implementeren (ronde 2: lijst links, geanimeerde kaart rechts)'),
    variants: [
      { k: 'A', name: tx('Chaos to order', 'Van chaos naar orde'), note: tx('Light, like "Where do you start?". Pick a cloud: that team\'s typical mess floats in (post-its, mails, Excel), then lands in one clean Salesforce screen, like the Sales Cloud hero.', 'Licht, zoals "Waar begin je?". Kies een cloud: de typische chaos van dat team zweeft binnen (post-its, mails, Excel) en landt daarna in één strak Salesforce-scherm, zoals de Sales Cloud-hero.'), C: CloudsChaos },
      { k: 'B', name: tx('Showcase screen', 'Showcase-scherm'), note: tx('Dark band, numbered list. A big laptop switches to the chosen cloud; "today" and "with Salesforce" labels and the price pop in around it.', 'Donkere band, genummerde lijst. Een grote laptop wisselt naar de gekozen cloud; labels "nu" en "met Salesforce" en de prijs ploppen eromheen.'), C: CloudsShowcase },
      { k: 'C', name: tx('Card deck', 'Kaartspel'), note: tx('Coral band with pill list. A fanned deck of cards: the chosen cloud\'s card is dealt to the front and tilts with your mouse.', 'Koraal band met pil-lijst. Een waaier van kaarten: de kaart van de gekozen cloud wordt naar voren gedeeld en kantelt mee met je muis.'), C: CloudsDeck },
    ],
  },
  {
    id: 'how', title: tx('Section 6 · How we work', 'Sectie 6 · Zo werken we'),
    variants: [
      { k: 'A', name: tx('Scroll timeline', 'Scroll-tijdlijn'), note: tx('Light; a coral line fills as you scroll and lights up each step. Title stays on the left.', 'Licht; een koraal lijn loopt mee met scrollen en licht elke stap op. Titel blijft links staan.'), C: HowTimeline },
      { k: 'B', name: tx('Pinned steps + mini screen', 'Vastgezette stappen + mini-scherm'), note: tx('Dark band that stays in place while you scroll through the six steps; each step shows a small screen.', 'Donkere band die blijft staan terwijl je door de zes stappen scrolt; elke stap toont een klein scherm.'), C: HowPinned },
      { k: 'C', name: tx('Horizontal cards', 'Horizontale kaarten'), note: tx('Scrolling down moves six cards sideways; they slide in one by one.', 'Naar beneden scrollen schuift zes kaarten opzij; ze schuiven één voor één in beeld.'), C: HowCards },
    ],
  },
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
      <HwwStyles />
      <ClStyles />
      <CpStyles />
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
