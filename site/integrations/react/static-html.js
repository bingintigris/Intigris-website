import { createElement as h } from 'react';

/* Astro children / named slots passed into a React component as pre-rendered HTML. */
const StaticHtml = ({ value, name, hydrate = true }) => {
  if (!value) return null;
  const tag = hydrate ? 'astro-slot' : 'astro-static-slot';
  return h(tag, { name, suppressHydrationWarning: true, dangerouslySetInnerHTML: { __html: value } });
};
StaticHtml.shouldComponentUpdate = () => false;
export default StaticHtml;
