import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Message, MessageService, Subscriber, SubscriberService } from '../inbox.service';
import { AdminUi } from './admin-ui';

// Messages reçus par le formulaire de contact, et abonnés à la newsletter
@Component({
  selector: 'app-admin-inbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, FormsModule],
  styleUrl: './admin.scss',
  template: `
    @if (kind === 'messages') {
      <div class="toolbar">
        <div class="search">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.500-3.500" />
          </svg>
          <input
            type="search"
            placeholder="Rechercher un message"
            aria-label="Rechercher"
            [ngModel]="query()"
            (ngModelChange)="query.set($event)"
          />
        </div>
        <div class="chips" role="group" aria-label="Filtrer">
          <button
            class="chip"
            type="button"
            [class.on]="!onlyUnread()"
            [attr.aria-pressed]="!onlyUnread()"
            (click)="onlyUnread.set(false)"
          >
            Tous
          </button>
          <button
            class="chip"
            type="button"
            [class.on]="onlyUnread()"
            [attr.aria-pressed]="onlyUnread()"
            (click)="onlyUnread.set(true)"
          >
            Non lus ({{ unreadCount() }})
          </button>
        </div>
        <span class="count">{{ filteredMessages().length }} sur {{ messages.items().length }}</span>
      </div>

      <div class="surface">
        @if (messages.error()) {
          <div class="state error">
            <h2>Chargement impossible</h2>
            <p>
              {{ messages.error() }} Vérifie que le script SQL <strong>schema-2.sql</strong> a bien
              été exécuté dans Supabase.
            </p>
            <button class="btn" type="button" (click)="messages.load()">Réessayer</button>
          </div>
        } @else if (messages.loading() && messages.items().length === 0) {
          @for (n of [1, 2, 3]; track n) {
            <div class="skeleton-row">
              <span class="skeleton square"></span><span class="skeleton"></span>
            </div>
          }
        } @else if (messages.items().length === 0) {
          <div class="state">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 7l9 6 9-6" />
            </svg>
            <h2>Aucun message pour le moment</h2>
            <p>Les messages envoyés depuis la page Contact apparaîtront ici.</p>
          </div>
        } @else if (filteredMessages().length === 0) {
          <div class="state">
            <h2>Aucun résultat</h2>
            <p>Aucun message ne correspond à votre recherche.</p>
          </div>
        } @else {
          @for (m of filteredMessages(); track m.id) {
            <article class="msg" [class.unread]="!m.read">
              <span class="avatar" aria-hidden="true">{{ m.name.charAt(0) }}</span>
              <div>
                <div class="msg-head">
                  <span class="name">{{ m.name }}</span>
                  <a class="meta" [href]="'mailto:' + m.email">{{ m.email }}</a>
                  <span class="msg-date">{{ m.created_at | date: 'dd/MM/yyyy à HH:mm' }}</span>
                </div>
                <button
                  class="row-toggle"
                  type="button"
                  [class.clamp]="openId() !== m.id"
                  [class.full]="openId() === m.id"
                  [attr.aria-expanded]="openId() === m.id"
                  (click)="toggle(m)"
                >
                  {{ m.message }}
                </button>
                <div class="msg-actions">
                  <a class="link-btn" [href]="replyLink(m)">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M9 14L4 9l5-5" />
                      <path d="M4 9h10a6 6 0 0 1 6 6v3" /></svg
                    >Répondre
                  </a>
                  <button class="link-btn" type="button" (click)="toggleRead(m)">
                    {{ m.read ? 'Marquer comme non lu' : 'Marquer comme lu' }}
                  </button>
                  <button class="link-btn danger" type="button" (click)="removeMessage(m)">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" /></svg
                    >Supprimer
                  </button>
                </div>
              </div>
            </article>
          }
        }
      </div>
    } @else {
      <div class="toolbar">
        <div class="search">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.500-3.500" />
          </svg>
          <input
            type="search"
            placeholder="Rechercher une adresse"
            aria-label="Rechercher"
            [ngModel]="query()"
            (ngModelChange)="query.set($event)"
          />
        </div>
        <span class="count"
          >{{ filteredSubscribers().length }} sur {{ subscribers.items().length }}</span
        >
        <button
          class="btn light"
          type="button"
          [disabled]="!subscribers.items().length"
          (click)="copyEmails()"
        >
          Copier les adresses
        </button>
        <button
          class="btn"
          type="button"
          [disabled]="!subscribers.items().length"
          (click)="exportCsv()"
        >
          Exporter en CSV
        </button>
      </div>

      <div class="surface">
        @if (subscribers.error()) {
          <div class="state error">
            <h2>Chargement impossible</h2>
            <p>
              {{ subscribers.error() }} Vérifie que le script SQL <strong>schema-2.sql</strong> a
              bien été exécuté dans Supabase.
            </p>
            <button class="btn" type="button" (click)="subscribers.load()">Réessayer</button>
          </div>
        } @else if (subscribers.loading() && subscribers.items().length === 0) {
          @for (n of [1, 2, 3]; track n) {
            <div class="skeleton-row">
              <span class="skeleton"></span><span class="skeleton"></span>
            </div>
          }
        } @else if (subscribers.items().length === 0) {
          <div class="state">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z" />
              <path d="M10 21h4" />
            </svg>
            <h2>Aucun abonné pour le moment</h2>
            <p>Les adresses saisies dans le pied de page du site apparaîtront ici.</p>
          </div>
        } @else if (filteredSubscribers().length === 0) {
          <div class="state">
            <h2>Aucun résultat</h2>
            <p>Aucune adresse ne correspond à votre recherche.</p>
          </div>
        } @else {
          <table>
            <thead>
              <tr>
                <th scope="col">Adresse email</th>
                <th scope="col">Inscrit le</th>
                <th scope="col"><span class="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              @for (s of filteredSubscribers(); track s.id) {
                <tr>
                  <td>
                    <span class="name">{{ s.email }}</span>
                  </td>
                  <td class="extra">
                    <span class="pill">{{ s.created_at | date: 'dd/MM/yyyy' }}</span>
                  </td>
                  <td class="actions-cell">
                    <button
                      class="icon-btn danger"
                      type="button"
                      [attr.aria-label]="'Supprimer ' + s.email"
                      (click)="removeSubscriber(s)"
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
    }
  `,
})
export class AdminInbox {
  private readonly ui = inject(AdminUi);
  protected readonly kind = inject(ActivatedRoute).snapshot.data['kind'] as
    'messages' | 'subscribers';
  protected readonly messages = inject(MessageService);
  protected readonly subscribers = inject(SubscriberService);

