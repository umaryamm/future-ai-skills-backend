import { useEffect, useRef } from 'react';

// Attach the returned ref to a container. Any descendant matching the
// selectors below gets a 'reveal-init' class immediately and 'revealed'
// once it scrolls into view — same animation as the original site.
const REVEAL_SELECTOR = '.card, .section-head, .director, .branch-callout, .stat-box, .hero-panel, .why-card, .team-wheel, .home-about-inner, .wheel-person, .about-fact';

export default function useScrollReveal(deps = []) {
  const containerRef = useRef(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root || !('IntersectionObserver' in window)) return;

    const els = root.querySelectorAll(REVEAL_SELECTOR);
    els.forEach(el => el.classList.add('reveal-init'));

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return containerRef;
}
