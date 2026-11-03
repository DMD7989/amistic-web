import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MessageService } from '../inbox.service';
import { Supabase } from '../supabase';
import { AdminUi } from './admin-ui';

type Icon = 'activities' | 'team' | 'news' | 'partners' | 'messages' | 'subscribers';

interface NavItem {
  path: string;
  label: string;
  icon: Icon;
  badge?: boolean;
}

interface NavGroup {
  heading: string;
  items: NavItem[];
}

const NAV: NavGroup[] = [
  {
    heading: 'Contenu du site',
    items: [
      { path: 'activites', label: 'Activités', icon: 'activities' },
      { path: 'equipe', label: 'Équipe', icon: 'team' },
      { path: 'actualites', label: 'Actualités', icon: 'news' },
      { path: 'partenaires', label: 'Partenaires', icon: 'partners' },
    ],
  },
  {
    heading: 'Échanges',
    items: [
      { path: 'messages', label: 'Messages', icon: 'messages', badge: true },
      { path: 'abonnes', label: 'Abonnés', icon: 'subscribers' },
    ],
  },
];

// Mise en page de l'administration : menu latéral fixe sur ordinateur, tiroir sur téléphone
@Component({
  selector: 'app-admin-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  styles: `
    :host {
      display: grid;
      grid-template-columns: 264px 1fr;
      min-height: 100vh;
      background: var(--soft);
    }

    /* Menu latéral */
    .sidebar {
      position: sticky;
      top: 0;
      height: 100vh;
      display: flex;
      flex-direction: column;
      background: var(--ink);
      color: #fff;
      z-index: 40;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1.25rem 1.25rem 1.1rem;
      color: #fff;
      text-decoration: none;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .brand img {
      width: 38px;
      height: 38px;
      border-radius: 8px;
    }
    .brand strong {
      display: block;
      font-size: 1rem;
      line-height: 1.2;
    }
    .brand small {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.75rem;
    }

    .menu {
      flex: 1;
      overflow-y: auto;
      padding: 1rem 0.75rem;
    }
    .group + .group {
      margin-top: 1.5rem;
    }
    .heading {
      margin: 0 0 0.5rem 0.75rem;
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.5);
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: 0.15rem;
    }
    .link {
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.8rem;
      padding: 0.65rem 0.75rem;
      border-radius: 8px;
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      font-size: 0.95rem;
      font-weight: 500;
      transition:
        background 0.15s,
        color 0.15s;
    }
    .link:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #fff;
    }
    .link:focus-visible,
    .foot-link:focus-visible,
    .burger:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }
    .link.active {
      background: rgba(255, 255, 255, 0.12);
      color: #fff;
    }
    .link.active::before {
      content: '';
      position: absolute;
      left: -0.75rem;
      top: 8px;
      bottom: 8px;
      width: 4px;
      border-radius: 0 4px 4px 0;
      background: var(--accent);
    }
    .icon {
      width: 20px;
      height: 20px;
      flex: none;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .badge {
      margin-left: auto;
      min-width: 22px;
      padding: 0 0.45rem;
      border-radius: 999px;
      background: var(--accent);
      color: var(--ink);
      font-size: 0.75rem;
      font-weight: 700;
      line-height: 22px;
      text-align: center;
    }

    .foot {
      padding: 0.75rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      display: grid;
      gap: 0.15rem;
    }
    .foot-link {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      width: 100%;
      padding: 0.65rem 0.75rem;
      border: 0;
      border-radius: 8px;
      background: none;
      color: rgba(255, 255, 255, 0.8);
      font: inherit;
      font-size: 0.95rem;
      font-weight: 500;
      text-decoration: none;
      cursor: pointer;
    }
    .foot-link:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #fff;
    }

    /* Zone principale */
    .main {
      min-width: 0;
      display: flex;
      flex-direction: column;
    }
    .topbar {
      position: sticky;
      top: 0;
      z-index: 20;
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.85rem 2rem;
      background: #fff;
      border-bottom: 1px solid var(--line);
    }
    .burger {
      display: none;
      padding: 0.4rem;
      border: 0;
      border-radius: 8px;
      background: none;
      color: var(--ink);
      cursor: pointer;
    }
    .burger .icon {
      width: 26px;
      height: 26px;
    }
    .crumbs {
      font-size: 0.8rem;
      color: var(--muted);
    }
    .title {
      margin: 0;
      font-family: 'Inter', sans-serif;
      font-size: 1.25rem;
      font-weight: 600;
    }
    .user {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 0.65rem;
      font-size: 0.9rem;
      color: var(--muted);
    }
    .avatar {
      display: grid;
      place-items: center;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: var(--accent);
      color: var(--ink);
      font-weight: 700;
      text-transform: uppercase;
    }
    .content {
      padding: 2rem;
      max-width: 1240px;
      width: 100%;
    }

    .overlay {
      display: none;
    }

    /* Notifications et confirmation */
    .toasts {
      position: fixed;
      right: 1.25rem;
      bottom: 1.25rem;
      z-index: 90;
    }
    .toast {
      max-width: 360px;
      padding: 0.85rem 1.1rem;
      border-radius: 8px;
      background: var(--ink);
      color: #fff;
      font-size: 0.95rem;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
      animation: pop 0.2s ease;
    }
    .toast.error {
      background: #b3261e;
    }
    @keyframes pop {
      from {
        transform: translateY(8px);
        opacity: 0;
      }
      to {
        transform: none;
        opacity: 1;
      }
    }
    dialog.confirm {
      width: min(420px, calc(100% - 2rem));
      padding: 1.6rem;
      border: 0;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
    }
    dialog.confirm::backdrop {
      background: rgba(0, 0, 0, 0.5);
    }
    dialog.confirm h2 {
      margin: 0 0 0.5rem;
      font-family: 'Inter', sans-serif;
      font-size: 1.15rem;
    }
    dialog.confirm p {
      margin: 0 0 1.4rem;
      color: var(--muted);
    }
    .confirm-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }
    .btn.danger {
      background: #b3261e;
    }
    .btn.danger:hover {
      background: #8f1d17;
    }

    @media (max-width: 900px) {
      :host {
        display: block;
      }
      .sidebar {
        position: fixed;
        inset: 0 auto 0 0;
        width: min(290px, 85vw);
        transform: translateX(-100%);
        transition: transform 0.25s ease;
      }
      .sidebar.open {
        transform: none;
        box-shadow: 0 0 40px rgba(0, 0, 0, 0.35);
      }
      .overlay {
        position: fixed;
        inset: 0;
        z-index: 30;
        background: rgba(0, 0, 0, 0.45);
      }
      .overlay.show {
        display: block;
      }
      .burger {
        display: block;
      }
      .topbar {
        padding: 0.75rem 1rem;
      }
      .user span:not(.avatar) {
        display: none;
      }
      .content {
        padding: 1.25rem 1rem 3rem;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .sidebar {
        transition: none;
      }
    }
  `,
  template: `
    <aside class="sidebar" [class.open]="open()" id="admin-menu" aria-label="Menu d'administration">
      <a routerLink="/admin" class="brand">
        <img src="logo.jpg" alt="" />
        <span><strong>AMISTIC</strong><small>Administration</small></span>
      </a>

      <nav class="menu" aria-label="Sections">
        @for (group of nav; track group.heading) {
          <div class="group">
            <p class="heading">{{ group.heading }}</p>
            <ul>
              @for (item of group.items; track item.path) {
                <li>
                  <a
                    class="link"
                    [routerLink]="item.path"
                    routerLinkActive="active"
                    ariaCurrentWhenActive="page"
                  >
                    <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
                      @switch (item.icon) {
                        @case ('activities') {
                          <path d="M13 2L4 14h7l-1 8 9-12h-7z" />
                        }
                        @case ('team') {
                          <circle cx="9" cy="8" r="3.5" />
                          <path d="M2.500 20c0-3.500 3-6 6.500-6s6.500 2.500 6.500 6" />
                          <circle cx="17" cy="9" r="2.500" />
                          <path d="M17.500 14c2.500.3 4.500 2.200 4.500 5" />
                        }
                        @case ('news') {
                          <rect x="4" y="4" width="16" height="16" rx="2" />
                          <path d="M8 9h8M8 13h8M8 17h5" />
                        }
                        @case ('partners') {
                          <path d="M10 14a4 4 0 0 0 5.700 0l3-3a4 4 0 0 0-5.700-5.700l-1 1" />
                          <path d="M14 10a4 4 0 0 0-5.700 0l-3 3a4 4 0 0 0 5.700 5.700l1-1" />
                        }
                        @case ('messages') {
                          <rect x="3" y="5" width="18" height="14" rx="2" />
                          <path d="M3 7l9 6 9-6" />
                        }
                        @case ('subscribers') {
                          <path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z" />
                          <path d="M10 21h4" />
                        }
                      }
                    </svg>
                    <span>{{ item.label }}</span>
                    @if (item.badge && unread() > 0) {
                      <span class="badge" [attr.aria-label]="unread() + ' non lus'">{{
                        unread()
                      }}</span>
                    }
                  </a>
                </li>
              }
            </ul>
          </div>
        }
      </nav>

      <div class="foot">
        <a class="foot-link" href="/" target="_blank" rel="noopener">
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M14 4h6v6" />
            <path d="M20 4l-9 9" />
            <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
          </svg>
          Voir le site
        </a>
        <button class="foot-link" type="button" (click)="logout()">
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
            <path d="M10 17l-5-5 5-5" />
            <path d="M5 12h11" />
          </svg>
          Se déconnecter
        </button>
      </div>
    </aside>

    <div class="overlay" [class.show]="open()" (click)="open.set(false)" aria-hidden="true"></div>

    <div class="main">
      <header class="topbar">
        <button
          class="burger"
          type="button"
          aria-label="Ouvrir le menu"
          aria-controls="admin-menu"
          [attr.aria-expanded]="open()"
          (click)="open.set(true)"
        >
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          <div class="crumbs">Administration › {{ current().group }}</div>
          <h1 class="title">{{ current().label }}</h1>
        </div>
        <div class="user">
          <span>{{ email() }}</span>
          <span class="avatar" aria-hidden="true">{{ email().charAt(0) }}</span>
        </div>
      </header>

      <main class="content"><router-outlet /></main>
    </div>

    <div class="toasts" aria-live="polite">
      @if (ui.toastMessage(); as t) {
        <div class="toast" [class.error]="t.error">{{ t.text }}</div>
      }
    </div>

    <dialog #confirmDialog class="confirm" (cancel)="ui.answer(false)">
      @if (ui.confirmState(); as c) {
        <h2>{{ c.title }}</h2>
        <p>{{ c.message }}</p>
        <div class="confirm-actions">
          <button class="btn light" type="button" (click)="ui.answer(false)">Annuler</button>
          <button class="btn danger" type="button" (click)="ui.answer(true)">
            {{ c.confirmLabel }}
          </button>
        </div>
      }
    </dialog>
  `,
})
export class AdminShell {
  protected readonly sb = inject(Supabase);
  private readonly router = inject(Router);
  private readonly messages = inject(MessageService);

  protected readonly nav = NAV;
  protected readonly open = signal(false);
  private readonly url = signal(this.router.url);

  protected readonly email = computed(() => this.sb.session()?.user?.email ?? '');
  protected readonly unread = computed(() => this.messages.items().filter((m) => !m.read).length);
  protected readonly current = computed(() => {
    for (const group of NAV) {
      const item = group.items.find((i) => this.url().includes(`/admin/${i.path}`));
      if (item) return { group: group.heading, label: item.label };
    }
    return { group: 'Contenu du site', label: 'Activités' };
  });

  protected readonly ui = inject(AdminUi);
  private readonly confirmDialog =
    viewChild.required<ElementRef<HTMLDialogElement>>('confirmDialog');

  constructor() {
    // Ouvre ou ferme la boîte de confirmation selon l'état du service
    effect(() => {
      const dialog = this.confirmDialog().nativeElement;
      if (this.ui.confirmState()) {
        if (!dialog.open) dialog.showModal();
      } else if (dialog.open) {
        dialog.close();
      }
    });

    this.messages.load();
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.url.set(e.urlAfterRedirects);
        this.open.set(false);
      }
    });
  }

  @HostListener('document:keydown.escape')
  protected closeMenu() {
    this.open.set(false);
  }

  protected async logout() {
    await this.sb.signOut();
    this.router.navigateByUrl('/admin/login');
  }
}
