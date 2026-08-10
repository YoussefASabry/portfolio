'use client';

import { useEffect, useRef, useState } from 'react';
import { useSiteContent } from './use-site-content';
import { useTheme } from './site-chrome';
import { slugify } from './content';

function Reveal({
  children,
  className = '',
  delay = 0,
  delayMs = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  delayMs?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    io.observe(el);
    const safety = window.setTimeout(() => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) setInView(true);
    }, 2500);
    return () => {
      io.disconnect();
      window.clearTimeout(safety);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`anm${inView ? ' in' : ''}${delay ? ` anm-d${delay}` : ''} ${className}`}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}

function ThemeToggle({ theme, onToggle }: { theme: string; onToggle: () => void }) {
  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      aria-label="Switch theme"
      title="Switch theme"
    >
      <svg className="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
      <svg className="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      </svg>
    </button>
  );
}

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export default function Portfolio() {
  const { content } = useSiteContent();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredPill, setHoveredPill] = useState<number | null>(null);

  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1));
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.nav-link'));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            links.forEach((l) =>
              l.classList.toggle('active', l.getAttribute('href') === `#${e.target.id}`)
            );
          }
        });
      },
      { rootMargin: '-35% 0px -60% 0px' }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const mobileLinks = document.querySelectorAll('.mobile-menu a');
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => setMenuOpen(false));
    });
  }, [menuOpen]);

  const pillStyle = (i: number): React.CSSProperties | undefined => {
    if (hoveredPill === null) return undefined;
    const dist = Math.abs(i - hoveredPill);
    if (dist === 0) {
      return {
        transform: 'scale(1.05)',
        zIndex: 10,
        boxShadow: 'var(--pill-hover-glow)',
      };
    }
    return {
      transform: `scale(${1 - 0.06 * dist})`,
      opacity: 1 - 0.12 * dist,
    };
  };

  return (
    <>
      <header>
        <div className="hdr">
          <a href="#home" className="logo">
            Y.S.
          </a>
          <nav aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <a key={l.href} className="nav-link" href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
          <div className="hdr-right">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <a href="#contact" className="hdr-cta">
              get in touch
            </a>
            <button
              className={`hamburger${menuOpen ? ' active' : ''}`}
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Menu"
              aria-expanded={menuOpen}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        {NAV_LINKS.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
        <div className="mobile-theme">
          <span className="mobile-theme-label">
            {theme === 'light' ? 'Light mode' : 'Dark mode'}
          </span>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </div>

      <main>
        <section className="hero" id="home">
          <div className="hero-left">
            <div className="hero-anm ha-d1">
              <h1 className="hero-name">{content.heroName}</h1>
            </div>
            <div className="hero-anm ha-d2">
              <p className="hero-role">
                {content.heroRole.map((r, i) => (
                  <span key={i} className="glow">
                    {r}
                  </span>
                ))}
              </p>
            </div>
            <div className="hero-anm ha-d3">
              <p className="hero-bio">{content.heroBio}</p>
            </div>
            <div className="hero-anm ha-d4">
              <div className="hero-ctas">
                <a href="#work" className="hero-cta hero-cta-primary">
                  {content.heroCtaPrimary}
                </a>
                <a href="#contact" className="hero-cta hero-cta-ghost">
                  {content.heroCtaSecondary}
                </a>
              </div>
            </div>
            <div className="hero-anm ha-d5">
              <div className="hero-socials">
                <a href="https://github.com/YoussefASabry" target="_blank" rel="noreferrer">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  GitHub
                </a>
                <a href="https://www.linkedin.com/in/youssef-sabry-7a9561389/" target="_blank" rel="noreferrer">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          <div className="hero-right">
            {content.skills.map((skill, i) => (
              <div
                key={skill}
                className={`skill-pill sp${i + 1}`}
                style={pillStyle(i)}
                onMouseEnter={() => setHoveredPill(i)}
                onMouseLeave={() => setHoveredPill(null)}
              >
                {skill}
              </div>
            ))}
          </div>
        </section>

        <section className="stats" aria-label="Experience highlights">
          <div className="stats-inner">
            {content.stats.map((s, i) => (
              <Reveal key={i} delay={i} className="stat">
                <span className="stat-num">{s.num}</span>
                <span className="stat-label">{s.label}</span>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="work-section" id="work">
          <div className="work-header">
            <Reveal>
              <h2 className="work-title">{content.workTitle}</h2>
            </Reveal>
            <Reveal delay={1} className="work-line-wrap">
              <div className="work-line"></div>
            </Reveal>
          </div>
          <div className="work-grid">
            {content.work.map((w, i) => (
              <Reveal key={w.name + i} delay={i + 1}>
                <a href={`/work/${w.slug ?? slugify(w.name)}`} className="work-card">
                  <div className="work-thumb">
                    {w.thumb ? (
                      <img src={w.thumb} alt={`${w.name} homepage screenshot`} loading="lazy" />
                    ) : (
                      <div className="work-thumb-ph">{w.name.charAt(0)}</div>
                    )}
                  </div>
                  <div className="work-card-body">
                    <div className="work-card-top">
                      <h3 className="work-name">{w.name}</h3>
                      <div className="work-tags">
                        {w.tags.map((t) => (
                          <span key={t} className="work-tag">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="work-desc">{w.desc}</p>
                    <span className="work-arrow">&rarr;</span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </section>

        <div className="section-divider" aria-hidden="true" />

        <section className="services" id="services">
          <div className="services-inner">
            <div className="services-left">
              <Reveal>
                <p className="eyebrow">{content.servicesEyebrow}</p>
                <h2>{content.servicesTitle}</h2>
                <p>{content.servicesIntro}</p>
              </Reveal>
            </div>
            <div className="services-right">
              <div className="svc-grid">
                {content.services.map((s, i) => (
                  <Reveal key={s.name + i} delay={(i % 3) + 1}>
                    <div className="svc-card">
                      <h3>{s.name}</h3>
                      <p className="desc">{s.desc}</p>
                      <a href={`/services/${s.slug ?? slugify(s.name)}`} className="cta-btn">
                        Learn More
                      </a>
                      <div className="price-divider"></div>
                      <span className="price">{s.price}</span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
          <div className="services-foot">
            <Reveal>
              <div className="bg-pattern">
                <p>
                  {content.servicesFoot.pre}
                  <a href="#contact" className="contact-link">
                    {content.servicesFoot.link}
                  </a>
                  {content.servicesFoot.post}
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <div className="section-divider" aria-hidden="true" />

        <section className="process-section" id="about">
          <div className="proc-header">
            <Reveal>
              <h2 className="proc-title">{content.processTitle}</h2>
            </Reveal>
            <Reveal delay={1} className="proc-line-wrap">
              <div className="proc-line"></div>
            </Reveal>
          </div>
          <div className="timeline">
            {content.process.map((p, i) => (
              <Reveal
                key={p.step + i}
                delayMs={i * 700}
                className="timeline-step-wrap"
              >
                <div className="timeline-step">
                  <div className="step-dot"></div>
                  <p className="step-num">{p.step}</p>
                  <h3 className="step-name">{p.name}</h3>
                  <p className="step-desc">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <div className="section-divider" aria-hidden="true" />

        <section className="contact-section" id="contact">
          <div className="contact-grid">
            <Reveal>
              <div className="contact-card">
                <h3>{content.contactTitle}</h3>
                <p className="sub">{content.contactSub}</p>
                <div className="contact-items">
                  <a
                    href={content.phoneHref}
                    target="_blank"
                    rel="noreferrer"
                    className="contact-item"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                    </svg>
                    {content.phone}
                  </a>
                  <a href={`mailto:${content.email}`} className="contact-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M22 7l-10 7L2 7" />
                    </svg>
                    {content.email}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer>
        <div className="ft-inner">
          {content.footerCols.map((col) => (
            <div key={col.heading} className="ft-col">
              <h4>{col.heading}</h4>
              {col.links.map((l) => (
                <a key={l.label + l.href} href={l.href}>
                  {l.label}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div className="ft-bottom">
          <p className="ft-copy">{content.footerCopy}</p>
          <div className="ft-socials">
            <a href="https://github.com/YoussefASabry" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/youssef-sabry-7a9561389/" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href={`mailto:${content.email}`}>Email</a>
          </div>
        </div>
      </footer>
    </>
  );
}
