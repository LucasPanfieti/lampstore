-- LampStore Database Schema
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (mirrors Supabase auth.users)
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Stores table
create table public.stores (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  slug text not null unique,
  whatsapp text,
  bio text,
  theme_color text default '#f97316' not null,
  button_color text default '#f97316' not null,
  logo_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Products table
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  store_id uuid references public.stores(id) on delete cascade not null,
  name text not null,
  slug text not null,
  price decimal(10,2) not null default 0,
  description text,
  image_url text,
  active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(store_id, slug)
);

-- Analytics table
create table public.analytics (
  id uuid default uuid_generate_v4() primary key,
  store_id uuid references public.stores(id) on delete cascade not null,
  event_type text not null,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for performance
create index stores_user_id_idx on public.stores(user_id);
create index stores_slug_idx on public.stores(slug);
create index products_store_id_idx on public.products(store_id);
create index analytics_store_id_idx on public.analytics(store_id);
create index analytics_created_at_idx on public.analytics(created_at);
create index analytics_event_type_idx on public.analytics(event_type);

-- Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.stores enable row level security;
alter table public.products enable row level security;
alter table public.analytics enable row level security;

-- Users RLS policies
create policy "Users can view their own data"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update their own data"
  on public.users for update
  using (auth.uid() = id);

-- Stores RLS policies
create policy "Anyone can view stores"
  on public.stores for select
  to anon, authenticated
  using (true);

create policy "Users can create their own stores"
  on public.stores for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own stores"
  on public.stores for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can delete their own stores"
  on public.stores for delete
  to authenticated
  using (auth.uid() = user_id);

-- Products RLS policies
create policy "Anyone can view active products"
  on public.products for select
  to anon, authenticated
  using (active = true);

create policy "Store owners can view all their products"
  on public.products for select
  to authenticated
  using (
    exists (
      select 1 from public.stores
      where stores.id = products.store_id
      and stores.user_id = auth.uid()
    )
  );

create policy "Store owners can create products"
  on public.products for insert
  to authenticated
  with check (
    exists (
      select 1 from public.stores
      where stores.id = products.store_id
      and stores.user_id = auth.uid()
    )
  );

create policy "Store owners can update their products"
  on public.products for update
  to authenticated
  using (
    exists (
      select 1 from public.stores
      where stores.id = products.store_id
      and stores.user_id = auth.uid()
    )
  );

create policy "Store owners can delete their products"
  on public.products for delete
  to authenticated
  using (
    exists (
      select 1 from public.stores
      where stores.id = products.store_id
      and stores.user_id = auth.uid()
    )
  );

-- Analytics RLS policies
create policy "Anyone can insert analytics"
  on public.analytics for insert
  to anon, authenticated
  with check (true);

create policy "Store owners can view their analytics"
  on public.analytics for select
  to authenticated
  using (
    exists (
      select 1 from public.stores
      where stores.id = analytics.store_id
      and stores.user_id = auth.uid()
    )
  );

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

-- Trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Storage bucket for product images
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Storage policies for product images
create policy "Anyone can view product images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

create policy "Authenticated users can upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

create policy "Authenticated users can update product images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images');

create policy "Authenticated users can delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');
