'use client';

import { useParams } from 'next/navigation';
import { useSiteContent } from '../../use-site-content';
import { slugify } from '../../content';
import { SiteHeader, SiteFooter, useTheme } from '../../site-chrome';
import { BlockRenderer } from '../../block-renderer';

export default function WorkDetailPage() {
  const params = useParams<{ slug: string }>();
  const { content } = useSiteContent();
  const { theme, toggleTheme } = useTheme();
  const slug = params?.slug;

  const item = content.work.find((w) => (w.slug ?? slugify(w.name)) === slug);

  return (
    <>
      <SiteHeader theme={theme} onToggleTheme={toggleTheme} home={false} />
      {item ? (
        <main className="detail-main">
          <a href="/#work" className="detail-back">← Back to work</a>
          {item.thumb && (
            <div className="detail-hero-thumb">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.thumb} alt={`${item.name} homepage screenshot`} />
            </div>
          )}
          <div className="detail-eyebrow">Case study</div>
          <h1 className="detail-title">{item.name}</h1>
          <div className="detail-tags">
            {item.tags.map((t) => <span key={t} className="detail-tag">{t}</span>)}
          </div>
          <p className="detail-desc">{item.desc}</p>
          <div className="detail-cta-row">
            {item.href && (
              <a className="detail-cta" href={item.href} target="_blank" rel="noreferrer">Visit live site ↗</a>
            )}
            <a className="detail-cta secondary" href="/#contact">Get in touch</a>
          </div>
          <BlockRenderer blocks={item.blocks ?? []} />
        </main>
      ) : (
        <div className="detail-notfound">
          <h1>Project not found</h1>
          <p>This work item doesn&apos;t exist or may have been renamed.</p>
          <a className="detail-cta" href="/">Back to home</a>
        </div>
      )}
      <SiteFooter content={content} />
    </>
  );
}
