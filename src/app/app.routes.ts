import { inject } from '@angular/core';
import { ResolveFn, Routes } from '@angular/router';
import { adminGuard } from './admin/admin-guard';
import { NewsService } from './news.service';

const collection = () => import('./admin/admin-collection').then((m) => m.AdminCollection);
const inbox = () => import('./admin/admin-inbox').then((m) => m.AdminInbox);

// Titre de l'onglet = titre de l'article
const newsTitle: ResolveFn<string> = async (route) => {
  const article = await inject(NewsService).getById(route.paramMap.get('id') ?? '');
  return article ? `${article.title} – AMISTIC` : 'Actualité introuvable – AMISTIC';
};

// Toutes les pages sont chargées à la demande (lazy loading) pour garder un démarrage rapide.
// data.description : texte affiché par Google sous le titre de la page
// data.noindex : page à ne pas référencer (administration, erreur 404)
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home').then((m) => m.Home),
    title: 'AMISTIC – Rendre les TIC accessibles à tous',
    data: {
      description:
        "AMISTIC, Association Malienne pour l'Initiation et la Sensibilisation aux TIC : ateliers, formations et sensibilisation au numérique au Mali.",
    },
  },
  {
    path: 'a-propos',
    loadComponent: () => import('./pages/about').then((m) => m.About),
    title: 'À propos – AMISTIC',
    data: {
      description:
        "Découvrez la mission, la vision et les valeurs d'AMISTIC, association malienne pour l'initiation et la sensibilisation aux TIC.",
    },
  },
  {
    path: 'nos-actions',
    loadComponent: () => import('./pages/actions').then((m) => m.Actions),
    title: 'Nos activités – AMISTIC',
    data: {
      description:
        "Initiation, sensibilisation, formation, partenariats : toutes les activités d'AMISTIC pour rendre les TIC accessibles à tous.",
    },
  },
  {
    path: 'equipe',
    loadComponent: () => import('./pages/team').then((m) => m.Team),
    title: 'Équipe – AMISTIC',
    data: { description: "Rencontrez les membres du bureau d'AMISTIC." },
  },
  {
    path: 'actualites',
    loadComponent: () => import('./pages/news').then((m) => m.News),
    title: 'Actualités – AMISTIC',
    data: { description: "Les dernières actualités et événements d'AMISTIC." },
  },
  {
    path: 'actualites/:id',
    loadComponent: () => import('./pages/news-detail').then((m) => m.NewsDetail),
    title: newsTitle,
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact').then((m) => m.Contact),
    title: 'Contact – AMISTIC',
    data: {
      description: 'Contactez AMISTIC pour adhérer, devenir partenaire ou poser une question.',
    },
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./admin/admin-login').then((m) => m.AdminLogin),
    title: 'Connexion – AMISTIC',
    data: { noindex: true },
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./admin/admin-shell').then((m) => m.AdminShell),
    title: 'Administration – AMISTIC',
    data: { noindex: true },
    children: [
      { path: '', redirectTo: 'activites', pathMatch: 'full' },
      {
        path: 'activites',
        loadComponent: collection,
        title: 'Activités – Administration',
        data: { kind: 'activities', noindex: true },
      },
      {
        path: 'equipe',
        loadComponent: collection,
        title: 'Équipe – Administration',
        data: { kind: 'team', noindex: true },
      },
      {
        path: 'actualites',
        loadComponent: collection,
        title: 'Actualités – Administration',
        data: { kind: 'news', noindex: true },
      },
      {
        path: 'partenaires',
        loadComponent: collection,
        title: 'Partenaires – Administration',
        data: { kind: 'partners', noindex: true },
      },
      {
        path: 'messages',
        loadComponent: inbox,
        title: 'Messages – Administration',
        data: { kind: 'messages', noindex: true },
      },
      {
        path: 'abonnes',
        loadComponent: inbox,
        title: 'Abonnés – Administration',
        data: { kind: 'subscribers', noindex: true },
      },
    ],
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found').then((m) => m.NotFound),
    title: 'Page introuvable – AMISTIC',
    data: { noindex: true },
  },
];
