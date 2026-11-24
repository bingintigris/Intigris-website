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
import { WhyLine, WhyStage, WhyZigzag, WsStyles } from '../home/WhyStack.jsx';
import { IntLinesPop, IntLinesGrow, IntLinesTrace, IntLinesFlow, V3Styles } from '../home/IntegrationsVariants.jsx';
import { WhySettleCards, WhySettleBento, WhySettleLine, WsoStyles } from '../home/WhySettle.jsx';
import { StoriesStack, StoriesWall, StoriesGallery, StoriesGalleryIndustry, SvStyles } from '../home/StoriesVariants.jsx';
import { StorySpotlight, SsStyles } from '../../legacy/components/StorySpotlight.jsx';
import { CK_STORIES, CkStyles } from '../../legacy/components/CloudKit.jsx';
const StoriesCurrent = () => { const S = CK_STORIES(); return <><CkStyles /><StorySpotlight variant="pills" head={{ eyebrow: tx('CUSTOMER SUCCESS STORIES', 'KLANTSUCCESVERHALEN'), a: tx('Teams that run on it.', 'Teams die erop draaien.'), b: '', lede: tx('What we built, in their own words. Pick a company or let it play.', 'Wat we bouwden, in hun eigen woorden. Kies een bedrijf of laat het vanzelf lopen.') }} stories={[S.wetransfer, S.evbox, S.ridder]} /></>; };
const WhyStageCream = () => <WhyStage look="cream" />;
const WhyStageNumber = () => <WhyStage look="number" />;
const WhyStageSplit = () => <WhyStage look="split" />;

const StoriesAfterEnd = () => <StoriesGalleryIndustry after="end" />;
const StoriesAfterCarousel = () => <StoriesGalleryIndustry after="carousel" />;
const StoriesAfterGrid = () => <StoriesGalleryIndustry after="grid" />;
const StoriesAfterFeature = () => <StoriesGalleryIndustry after="feature" />;

