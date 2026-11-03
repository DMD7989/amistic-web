import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Signal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ActivityService } from '../activity.service';
import { Collection, Row } from '../collection';
import { NewsService } from '../news.service';
import { PartnerService } from '../partner.service';
import { TeamService } from '../team.service';
import { AdminUi } from './admin-ui';

const MAX_IMAGE_MB = 5;

interface Field {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'date' | 'url';
  max?: number;
  optional?: boolean;
  hint?: string;
}

type AdminRow = Row & Record<string, unknown>;

// Ce dont la page a besoin d'un service de données (Collection<T> convient pour chaque type)
interface Source {
  items: Signal<AdminRow[]>;
  loading: Signal<boolean>;
  error: Signal<string | null>;
  load(): Promise<void>;
  save(row: AdminRow, file: File | null): Promise<string | null>;
  remove(row: AdminRow): Promise<string | null>;
}

interface Config {
  singular: string;
  plural: string;
  imageLabel: string;
  service: Source;
  fields: Field[];
  titleKey: string;
  subtitle: (row: AdminRow) => string;
  extraLabel: string;
  extra: (row: AdminRow) => string;
  blank: () => AdminRow;
}

// Les modèles (Activity, Partner…) n'ont pas de signature d'index : on les voit ici comme des lignes génériques
const asSource = <T extends Row>(service: Collection<T>): Source => service as unknown as Source;

const text = (value: unknown): string =>
  value === null || value === undefined ? '' : String(value);

// Liste, recherche, ajout, modification et suppression : partagés par les activités, l'équipe,
// les actualités et les partenaires. Chaque type se décrit dans `configs`.
@Component({
  selector: 'app-admin-collection',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  styleUrl: './admin.scss',
  template: `
    <div class="toolbar">
      <div class="search">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.500-3.500" />
        </svg>
        <input
          type="search"
          [placeholder]="'Rechercher parmi les ' + config.plural.toLowerCase()"
          [ngModel]="query()"
          (ngModelChange)="query.set($event)"
          [attr.aria-label]="'Rechercher'"
        />
      </div>
      <span class="count">{{ filtered().length }} sur {{ config.service.items().length }}</span>
      <button class="btn" type="button" (click)="openNew()">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>Ajouter
        {{ article }}{{ config.singular }}
      </button>
    </div>

    <div class="surface">
      @if (config.service.error()) {
        <div class="state error">
          <h2>Chargement impossible</h2>
          <p>
            {{ config.service.error() }} Vérifie ta connexion et que le script SQL correspondant a
            bien été exécuté dans Supabase.
          </p>
          <button class="btn" type="button" (click)="config.service.load()">Réessayer</button>
        </div>
      } @else if (config.service.loading() && config.service.items().length === 0) {
        @for (n of [1, 2, 3, 4]; track n) {
          <div class="skeleton-row">
            <span class="skeleton square"></span><span class="skeleton"></span
            ><span class="skeleton"></span>
          </div>
        }
      } @else if (config.service.items().length === 0) {
        <div class="state">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M3 9h18M9 14h6" />
          </svg>
          <h2>Aucun élément pour le moment</h2>
          <p>Commence par ajouter {{ article }}{{ config.singular }}.</p>
          <button class="btn" type="button" (click)="openNew()">
            Ajouter {{ article }}{{ config.singular }}
          </button>
        </div>
      } @else if (filtered().length === 0) {
        <div class="state">
          <h2>Aucun résultat</h2>
          <p>Aucun élément ne correspond à « {{ query() }} ».</p>
        </div>
      } @else {
        <table>
          <thead>
            <tr>
              <th scope="col">
                {{ config.singular.charAt(0).toUpperCase() + config.singular.slice(1) }}
              </th>
              <th scope="col">{{ config.extraLabel }}</th>
              <th scope="col"><span class="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            @for (row of filtered(); track row.id) {
              <tr>
                <td>
                  <div class="cell-main">
                    @if (row.image_url) {
                      <img class="thumb" [src]="row.image_url" alt="" loading="lazy" />
                    } @else {
                      <span class="thumb"></span>
                    }
                    <div>
                      <p class="name">{{ row[config.titleKey] }}</p>
                      <p class="sub">{{ config.subtitle(row) }}</p>
                    </div>
                  </div>
                </td>
                <td class="extra">
                  <span class="pill">{{ config.extra(row) }}</span>
                </td>
                <td class="actions-cell">
                  <button
                    class="icon-btn"
                    type="button"
                    [attr.aria-label]="'Modifier ' + row[config.titleKey]"
                    (click)="edit(row)"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M4 20h4L19 9l-4-4L4 16z" />
                      <path d="M13.500 6.500l4 4" />
                    </svg>
                  </button>
                  <button
                    class="icon-btn danger"
                    type="button"
                    [attr.aria-label]="'Supprimer ' + row[config.titleKey]"
                    (click)="remove(row)"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" />
                    </svg>
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      }
    </div>

    @if (panelOpen()) {
      <div class="overlay" (click)="close()" aria-hidden="true"></div>
      <aside
        class="drawer"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="(editing() ? 'Modifier ' : 'Ajouter ') + article + config.singular"
      >
        <div class="drawer-head">
          <h2>{{ editing() ? 'Modifier' : 'Ajouter' }} {{ article }}{{ config.singular }}</h2>
          <button class="icon-btn" type="button" aria-label="Fermer" (click)="close()">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        <form id="entity-form" (ngSubmit)="save()">
          @for (f of config.fields; track f.key) {
            @if (f.type === 'textarea') {
              <label class="field"
                >{{ f.label }}
                <textarea
                  [name]="f.key"
                  rows="5"
                  [maxLength]="f.max ?? 300"
                  required
                  [ngModel]="form[f.key]"
                  (ngModelChange)="form[f.key] = $event"
                ></textarea>
                <span class="hint">{{ charCount(f.key) }} / {{ f.max ?? 300 }} caractères</span>
              </label>
            } @else {
              <label class="field"
                >{{ f.label }}
                <input
                  [name]="f.key"
                  [type]="f.type"
                  [maxLength]="f.max ?? 100"
                  [required]="!f.optional && f.type !== 'number'"
                  [ngModel]="form[f.key]"
                  (ngModelChange)="form[f.key] = $event"
                />
                @if (f.hint) {
                  <span class="hint">{{ f.hint }}</span>
                }
              </label>
            }
          }

          <div class="field">
            {{ config.imageLabel }}
            <div
              class="dropzone"
              [class.drag]="dragging()"
              (dragover)="$event.preventDefault(); dragging.set(true)"
              (dragleave)="dragging.set(false)"
              (drop)="onDrop($event)"
            >
              <input
                type="file"
                accept="image/*"
                [attr.aria-label]="config.imageLabel"
                (change)="pick($event)"
              />
              <strong>Choisir une image</strong> ou la déposer ici<br />
              <span class="hint">JPG, PNG ou WebP, {{ maxMb }} Mo maximum</span>
            </div>
            @if (preview()) {
              <img class="preview" [src]="preview()" alt="Aperçu" />
            }
          </div>

          @if (formError()) {
            <p class="form-error">{{ formError() }}</p>
          }
        </form>

        <div class="drawer-foot">
          <button class="btn light" type="button" (click)="close()">Annuler</button>
          <button class="btn" type="submit" form="entity-form" [disabled]="busy()">
            {{ busy() ? 'Enregistrement…' : editing() ? 'Enregistrer' : 'Ajouter' }}
          </button>
        </div>
      </aside>
    }
  `,
})
export class AdminCollection {
  private readonly ui = inject(AdminUi);
  private readonly activities = inject(ActivityService);
  private readonly team = inject(TeamService);
  private readonly news = inject(NewsService);
  private readonly partners = inject(PartnerService);

