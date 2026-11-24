/* Review page for homepage sections: each variant under a label, so Bing can compare and pick.
   Not linked from the site, noindex, excluded from the sitemap. */
import React from 'react';
import { tx, getLang, localePath } from '../../lib/i18n.js';
import { StartRolesCard, StartRoles, StartTabs, StartBento, WtsStyles } from '../home/WhereToStart.jsx';
import { HowTimeline, HowPinned, HowCards, HwwStyles } from '../home/HowWeWork.jsx';
import { ClStyles } from '../home/CloudsOverview.jsx';
import { CloudsChaos, CloudsShowcase, CloudsDeck, CpStyles } from '../home/CloudsPick.jsx';
import { CloudIntrosReview, CiStyles } from '../home/CloudIntros.jsx';
import { TrustedVelocity, TrustedWall, TrustedSentence, TrustedStats, TvStyles } from '../home/TrustedVariants.jsx';
import { HeroFx1, HeroFx2, HeroFx3, HfxStyles } from './HeroFxVariants.jsx';
import { WhyBento, WhyVs, WhyPinned, WhyStory, WhyPeople, WiStyles } from '../home/WhyIntigris.jsx';

const ROUNDS = () => [
  {
    id: 'why', title: tx('"Why Intigris" · five variations (replaces "Where do you start?")', '"Waarom Intigris" · vijf varianten (vervangt "Waar begin je?")'),
    variants: [
      { k: 'A', name: tx('Proof bento', 'Bewijs-bento'), note: tx('Tiles with Summit Partner, the numbers and the reasons; they appear one after another as you scroll in.', 'Tegels met Summit Partner, de cijfers en de redenen; ze verschijnen na elkaar als je erin scrolt.'), C: WhyBento },
      { k: 'B', name: tx('Intigris vs a typical partner', 'Intigris vs een gemiddelde partner'), note: tx('Side-by-side comparison; rows slide in, the checkmarks pop.', 'Vergelijking naast elkaar; rijen schuiven in, de vinkjes ploppen.'), C: WhyVs },
      { k: 'C', name: tx('Pinned statement', 'Vastgezette stelling'), note: tx('"Why Intigris?" stays on the left while the reasons scroll by; each headline animates in letter by letter (SplitText).', '"Waarom Intigris?" blijft links staan terwijl de redenen voorbij scrollen; elke kop animeert letter voor letter in (SplitText).'), C: WhyPinned },
      { k: 'D', name: tx('The Intigris story', 'Het verhaal van Intigris'), note: tx('A timeline that draws itself as you scroll: 2010 → 300+ projects → 4.5★ → 2026 Summit Partner → today.', 'Een tijdlijn die zichzelf tekent als je scrolt: 2010 → 300+ projecten → 4.5★ → 2026 Summit Partner → nu.'), C: WhyStory },
      { k: 'E', name: tx('Meet the people', 'Maak kennis met de mensen'), note: tx('"Talk to the people who build it": team photos fan out next to the key reasons.', '"Praat met de mensen die het bouwen": teamfoto\'s waaieren uit naast de belangrijkste redenen.'), C: WhyPeople },
    ],
  },
  {
    id: 'herofx', title: tx('Homepage top section · three scroll effects (copy of the hero; the real one on :8003 is unchanged)', 'Bovenste sectie homepage · drie scrolleffecten (kopie van de hero; de echte op :8003 is ongewijzigd)'),
    variants: [
      { k: '1', name: tx('Card lift', 'Kaart tilt op'), note: tx('Space grows on the left and right; the hero becomes a floating card with rounded corners.', 'Links en rechts groeit ruimte; de hero wordt een zwevende kaart met ronde hoeken.'), C: HeroFx1 },
      { k: '2', name: tx('Depth (parallax)', 'Diepte (parallax)'), note: tx('The photo moves slower and zooms in a little; headline and numbers card drift up at different speeds.', 'De foto beweegt trager en zoomt iets in; kop en cijferkaart drijven met verschillende snelheden omhoog.'), C: HeroFx2 },
      { k: '3', name: tx('Photo reveal', 'Foto komt naar voren'), note: tx('The team photo comes forward, the colour warms toward brown, and "Business." turns light to stay readable.', 'De teamfoto komt naar voren, de kleur verwarmt naar bruin en "Business." wordt licht zodat het leesbaar blijft.'), C: HeroFx3 },
    ],
  },
  {
    id: 'trusted', title: tx('"Trusted by" logo strip · four redesigns (current = simple scrolling row below the hero)', '"Vertrouwd door"-logostrook · vier herontwerpen (nu = simpele scrollende rij onder de hero)'),
    variants: [
      { k: 'A', name: tx('Speed marquee', 'Snelheidsmarquee'), note: tx('Scroll down the page: the row speeds up and leans; scroll up: it reverses. Grey logos turn colour on hover.', 'Scroll de pagina: de rij versnelt en helt over; scroll omhoog: hij keert om. Grijze logo\'s krijgen kleur bij hover.'), C: TrustedVelocity },
      { k: 'A2', name: tx('Speed marquee · all logos in Intigris coral', 'Snelheidsmarquee · alle logo\'s in Intigris-koraal'), note: tx('Same as A, but every logo in Intigris coral (dark brown on hover).', 'Zelfde als A, maar elk logo in Intigris-koraal (donkerbruin bij hover).'), C: () => <TrustedVelocity tint /> },
      { k: 'B', name: tx('Logo wall with spotlight', 'Logomuur met spotlight'), note: tx('A 3×3 wall that appears tile by tile; a soft light follows your mouse.', 'Een 3×3-muur die tegel voor tegel verschijnt; een zacht licht volgt je muis.'), C: TrustedWall },
      { k: 'C', name: tx('Rotating sentence', 'Wisselende zin'), note: tx('"Trusted by [logo] in [industry]": the logo glides in, the industry word scrambles into the next one. Industry labels to confirm.', '"Vertrouwd door [logo] in [sector]": het logo glijdt in, het sectorwoord husselt naar het volgende. Sectorlabels nog te bevestigen.'), C: TrustedSentence },
      { k: 'D', name: tx('Numbers + shuffling wall', 'Cijfers + schuivende muur'), note: tx('Counters run up when you scroll in (15+, 300+, 4.5★); the logo wall reshuffles every few seconds (GSAP Flip).', 'Tellers lopen op als je erin scrolt (15+, 300+, 4.5★); de logomuur schudt om de paar seconden door (GSAP Flip).'), C: TrustedStats },
    ],
  },
  {
    id: 'intros', title: tx('Section 2 · Opening animation per cloud (option 1 vs 2)', 'Sectie 2 · Openingsanimatie per cloud (optie 1 vs 2)'),
    variants: [
      { k: '★', name: tx('Pick 1 or 2 per cloud', 'Kies 1 of 2 per cloud'), note: tx('Rough previews; the section itself (concept A) is already on the homepage.', 'Ruwe previews; de sectie zelf (concept A) staat al op de homepage.'), C: CloudIntrosReview },
    ],
  },
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
      <CiStyles />
      <TvStyles />
      <HfxStyles />
      <WiStyles />
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
