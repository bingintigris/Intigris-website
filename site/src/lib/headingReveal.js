/* Section titles rise in word by word as they scroll into view
   (Bing 2026-11-25: "the titles animate onto the screen", first on the AI home,
   then also on the Salesforce home). Shared so both views move the same way.
   - GSAP: the page's own copy (synced with Lenis smooth scrolling) or npm.
   - Skipped for prefers-reduced-motion: titles simply stay in place.
   - Everything is reverted on unmount (language or AI/Salesforce switch). */
import { useEffect } from 'react';

function loadGsap() {
  const w = window;
  if (w.gsap && w.ScrollTrigger && w.SplitText) return Promise.resolve({ gsap: w.gsap, ScrollTrigger: w.ScrollTrigger, SplitText: w.SplitText });
  return Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('gsap/SplitText')])
    .then(([a, b, c]) => ({ gsap: a.gsap || a.default, ScrollTrigger: b.ScrollTrigger, SplitText: c.SplitText }));
}

export function useHeadingReveal(ref, selector = 'h2') {
  useEffect(() => {
    if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let ctx, alive = true, t;
    loadGsap().then(({ gsap, ScrollTrigger, SplitText }) => {
      const root = ref.current;
      if (!alive || !root || !SplitText) return;
      gsap.registerPlugin(ScrollTrigger, SplitText);
      ctx = gsap.context(() => {
        root.querySelectorAll(selector).forEach((h) => {
          const s = SplitText.create(h, { type: 'words', mask: 'words' });
          gsap.from(s.words, { yPercent: 110, duration: 0.9, stagger: 0.05, ease: 'power3.out', scrollTrigger: { trigger: h, start: 'top 85%' } });
        });
      }, root);
      /* sections with pinned/sticky parts change the page height: re-measure once */
      t = setTimeout(() => { ScrollTrigger.sort && ScrollTrigger.sort(); ScrollTrigger.refresh(); }, 300);
    });
    return () => { alive = false; clearTimeout(t); ctx && ctx.revert(); };
  }, []);
}
