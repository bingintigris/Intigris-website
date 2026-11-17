/* ==================================================================== */
/*  One-off converter: classic in-browser Babel site -> ES modules for     */
/*  Astro. Reads ../components/*.jsx and the inline <script type=         */
/*  "text/babel"> of each production page, writes                         */
/*    src/legacy/components/<File>.jsx   (one module per component file)  */
/*    src/legacy/apps/<Page>.jsx         (the page's App, default export) */
/*    src/legacy/pages.json              (title, head + body extras)      */
/*  Run: node scripts/convert-legacy.mjs   (from site/)                   */
/*  After the first run the output is the source of truth (edit it by     */
/*  hand); re-running overwrites it, so only re-run before hand edits.    */
/* ==================================================================== */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from '@babel/parser';
import traverseMod from '@babel/traverse';
const traverse = traverseMod.default || traverseMod;

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const OUT = path.resolve(import.meta.dirname, '..', 'src', 'legacy');

/* old file -> new route (EN; NL = '/nl' + route). Keeps the live Webflow paths. */
export const ROUTES = {
  'index': '/',
  'Services': '/services',
  'Quickstarts': '/quickstarts',
  'SalesCloud': '/quickstarts/sales-cloud',
  'SalesCloud-v3': '/quickstarts/sales-cloud',
  'FieldService-v3': '/quickstarts/field-service',
  'FieldService': '/quickstarts/field-service',
  'ServiceCloud': '/quickstarts/service-cloud',
  'Agentforce': '/quickstarts/agentforce',
  'About': '/company',
  'Careers': '/careers',
  'Culture': '/culture',
  'Benefits': '/benefits',
  'Vacancies': '/vacancies',
  'ApplicationProcedure': '/application-procedure',
  'ISA': '/isa',
  'Blog': '/blog',
  'Industries': '/industries',
  'AIReadinessScan': '/ai-readiness-scan',
  'Privacy': '/privacy',
  'Cookies': '/cookies',
};
/* pages that get built (FieldService.html is replaced by the v3 page) */
const PAGES = ['index', 'Services', 'Quickstarts', 'SalesCloud', 'FieldService-v3', 'ServiceCloud', 'Agentforce', 'About',
  'Careers', 'Culture', 'Benefits', 'Vacancies', 'ApplicationProcedure', 'ISA', 'Blog', 'Industries', 'AIReadinessScan', 'Privacy', 'Cookies'];

const REACT_NAMED = ['useState', 'useEffect', 'useRef', 'useMemo', 'useCallback', 'useLayoutEffect', 'useContext', 'createContext',
  'Fragment', 'useId', 'useReducer', 'forwardRef', 'memo', 'useTransition', 'useDeferredValue', 'Children', 'cloneElement', 'isValidElement'];
const WIN_PROPS = ['localStorage', 'sessionStorage', 'navigator', 'location', 'matchMedia', 'requestAnimationFrame', 'cancelAnimationFrame',
  'getComputedStyle', 'innerWidth', 'innerHeight', 'scrollY', 'history', 'IntersectionObserver', 'ResizeObserver', 'MutationObserver'];
const ASSET_DIRS = ['assets/', 'design-system/', 'one-pagers/', 'legal/', 'islands-dist/'];

const parseCode = (code, file) => parse(code, { sourceType: 'module', plugins: ['jsx'], errorRecovery: false, sourceFilename: file });

function topLevelNames(ast) {
  const names = [];
  for (const n of ast.program.body) {
    if (n.type === 'FunctionDeclaration' || n.type === 'ClassDeclaration') names.push(n.id.name);
    if (n.type === 'VariableDeclaration') for (const d of n.declarations) collectPattern(d.id, names);
  }
  return names;
}
function collectPattern(p, out) {
  if (!p) return;
  if (p.type === 'Identifier') out.push(p.name);
  else if (p.type === 'ObjectPattern') p.properties.forEach((q) => collectPattern(q.type === 'RestElement' ? q.argument : q.value, out));
  else if (p.type === 'ArrayPattern') p.elements.forEach((q) => collectPattern(q, out));
  else if (p.type === 'AssignmentPattern') collectPattern(p.left, out);
  else if (p.type === 'RestElement') collectPattern(p.argument, out);
}

