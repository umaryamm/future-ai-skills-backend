import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

/* Auto-rotating promotional banners shown right below the navbar.
   Slides move on their own every few seconds, pause on hover, and can
   be navigated with the arrows or dots. Purely presentational — it does
   not touch any existing data or functionality. */

const SLIDES = [
  {
    key: 'admissions',
    eyebrow: 'Admissions Open · Shujabad Campus',
    title: 'Learn the skills the internet is actually hiring for.',
    text: 'In-person, project-based training in freelancing, design, marketing and content — until you can earn on your own.',
    cta: { label: 'Explore Courses', to: '/courses' },
    theme: 'banner-a',
  },
  {
    key: 'batch',
    eyebrow: 'New Batches Starting Soon',
    title: 'YouTube Automation & Video Editing — limited seats.',
    text: 'Small batches, real client workflows, and mentors who work in the industry they teach.',
    cta: { label: 'Reserve a Seat', to: '/contact' },
    theme: 'banner-b',
  },
  {
    key: 'earn',
    eyebrow: 'From Shujabad · Paid in Dollars',
    title: 'A degree gets you a queue. A skill gets you a client.',
    text: 'Join hundreds of students already earning from remote clients across the Gulf, Europe and North America.',
    cta: { label: 'Meet the Academy', to: '/about' },
    theme: 'banner-c',
  },
];

export default function HeroBanners() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    if (paused) return undefined;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return undefined;
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer.current);
  }, [paused]);

  const go = (i) => setIndex((i + SLIDES.length) % SLIDES.length);

  return (
    <div
      className="banner-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Academy highlights"
    >
      <div className="banner-viewport">
        {SLIDES.map((s, i) => (
          <div
            key={s.key}
            className={`banner-slide ${s.theme}${i === index ? ' is-active' : ''}`}
            aria-hidden={i !== index}
          >
            <div className="container banner-inner">
              <div className="banner-eyebrow">{s.eyebrow}</div>
              <h2 className="banner-title">{s.title}</h2>
              <p className="banner-text">{s.text}</p>
              <Link to={s.cta.to} className="btn btn-accent banner-cta">{s.cta.label} →</Link>
            </div>
          </div>
        ))}
      </div>

      <button className="banner-arrow banner-prev" aria-label="Previous banner" onClick={() => go(index - 1)}>‹</button>
      <button className="banner-arrow banner-next" aria-label="Next banner" onClick={() => go(index + 1)}>›</button>

      <div className="banner-dots" role="tablist" aria-label="Choose banner">
        {SLIDES.map((s, i) => (
          <button
            key={s.key}
            className={`banner-dot${i === index ? ' is-active' : ''}`}
            aria-label={`Go to banner ${i + 1}`}
            aria-selected={i === index}
            role="tab"
            onClick={() => go(i)}
          />
        ))}
      </div>
    </div>
  );
}
