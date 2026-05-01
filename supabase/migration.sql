-- Run this SQL in your Supabase SQL editor to set up the database

-- TABLES

create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  thumbnail text,
  coach_name text,
  price text,
  featured boolean default false,
  archived boolean default false,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists course_content (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete cascade,
  content_type text not null check (content_type in ('video', 'pdf', 'image', 'link')),
  title text not null,
  content_url text,
  embed_code text,
  sort_order integer default 0,
  created_at timestamp default now()
);

create table if not exists access_tokens (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete cascade,
  token text unique not null,
  active boolean default true,
  usage_limit integer default 1,
  usage_count integer default 0,
  expires_at timestamp null,
  created_at timestamp default now()
);

create table if not exists admin_settings (
  id uuid primary key default gen_random_uuid(),
  admin_pin_hash text not null,
  site_name text,
  hero_title text,
  hero_subtitle text,
  updated_at timestamp default now()
);

create table if not exists token_sessions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id),
  token_id uuid references access_tokens(id),
  session_key text,
  created_at timestamp default now()
);

-- STORAGE BUCKETS (run separately in Supabase Storage UI or via API)
-- Create buckets: course-videos, course-pdfs, course-images, course-thumbnails

-- ROW LEVEL SECURITY (disable for simplicity, or configure as needed)
alter table courses enable row level security;
alter table course_content enable row level security;
alter table access_tokens enable row level security;
alter table admin_settings enable row level security;
alter table token_sessions enable row level security;

-- Allow all reads (public platform)
create policy "public read courses" on courses for select using (true);
create policy "public read content" on course_content for select using (true);
create policy "public read tokens" on access_tokens for select using (true);
create policy "public read settings" on admin_settings for select using (true);
create policy "public read sessions" on token_sessions for select using (true);

-- Allow all writes (admin controls access via PIN, not Supabase auth)
create policy "allow all writes courses" on courses for all using (true) with check (true);
create policy "allow all writes content" on course_content for all using (true) with check (true);
create policy "allow all writes tokens" on access_tokens for all using (true) with check (true);
create policy "allow all writes settings" on admin_settings for all using (true) with check (true);
create policy "allow all writes sessions" on token_sessions for all using (true) with check (true);