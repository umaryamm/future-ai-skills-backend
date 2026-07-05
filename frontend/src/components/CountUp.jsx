import { useEffect, useRef, useState } from 'react';

// Animates a number from 0 up to `end` once it scrolls into view.
// Pass prefix/suffix for things like "$1T+" or "60%+".
export default function CountUp({ end, duration = 1200, prefix = '', suffix = '', decimals = 0 }) {
  const [value, setValue] = useState(0);
  const spanRef = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const node = spanRef.current;
    if (!node) return;

    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !('IntersectionObserver' in window)) {
      setValue(end);
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const step = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
            setValue(end * eased);
            if (progress < 1) requestAnimationFrame(step);
            else setValue(end);
          };
          requestAnimationFrame(step);
          io.unobserve(node);
        }
      });
    }, { threshold: 0.4 });

    io.observe(node);
    return () => io.disconnect();
  }, [end, duration]);

  return (
    <span ref={spanRef}>
      {prefix}{decimals ? value.toFixed(decimals) : Math.round(value).toLocaleString()}{suffix}
    </span>
  );
}
