import { inject, signal } from '@angular/core';
import { shrinkImage } from './image-resize';
import { Supabase } from './supabase';

// Dossier de stockage des photos (créé par supabase/schema.sql)
const BUCKET = 'activities';

export interface Row {
  id?: string;
  image_url?: string | null;
}

// Lecture et écriture d'une table Supabase, avec gestion de la photo associée.
export abstract class Collection<T extends Row> {
  protected readonly sb = inject(Supabase);

  readonly items = signal<T[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  protected constructor(
    private readonly table: string,
    defaults: T[],
    private readonly order: { column: string; ascending?: boolean }[],
    autoLoad = true,
  ) {
    // Tant que Supabase n'est pas configuré, le site affiche les exemples
    this.items.set(this.sb.configured ? [] : defaults);
    if (autoLoad) this.load();
  }

  async load() {
    const client = this.sb.client;
    if (!client) return;
    this.loading.set(true);
    let query = client.from(this.table).select('*');
    for (const o of this.order) query = query.order(o.column, { ascending: o.ascending ?? true });
    const { data, error } = await query;
    if (error) this.error.set('Impossible de charger les données.');
    else {
      this.error.set(null);
      this.items.set(data as T[]);
    }
    this.loading.set(false);
  }

  /** Retrouve une ligne par son identifiant (dans la liste déjà chargée, sinon dans la base). */
  async getById(id: string): Promise<T | null> {
    const known = this.items().find((row) => row.id === id);
    if (known) return known;
    const client = this.sb.client;
    if (!client) return null;
    const { data } = await client.from(this.table).select('*').eq('id', id).maybeSingle();
    return (data as T | null) ?? null;
  }

  /** Ajoute ou modifie une ligne ; renvoie un message d'erreur ou null. */
  async save(row: T, file: File | null): Promise<string | null> {
    const client = this.sb.client;
    if (!client) return "Le back-office n'est pas encore configuré.";

    const payload: Record<string, unknown> = { ...(row as Record<string, unknown>) };
    delete payload['id'];
    delete payload['created_at'];

    if (file) {
      const url = await this.upload(file);
      if (!url) return "L'envoi de la photo a échoué.";
      payload['image_url'] = url;
    }

    const { error } = row.id
      ? await client.from(this.table).update(payload).eq('id', row.id)
      : await client.from(this.table).insert(payload);
    if (error) return "L'enregistrement a échoué.";

    if (file && row.image_url) await this.removeImage(row.image_url);
    await this.load();
    return null;
  }

  /** Modifie quelques champs d'une ligne (ex. marquer un message comme lu). */
  async patch(row: T, changes: Partial<T>): Promise<string | null> {
    const client = this.sb.client;
    if (!client || !row.id) return 'Modification impossible.';
    const { error } = await client
      .from(this.table)
      .update(changes as Record<string, unknown>)
      .eq('id', row.id);
    if (error) return 'La modification a échoué.';
    await this.load();
    return null;
  }

  async remove(row: T): Promise<string | null> {
    const client = this.sb.client;
    if (!client || !row.id) return 'Suppression impossible.';
    const { error } = await client.from(this.table).delete().eq('id', row.id);
    if (error) return 'La suppression a échoué.';
    if (row.image_url) await this.removeImage(row.image_url);
    await this.load();
    return null;
  }

  private async upload(original: File): Promise<string | null> {
    const client = this.sb.client!;
    const file = await shrinkImage(original);
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await client.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type });
    return error ? null : client.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  }

  private async removeImage(url: string) {
    const marker = `/${BUCKET}/`;
    const index = url.indexOf(marker);
    if (index >= 0)
      await this.sb.client?.storage.from(BUCKET).remove([url.slice(index + marker.length)]);
  }
}
