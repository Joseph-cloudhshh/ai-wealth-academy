-- Run this in your Supabase SQL Editor (in addition to migration.sql)

-- Add contact/social columns to admin_settings
alter table admin_settings add column if not exists email text;
alter table admin_settings add column if not exists whatsapp text;
alter table admin_settings add column if not exists telegram text;
alter table admin_settings add column if not exists discord text;
alter table admin_settings add column if not exists instagram text;
alter table admin_settings add column if not exists tiktok text;

-- Reviews table
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  avatar text,
  rating integer default 5 check (rating between 1 and 5),
  text text not null,
  course_name text,
  active boolean default true,
  created_at timestamp default now()
);

-- Contact messages table
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  read boolean default false,
  created_at timestamp default now()
);

-- RLS for new tables
alter table reviews enable row level security;
alter table contact_messages enable row level security;

create policy "public read reviews" on reviews for select using (true);
create policy "allow all writes reviews" on reviews for all using (true) with check (true);
create policy "allow all writes messages" on contact_messages for all using (true) with check (true);
create policy "allow all reads messages" on contact_messages for select using (true);

-- Also make sure courses has free_access column
alter table courses add column if not exists free_access boolean default false;