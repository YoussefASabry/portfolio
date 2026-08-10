'use client';

import { useParams } from 'next/navigation';
import { useSiteContent } from '../../use-site-content';
import { slugify } from '../../content';
import { SiteHeader, SiteFooter, useTheme } from '../../site-chrome';
import { BlockRenderer } from '../../block-renderer';

export default function ServiceDetailPage() {
  const params = useParams<{ slug: string }>();
  const { content } = useSiteContent();
  const { theme, toggleTheme } = useTheme();
  const slug = params?.slug;

  const item = content.services.find((s) => (s.slug ?? slugify(s.name)) === slug);

  return (
    <>
      <SiteHeader theme={theme} onToggleTheme={toggleTheme} home={false} />
      {item ? (
        <main className="detail-main">
          <a href="/#services" className="detail-back">← Back to services</a>
          <div className="detail-eyebrow">Service</div>
          <h1 className="detail-title">{item.name}</h1>
          <div className="detail-price">{item.price}</div>
          <p className="detail-desc">{item.desc}</p>
          <div className="detail-cta-row">
            <a className="detail-cta" href="/#contact">Get in touch</a>
          </div>
          <BlockRenderer blocks={item.blocks ?? []} />
        </main>
      ) : (
        <div className="detail-notfound">
          <h1>Service not found</h1>
          <p>This service doesn&apos;t exist or may have been renamed.</p>
          <a className="detail-cta" href="/">Back to home</a>
        </div>
      )}
      <SiteFooter content={content} />
    </>
  );
}
