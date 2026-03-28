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

drop policy if exists "public can insert quote submissions" on public.quote_submissions;
drop policy if exists "authenticated users can read quote submissions" on public.quote_submissions;
