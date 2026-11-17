import { createElement } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import StaticHtml from './static-html.js';

export default (element) => (Component, props, { default: children, ...slotted }, { client }) => {
  if (!element.hasAttribute('ssr')) return;
  for (const [key, value] of Object.entries(slotted)) props[key] = createElement(StaticHtml, { value, name: key });
  const vnode = createElement(Component, props, children != null ? createElement(StaticHtml, { value: children }) : undefined);
  const root = client === 'only' ? createRoot(element) : null;
  if (root) root.render(vnode);
  const r = root || hydrateRoot(element, vnode, {
    onRecoverableError: (err) => { const m = String(err && err.message || err).slice(0, 300); (window.__qa = window.__qa || []).push('hydrate: ' + m); console.warn('[hydrate]', m); },
  });
  element.addEventListener('astro:unmount', () => r.unmount(), { once: true });
};
