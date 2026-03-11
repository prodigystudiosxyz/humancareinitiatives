-- Human Care Initiative - Database Schema

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 0. CLEANUP (Standard reset)
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

drop table if exists public.site_settings cascade;
drop table if exists public.magazine_posts cascade;
drop table if exists public.impact_gallery cascade;
drop table if exists public.impact_reports cascade;
drop table if exists public.impact_stories cascade;
drop table if exists public.donations cascade;
drop table if exists public.appeals cascade;
drop table if exists public.subprojects cascade;
drop table if exists public.projects cascade;
drop table if exists public.profiles cascade;

-- 1. PROFILES / USERS
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  is_admin boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for profiles
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- 2. PROJECTS
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.projects enable row level security;
create policy "Projects are viewable by everyone." on projects for select using (true);
create policy "Only admins can insert projects." on projects for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);
create policy "Only admins can update projects." on projects for update using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);
create policy "Only admins can delete projects." on projects for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);

-- 3. SUBPROJECTS
create table public.subprojects (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  title text not null,
  slug text unique not null,
  summary text not null,
  description text,
  thumbnail_url text,
  category text not null check (category in ('sustainable', 'emergency')),
  raised numeric default 0 not null,
  goal numeric default 0 not null,
  progress numeric generated always as (
    case when goal > 0 then (raised / goal) * 100 else 0 end
  ) stored,
  is_featured_campaign boolean default false not null, -- For the 2 featured campaigns on Landing page
  is_landing_project boolean default false not null, -- For the 3 projects in the ProjectsSection
  is_navbar_project boolean default false not null, -- For the 3 projects in the Top Navbar
  custom_tagline text, -- E.g. "Most urgent now" for featured campaigns
  short_description text, -- For featured campaigns
  locations text[], -- Array of districts for the map
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.subprojects enable row level security;
create policy "Subprojects are viewable by everyone." on subprojects for select using (true);
create policy "Only admins can insert subprojects." on subprojects for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);
create policy "Only admins can update subprojects." on subprojects for update using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);
create policy "Only admins can delete subprojects." on subprojects for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);

-- 4. APPEALS
create table public.appeals (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique not null,
  description text,
  image_url text,
  is_urgent boolean default false not null,
  raised numeric default 0 not null,
  goal numeric default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.appeals enable row level security;
create policy "Appeals are viewable by everyone." on appeals for select using (true);
create policy "Only admins can insert appeals." on appeals for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);
create policy "Only admins can update appeals." on appeals for update using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);
create policy "Only admins can delete appeals." on appeals for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);

-- 5. DONATIONS
create table public.donations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete set null,
  donor_name text,
  donor_email text,
  type text not null check (type in ('zakat', 'sadaqah', 'appeal', 'project')),
  target_id uuid, -- Can be an appeal ID or subproject ID
  amount numeric not null check (amount > 0),
  status text not null default 'completed',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.donations enable row level security;
create policy "Admins can view all donations." on donations for select using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);
create policy "Users can view own donations." on donations for select using (auth.uid() = user_id);
create policy "Anyone can insert a donation." on donations for insert with check (true);

-- 6. IMPACT STORIES ("Why we do what we do" cards)
create table public.impact_stories (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  image_url text not null,
  content text not null, -- Stores text or HTML snippet
  display_order integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.impact_stories enable row level security;
create policy "Impact stories are viewable by everyone." on impact_stories for select using (true);
create policy "Only admins can manage impact stories." on impact_stories for all using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);

-- 7. IMPACT REPORTS
create table public.impact_reports (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  file_url text not null,
  year integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.impact_reports enable row level security;
create policy "Impact reports are viewable by everyone." on impact_reports for select using (true);
create policy "Only admins can manage impact reports." on impact_reports for all using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);

-- 8. IMPACT GALLERY
create table public.impact_gallery (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  video_url text not null, -- YouTube link
  thumbnail_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.impact_gallery enable row level security;
create policy "Impact gallery is viewable by everyone." on impact_gallery for select using (true);
create policy "Only admins can manage impact gallery." on impact_gallery for all using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);

-- 9. MAGAZINE POSTS
create table public.magazine_posts (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique not null,
  content text not null, -- Markdown content
  thumbnail_url text,
  author_id uuid references public.profiles(id) on delete set null,
  published_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.magazine_posts enable row level security;
create policy "Magazine posts are viewable by everyone." on magazine_posts for select using (true);
create policy "Only admins can manage magazine posts." on magazine_posts for all using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);

-- 10. SITE SETTINGS
create table public.site_settings (
    id text primary key,
    value jsonb not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.site_settings enable row level security;
create policy "Site settings are viewable by everyone." on site_settings for select using (true);
create policy "Only admins can manage site settings." on site_settings for all using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);

-- 11. VOLUNTEER APPLICATIONS
create table public.volunteer_applications (
  id uuid default uuid_generate_v4() primary key,
  full_name text not null,
  email text not null,
  phone text not null,
  interest text not null,
  availability text not null,
  status text default 'pending' not null check (status in ('pending', 'reviewed', 'accepted', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.volunteer_applications enable row level security;
create policy "Only admins can view volunteer applications." on volunteer_applications for select using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);
create policy "Anyone can submit a volunteer application." on volunteer_applications for insert with check (true);
create policy "Only admins can manage volunteer applications." on volunteer_applications for all using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);

-- 12. CONTACT MESSAGES
create table public.contact_messages (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text default 'unread' not null check (status in ('unread', 'read', 'replied')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.contact_messages enable row level security;
create policy "Only admins can view contact messages." on contact_messages for select using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);
create policy "Anyone can send a contact message." on contact_messages for insert with check (true);
create policy "Only admins can manage contact messages." on contact_messages for all using (
  exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);

-- Set up storage buckets
insert into storage.buckets (id, name, public) values ('media', 'media', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('documents', 'documents', true) on conflict do nothing;

-- Storage Policies cleanup
drop policy if exists "Public Access to Media" on storage.objects;
drop policy if exists "Admin Upload to Media" on storage.objects;
drop policy if exists "Admin Update Media" on storage.objects;
drop policy if exists "Admin Delete Media" on storage.objects;

drop policy if exists "Public Access to Documents" on storage.objects;
drop policy if exists "Admin Upload to Documents" on storage.objects;
drop policy if exists "Admin Update Documents" on storage.objects;
drop policy if exists "Admin Delete Documents" on storage.objects;

create policy "Public Access to Media" on storage.objects for select using (bucket_id = 'media');
create policy "Admin Upload to Media" on storage.objects for insert with check (
  bucket_id = 'media' and exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);
create policy "Admin Update Media" on storage.objects for update using (
  bucket_id = 'media' and exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);
create policy "Admin Delete Media" on storage.objects for delete using (
  bucket_id = 'media' and exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);

create policy "Public Access to Documents" on storage.objects for select using (bucket_id = 'documents');
create policy "Admin Upload to Documents" on storage.objects for insert with check (
  bucket_id = 'documents' and exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);
create policy "Admin Update Documents" on storage.objects for update using (
  bucket_id = 'documents' and exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);
create policy "Admin Delete Documents" on storage.objects for delete using (
  bucket_id = 'documents' and exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
);

-- Profile trigger
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, is_admin)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', false);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
