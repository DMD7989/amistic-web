import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { SubscriberService } from './inbox.service';
import { Seo } from './seo';
import { SITE, whatsappLink } from './site.config';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  private readonly router = inject(Router);
  private readonly seo = inject(Seo);
  private readonly subscribers = inject(SubscriberService);

  protected readonly year = new Date().getFullYear();
  protected readonly site = SITE;
  protected readonly whatsapp = whatsappLink;
  protected readonly links = [
    { path: '/', label: 'Accueil' },
    { path: '/a-propos', label: 'À propos' },
    { path: '/nos-actions', label: 'Nos activités' },
    { path: '/equipe', label: 'Équipe' },
    { path: '/actualites', label: 'Actualités' },
  ];

  protected readonly menuOpen = signal(false);
  protected readonly showTop = signal(false);
  // L'administration a sa propre mise en page : pas d'en-tête ni de pied de page du site
  protected readonly isAdmin = signal(location.pathname.startsWith('/admin'));

  protected readonly subscribed = signal(false);
  protected readonly subscribing = signal(false);
  protected readonly subscribeError = signal<string | null>(null);

  private firstNavigation = true;

  constructor() {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(inject(DestroyRef)),
      )
      .subscribe((e) => {
        this.menuOpen.set(false);
        this.isAdmin.set(e.urlAfterRedirects.startsWith('/admin'));
        this.seo.applyRoute(this.deepestRoute().data, e.urlAfterRedirects);
        // Après un changement de page, le clavier et les lecteurs d'écran repartent du contenu
        if (!this.firstNavigation) this.focusMain();
        this.firstNavigation = false;
      });
  }

  @HostListener('window:scroll')
  protected onScroll() {
    const visible = window.scrollY > 500;
    if (visible !== this.showTop()) this.showTop.set(visible);
  }

  protected skipToContent(event: Event) {
    event.preventDefault();
    this.focusMain();
  }

  protected toTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  protected async subscribe(event: Event, email: string) {
    event.preventDefault();
    this.subscribing.set(true);
    const error = await this.subscribers.subscribe(email.trim());
    this.subscribing.set(false);
    this.subscribeError.set(error);
    if (!error) this.subscribed.set(true);
  }

  private focusMain() {
    document.getElementById('main')?.focus({ preventScroll: true });
  }

  private deepestRoute() {
    let route = this.router.routerState.snapshot.root;
    while (route.firstChild) route = route.firstChild;
    return route;
  }
}
