'use client';

import { useState } from 'react';
import type { Block } from './content';

/** Renders a single content block. Shared by /work/[slug] and /services/[slug]. */
function VideoEmbed({ url }: { url: string }) {
  if (!url) return null;
  let src = '';
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/);
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (yt) src = `https://www.youtube.com/embed/${yt[1]}`;
  else if (vimeo) src = `https://player.vimeo.com/video/${vimeo[1]}`;
  else src = url;
  return (
    <div className="block-video">
      <iframe
        src={src}
        title="Video"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

function Slideshow({ images }: { images: { src: string; alt: string }[] }) {
  const [i, setI] = useState(0);
  if (!images.length) return null;
  const go = (delta: number) => setI((prev) => (prev + delta + images.length) % images.length);
  return (
    <div className="block-slideshow" role="region" aria-roledescription="carousel" aria-label="Image slideshow">
      <div className="block-slideshow-frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[i].src} alt={images[i].alt || `Slide ${i + 1}`} />
        {images.length > 1 && (
          <>
            <button type="button" className="ss-arrow ss-prev" aria-label="Previous slide" onClick={() => go(-1)}>‹</button>
            <button type="button" className="ss-arrow ss-next" aria-label="Next slide" onClick={() => go(1)}>›</button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="ss-dots" role="tablist" aria-label="Slide picker">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={idx === i}
              aria-label={`Go to slide ${idx + 1}`}
              className={`ss-dot${idx === i ? ' active' : ''}`}
              onClick={() => setI(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="block-stack">
      {blocks.map((b) => {
        switch (b.type) {
          case 'heading': {
            const Tag = b.level === 3 ? 'h3' : 'h2';
            return <Tag key={b.id} className="block-heading">{b.text}</Tag>;
          }
          case 'paragraph':
            return <p key={b.id} className="block-paragraph">{b.text}</p>;
          case 'image':
            return (
              <figure key={b.id} className="block-image">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.src} alt={b.alt} loading="lazy" />
                {b.caption && <figcaption>{b.caption}</figcaption>}
              </figure>
            );
          case 'link':
            return (
              <p key={b.id} className="block-link-wrap">
                <a className="block-link" href={b.href} target="_blank" rel="noreferrer">{b.label}</a>
              </p>
            );
          case 'slideshow':
            return <Slideshow key={b.id} images={b.images} />;
          case 'gallery':
            return (
              <div key={b.id} className="block-gallery" style={{ ['--gcols' as string]: String(b.cols ?? 2) }}>
                {b.images.map((img, idx) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={idx} src={img.src} alt={img.alt} loading="lazy" />
                ))}
              </div>
            );
          case 'checklist':
            return (
              <ul key={b.id} className="block-checklist">
                {b.items.map((it, idx) => (
                  <li key={idx}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3 8.5 6.5 12 13 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            );
          case 'quote':
            return (
              <blockquote key={b.id} className="block-quote">
                <p>“{b.text}”</p>
                {b.cite && <cite>— {b.cite}</cite>}
              </blockquote>
            );
          case 'list':
            return (
              <ul key={b.id} className="block-list">
                {b.items.map((it, idx) => <li key={idx}>{it}</li>)}
              </ul>
            );
          case 'divider':
            return <hr key={b.id} className="block-divider" />;
          case 'video':
            return <VideoEmbed key={b.id} url={b.url} />;
          case 'code':
            return (
              <pre key={b.id} className="block-code">
                {b.lang && <span className="block-code-lang">{b.lang}</span>}
                <code>{b.code}</code>
              </pre>
            );
          case 'cta':
            return (
              <p key={b.id} className="block-cta-wrap">
                <a className="block-cta" href={b.href}>{b.label}</a>
              </p>
            );
          case 'note':
            return (
              <div key={b.id} className="block-note">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 9v4M12 16.5h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                </svg>
                <p>{b.text}</p>
              </div>
            );
          case 'comment':
            return (
              <div key={b.id} className="block-comment">
                <p>{b.text}</p>
                {b.author && <span className="block-comment-author">— {b.author}</span>}
              </div>
            );
          case 'stat':
            return (
              <div key={b.id} className="block-stat">
                <span className="block-stat-num">{b.num}</span>
                <span className="block-stat-label">{b.label}</span>
              </div>
            );
          case 'columns':
            return (
              <div key={b.id} className="block-columns" style={{ ['--gcols' as string]: String(b.cols ?? 2) }}>
                {b.columns.map((colBlocks, idx) => (
                  <div key={idx} className="block-column">
                    <BlockRenderer blocks={colBlocks} />
                  </div>
                ))}
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
