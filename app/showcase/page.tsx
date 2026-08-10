'use client';

import type { Block } from '../content';
import { useSiteContent } from '../use-site-content';
import { BlockRenderer } from '../block-renderer';
import { SiteFooter, SiteHeader, useTheme } from '../site-chrome';

const pic = (seed: string) => `https://picsum.photos/seed/${seed}/800/450`;

const sampleBlocks: { key: string; label: string; block: Block }[] = [
  {
    key: 'heading2',
    label: 'Heading — H2',
    block: { id: 'h2', type: 'heading', text: 'Section heading', level: 2 },
  },
  {
    key: 'heading3',
    label: 'Heading — H3',
    block: { id: 'h3', type: 'heading', text: 'Subsection heading', level: 3 },
  },
  {
    key: 'paragraph',
    label: 'Paragraph',
    block: {
      id: 'p',
      type: 'paragraph',
      text: 'Body copy. This is what a normal paragraph looks like on a case-study page — regular weight, comfortable line height, muted colour so the headings carry the hierarchy.',
    },
  },
  {
    key: 'image',
    label: 'Image',
    block: {
      id: 'img',
      type: 'image',
      src: pic('showcase-img'),
      alt: 'Example image',
      caption: 'An optional caption shown under the image.',
    },
  },
  {
    key: 'link',
    label: 'Link',
    block: { id: 'link', type: 'link', label: 'Visit the live project', href: '#' },
  },
  {
    key: 'slideshow',
    label: 'Slideshow',
    block: {
      id: 'ss',
      type: 'slideshow',
      images: [
        { src: pic('ss1'), alt: 'Slide 1' },
        { src: pic('ss2'), alt: 'Slide 2' },
        { src: pic('ss3'), alt: 'Slide 3' },
      ],
    },
  },
  {
    key: 'gallery',
    label: 'Gallery',
    block: {
      id: 'g',
      type: 'gallery',
      images: [
        { src: pic('g1'), alt: 'One' },
        { src: pic('g2'), alt: 'Two' },
        { src: pic('g3'), alt: 'Three' },
        { src: pic('g4'), alt: 'Four' },
      ],
      cols: 2,
    },
  },
  {
    key: 'checklist',
    label: 'Checklist',
    block: {
      id: 'cl',
      type: 'checklist',
      items: [
        'Secure checkout with payment gateway',
        'Automated shipping calculators',
        'Inventory management dashboard',
      ],
    },
  },
  {
    key: 'quote',
    label: 'Quote',
    block: {
      id: 'q',
      type: 'quote',
      text: 'It finally feels like our own newsroom instead of a shared document.',
      cite: 'I-Tech School staff',
    },
  },
  {
    key: 'list',
    label: 'List',
    block: {
      id: 'l',
      type: 'list',
      items: ['Custom admin dashboard', 'Structured database', 'Responsive reading experience'],
    },
  },
  { key: 'divider', label: 'Divider', block: { id: 'd', type: 'divider' } },
  {
    key: 'video',
    label: 'Video',
    block: { id: 'v', type: 'video', url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw' },
  },
  {
    key: 'code',
    label: 'Code',
    block: {
      id: 'c',
      type: 'code',
      lang: 'ts',
      code: `export function greeting(name: string) {\n  return \`Hello, \${name}!\`;\n}`,
    },
  },
  {
    key: 'cta',
    label: 'Button (CTA)',
    block: { id: 'cta', type: 'cta', label: 'Get in touch', href: '/#contact' },
  },
  {
    key: 'note',
    label: 'Note',
    block: {
      id: 'n',
      type: 'note',
      text: 'This is an inline note — use it to highlight a caveat or an important detail.',
    },
  },
  {
    key: 'comment',
    label: 'Comment',
    block: {
      id: 'cm',
      type: 'comment',
      text: 'This is a comment block, useful for editorial asides or a personal note.',
      author: 'Youssef',
    },
  },
  {
    key: 'stat',
    label: 'Stat',
    block: { id: 'st', type: 'stat', num: '5+', label: 'years of experience' },
  },
  {
    key: 'columns',
    label: 'Columns — 2-up',
    block: {
      id: 'cols',
      type: 'columns',
      cols: 2,
      columns: [
        [
          { id: 'c1h', type: 'heading', text: 'Feature one', level: 3 },
          { id: 'c1p', type: 'paragraph', text: 'Left column — any blocks you like, including lists and images.' },
          { id: 'c1l', type: 'list', items: ['Point one', 'Point two'] },
        ],
        [
          { id: 'c2h', type: 'heading', text: 'Feature two', level: 3 },
          { id: 'c2p', type: 'paragraph', text: 'Right column. Use this for side-by-side features, specs, or pricing.' },
          { id: 'c2c', type: 'cta', label: 'Get in touch', href: '/#contact' },
        ],
      ],
    },
  },
];

function Frame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="show-frame">
      <h3 className="show-frame-label">{label}</h3>
      <div className="show-frame-body">{children}</div>
    </div>
  );
}

