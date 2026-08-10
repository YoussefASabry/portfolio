-- Supabase setup for the portfolio CMS
-- Run this once in the Supabase SQL editor when you're ready to switch on
-- database persistence (the "later" step). Then set the two env vars below
-- in .env.local and the admin will start saving to Postgres automatically.

--   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
--   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

create table if not exists public.site_content (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

-- The site reads content anonymously; the admin writes it with the anon key.
create policy "anyone can read site content"
  on public.site_content for select
  using (true);

create policy "anyone can upsert site content"
  on public.site_content for all
  using (true)
  with check (true);

-- NOTE: the write policy above is intentionally permissive for a public
-- portfolio (there's no user login yet). To lock it down later:
--   * add a `secret text` column,
--   * include `secret = '<shared value>'` in the upsert,
--   * replace `using (true) with check (true)` with a check on that column,
-- or gate writes behind Supabase Auth.
