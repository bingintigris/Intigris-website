import './index.css';
import type { ComponentType } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Demo } from './islands/Demo';

/* Registry of islands. Add a new island here and it can be placed on any page with
   the <Island name="..." props={...} /> host component (components/Island.jsx). */
const ISLANDS: Record<string, ComponentType<any>> = {
  demo: Demo,
};

const roots = new WeakMap<Element, Root>();

/* Mounts an island into an element. The element gets class "tw" so the scoped Tailwind
   utilities apply inside it (and nowhere else). Returns an unmount function. */
export function mount(name: string, el: Element, props: Record<string, unknown> = {}) {
  const Comp = ISLANDS[name];
  if (!Comp) { console.warn('[islands] unknown island:', name); return () => {}; }
  el.classList.add('tw');
  let root = roots.get(el);
  if (!root) { root = createRoot(el); roots.set(el, root); }
  root.render(<Comp {...props} />);
  return () => { root!.unmount(); roots.delete(el); };
}

export const names = Object.keys(ISLANDS);
