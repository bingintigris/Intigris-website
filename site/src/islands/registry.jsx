/* Islands registry for the Astro site. The island sources stay in ../../islands/src
   (alias "@islands"); their Tailwind CSS is the prebuilt /islands-dist/islands.css
   (rebuild with `cd islands && npm run build` after changing classes). */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Demo } from '@islands/islands/Demo';
import { PlatformZoom } from '@islands/islands/PlatformZoom';
import { PlatformMission } from '@islands/islands/PlatformMission';

const ISLANDS = { demo: Demo, platformZoom: PlatformZoom, platformMission: PlatformMission };
const roots = new WeakMap();

export function mount(name, el, props = {}) {
  const Comp = ISLANDS[name];
  if (!Comp) { console.warn('[islands] unknown island:', name); return () => {}; }
  el.classList.add('tw');
  let root = roots.get(el);
  if (!root) { root = createRoot(el); roots.set(el, root); }
  root.render(React.createElement(Comp, props));
  return () => { root.unmount(); roots.delete(el); };
}
