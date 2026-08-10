'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ADMIN_PASSWORD,
  BLOCK_TYPES,
  CONTENT_KEY,
  DEFAULT_CONTENT,
  defaultBlockFor,
  slugify,
  type Block,
  type SiteContent,
  type WorkItem,
  type Service,
  type ProcessStep,
  type Stat,
} from '../content';
import { clearContent, loadContentAsync, saveContent } from '../use-site-content';
import { uploadImage } from '../lib/upload';
import './admin.css';

const AUTH_KEY = 'portfolio-admin-auth';

function Field({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="adm-field">
      <span>{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur ? (e) => onBlur(e.target.value) : undefined}
        placeholder={placeholder}
      />
    </label>
  );
}

function Area({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="adm-field adm-field--full">
      <span>{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} />
    </label>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="adm-section">
      <h2>{title}</h2>
      <div className="adm-grid">{children}</div>
    </section>
  );
}

function AddBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className="adm-add" onClick={onClick}>
      + {label}
    </button>
  );
}

function DelBtn({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="adm-del" onClick={onClick} title="Remove">
      &times;
    </button>
  );
}

function UploadButton({ onUploaded, label = 'Upload image' }: { onUploaded: (url: string) => void; label?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const url = await uploadImage(file);
      onUploaded(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="adm-upload">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <button type="button" className="adm-upload-btn" disabled={busy} onClick={() => inputRef.current?.click()}>
        {busy ? 'Uploading…' : `↥ ${label}`}
      </button>
      {error && <span className="adm-error">{error}</span>}
    </div>
  );
}

function parseLinks(text: string) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, href] = line.split('|').map((s) => s.trim());
      return { label: label || '', href: href || '#' };
    });
}

function linksToText(links: { label: string; href: string }[]) {
  return links.map((l) => `${l.label}|${l.href}`).join('\n');
}

function parseImages(text: string): { src: string; alt: string }[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [src, alt] = line.split('|').map((s) => s.trim());
      return { src: src || '', alt: alt || '' };
    });
}

function imagesToText(images: { src: string; alt: string }[]) {
  return images.map((im) => `${im.src}${im.alt ? '|' + im.alt : ''}`).join('\n');
}

