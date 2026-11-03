import { Injectable } from '@angular/core';
import { Collection } from './collection';

export interface TeamMember {
  id?: string;
  name: string;
  role: string;
  image_url: string | null;
  position: number;
}

const DEFAULTS: TeamMember[] = [
  { name: 'Nom et prénom', role: 'Président', image_url: null, position: 1 },
  { name: 'Nom et prénom', role: 'Vice-président', image_url: null, position: 2 },
  { name: 'Nom et prénom', role: 'Secrétaire général', image_url: null, position: 3 },
  { name: 'Nom et prénom', role: 'Trésorier', image_url: null, position: 4 },
];

@Injectable({ providedIn: 'root' })
export class TeamService extends Collection<TeamMember> {
  constructor() {
    super('team_members', DEFAULTS, [{ column: 'position' }, { column: 'created_at' }]);
  }
}
