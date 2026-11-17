import React from 'react';
import { renderToString } from 'react-dom/server';
import StaticHtml from './static-html.js';

const slotName = (s) => s.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());

function check(Component) {
  if (typeof Component === 'function') return true;
  return !!(Component && typeof Component === 'object' && Component.$$typeof);
}

async function renderToStaticMarkup(Component, props, { default: children, ...slotted } = {}, metadata = {}) {
  const hydrate = !!(metadata && metadata.hydrate);
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    slots[slotName(key)] = React.createElement(StaticHtml, { hydrate, value, name: key });
  }
  const newProps = { ...props, ...slots };
  const kids = children ?? props.children;
  if (kids != null) newProps.children = React.createElement(StaticHtml, { hydrate, value: kids });
  delete newProps['client:only'];
  const html = renderToString(React.createElement(Component, newProps));
  return { html };
}

export default { name: 'intigris-react', check, renderToStaticMarkup, supportsAstroStaticSlot: true };
