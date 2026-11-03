import { Injectable } from '@angular/core';
import { Collection } from './collection';

export interface NewsItem {
  id?: string;
  title: string;
  text: string;
  image_url: string | null;
  published_at: string;
}

const DEFAULTS: NewsItem[] = [
  {
    title: "Titre de l'article",
    text: "Résumé de l'actualité à compléter.",
    image_url: null,
    published_at: '',
  },
  {
    title: "Titre de l'article",
    text: "Résumé de l'actualité à compléter.",
    image_url: null,
    published_at: '',
  },
  {
    title: "Titre de l'article",
    text: "Résumé de l'actualité à compléter.",
    image_url: null,
    published_at: '',
  },
];

@Injectable({ providedIn: 'root' })
export class NewsService extends Collection<NewsItem> {
  constructor() {
    super('news', DEFAULTS, [
      { column: 'published_at', ascending: false },
      { column: 'created_at', ascending: false },
    ]);
  }
}