/* rewrite "X.html?..." / asset paths inside a string */
function rewriteUrl(s) {
  const m = s.match(/^([A-Za-z0-9-]+)\.html(\?[^#]*)?(#.*)?$/);
  if (m && ROUTES[m[1]] !== undefined) {
    let route = ROUTES[m[1]];
    let q = m[2] || '';
    q = q.replace(/[?&]lang=(en|nl)/, '').replace(/^&/, '?');
    if (q === '?') q = '';
    return { route: route + q + (m[3] || ''), localized: true };
  }
  for (const d of ASSET_DIRS) if (s.startsWith(d)) return { route: '/' + s, localized: false };
  return null;
}

function convert(code, file, { globalMap, isApp }) {
  const ast = parseCode(code, file);
  const own = new Set(topLevelNames(ast));
  const edits = [];
  const imports = new Map(); // module -> Set(names)
  const need = (mod, name) => { if (!imports.has(mod)) imports.set(mod, new Set()); imports.get(mod).add(name); };
  const handled = new WeakSet();
  const warn = [];

  const resolveGlobal = (name) => {
    if (own.has(name)) return null;
    const mods = globalMap.get(name);
    if (!mods) return null;
    const pick = mods.find((m) => !/Variants|V2|Carousel|HomePlatform|tweaks/.test(m)) || mods[0];
    if (mods.length > 1) warn.push(`${name}: defined in ${mods.join(', ')} -> using ${pick}`);
    return pick;
  };

  traverse(ast, {
    /* Object.assign(window, {...}) / window.X = X at top level: dropped (we export instead) */
    ExpressionStatement(p) {
      if (p.parent.type !== 'Program') return;
      const e = p.node.expression;
      const isAssignWin = e.type === 'CallExpression' && e.callee.type === 'MemberExpression' && e.callee.object.name === 'Object'
        && e.callee.property.name === 'assign' && e.arguments[0]?.name === 'window';
      const isWinSet = e.type === 'AssignmentExpression' && e.left.type === 'MemberExpression' && e.left.object.name === 'window'
        && e.right.type === 'Identifier' && own.has(e.right.name);
      const isRender = e.type === 'CallExpression' && /ReactDOM\.createRoot/.test(code.slice(e.start, e.end));
      if (isAssignWin || isWinSet || (isApp && isRender)) { edits.push([p.node.start, p.node.end, '']); p.skip(); }
    },
    AssignmentExpression(p) {
      const l = p.node.left;
      if (l.type === 'MemberExpression' && l.object.name === 'window' && !l.computed && l.property.name === '__lang') {
        edits.push([p.node.start, p.node.end, `switchLang(${code.slice(p.node.right.start, p.node.right.end)})`]);
        need('../../lib/i18n.js', 'switchLang');
        p.skip();
      }
    },
    MemberExpression(p) {
      const n = p.node;
      if (n.object.type !== 'Identifier' || n.object.name !== 'window' || n.computed) return;
      if (p.scope.hasBinding('window')) return;
      const prop = n.property.name;
      if (prop === '__lang') { edits.push([n.start, n.end, 'getLang()']); need('../../lib/i18n.js', 'getLang'); handled.add(n.object); return; }
      if (prop === 'tx') { edits.push([n.start, n.end, 'tx']); need('../../lib/i18n.js', 'tx'); handled.add(n.object); return; }
      const mod = resolveGlobal(prop);
      if (mod && !(p.parent.type === 'AssignmentExpression' && p.parent.left === n)) {
        edits.push([n.start, n.end, prop]); need(mod, prop); handled.add(n.object);
      }
    },
    Identifier(p) {
      const n = p.node;
      if (handled.has(n)) return;
      if (!p.isReferencedIdentifier()) return;
      const name = n.name;
      if (p.scope.hasBinding(name)) return;
      if (name === 'window') { edits.push([n.start, n.end, 'win']); need('../../lib/env.js', 'win'); return; }
      if (name === 'document') { edits.push([n.start, n.end, 'doc']); need('../../lib/env.js', 'doc'); return; }
      if (WIN_PROPS.includes(name) && !(p.parent.type === 'UnaryExpression' && p.parent.operator === 'typeof')) {
        edits.push([n.start, n.end, 'win.' + name]); need('../../lib/env.js', 'win'); return;
      }
      if (name === 'React') { need('react', 'default:React'); return; }
      if (name === 'ReactDOM') { need('react-dom', 'ns:ReactDOM'); return; }
      if (name === 'tx') { need('../../lib/i18n.js', 'tx'); return; }
      if (REACT_NAMED.includes(name)) { need('react', name); return; }
      const mod = resolveGlobal(name);
      if (mod) need(mod, name);
    },
    JSXOpeningElement(p) {
      const nm = p.node.name;
      if (nm.type !== 'JSXIdentifier' && nm.type !== 'JSXMemberExpression') return;
      const base = nm.type === 'JSXIdentifier' ? nm.name : nm.object.name;
      if (!base || !/^[A-Z]/.test(base)) return;
      if (p.scope.hasBinding(base)) return;
      if (base === 'React') { need('react', 'default:React'); return; }
      const mod = resolveGlobal(base);
      if (mod) need(mod, base); else warn.push(`unresolved JSX <${base}>`);
    },
    StringLiteral(p) {
      const r = rewriteUrl(p.node.value);
      if (!r) return;
      const lit = JSON.stringify(r.route);
      const expr = r.localized ? `lp(${lit})` : lit;
      if (r.localized) need('../../lib/i18n.js', 'lp');
      if (p.parent.type === 'JSXAttribute') edits.push([p.node.start, p.node.end, `{${expr}}`]);
      else if (p.parent.type === 'ImportDeclaration') return;
      else edits.push([p.node.start, p.node.end, expr]);
    },
    TemplateLiteral(p) {
      const q = p.node.quasis[0];
      const raw = q.value.raw;
      const m = raw.match(/^([A-Za-z0-9-]+)\.html(\?(post|job)=)?/);
      if (m && ROUTES[m[1]] !== undefined) {
        let route = ROUTES[m[1]];
        if (m[3] === 'post') route = '/blog-posts/';
        else if (m[3] === 'job') route = '/vacancies/';
        else if (m[2]) route += m[2];
        edits.push([q.start, q.start + m[0].length, route]);
        edits.push([p.node.start, p.node.start, 'lp(']);
        edits.push([p.node.end, p.node.end, ')']);
        need('../../lib/i18n.js', 'lp');
        return;
      }
      for (const d of ASSET_DIRS) if (raw.startsWith(d)) { edits.push([q.start, q.start, '/']); return; }
    },
  });

  /* apply edits back to front (zero-width inserts at the same spot keep their order) */
  edits.sort((a, b) => b[0] - a[0] || b[1] - a[1]);
  let out = code;
  let lastStart = Infinity;
  for (const [s, e, t] of edits) {
    if (e > lastStart) { warn.push(`overlapping edit skipped at ${s}`); continue; }
    out = out.slice(0, s) + t + out.slice(e);
    if (s !== e) lastStart = s;
  }

  const head = [];
  for (const [mod, set] of imports) {
    const names = [...set];
    const def = names.find((x) => x.startsWith('default:'));
    const ns = names.find((x) => x.startsWith('ns:'));
    const named = names.filter((x) => !x.includes(':')).sort();
    if (ns) head.push(`import * as ${ns.slice(3)} from '${mod}';`);
    const parts = [];
    if (def) parts.push(def.slice(8));
    if (named.length) parts.push(`{ ${named.join(', ')} }`);
    if (parts.length) head.push(`import ${parts.join(', ')} from '${mod}';`);
  }
  if (!imports.has('react') || ![...imports.get('react')].includes('default:React')) head.unshift(`import React from 'react';`);
  /* a page's `const { useState } = React;` would now clash with nothing, keep it */
  const exportsLine = isApp ? `\nexport default App;\n` : `\nexport { ${[...own].join(', ')} };\n`;
  return { code: head.join('\n') + '\n' + out.replace(/\s+$/, '') + '\n' + exportsLine, warn, own };
}

/* ---------- 1. components ---------- */
const compDir = path.join(ROOT, 'components');
const compFiles = fs.readdirSync(compDir).filter((f) => f.endsWith('.jsx') && f !== 'Island.jsx');
const globalMap = new Map();
const sources = {};
for (const f of compFiles) {
  const code = fs.readFileSync(path.join(compDir, f), 'utf8');
  sources[f] = code;
  for (const n of topLevelNames(parseCode(code, f))) {
    const mod = `./${f}`;
    if (!globalMap.has(n)) globalMap.set(n, []);
    globalMap.get(n).push(mod);
  }
}
globalMap.set('Island', ['./Island.jsx']);
fs.mkdirSync(path.join(OUT, 'components'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'apps'), { recursive: true });
const report = [];
for (const f of compFiles) {
  const { code, warn } = convert(sources[f], f, { globalMap, isApp: false });
  fs.writeFileSync(path.join(OUT, 'components', f), `/* Converted from components/${f} (classic Babel global) by scripts/convert-legacy.mjs */\n` + code);
  if (warn.length) report.push(`# ${f}\n  ` + [...new Set(warn)].join('\n  '));
}

/* ---------- 2. pages ---------- */
const appMap = new Map([...globalMap].map(([k, v]) => [k, v.map((m) => '../components/' + m.slice(2))]));
const pagesMeta = {};
for (const page of PAGES) {
  const html = fs.readFileSync(path.join(ROOT, page + '.html'), 'utf8');
  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1]?.trim() || 'Intigris';
  const desc = (html.match(/<meta\s+name="description"\s+content="([^"]*)"/) || [])[1] || '';
  const robots = (html.match(/<meta\s+name="robots"\s+content="([^"]*)"/) || [])[1] || '';
  const inline = [...html.matchAll(/<script type="text\/babel">([\s\S]*?)<\/script>/g)].map((m) => m[1]).join('\n');
  /* extras: stylesheets / non-babel external scripts / styles, minus React, Babel, islands bundle */
  const fix = (s) => s.replace(/(href|src)="(?!https?:|\/|#|data:|mailto:)([^"]+)"/g, (_, a, u) => `${a}="/${u}"`);
  const headPart = html.split(/<\/head>/)[0].split(/<head>/)[1] || '';
  const bodyPart = html.split(/<body[^>]*>/)[1] || '';
  const keepTag = (t) => !/react(-dom)?@|babel|text\/babel|islands-dist\/islands\.js|window\.tx\s*=|charset|viewport|<title|name="description"|name="robots"|rel="icon"|design-system\/site\.css/.test(t);
  const tags = (part) => [...part.matchAll(/<link[^>]*>|<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<meta[^>]*>/g)].map((m) => m[0]).filter(keepTag).map(fix);
  pagesMeta[page] = { route: ROUTES[page], title, description: desc, robots, head: tags(headPart).join('\n'), body: tags(bodyPart).join('\n') };

  const { code, warn } = convert(inline, page + '.html', { globalMap: appMap, isApp: true });
  const fixed = code.replace(/'\.\.\/\.\.\/lib\//g, "'../../lib/");
  fs.writeFileSync(path.join(OUT, 'apps', page.replace(/-/g, '') + '.jsx'), `/* Converted from ${page}.html (inline page script) by scripts/convert-legacy.mjs */\n` + fixed);
  if (warn.length) report.push(`# ${page}.html\n  ` + [...new Set(warn)].join('\n  '));
}
fs.writeFileSync(path.join(OUT, 'pages.json'), JSON.stringify(pagesMeta, null, 2));
fs.writeFileSync(path.join(OUT, 'convert-report.txt'), report.join('\n') + '\n');
console.log(`converted ${compFiles.length} components + ${PAGES.length} pages; warnings in src/legacy/convert-report.txt (${report.length} files)`);
