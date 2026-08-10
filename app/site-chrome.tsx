'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { SiteContent } from './content';

/** Scroll-reveal wrapper shared by the homepage and detail pages. */
export function Reveal({
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

export function ThemeToggle({ theme, onToggle }: { theme: string; onToggle: () => void }) {
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

/** Reads/writes the `data-theme` attribute + localStorage, shared by every page. */
export function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useLayoutEffect(() => {
    setTheme(
      document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
    );
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light' : 'dark');
    try {
      localStorage.setItem('theme', theme === 'light' ? 'light' : 'dark');
    } catch {
      /* private mode */
    }
  }, [theme]);

  const toggleTheme = () => {
    document.documentElement.classList.add('theme-switching');
    window.setTimeout(
      () => document.documentElement.classList.remove('theme-switching'),
      250
    );
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
}

/**
 * Nav links. On the homepage these are in-page anchors with scrollspy.
 * On any other page they point back at the homepage sections.
 */
function navLinks(home: boolean) {
  const base = [
    { label: 'Home', href: 'home' },
    { label: 'Work', href: 'work' },
    { label: 'Services', href: 'services' },
    { label: 'About', href: 'about' },
    { label: 'Contact', href: 'contact' },
  ];
  return base.map((l) => ({ label: l.label, href: home ? `#${l.href}` : `/#${l.href}` }));
}

export function SiteHeader({
  theme,
  onToggleTheme,
  home = false,
  contactHref,
}: {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  home?: boolean;
  contactHref?: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = navLinks(home);
  const contact = contactHref ?? (home ? '#contact' : '/#contact');
  const logoHref = home ? '#home' : '/';

  useEffect(() => {
    if (!home) return;
    const ids = ['home', 'work', 'services', 'about', 'contact'];
    const navEls = Array.from(document.querySelectorAll<HTMLAnchorElement>('.nav-link'));
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            navEls.forEach((l) =>
              l.classList.toggle('active', l.getAttribute('href') === `#${e.target.id}`)
            );
          }
        });
      },
      { rootMargin: '-35% 0px -60% 0px' }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [home]);

  useEffect(() => {
    const mobileLinks = document.querySelectorAll('.mobile-menu a');
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => setMenuOpen(false));
    });
  }, [menuOpen]);

  return (
    <>
      <header>
        <div className="hdr">
          <a href={logoHref} className="logo">
            Y.S.
          </a>
          <nav aria-label="Primary">
            {links.map((l) => (
              <a key={l.href} className="nav-link" href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
          <div className="hdr-right">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <a href={contact} className="hdr-cta">
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
        {links.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
        <div className="mobile-theme">
          <span className="mobile-theme-label">
            {theme === 'light' ? 'Light mode' : 'Dark mode'}
          </span>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>
    </>
  );
}

export function SiteFooter({ content, home = false }: { content: SiteContent; home?: boolean }) {
  const fix = (href: string) => (home ? href : href.startsWith('#') ? `/${href}` : href);
  return (
    <footer>
      <div className="ft-inner">
        {content.footerCols.map((col) => (
          <div key={col.heading} className="ft-col">
            <h4>{col.heading}</h4>
            {col.links.map((l) => (
              <a key={l.label + l.href} href={fix(l.href)}>
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
  );
}
