/* Language for every page and component.
   English lives at /path, Dutch at /nl/path. The page's <html lang> is the source of truth
   in the browser; during the build each page calls setLang() in its frontmatter before
   rendering (pages build one at a time). */
let serverLang = 'en';
export const LANGS = ['en', 'nl'];

export function setLang(l) { serverLang = l === 'nl' ? 'nl' : 'en'; }
export function getLang() {
  if (typeof document === 'undefined') return serverLang;
  return document.documentElement.lang === 'nl' ? 'nl' : 'en';
}
export function tx(en, nl) { return getLang() === 'nl' ? nl : en; }

/* strip a leading /nl from a path */
export function basePath(p) {
  const s = p.replace(/^\/nl(?=\/|$)/, '');
  return s === '' ? '/' : s;
}
/* path in a given language */
export function localePath(p, lang) {
  if (!p.startsWith('/') || p.startsWith('//')) return p;
  const b = basePath(p);
  if (lang !== 'nl') return b;
  return b === '/' ? '/nl/' : '/nl' + b;
}
/* path in the current language (used for every internal link) */
export function lp(p) { return localePath(p, getLang()); }

/* language switch = go to the same page in the other language (keeps query + hash) */
export function switchLang(next) {
  if (typeof window === 'undefined') { setLang(next); return; }
  const { pathname, search, hash } = window.location;
  const target = localePath(pathname, next) + search + hash;
  if (target !== pathname + search + hash) window.location.assign(target);
}
