'use client';

import { useEffect, useState } from 'react';
import { CONTENT_KEY, DEFAULT_CONTENT, type SiteContent } from './content';
import { REMOTE_ROW_ID, REMOTE_TABLE, supabase, supabaseEnabled } from './lib/supabase';

export function loadContent(): SiteContent {
  if (typeof window === 'undefined') return DEFAULT_CONTENT;
  try {
    const raw = window.localStorage.getItem(CONTENT_KEY);
    if (!raw) return DEFAULT_CONTENT;
    return { ...DEFAULT_CONTENT, ...JSON.parse(raw) } as SiteContent;
  } catch {
    return DEFAULT_CONTENT;
  }
}

async function loadRemote(): Promise<SiteContent | null> {
  if (!supabase) {
    console.warn('[CMS] supabase client unavailable:', { supabaseEnabled, type: typeof supabase });
    return null;
  }
  try {
    const { data, error } = await supabase
      .from(REMOTE_TABLE)
      .select('content')
      .eq('id', REMOTE_ROW_ID)
      .maybeSingle();
    if (error) {
      console.error('[CMS] Supabase read error:', error.message);
      return null;
    }
    if (data?.content) {
      return { ...DEFAULT_CONTENT, ...(data.content as Partial<SiteContent>) } as SiteContent;
    }
  } catch (e) {
    console.error('[CMS] loadRemote exception:', e);
  }
  return null;
}

/** Local first, then Supabase if it's configured and reachable. */
export async function loadContentAsync(): Promise<SiteContent> {
  const local = loadContent();
  const remote = await loadRemote();
  return remote ?? local;
}

export async function saveContent(content: SiteContent): Promise<{ ok: boolean; error?: string }> {
  window.localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
  if (!supabase) return { ok: false, error: `Database not connected (supabaseEnabled=${supabaseEnabled}, supabase=${typeof supabase}) — saved locally only` };
  try {
    const { error } = await supabase
      .from(REMOTE_TABLE)
      .upsert(
        { id: REMOTE_ROW_ID, content, updated_at: new Date().toISOString() },
        { onConflict: 'id' }
      );
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Unknown error' };
  }
}

export function clearContent() {
  window.localStorage.removeItem(CONTENT_KEY);
}

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);

  useEffect(() => {
    let active = true;
    loadContentAsync().then((c) => {
      if (active) setContent(c);
    });
    return () => {
      active = false;
    };
  }, []);

  return { content };
}
