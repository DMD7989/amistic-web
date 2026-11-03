-- Troisième partie : partenaires (logos affichés sur l'accueil).
-- À exécuter une seule fois dans Supabase : SQL Editor > New query > Run
-- (après schema.sql et schema-2.sql)

create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  website text,
  image_url text,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.partners enable row level security;

create policy "Lecture publique des partenaires" on public.partners for select using (true);
create policy "Les admins ajoutent des partenaires" on public.partners for insert to authenticated with check (true);
create policy "Les admins modifient les partenaires" on public.partners for update to authenticated using (true) with check (true);
create policy "Les admins suppriment des partenaires" on public.partners for delete to authenticated using (true);