const ROUNDS = () => [
  {
    id: 'intlines', title: tx('Integrations · smoother connector lines (Salesforce label removed)', 'Koppelingen · soepelere verbindingslijnen (Salesforce-label weg)'),
    variants: [
      { k: '0', name: tx('Now: lines pop in', 'Nu: lijnen ploppen in'), note: tx('Reference: each line snaps in quickly after its tool has landed.', 'Referentie: elke lijn schiet snel in nadat de tool geland is.'), C: IntLinesPop },
      { k: 'A', name: tx('Reach out', 'Uitreiken'), note: tx('Each line draws out from Salesforce at the same pace as its tool flies in, so they meet exactly when the tool lands. One continuous movement.', 'Elke lijn tekent zich vanuit Salesforce in hetzelfde tempo als de tool invliegt, zodat ze elkaar precies raken als de tool landt. Eén doorlopende beweging.'), C: IntLinesGrow },
      { k: 'B', name: tx('Connect one by one', 'Eén voor één verbinden'), note: tx('The tools land first; then each line draws slowly from Salesforce to its tool, one after another, with a small light travelling along it.', 'Eerst landen de tools; daarna tekent elke lijn zich rustig van Salesforce naar zijn tool, één voor één, met een klein lichtje dat meereist.'), C: IntLinesTrace },
      { k: 'C', name: tx('Soft fade + data flow (CHOSEN)', 'Zachte fade + datastroom (GEKOZEN)'), note: tx('Lines fade in softly (no drawing); once everything has landed, all lines glow softly up and down in one light orange; hovering a tool turns its line bright orange.', 'Lijnen faden zacht in (geen tekenen); zodra alles geland is, gloeien alle lijnen zacht op en neer in één lichtoranje kleur; met je muis op een tool wordt die lijn fel oranje.'), C: IntLinesFlow },
    ],
  },
  {
    id: 'stories2', title: tx('Customer stories · what it becomes after you have scrolled through it (scroll past each one)', 'Klantverhalen · wat het wordt nadat je erdoorheen gescrold bent (scroll steeds voorbij)'),
    variants: [
      { k: '0', name: tx('Now: the row stays at its end', 'Nu: de rij blijft aan het eind staan'), note: tx('Reference: what the homepage does now (last cards half visible + "Read all stories").', 'Referentie: wat de homepage nu doet (laatste kaarten half zichtbaar + "Lees alle verhalen").'), C: StoriesAfterEnd },
      { k: 'A', name: tx('Carousel back to the start (CHOSEN)', 'Carrousel terug naar het begin (GEKOZEN)'), note: tx('Once you have scrolled through, the row glides back to the first story and becomes a normal carousel: arrow buttons, drag with the mouse or swipe.', 'Na het doorscrollen glijdt de rij terug naar het eerste verhaal en wordt een gewone carrousel: pijlknoppen, slepen met de muis of swipen.'), C: StoriesAfterCarousel },
      { k: 'B', name: tx('Fold into a grid', 'Samenvouwen tot een raster'), note: tx('The row fades out and all stories rise in as a tidy grid of compact cards (logo, quote, name), plus a "Read all stories" tile. The industry pills still filter.', 'De rij vervaagt en alle verhalen komen omhoog als een net raster van compacte kaarten (logo, citaat, naam), plus een "Lees alle verhalen"-tegel. De branchepillen filteren nog steeds.'), C: StoriesAfterGrid },
      { k: 'C', name: tx('Spotlight + logo list', 'Spotlight + logolijst'), note: tx('One big quote on the left, the customers as a clickable logo list on the right; it rotates every 6 seconds (thin coral timer) until you pick one.', 'Eén groot citaat links, de klanten als klikbare logolijst rechts; wisselt elke 6 seconden (dunne koraal timer) tot je er zelf één kiest.'), C: StoriesAfterFeature },
    ],
  },
  {
    id: 'why4', title: tx('"We breathe Salesforce." · plays once, then settles into a fixed overview (three designs)', '"Wij ademen Salesforce." · speelt één keer, daarna een vast overzicht (drie ontwerpen)'),
    variants: [
      { k: 'A', name: tx('Five cards in a row', 'Vijf kaarten op een rij'), note: tx('After the last reason, the timeline folds into five white cards side by side (proof on top, reason and short text below) under the heading. Scrolling back up just passes this still overview.', 'Na de laatste reden vouwt de tijdlijn zich tot vijf witte kaarten naast elkaar (bewijs boven, reden en korte tekst eronder) onder de kop. Terugscrollen loopt gewoon langs dit stilstaande overzicht.'), C: WhySettleCards },
      { k: 'B', name: tx('Bento: heading left, tiles right (CHOSEN)', 'Bento: kop links, tegels rechts (GEKOZEN)'), note: tx('The heading stays left; the reasons gather into four compact tiles with their proof, plus a wide coral 4.5★ bar underneath.', 'De kop blijft links; de redenen komen samen in vier compacte tegels met hun bewijs, plus een brede koraal 4.5★-balk eronder.'), C: WhySettleBento },
      { k: 'C', name: tx('The line turns horizontal', 'De lijn draait horizontaal'), note: tx('The coral scroll line turns sideways under a centred heading: five checkpoints, each with its proof, reason and short text.', 'De koraal scrolllijn draait opzij onder een gecentreerde kop: vijf checkpoints, elk met bewijs, reden en korte tekst.'), C: WhySettleLine },
    ],
  },
  {
    id: 'stories', title: tx('Customer stories · current section + three redesigns', 'Klantverhalen · huidige sectie + drie herontwerpen'),
    variants: [
      { k: 'C2', name: tx('Horizontal gallery + industry pills (CHOSEN, with Bing\'s changes)', 'Horizontale galerij + branchepillen (GEKOZEN, met Bings wijzigingen)'), note: tx('Heading on the left, a sliding pill selector on the right (All · Energy & renewables · Installation & maintenance · Software & tech); picking one shows only that industry\'s stories.', 'Kop links, rechts een schuivende pillenkiezer (Alles · Energie & duurzaam · Installatie & onderhoud · Software & tech); kies er één en je ziet alleen de verhalen uit die branche.'), C: StoriesGalleryIndustry },
      { k: '0', name: tx('Current (reference)', 'Huidig (referentie)'), note: tx('The section that is on the homepage now.', 'De sectie die nu op de homepage staat.'), C: StoriesCurrent },
      { k: 'A', name: tx('Swipeable card stack', 'Swipebare kaartenstapel'), note: tx('A deck of story cards you drag (or swipe) away with throwing physics; the next quote appears line by line. GSAP Draggable + Inertia + SplitText.', 'Een stapel verhaalkaarten die je wegsleept (of swipet) met werpfysica; het volgende citaat verschijnt regel voor regel. GSAP Draggable + Inertia + SplitText.'), C: StoriesStack },
      { k: 'B', name: tx('Story wall that expands', 'Verhalenmuur die uitklapt'), note: tx('A wall of small customer tiles; click one and it smoothly grows into the featured story while the others make room. GSAP Flip.', 'Een muur met kleine klanttegels; klik er één aan en hij groeit soepel uit tot het uitgelichte verhaal terwijl de rest plaatsmaakt. GSAP Flip.'), C: StoriesWall },
      { k: 'C', name: tx('Horizontal story gallery', 'Horizontale verhalengalerij'), note: tx('The section stays in place while scrolling slides large story cards sideways; each quote lights up word by word. ScrollTrigger + SplitText.', 'De sectie blijft staan terwijl scrollen grote verhaalkaarten opzij schuift; elk citaat licht woord voor woord op. ScrollTrigger + SplitText.'), C: StoriesGallery },
    ],
  },
  {
    id: 'why2', title: tx('"Why Intigris" round 2 · C × D: stacked reasons with an active scroll line', '"Waarom Intigris" ronde 2 · C × D: gestapelde redenen met een actieve scrolllijn'),
    variants: [
      { k: '1', name: tx('Scroll line along the reasons (CHOSEN, with Bing\'s changes)', 'Scrolllijn langs de redenen (GEKOZEN, met Bings wijzigingen)'), note: tx('"We breathe Salesforce." stays on the left (no counter, no button); on the right a line fills as you scroll, a glowing dot lights each reason, headlines animate in letter by letter and each proof animates.', '"Wij ademen Salesforce." blijft links staan (geen teller, geen knop); rechts vult een lijn zich terwijl je scrolt, een gloeiende stip licht elke reden op, koppen animeren letter voor letter in en elk bewijs animeert.'), C: WhyLine },
      { k: '2', name: tx('Pinned stage', 'Vastgezet podium'), note: tx('The section stays in place; scrolling moves the line on the left from reason to reason while one big reason at a time flies in letter by letter, with its proof.', 'De sectie blijft staan; scrollen beweegt de lijn links van reden naar reden terwijl één grote reden tegelijk letter voor letter invliegt, met het bewijs.'), C: WhyStage },
      { k: '3', name: tx('Centre line, zigzag', 'Middenlijn, zigzag'), note: tx('A line draws itself down the middle; reasons slide in from left and right, each point lights up; it ends on the Summit badge and a call to action.', 'Een lijn tekent zichzelf door het midden; redenen schuiven links en rechts in, elk punt licht op; eindigt bij de Summit-badge en een call-to-action.'), C: WhyZigzag },
    ],
  },
  {
    id: 'why3', title: tx('"Why Intigris" round 3 · the pinned stage (2) on cream, three designs', '"Waarom Intigris" ronde 3 · het vastgezette podium (2) op crème, drie ontwerpen'),
    variants: [
      { k: '2A', name: tx('Cream classic', 'Crème klassiek'), note: tx('Same as 2, on cream: line with the five reasons on the left, the big reason in the middle, proof in a white card.', 'Zelfde als 2, op crème: lijn met de vijf redenen links, de grote reden in het midden, bewijs in een witte kaart.'), C: WhyStageCream },
      { k: '2B', name: tx('Big outlined number', 'Groot omlijnd cijfer'), note: tx('A giant outlined number (01–05) behind each reason fills with coral as you scroll; a slim column of numbers on the left.', 'Een reusachtig omlijnd cijfer (01–05) achter elke reden vult zich met koraal terwijl je scrolt; een smalle kolom cijfers links.'), C: WhyStageNumber },
      { k: '2C', name: tx('Split stage with story bars', 'Gesplitst podium met storybalkjes'), note: tx('Reason on the left, a large proof card sliding in on the right; progress as five bars along the bottom, like stories.', 'Reden links, een grote bewijskaart die rechts inschuift; voortgang als vijf balkjes onderaan, zoals stories.'), C: WhyStageSplit },
    ],
  },
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
      <WsStyles /><WsoStyles /><V3Styles />
      <SvStyles />
      <SsStyles />
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
