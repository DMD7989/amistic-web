import { Injectable } from '@angular/core';
import { Collection } from './collection';

export interface Partner {
  id?: string;
  name: string;
  website: string | null;
  image_url: string | null;
  position: number;
}

// Cadres d'exemple affichés tant que Supabase n'est pas configuré
const DEFAULTS: Partner[] = [1, 2, 3, 4].map((n) => ({
  name: 'Logo partenaire',
  website: null,
  image_url: null,
  position: n,
}));

@Injectable({ providedIn: 'root' })
export class PartnerService extends Collection<Partner> {
  constructor() {
    super('partners', DEFAULTS, [{ column: 'position' }, { column: 'created_at' }]);
  }
}
