import { Injectable } from '@angular/core';
import { Collection } from './collection';

export interface Message {
  id?: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at?: string;
}

export interface Subscriber {
  id?: string;
  email: string;
  created_at?: string;
}

// Messages du formulaire de contact : lus uniquement depuis le back-office
@Injectable({ providedIn: 'root' })
export class MessageService extends Collection<Message> {
  constructor() {
    super('messages', [], [{ column: 'created_at', ascending: false }], false);
  }

  /** Envoie un message depuis le site public ; renvoie un message d'erreur ou null. */
  async send(name: string, email: string, message: string): Promise<string | null> {
    const client = this.sb.client;
    if (!client) return "Le formulaire n'est pas disponible pour le moment.";
    const { error } = await client.from('messages').insert({ name, email, message });
    return error ? "L'envoi a échoué. Vérifie les champs et réessaie." : null;
  }
}

// Abonnés à la newsletter : liste visible uniquement depuis le back-office
@Injectable({ providedIn: 'root' })
export class SubscriberService extends Collection<Subscriber> {
  constructor() {
    super('subscribers', [], [{ column: 'created_at', ascending: false }], false);
  }

  /** Inscrit une adresse ; une adresse déjà inscrite est considérée comme réussie. */
  async subscribe(email: string): Promise<string | null> {
    const client = this.sb.client;
    if (!client) return "L'inscription n'est pas disponible pour le moment.";
    const { error } = await client.from('subscribers').insert({ email });
    if (error && error.code !== '23505') return "L'inscription a échoué. Vérifie ton adresse.";
    return null;
  }
}
