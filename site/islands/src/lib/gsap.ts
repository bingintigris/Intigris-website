/* GSAP + ScrollTrigger come from the page (CDN, window.gsap / window.ScrollTrigger),
   so islands and classic components share one instance. Types come from the npm package. */
import type { gsap as GsapType } from 'gsap';
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger';

const w = window as unknown as { gsap: typeof GsapType; ScrollTrigger: typeof ScrollTriggerType };

export const gsap = w.gsap;
export const ScrollTrigger = w.ScrollTrigger;
export type ScrollTriggerInstance = ScrollTriggerType;

if (gsap && ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
