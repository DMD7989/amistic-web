# Configurer le back-office (Supabase)

Tant que ces étapes ne sont pas faites, le site affiche des contenus d'exemple et le back-office indique « non configuré ».

## Installation (une seule fois)

1. Créer un compte gratuit sur https://supabase.com puis un nouveau projet.
2. **SQL Editor > New query** : coller le contenu de `schema.sql`, cliquer **Run**.
3. Refaire la même chose avec `schema-2.sql` (équipe, actualités, messages, abonnés),
   puis avec `schema-3.sql` (partenaires).
4. **Project Settings > API Keys** : copier l'**URL du projet** et la clé **publishable** dans `src/app/supabase.config.ts`.
5. **Authentication > Sign In / Providers > Email** : désactiver **Allow new users to sign up**
   (sinon n'importe qui pourrait créer un compte et modifier le site).
6. **Authentication > Users > Add user > Create new user** : un compte (email + mot de passe) par administrateur,
   avec « Auto Confirm User » coché.

## Utilisation

Connexion sur `/admin/login`. Le back-office permet de gérer :

- **Activités**, **Équipe**, **Actualités** : ajouter, modifier, supprimer, avec photo.
- **Partenaires** : nom, logo et site web ; les logos s'affichent sur l'accueil (la section disparaît s'il n'y en a aucun).
- **Messages** : messages envoyés depuis le formulaire de contact (les non lus ont un trait orange).
- **Abonnés** : adresses inscrites à la newsletter, avec un bouton pour copier toutes les adresses.

Tout utilisateur créé à l'étape 6 est administrateur.

## Sécurité

- La clé `publishable` est publique par conception ; la sécurité repose sur les règles des fichiers `.sql`.
- Ne jamais mettre la clé `secret` / `service_role` dans le site.
- Le formulaire de contact a un champ piège contre les robots et des limites de taille côté base.
  Si le site reçoit beaucoup de courrier indésirable, ajouter un CAPTCHA.

## Mise en ligne (Netlify, gratuit)

1. Mettre le dossier `amistic-web` sur GitHub (le fichier `.gitignore` exclut déjà `node_modules` et `dist`).
2. Sur https://netlify.com : **Add new site > Import an existing project**, choisir le dépôt.
   Le fichier `netlify.toml` règle la commande de build (`npm run build`) et le dossier publié.
3. Ajouter ensuite un nom de domaine (ex. `amistic.ml`) dans **Domain management**.
