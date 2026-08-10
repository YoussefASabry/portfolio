import { createClient } from '@supabase/supabase-js';

/**
 * Optional Supabase persistence for the portfolio CMS.
 *
 * The site keeps working purely on localStorage when these env vars are not
 * set. To turn the database on, create a Supabase project, run
 * `supabase/schema.sql` in its SQL editor, then set both vars in `.env.local`:
 *
 *   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseEnabled = Boolean(url && anonKey);

export const supabase = supabaseEnabled
  ? createClient(url as string, anonKey as string)
  : null;

export const REMOTE_TABLE = 'site_content';
export const REMOTE_ROW_ID = 'main';
