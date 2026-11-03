# AMISTIC – site web

Site public et back-office de l'Association Malienne pour l'Initiation et Sensibilisation aux TIC.

- **Front** : Angular 22 (composants standalone, signals, OnPush, routes chargées à la demande)
- **Données et authentification** : Supabase (PostgreSQL + règles RLS, Auth, Storage)
- **Hébergement** : Netlify (`netlify.toml`)

## Démarrage

```bash
npm install
npm start          # http://localhost:4200
```

## Commandes

| Commande               | Rôle                                  |
| ---------------------- | ------------------------------------- |
| `npm run build`        | Compilation de production (`dist/`)  |
| `npm run lint`         | Analyse du code (ESLint)              |
| `npm test`             | Tests unitaires (Vitest)              |
| `npm run format`       | Mise en forme (Prettier)              |

La CI GitHub (`.github/workflows/ci.yml`) exécute lint, tests et build à chaque modification.

## Structure

```
src/app/
  pages/        pages publiques (accueil, à propos, activités, équipe, actualités, contact)
  admin/        back-office (connexion, menu latéral, listes, messages, abonnés)
  collection.ts accès générique à une table Supabase (lecture, ajout, image, suppression)
  *.service.ts  un service par table (activités, équipe, actualités, partenaires, messages)
  seo.ts        balises de référencement et d'aperçu de partage
  site.config.ts coordonnées de l'association, liens Facebook/WhatsApp, adresse du site
supabase/       schémas SQL et guide de configuration (LISEZMOI.md)
```

## Configuration

1. Suivre `supabase/LISEZMOI.md` (projet Supabase, scripts SQL, comptes administrateurs).
2. Renseigner `src/app/site.config.ts` : coordonnées, Facebook, WhatsApp et **adresse définitive du site** (aussi dans `src/index.html`, `public/robots.txt` et `public/sitemap.xml`).
3. Déployer sur Netlify : la commande de build et le dossier publié sont déjà dans `netlify.toml`, ainsi que les en-têtes de sécurité (CSP, anti-iframe, etc.).

## Sécurité

- La clé Supabase « publishable » est publique par conception ; la protection repose sur les règles RLS (`supabase/schema*.sql`) : lecture publique du contenu, écriture réservée aux administrateurs connectés.
- Inscriptions Supabase désactivées : les administrateurs sont créés depuis le tableau de bord.
- Si le domaine change, ajouter le nouveau domaine dans les URL autorisées de Supabase et mettre à jour la CSP de `netlify.toml` si de nouveaux services sont utilisés.
