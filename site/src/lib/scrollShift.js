/* Move the page to scroll position y without the visitor noticing (Bing 2026-11-24).
   Used when a section that played once is made shorter (pin removed, layout swapped) and the
   scroll position is corrected so nothing on screen moves. With Lenis smooth scrolling, a plain
   immediate jump also throws away the scroll momentum that is still running, so the page stalls
   for a moment ("hitch"); here the remaining momentum is carried over to the new position. */
export function scrollShift(y) {
  const w = window, L = w.lenis;
  y = Math.max(0, y);
  if (!L) { w.scrollTo(0, y); return; }
  const rest = (L.targetScroll || 0) - (L.animatedScroll || 0);
  L.scrollTo(y, { immediate: true, force: true });
  if (Math.abs(rest) > 0.5) L.scrollTo(y + rest, { force: true });
}