function BlockFields({ block, onChange }: { block: Block; onChange: (next: Block) => void }) {
  switch (block.type) {
    case 'heading':
      return (
        <div className="adm-grid">
          <Field label="Text" value={block.text} onChange={(v) => onChange({ ...block, text: v })} />
          <label className="adm-field">
            <span>Level</span>
            <select
              value={block.level ?? 2}
              onChange={(e) => onChange({ ...block, level: (Number(e.target.value) as 2 | 3) })}
            >
              <option value={2}>H2</option>
              <option value={3}>H3</option>
            </select>
          </label>
        </div>
      );
    case 'paragraph':
      return <Area label="Text" value={block.text} onChange={(v) => onChange({ ...block, text: v })} />;
    case 'image':
      return (
        <>
          <div className="adm-grid">
            <Field label="Image URL" value={block.src} onChange={(v) => onChange({ ...block, src: v })} />
            <Field label="Alt text" value={block.alt} onChange={(v) => onChange({ ...block, alt: v })} />
            <Field
              label="Caption (optional)"
              value={block.caption ?? ''}
              onChange={(v) => onChange({ ...block, caption: v })}
            />
          </div>
          <UploadButton onUploaded={(url) => onChange({ ...block, src: url })} />
        </>
      );
    case 'link':
      return (
        <div className="adm-grid">
          <Field label="Label" value={block.label} onChange={(v) => onChange({ ...block, label: v })} />
          <Field label="URL" value={block.href} onChange={(v) => onChange({ ...block, href: v })} />
        </div>
      );
    case 'slideshow':
      return (
        <>
          <Area
            label="Images — one per line, as url|alt"
            value={imagesToText(block.images)}
            onChange={(v) => onChange({ ...block, images: parseImages(v) })}
            rows={4}
          />
          <UploadButton
            label="Upload and add to slideshow"
            onUploaded={(url) => onChange({ ...block, images: [...block.images, { src: url, alt: '' }] })}
          />
        </>
      );
    case 'gallery':
      return (
        <>
          <Area
            label="Images — one per line, as url|alt"
            value={imagesToText(block.images)}
            onChange={(v) => onChange({ ...block, images: parseImages(v) })}
            rows={4}
          />
          <UploadButton
            label="Upload and add to gallery"
            onUploaded={(url) => onChange({ ...block, images: [...block.images, { src: url, alt: '' }] })}
          />
          <label className="adm-field">
            <span>Columns</span>
            <select
              value={block.cols ?? 2}
              onChange={(e) => onChange({ ...block, cols: (Number(e.target.value) as 2 | 3) })}
            >
              <option value={2}>2</option>
              <option value={3}>3</option>
            </select>
          </label>
        </>
      );
    case 'checklist':
      return (
        <Area
          label="Items — one per line"
          value={block.items.join('\n')}
          onChange={(v) =>
            onChange({ ...block, items: v.split('\n').map((s) => s.trim()).filter(Boolean) })
          }
          rows={4}
        />
      );
    case 'quote':
      return (
        <div className="adm-grid">
          <Area label="Quote text" value={block.text} onChange={(v) => onChange({ ...block, text: v })} />
          <Field
            label="Cite (optional)"
            value={block.cite ?? ''}
            onChange={(v) => onChange({ ...block, cite: v })}
          />
        </div>
      );
    case 'list':
      return (
        <Area
          label="Items — one per line"
          value={block.items.join('\n')}
          onChange={(v) =>
            onChange({ ...block, items: v.split('\n').map((s) => s.trim()).filter(Boolean) })
          }
          rows={4}
        />
      );
    case 'divider':
      return <p className="adm-block-hint">A horizontal divider — no fields to edit.</p>;
    case 'video':
      return (
        <Field
          label="Video URL (YouTube / Vimeo / mp4)"
          value={block.url}
          onChange={(v) => onChange({ ...block, url: v })}
        />
      );
    case 'code':
      return (
        <>
          <Area label="Code" value={block.code} onChange={(v) => onChange({ ...block, code: v })} rows={6} />
          <Field
            label="Language (optional)"
            value={block.lang ?? ''}
            onChange={(v) => onChange({ ...block, lang: v })}
          />
        </>
      );
    case 'cta':
      return (
        <div className="adm-grid">
          <Field label="Button label" value={block.label} onChange={(v) => onChange({ ...block, label: v })} />
          <Field label="Button URL" value={block.href} onChange={(v) => onChange({ ...block, href: v })} />
        </div>
      );
    case 'note':
      return <Area label="Note text" value={block.text} onChange={(v) => onChange({ ...block, text: v })} />;
    case 'comment':
      return (
        <div className="adm-grid">
          <Area label="Comment text" value={block.text} onChange={(v) => onChange({ ...block, text: v })} />
          <Field
            label="Author (optional)"
            value={block.author ?? ''}
            onChange={(v) => onChange({ ...block, author: v })}
          />
        </div>
      );
    case 'stat':
      return (
        <div className="adm-grid">
          <Field label="Number" value={block.num} onChange={(v) => onChange({ ...block, num: v })} />
          <Field label="Label" value={block.label} onChange={(v) => onChange({ ...block, label: v })} />
        </div>
      );
    case 'columns':
      return (
        <>
          <label className="adm-field">
            <span>Columns</span>
            <select
              value={block.cols}
              onChange={(e) => {
                const n = Number(e.target.value) as 2 | 3;
                const colsArr = [...block.columns];
                while (colsArr.length < n) colsArr.push([]);
                onChange({ ...block, cols: n, columns: colsArr.slice(0, n) });
              }}
            >
              <option value={2}>2</option>
              <option value={3}>3</option>
            </select>
          </label>
          <div className="adm-columns">
            {Array.from({ length: block.cols }).map((_, i) => (
              <div key={i} className="adm-column">
                <h4>Column {i + 1}</h4>
                <BlockEditor
                  blocks={block.columns[i] ?? []}
                  onChange={(next) =>
                    onChange({
                      ...block,
                      columns: block.columns.map((c, ci) => (ci === i ? next : c)),
                    })
                  }
                />
              </div>
            ))}
          </div>
        </>
      );
    default:
      return null;
  }
}