export default function ShowcasePage() {
  const { content } = useSiteContent();
  const { theme, toggleTheme } = useTheme();
  const w = content.work[0];
  const s = content.services[0];
  const step = content.process[0];

  return (
    <>
      <SiteHeader theme={theme} onToggleTheme={toggleTheme} home={false} contactHref="/#contact" />
      <main className="showcase">
        <section className="show-head">
          <p className="show-eyebrow">Component showcase</p>
          <h1>Every element you can use from the admin</h1>
          <p className="show-intro">
            Each block below is rendered exactly as it appears on the site. Hover the buttons and
            pills to preview the interactions. Everything here is editable from{' '}
            <a href="/admin" className="block-link">/admin</a>.
          </p>
        </section>

        <section className="show-group">
          <h2>Buttons</h2>
          <Frame label="Primary (hero CTA)">
            <a className="hero-cta hero-cta-primary" href="/#work">
              {content.heroCtaPrimary}
            </a>
          </Frame>
          <Frame label="Secondary / ghost">
            <a className="hero-cta hero-cta-ghost" href="/#contact">
              {content.heroCtaSecondary}
            </a>
          </Frame>
          <Frame label="Header CTA (small)">
            <a className="hdr-cta" href="/#contact">
              get in touch
            </a>
          </Frame>
          <Frame label="Service card button">
            <a className="cta-btn" href={`/services/${s.slug}`} style={{ display: 'inline-block' }}>
              View details
            </a>
          </Frame>
          <Frame label="Detail page button">
            <a className="detail-cta" href="/#contact">
              Get in touch
            </a>
          </Frame>
          <Frame label="Block CTA">
            <a className="block-cta" href="/#contact">
              Start your project
            </a>
          </Frame>
        </section>

        <section className="show-group">
          <h2>Pills &amp; tags</h2>
          <Frame label="Skill pills">
            <div className="show-pills">
              {content.skills.map((skill) => (
                <span key={skill} className="skill-pill">
                  {skill}
                </span>
              ))}
            </div>
          </Frame>
          <Frame label="Work tags">
            <div className="show-tags">
              {w.tags.map((t) => (
                <span key={t} className="work-tag">
                  {t}
                </span>
              ))}
            </div>
          </Frame>
          <Frame label="Detail tags">
            <div className="show-tags">
              {['Next.js', 'TypeScript', 'Database'].map((t) => (
                <span key={t} className="detail-tag">
                  {t}
                </span>
              ))}
            </div>
          </Frame>
        </section>

        <section className="show-group">
          <h2>Stats</h2>
          <Frame label="Stats strip">
            <div className="show-stats">
              <div className="stats-inner">
                {content.stats.map((st, i) => (
                  <div key={i} className="stat">
                    <span className="stat-num">{st.num}</span>
                    <span className="stat-label">{st.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Frame>
        </section>

        <section className="show-group">
          <h2>Cards</h2>
          <Frame label="Work card">
            <div className="show-grid-2">
              <a href={`/work/${w.slug}`} className="work-card">
                <div className="work-thumb">
                  {w.thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={w.thumb} alt={w.name} />
                  ) : (
                    <div className="work-thumb-ph">{w.name.slice(0, 1)}</div>
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
                  <span className="work-arrow">↗</span>
                </div>
              </a>
            </div>
          </Frame>
          <Frame label="Service card">
            <div className="show-grid-2">
              <div className="svc-card">
                <h3>{s.name}</h3>
                <div className="price">{s.price}</div>
                <div className="price-divider" />
                <p className="desc">{s.desc}</p>
                <a className="cta-btn" href={`/services/${s.slug}`}>
                  View details
                </a>
              </div>
            </div>
          </Frame>
          <Frame label="Process step">
            <div className="show-step">
              <div className="step-dot" />
              <div className="step-num">{step.step}</div>
              <div className="step-name">{step.name}</div>
              <div className="step-desc">{step.desc}</div>
            </div>
          </Frame>
          <Frame label="Contact card">
            <div className="show-grid-2">
              <div className="contact-card">
                <h3>{content.contactTitle}</h3>
                <p className="sub">{content.contactSub}</p>
                <div className="contact-items">
                  <a className="contact-item" href={content.phoneHref} target="_blank" rel="noreferrer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    {content.phone}
                  </a>
                  <a className="contact-item" href={`mailto:${content.email}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-10 6L2 7" />
                    </svg>
                    {content.email}
                  </a>
                </div>
              </div>
            </div>
          </Frame>
        </section>

        <section className="show-group">
          <h2>Section divider</h2>
          <Frame label="Between sections">
            <div className="section-divider" aria-hidden="true" />
          </Frame>
        </section>

        <section className="show-group">
          <h2>Page blocks (from the page builder)</h2>
          <p className="show-intro">
            These are the blocks you add to /work/… and /services/… pages. Each is shown alone so you
            can see exactly how it renders.
          </p>
          {sampleBlocks.map((s) => (
            <Frame key={s.key} label={s.label}>
              <BlockRenderer blocks={[s.block]} />
            </Frame>
          ))}
        </section>

        <section className="show-group">
          <h2>Footer column</h2>
          <Frame label="Footer links">
            <div className="show-footer">
              <div className="ft-col">
                <h4>{content.footerCols[0]?.heading}</h4>
                {content.footerCols[0]?.links.map((l) => (
                  <a key={l.label + l.href} href={l.href}>
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          </Frame>
        </section>
      </main>
      <SiteFooter content={content} home={false} />
    </>
  );
}