  protected readonly query = signal('');
  protected readonly onlyUnread = signal(false);
  protected readonly openId = signal<string | null>(null);

  protected readonly unreadCount = computed(
    () => this.messages.items().filter((m) => !m.read).length,
  );

  protected readonly filteredMessages = computed(() => {
    const q = this.query().trim().toLowerCase();
    return this.messages
      .items()
      .filter(
        (m) =>
          (!this.onlyUnread() || !m.read) &&
          (!q || `${m.name} ${m.email} ${m.message}`.toLowerCase().includes(q)),
      );
  });

  protected readonly filteredSubscribers = computed(() => {
    const q = this.query().trim().toLowerCase();
    return this.subscribers.items().filter((s) => !q || s.email.toLowerCase().includes(q));
  });

  constructor() {
    (this.kind === 'messages' ? this.messages : this.subscribers).load();
  }

  protected replyLink(m: Message) {
    return `mailto:${m.email}?subject=${encodeURIComponent('Re: votre message à AMISTIC')}`;
  }

  /** Ouvre ou referme un message ; l'ouvrir le marque comme lu. */
  protected toggle(m: Message) {
    const opening = this.openId() !== m.id;
    this.openId.set(opening ? (m.id ?? null) : null);
    if (opening && !m.read) this.messages.patch(m, { read: true });
  }

  protected async toggleRead(m: Message) {
    const error = await this.messages.patch(m, { read: !m.read });
    if (error) this.ui.toast(error, true);
  }

  protected async removeMessage(m: Message) {
    const ok = await this.ui.confirm({
      title: 'Supprimer ce message ?',
      message: `Le message de ${m.name} sera définitivement supprimé.`,
      confirmLabel: 'Supprimer',
    });
    if (!ok) return;
    const error = await this.messages.remove(m);
    this.ui.toast(error ?? 'Message supprimé.', !!error);
  }

  protected async removeSubscriber(s: Subscriber) {
    const ok = await this.ui.confirm({
      title: 'Supprimer cet abonné ?',
      message: `${s.email} ne figurera plus dans la liste.`,
      confirmLabel: 'Supprimer',
    });
    if (!ok) return;
    const error = await this.subscribers.remove(s);
    this.ui.toast(error ?? 'Abonné supprimé.', !!error);
  }

  protected async copyEmails() {
    const emails = this.subscribers
      .items()
      .map((s) => s.email)
      .join(', ');
    try {
      await navigator.clipboard.writeText(emails);
      this.ui.toast(`${this.subscribers.items().length} adresses copiées.`);
    } catch {
      this.ui.toast('Impossible de copier automatiquement.', true);
    }
  }

  protected exportCsv() {
    const rows = this.subscribers.items().map((s) => `${s.email},${s.created_at ?? ''}`);
    const blob = new Blob(['﻿email,inscrit_le\n' + rows.join('\n')], {
      type: 'text/csv;charset=utf-8',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'abonnes-amistic.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  }
}