  private readonly configs: Record<string, Config> = {
    activities: {
      singular: 'activité',
      plural: 'Activités',
      imageLabel: 'Photo',
      service: asSource(this.activities),
      titleKey: 'title',
      subtitle: (r) => text(r['text']),
      extraLabel: 'Ordre',
      extra: (r) => `n° ${text(r['position'])}`,
      fields: [
        { key: 'title', label: 'Titre', type: 'text', max: 60 },
        { key: 'text', label: 'Description', type: 'textarea', max: 300 },
        {
          key: 'position',
          label: "Ordre d'affichage",
          type: 'number',
          hint: "Les plus petits numéros s'affichent en premier.",
        },
      ],
      blank: () => ({
        title: '',
        text: '',
        image_url: null,
        position: this.activities.items().length + 1,
      }),
    },
    team: {
      singular: 'membre',
      plural: 'Membres',
      imageLabel: 'Photo',
      service: asSource(this.team),
      titleKey: 'name',
      subtitle: (r) => text(r['role']),
      extraLabel: 'Ordre',
      extra: (r) => `n° ${text(r['position'])}`,
      fields: [
        { key: 'name', label: 'Nom et prénom', type: 'text', max: 80 },
        { key: 'role', label: 'Fonction', type: 'text', max: 80 },
        {
          key: 'position',
          label: "Ordre d'affichage",
          type: 'number',
          hint: "Les plus petits numéros s'affichent en premier.",
        },
      ],
      blank: () => ({
        name: '',
        role: '',
        image_url: null,
        position: this.team.items().length + 1,
      }),
    },
    news: {
      singular: 'actualité',
      plural: 'Actualités',
      imageLabel: 'Photo',
      service: asSource(this.news),
      titleKey: 'title',
      subtitle: (r) => text(r['text']),
      extraLabel: 'Publiée le',
      extra: (r) =>
        r['published_at'] ? new Date(text(r['published_at'])).toLocaleDateString('fr-FR') : '—',
      fields: [
        { key: 'title', label: 'Titre', type: 'text', max: 100 },
        { key: 'text', label: 'Texte', type: 'textarea', max: 1000 },
        { key: 'published_at', label: 'Date de publication', type: 'date' },
      ],
      blank: () => ({
        title: '',
        text: '',
        image_url: null,
        published_at: new Date().toISOString().slice(0, 10),
      }),
    },
    partners: {
      singular: 'partenaire',
      plural: 'Partenaires',
      imageLabel: 'Logo',
      service: asSource(this.partners),
      titleKey: 'name',
      subtitle: (r) => text(r['website']) || 'Pas de site web',
      extraLabel: 'Ordre',
      extra: (r) => `n° ${text(r['position'])}`,
      fields: [
        { key: 'name', label: 'Nom du partenaire', type: 'text', max: 80 },
        {
          key: 'website',
          label: 'Site web',
          type: 'url',
          max: 200,
          optional: true,
          hint: 'Facultatif. Adresse complète, ex. https://exemple.org',
        },
        {
          key: 'position',
          label: "Ordre d'affichage",
          type: 'number',
          hint: "Les plus petits numéros s'affichent en premier.",
        },
      ],
      blank: () => ({
        name: '',
        website: null,
        image_url: null,
        position: this.partners.items().length + 1,
      }),
    },
  };

