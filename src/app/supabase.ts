import { Injectable, signal } from '@angular/core';
import { Session, SupabaseClient, createClient } from '@supabase/supabase-js';
import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseConfigured } from './supabase.config';

@Injectable({ providedIn: 'root' })
export class Supabase {
  readonly configured = supabaseConfigured;
  readonly client: SupabaseClient | null = supabaseConfigured
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;
  readonly session = signal<Session | null>(null);
  // Résolu quand la session enregistrée a été relue (utile pour le garde de route)
  readonly ready: Promise<void>;

  constructor() {
    if (!this.client) {
      this.ready = Promise.resolve();
      return;
    }
    this.ready = this.client.auth.getSession().then(({ data }) => this.session.set(data.session));
    this.client.auth.onAuthStateChange((_event, session) => this.session.set(session));
  }

  async signIn(email: string, password: string): Promise<string | null> {
    if (!this.client) return "Le back-office n'est pas encore configuré.";
    const { error } = await this.client.auth.signInWithPassword({ email, password });
    return error ? 'Email ou mot de passe incorrect.' : null;
  }

  async signOut() {
    await this.client?.auth.signOut();
  }
}
