/* Smooth scrolling (Lenis) wired into GSAP ScrollTrigger.
   Load after lenis.min.js, gsap.min.js and ScrollTrigger.min.js.
   - Skipped for visitors who ask for reduced motion, and on touch devices
     (phones already scroll smoothly; Lenis would only add lag there).
   - window.lenis is exposed so other code can pause it (lenis.stop()/start())
     or scroll with it (lenis.scrollTo(target)).
   Not loaded on pages with a scroll lock (SalesCloud.html "Stop met" band):
   that lock listens to wheel events itself. */
(function () {
  if (!window.Lenis) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var touch = window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  if (reduce || touch) return;

  var lenis = new window.Lenis({
    lerp: 0.1,            // how quickly the page catches up with the wheel (lower = floatier)
    wheelMultiplier: 1,
    smoothWheel: true,
    anchors: true         // in-page #links scroll smoothly too
  });
  window.lenis = lenis;

  if (window.gsap && window.ScrollTrigger) {
    window.gsap.registerPlugin(window.ScrollTrigger);
    lenis.on('scroll', window.ScrollTrigger.update);
    window.gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    window.gsap.ticker.lagSmoothing(0);
  } else {
    var raf = function (time) { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
})();
