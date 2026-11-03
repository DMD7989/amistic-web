-- À exécuter une seule fois dans Supabase : SQL Editor > New query > Run

-- Table des activités
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  text text not null,
  image_url text,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.activities enable row level security;

-- Tout le monde peut lire les activités (site public)
create policy "Lecture publique des activités"
  on public.activities for select
  using (true);

-- Seuls les administrateurs connectés peuvent ajouter, modifier ou supprimer
create policy "Les admins ajoutent des activités"
  on public.activities for insert
  to authenticated
  with check (true);

create policy "Les admins modifient les activités"
  on public.activities for update
  to authenticated
  using (true) with check (true);

create policy "Les admins suppriment les activités"
  on public.activities for delete
  to authenticated
  using (true);

-- Dossier de stockage des photos (lecture publique)
insert into storage.buckets (id, name, public)
values ('activities', 'activities', true)
on conflict (id) do nothing;

create policy "Lecture publique des photos"
  on storage.objects for select
  using (bucket_id = 'activities');

create policy "Les admins envoient des photos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'activities');

create policy "Les admins modifient les photos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'activities');

create policy "Les admins suppriment les photos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'activities');

-- Activités de départ (facultatif : supprime ce bloc si tu préfères partir de zéro)
insert into public.activities (title, text, position) values
  ('Initiation', 'Ateliers pratiques de bureautique, d''internet et de messagerie pour les débutants.', 1),
  ('Sensibilisation', 'Sécurité en ligne, protection des données personnelles et lutte contre la désinformation.', 2),
  ('Formation', 'Sessions destinées aux jeunes, aux femmes et aux professionnels.', 3),
  ('Écoles et communautés', 'Interventions dans les établissements et les quartiers pour rapprocher le numérique de la population.', 4),
  ('Partenariats', 'Collaboration avec les institutions, les ONG et les entreprises.', 5),
  ('Innovation', 'Rencontres et projets pour encourager l''entrepreneuriat numérique local.', 6);
