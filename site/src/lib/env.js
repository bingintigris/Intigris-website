/* Browser globals for code that was written for the browser only.
   In the browser `win` / `doc` are the real window / document. During the static build
   (Node, no DOM) they are harmless stand-ins, so components can render to HTML without
   crashing on window.matchMedia, document.getElementById, localStorage, ... */
const isServer = typeof window === 'undefined';
const noop = () => {};
const mql = { matches: false, media: '', onchange: null, addEventListener: noop, removeEventListener: noop, addListener: noop, removeListener: noop };
const storage = { getItem: () => null, setItem: noop, removeItem: noop, clear: noop, key: () => null, length: 0 };
const classList = { add: noop, remove: noop, toggle: noop, contains: () => false };
const el = () => ({ style: {}, classList, dataset: {}, setAttribute: noop, getAttribute: () => null, removeAttribute: noop, appendChild: noop, removeChild: noop, addEventListener: noop, removeEventListener: noop, querySelector: () => null, querySelectorAll: () => [], getBoundingClientRect: () => ({ top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 }) });
class NoopObserver { observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } }

const serverWindow = {
  location: { search: '', pathname: '/', href: '', hash: '', origin: 'https://www.intigris.nl', host: 'www.intigris.nl', hostname: 'www.intigris.nl', assign: noop, replace: noop, reload: noop },
  matchMedia: () => mql,
  innerWidth: 1440, innerHeight: 900, outerWidth: 1440, scrollX: 0, scrollY: 0, pageXOffset: 0, pageYOffset: 0, devicePixelRatio: 1,
  addEventListener: noop, removeEventListener: noop, dispatchEvent: noop,
  scrollTo: noop, scrollBy: noop, open: noop,
  requestAnimationFrame: () => 0, cancelAnimationFrame: noop,
  setTimeout, clearTimeout, setInterval, clearInterval,
  getComputedStyle: () => ({ getPropertyValue: () => '' }),
  navigator: { userAgent: '', language: 'en', languages: ['en'], clipboard: { writeText: async () => {} } },
  history: { pushState: noop, replaceState: noop, back: noop, state: null },
  localStorage: storage, sessionStorage: storage,
  IntersectionObserver: NoopObserver, ResizeObserver: NoopObserver, MutationObserver: NoopObserver,
  dataLayer: [],
};
const serverDocument = {
  documentElement: { ...el(), lang: 'en', clientWidth: 1440, clientHeight: 900, scrollTop: 0 },
  body: el(), head: el(),
  cookie: '', referrer: '', title: '', readyState: 'complete', visibilityState: 'visible',
  getElementById: () => null, querySelector: () => null, querySelectorAll: () => [], getElementsByTagName: () => [],
  createElement: el, createElementNS: el, createTextNode: () => ({}),
  addEventListener: noop, removeEventListener: noop,
};
serverWindow.document = serverDocument;

export const win = isServer ? serverWindow : window;
export const doc = isServer ? serverDocument : document;
export const IS_SERVER = isServer;