  protected readonly config = this.configs[inject(ActivatedRoute).snapshot.data['kind']];
  // « un » ou « une » selon le genre du mot
  protected readonly article = ['activité', 'actualité'].includes(this.config.singular)
    ? 'une '
    : 'un ';
  protected readonly maxMb = MAX_IMAGE_MB;

  protected readonly query = signal('');
  protected readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const rows = this.config.service.items();
    if (!q) return rows;
    return rows.filter((r) =>
      `${text(r[this.config.titleKey])} ${this.config.subtitle(r)}`.toLowerCase().includes(q),
    );
  });

  protected form: AdminRow = this.config.blank();

  protected charCount(key: string): number {
    return text(this.form[key]).length;
  }
  private file: File | null = null;

  protected readonly panelOpen = signal(false);
  protected readonly editing = signal(false);
  protected readonly preview = signal<string | null>(null);
  protected readonly dragging = signal(false);
  protected readonly busy = signal(false);
  protected readonly formError = signal<string | null>(null);

  constructor() {
    // Recharge la liste à chaque ouverture de la page
    this.config.service.load();
  }

  @HostListener('document:keydown.escape')
  protected onEscape() {
    if (this.panelOpen() && !this.busy()) this.close();
  }

  protected openNew() {
    this.form = this.config.blank();
    this.file = null;
    this.preview.set(null);
    this.editing.set(false);
    this.formError.set(null);
    this.openPanel();
  }

  protected edit(row: AdminRow) {
    this.form = { ...row };
    this.file = null;
    this.preview.set(text(row['image_url']) || null);
    this.editing.set(true);
    this.formError.set(null);
    this.openPanel();
  }

  // Ouvre le panneau et place le curseur dans le premier champ
  private openPanel() {
    this.panelOpen.set(true);
    setTimeout(
      () =>
        document.querySelector<HTMLElement>('#entity-form input, #entity-form textarea')?.focus(),
      60,
    );
  }

  protected close() {
    this.panelOpen.set(false);
  }

  protected pick(event: Event) {
    const input = event.target as HTMLInputElement;
    this.setFile(input.files?.[0] ?? null);
    if (!this.file) input.value = '';
  }

  protected onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragging.set(false);
    this.setFile(event.dataTransfer?.files?.[0] ?? null);
  }

  private setFile(file: File | null) {
    if (file && !file.type.startsWith('image/')) {
      this.formError.set('Le fichier doit être une image.');
      return;
    }
    if (file && file.size > MAX_IMAGE_MB * 1024 * 1024) {
      this.formError.set(`La photo dépasse ${MAX_IMAGE_MB} Mo.`);
      return;
    }
    this.formError.set(null);
    this.file = file;
    if (file) this.preview.set(URL.createObjectURL(file));
  }

  protected async save() {
    this.busy.set(true);
    const wasEditing = this.editing();
    const error = await this.config.service.save(this.form, this.file);
    this.busy.set(false);
    if (error) {
      this.formError.set(error);
      return;
    }
    this.close();
    this.ui.toast(wasEditing ? 'Modification enregistrée.' : 'Ajout effectué.');
  }

  protected async remove(row: AdminRow) {
    const ok = await this.ui.confirm({
      title: `Supprimer ${this.article === 'une ' ? 'cette' : 'ce'} ${this.config.singular} ?`,
      message: `« ${row[this.config.titleKey]} » sera définitivement supprimé${this.article === 'une ' ? 'e' : ''} du site. Cette action est irréversible.`,
      confirmLabel: 'Supprimer',
    });
    if (!ok) return;
    const error = await this.config.service.remove(row);
    this.ui.toast(error ?? 'Suppression effectuée.', !!error);
  }
}