function BlockEditor({ blocks, onChange }: { blocks: Block[]; onChange: (blocks: Block[]) => void }) {
  const moveBlock = (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= blocks.length) return;
    const next = [...blocks];
    [next[idx], next[j]] = [next[j], next[idx]];
    onChange(next);
  };
  const removeBlock = (idx: number) => onChange(blocks.filter((_, i) => i !== idx));
  const updateBlock = (idx: number, next: Block) =>
    onChange(blocks.map((b, i) => (i === idx ? next : b)));
  const addBlock = (type: Block['type']) => onChange([...blocks, defaultBlockFor(type)]);

  return (
    <div className="adm-blocks">
      {blocks.length === 0 && <p className="adm-block-hint">No blocks yet — add one below.</p>}
      {blocks.map((b, i) => (
        <div key={b.id} className="adm-block">
          <div className="adm-block-head">
            <span className="adm-block-type">
              {BLOCK_TYPES.find((t) => t.type === b.type)?.label ?? b.type}
            </span>
            <div className="adm-block-controls">
              <button type="button" onClick={() => moveBlock(i, -1)} disabled={i === 0} title="Move up">
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveBlock(i, 1)}
                disabled={i === blocks.length - 1}
                title="Move down"
              >
                ↓
              </button>
              <DelBtn onClick={() => removeBlock(i)} />
            </div>
          </div>
          <BlockFields block={b} onChange={(next) => updateBlock(i, next)} />
        </div>
      ))}
      <div className="adm-block-add">
        {BLOCK_TYPES.map((t) => (
          <button key={t.type} type="button" className="adm-add-block" onClick={() => addBlock(t.type)}>
            + {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => {
    try {
      return sessionStorage.getItem(AUTH_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [draft, setDraft] = useState<SiteContent>(() => {
    try {
      const raw = localStorage.getItem(CONTENT_KEY);
      return raw ? { ...DEFAULT_CONTENT, ...JSON.parse(raw) } : DEFAULT_CONTENT;
    } catch {
      return DEFAULT_CONTENT;
    }
  });

  useEffect(() => {
    let active = true;
    loadContentAsync().then((c) => {
      if (active) setDraft(c);
    });
    return () => {
      active = false;
    };
  }, []);

  const set = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const setWork = (i: number, patch: Partial<WorkItem>) =>
    set('work', draft.work.map((w, idx) => (idx === i ? { ...w, ...patch } : w)));
  const setService = (i: number, patch: Partial<Service>) =>
    set('services', draft.services.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const setStep = (i: number, patch: Partial<ProcessStep>) =>
    set('process', draft.process.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  const setStat = (i: number, patch: Partial<Stat>) =>
    set('stats', draft.stats.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === ADMIN_PASSWORD) {
      try {
        sessionStorage.setItem(AUTH_KEY, '1');
      } catch {
        /* ignore */
      }
      setAuthed(true);
      setError('');
    } else {
      setError('Wrong password.');
    }
  };

  const doSave = () => {
    saveContent(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const doReset = () => {
    if (confirm('Reset all content back to defaults? This deletes your saved edits.')) {
      clearContent();
      setDraft(DEFAULT_CONTENT);
    }
  };

  if (!authed) {
    return (
      <main className="adm-login">
        <form onSubmit={login} className="adm-login-card">
          <h1>Portfolio Admin</h1>
          <label>
            <span>Password</span>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              autoFocus
            />
          </label>
          {error && <p className="adm-error">{error}</p>}
          <button type="submit">Unlock</button>
        </form>
      </main>
    );
  }

  return (
    <main className="adm">
      <div className="adm-top">
        <h1>Edit your portfolio</h1>
        <div className="adm-actions">
          <a href="/showcase" target="_blank" className="adm-view">
            Showcase ↗
          </a>
          <a href="/" target="_blank" className="adm-view">
            View site ↗
          </a>
          <button type="button" className="adm-reset" onClick={doReset}>
            Reset to defaults
          </button>
          <button type="button" className="adm-save" onClick={doSave}>
            {saved ? 'Saved ✓' : 'Save changes'}
          </button>
        </div>
      </div>
      <p className="adm-note">
        Content is saved to the Supabase database (plus a localStorage backup) — everything here is
        live on the site from any device. Images you upload go to Supabase Storage automatically.
        The /admin door is guarded by a simple password, not a real auth system.
      </p>

      <Section title="Hero">
        <Field label="Name" value={draft.heroName} onChange={(v) => set('heroName', v)} />
        <Field
          label="Role line 1"
          value={draft.heroRole[0] ?? ''}
          onChange={(v) => set('heroRole', [v, draft.heroRole[1] ?? ''])}
        />
        <Field
          label="Role line 2"
          value={draft.heroRole[1] ?? ''}
          onChange={(v) => set('heroRole', [draft.heroRole[0] ?? '', v])}
        />
        <Area
          label="Bio (one line per bullet)"
          value={draft.heroBio}
          onChange={(v) => set('heroBio', v)}
          rows={4}
        />
        <Field
          label="Primary CTA"
          value={draft.heroCtaPrimary}
          onChange={(v) => set('heroCtaPrimary', v)}
        />
        <Field
          label="Secondary CTA"
          value={draft.heroCtaSecondary}
          onChange={(v) => set('heroCtaSecondary', v)}
        />
      </Section>

      <Section title="Skill pills (one per line)">
        <Area
          label="Skills"
          value={draft.skills.join('\n')}
          onChange={(v) => set('skills', v.split('\n').map((s) => s.trim()).filter(Boolean))}
          rows={6}
        />
      </Section>

      <Section title="Stats">
        {draft.stats.map((s, i) => (
          <div key={i} className="adm-row">
            <Field
              label="Number"
              value={s.num}
              onChange={(v) => setStat(i, { num: v })}
            />
            <Field
              label="Label"
              value={s.label}
              onChange={(v) => setStat(i, { label: v })}
            />
          </div>
        ))}
      </Section>

      <Section title="My Work">
        <div className="adm-list">
          {draft.work.map((w, i) => {
            const effectiveSlug = w.slug || slugify(w.name || 'untitled');
            return (
              <div key={i} className="adm-card">
                <div className="adm-card-head">
                  <strong>{w.name || 'Untitled project'}</strong>
                  <DelBtn onClick={() => set('work', draft.work.filter((_, idx) => idx !== i))} />
                </div>
                <div className="adm-grid">
                  <Field label="Project name" value={w.name} onChange={(v) => setWork(i, { name: v })} />
                  <Field
                    label="Tags (comma separated)"
                    value={w.tags.join(', ')}
                    onChange={(v) =>
                      setWork(i, { tags: v.split(',').map((t) => t.trim()).filter(Boolean) })
                    }
                  />
                  <Field label="Link (URL)" value={w.href} onChange={(v) => setWork(i, { href: v })} />
                  <Field
                    label="Thumbnail (URL)"
                    value={w.thumb}
                    onChange={(v) => setWork(i, { thumb: v })}
                    placeholder="Leave empty for a letter placeholder"
                  />
                  <UploadButton label="Upload thumbnail" onUploaded={(url) => setWork(i, { thumb: url })} />
                  <Field
                    label="Slug (optional)"
                    value={w.slug ?? ''}
                    onChange={(v) => setWork(i, { slug: v })}
                    onBlur={(v) => setWork(i, { slug: v ? slugify(v) : '' })}
                    placeholder={slugify(w.name || 'untitled')}
                  />
                </div>
                <Area label="Description" value={w.desc} onChange={(v) => setWork(i, { desc: v })} />
                <Area
                  label="Admin notes (optional, not shown on site)"
                  value={w.notes ?? ''}
                  onChange={(v) => setWork(i, { notes: v })}
                  rows={2}
                />
                <div className="adm-page-builder">
                  <div className="adm-page-builder-head">
                    <span className="adm-page-builder-title">Edit page — /work/{effectiveSlug}</span>
                    <a href={`/work/${effectiveSlug}`} target="_blank" rel="noreferrer" className="adm-preview-link">
                      Preview page ↗
                    </a>
                  </div>
                  <BlockEditor blocks={w.blocks ?? []} onChange={(blocks) => setWork(i, { blocks })} />
                </div>
              </div>
            );
          })}
          <AddBtn
            label="Add project"
            onClick={() =>
              set('work', [
                ...draft.work,
                { name: 'New Project', desc: '', tags: [], href: '', thumb: '', slug: '', blocks: [], notes: '' },
              ])
            }
          />
        </div>
      </Section>

      <Section title="Services">
        <Field
          label="Eyebrow"
          value={draft.servicesEyebrow}
          onChange={(v) => set('servicesEyebrow', v)}
        />
        <Field
          label="Heading"
          value={draft.servicesTitle}
          onChange={(v) => set('servicesTitle', v)}
        />
        <Area
          label="Intro"
          value={draft.servicesIntro}
          onChange={(v) => set('servicesIntro', v)}
        />
        <div className="adm-list adm-list--full">
          {draft.services.map((s, i) => {
            const effectiveSlug = s.slug || slugify(s.name || 'untitled');
            return (
              <div key={i} className="adm-card">
                <div className="adm-card-head">
                  <strong>{s.name || 'New service'}</strong>
                  <DelBtn
                    onClick={() => set('services', draft.services.filter((_, idx) => idx !== i))}
                  />
                </div>
                <div className="adm-grid">
                  <Field label="Service name" value={s.name} onChange={(v) => setService(i, { name: v })} />
                  <Field label="Price" value={s.price} onChange={(v) => setService(i, { price: v })} />
                  <Field
                    label="Slug (optional)"
                    value={s.slug ?? ''}
                    onChange={(v) => setService(i, { slug: v })}
                    onBlur={(v) => setService(i, { slug: v ? slugify(v) : '' })}
                    placeholder={slugify(s.name || 'untitled')}
                  />
                </div>
                <Area label="Description" value={s.desc} onChange={(v) => setService(i, { desc: v })} />
                <Area
                  label="Admin notes (optional, not shown on site)"
                  value={s.notes ?? ''}
                  onChange={(v) => setService(i, { notes: v })}
                  rows={2}
                />
                <div className="adm-page-builder">
                  <div className="adm-page-builder-head">
                    <span className="adm-page-builder-title">Edit page — /services/{effectiveSlug}</span>
                    <a
                      href={`/services/${effectiveSlug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="adm-preview-link"
                    >
                      Preview page ↗
                    </a>
                  </div>
                  <BlockEditor blocks={s.blocks ?? []} onChange={(blocks) => setService(i, { blocks })} />
                </div>
              </div>
            );
          })}
          <AddBtn
            label="Add service"
            onClick={() =>
              set('services', [
                ...draft.services,
                { name: 'New Service', desc: '', price: '', slug: '', blocks: [], notes: '' },
              ])
            }
          />
        </div>
      </Section>

      <Section title="Services footer note">
        <Field
          label="Text before link"
          value={draft.servicesFoot.pre}
          onChange={(v) => set('servicesFoot', { ...draft.servicesFoot, pre: v })}
        />
        <Field
          label="Link label"
          value={draft.servicesFoot.link}
          onChange={(v) => set('servicesFoot', { ...draft.servicesFoot, link: v })}
        />
        <Field
          label="Text after link"
          value={draft.servicesFoot.post}
          onChange={(v) => set('servicesFoot', { ...draft.servicesFoot, post: v })}
        />
      </Section>

      <Section title="How I work">
        <Field
          label="Heading"
          value={draft.processTitle}
          onChange={(v) => set('processTitle', v)}
        />
        <div className="adm-list adm-list--full">
          {draft.process.map((p, i) => (
            <div key={i} className="adm-card">
              <div className="adm-card-head">
                <strong>
                  {p.step} · {p.name}
                </strong>
                <DelBtn
                  onClick={() => set('process', draft.process.filter((_, idx) => idx !== i))}
                />
              </div>
              <div className="adm-grid">
                <Field label="Step label" value={p.step} onChange={(v) => setStep(i, { step: v })} />
                <Field label="Step name" value={p.name} onChange={(v) => setStep(i, { name: v })} />
              </div>
              <Field label="Description" value={p.desc} onChange={(v) => setStep(i, { desc: v })} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Contact">
        <Field
          label="Heading"
          value={draft.contactTitle}
          onChange={(v) => set('contactTitle', v)}
        />
        <Field label="Subtitle" value={draft.contactSub} onChange={(v) => set('contactSub', v)} />
        <Field label="Phone (display)" value={draft.phone} onChange={(v) => set('phone', v)} />
        <Field
          label="Phone link (WhatsApp URL)"
          value={draft.phoneHref}
          onChange={(v) => set('phoneHref', v)}
          placeholder="https://wa.me/201001271917"
        />
        <Field label="Email" value={draft.email} onChange={(v) => set('email', v)} />
      </Section>

      <Section title="Footer">
        <div className="adm-list adm-list--full">
          {draft.footerCols.map((col, i) => (
            <div key={i} className="adm-card">
              <div className="adm-card-head">
                <strong>{col.heading || 'Column'}</strong>
                <DelBtn
                  onClick={() => set('footerCols', draft.footerCols.filter((_, idx) => idx !== i))}
                />
              </div>
              <Field
                label="Column heading"
                value={col.heading}
                onChange={(v) =>
                  set(
                    'footerCols',
                    draft.footerCols.map((c, idx) => (idx === i ? { ...c, heading: v } : c))
                  )
                }
              />
              <Area
                label="Links — one per line, as label|url"
                value={linksToText(col.links)}
                onChange={(v) =>
                  set(
                    'footerCols',
                    draft.footerCols.map((c, idx) =>
                      idx === i ? { ...c, links: parseLinks(v) } : c
                    )
                  )
                }
                rows={4}
              />
            </div>
          ))}
          <AddBtn
            label="Add footer column"
            onClick={() =>
              set('footerCols', [...draft.footerCols, { heading: 'New Column', links: [] }])
            }
          />
        </div>
        <Field
          label="Copyright line"
          value={draft.footerCopy}
          onChange={(v) => set('footerCopy', v)}
        />
      </Section>

      <div className="adm-actions adm-actions--bottom">
        <button type="button" className="adm-reset" onClick={doReset}>
          Reset to defaults
        </button>
        <button type="button" className="adm-save" onClick={doSave}>
          {saved ? 'Saved ✓' : 'Save changes'}
        </button>
      </div>
    </main>
  );
}
