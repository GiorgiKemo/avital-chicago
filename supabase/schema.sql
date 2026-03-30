create extension if not exists pgcrypto;

create table if not exists public.quote_submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  pickup_location text,
  dropoff_location text,
  passengers integer,
  event_date date,
  event_type text,
  service_type text,
  vehicle_type text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.quote_submissions enable row level security;

create table if not exists public.site_media_slots (
  slot_key text primary key,
  bucket_path text not null,
  alt_text text,
  updated_by_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_site_media_slots_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_site_media_slots_updated_at on public.site_media_slots;
create trigger set_site_media_slots_updated_at
before update on public.site_media_slots
for each row
execute function public.set_site_media_slots_updated_at();

alter table public.site_media_slots enable row level security;

create table if not exists public.site_media_galleries (
  page_key text not null,
  position integer not null,
  bucket_path text not null,
  alt_text text,
  updated_by_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (page_key, position)
);

create or replace function public.set_site_media_galleries_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_site_media_galleries_updated_at on public.site_media_galleries;
create trigger set_site_media_galleries_updated_at
before update on public.site_media_galleries
for each row
execute function public.set_site_media_galleries_updated_at();

alter table public.site_media_galleries enable row level security;

drop policy if exists "public can insert quote submissions" on public.quote_submissions;
drop policy if exists "authenticated users can read quote submissions" on public.quote_submissions;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'media',
  'media',
  true,
  15728640,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'image/avif'
  ]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;
