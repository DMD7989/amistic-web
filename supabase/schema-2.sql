-- Deuxième partie : équipe, actualités, messages de contact et abonnés à la newsletter.
-- À exécuter une seule fois dans Supabase : SQL Editor > New query > Run
-- (après schema.sql)

-- Équipe
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  image_url text,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

-- Actualités
create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  text text not null,
  image_url text,
  published_at date not null default current_date,
  created_at timestamptz not null default now()
);

-- Messages envoyés depuis le formulaire de contact
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 5 and 200 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  message text not null check (char_length(message) between 1 and 2000),
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- Abonnés à la newsletter
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (char_length(email) between 5 and 200 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  created_at timestamptz not null default now()
);

alter table public.team_members enable row level security;
alter table public.news enable row level security;
alter table public.messages enable row level security;
alter table public.subscribers enable row level security;

-- Équipe et actualités : lecture publique, écriture réservée aux admins
create policy "Lecture publique de l'équipe" on public.team_members for select using (true);
create policy "Les admins ajoutent des membres" on public.team_members for insert to authenticated with check (true);
create policy "Les admins modifient les membres" on public.team_members for update to authenticated using (true) with check (true);
create policy "Les admins suppriment des membres" on public.team_members for delete to authenticated using (true);

create policy "Lecture publique des actualités" on public.news for select using (true);
create policy "Les admins ajoutent des actualités" on public.news for insert to authenticated with check (true);
create policy "Les admins modifient les actualités" on public.news for update to authenticated using (true) with check (true);
create policy "Les admins suppriment des actualités" on public.news for delete to authenticated using (true);

-- Messages : tout le monde peut en envoyer, seuls les admins peuvent les lire
create policy "Envoi d'un message" on public.messages for insert to anon, authenticated with check (true);
create policy "Les admins lisent les messages" on public.messages for select to authenticated using (true);
create policy "Les admins modifient les messages" on public.messages for update to authenticated using (true) with check (true);
create policy "Les admins suppriment les messages" on public.messages for delete to authenticated using (true);

-- Abonnés : tout le monde peut s'inscrire, seuls les admins peuvent voir la liste
create policy "Inscription à la newsletter" on public.subscribers for insert to anon, authenticated with check (true);
create policy "Les admins lisent les abonnés" on public.subscribers for select to authenticated using (true);
create policy "Les admins suppriment des abonnés" on public.subscribers for delete to authenticated using (true);
