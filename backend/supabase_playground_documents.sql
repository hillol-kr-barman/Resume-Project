create extension if not exists pgcrypto;

create table if not exists public.playground_documents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Untitled snippet',
  content text not null default '',
  language text not null default 'javascript',
  share_token uuid not null unique default gen_random_uuid(),
  is_shared boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_playground_document_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_playground_document_updated_at on public.playground_documents;

create trigger set_playground_document_updated_at
before update on public.playground_documents
for each row execute procedure public.set_playground_document_updated_at();

alter table public.playground_documents enable row level security;

drop policy if exists "Owners can read their own playground documents" on public.playground_documents;
create policy "Owners can read their own playground documents"
on public.playground_documents
for select
to authenticated
using (auth.uid() = owner_id);

drop policy if exists "Owners can create their own playground documents" on public.playground_documents;
create policy "Owners can create their own playground documents"
on public.playground_documents
for insert
to authenticated
with check (auth.uid() = owner_id);

drop policy if exists "Owners can update their own playground documents" on public.playground_documents;
create policy "Owners can update their own playground documents"
on public.playground_documents
for update
to authenticated
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

drop policy if exists "Owners can delete their own playground documents" on public.playground_documents;
create policy "Owners can delete their own playground documents"
on public.playground_documents
for delete
to authenticated
using (auth.uid() = owner_id);

drop policy if exists "Shared playground documents are readable by everyone" on public.playground_documents;
create policy "Shared playground documents are readable by everyone"
on public.playground_documents
for select
to anon, authenticated
using (is_shared = true);
