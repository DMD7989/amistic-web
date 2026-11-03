import { Injectable } from '@angular/core';
import { Collection } from './collection';

export interface Activity {
  id?: string;
  title: string;
  text: string;
  image_url: string | null;
  position: number;
}

const DEFAULTS: Activity[] = [
  {
    title: 'Initiation',
    text: "Ateliers pratiques de bureautique, d'internet et de messagerie pour les débutants.",
    image_url: null,
    position: 1,
  },
  {
    title: 'Sensibilisation',
    text: 'Sécurité en ligne, protection des données personnelles et lutte contre la désinformation.',
    image_url: null,
    position: 2,
  },
  {
    title: 'Formation',
    text: 'Sessions destinées aux jeunes, aux femmes et aux professionnels.',
    image_url: null,
    position: 3,
  },
  {
    title: 'Écoles et communautés',
    text: 'Interventions dans les établissements et les quartiers pour rapprocher le numérique de la population.',
    image_url: null,
    position: 4,
  },
  {
    title: 'Partenariats',
    text: 'Collaboration avec les institutions, les ONG et les entreprises.',
    image_url: null,
    position: 5,
  },
  {
    title: 'Innovation',
    text: "Rencontres et projets pour encourager l'entrepreneuriat numérique local.",
    image_url: null,
    position: 6,
  },
];

@Injectable({ providedIn: 'root' })
export class ActivityService extends Collection<Activity> {
  constructor() {
    super('activities', DEFAULTS, [{ column: 'position' }, { column: 'created_at' }]);
  }
}
