/* <Island name="..." props={...} /> places an interactive section built in /islands
   (React + TypeScript + Tailwind, scoped to .tw via islands-dist/islands.css).
   Islands are browser-only: the registry is loaded with a dynamic import after hydration,
   so the static build never runs their window/GSAP code. */
import React from 'react';
import { getLang } from '../../lib/i18n.js';

export function Island({ name, props, className = '', minHeight }) {
  const ref = React.useRef(null);
  const key = JSON.stringify(props || {});
  React.useEffect(() => {
    let off = () => {};
    let cancelled = false;
    import('../../islands/registry.jsx').then(({ mount }) => {
      if (!cancelled && ref.current) off = mount(name, ref.current, props || {});
    });
    return () => { cancelled = true; off(); };
  }, [name, key, getLang()]);
  return <div ref={ref} className={'island ' + className} data-island={name} style={minHeight ? { minHeight } : null} />;
}
