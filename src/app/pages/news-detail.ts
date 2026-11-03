import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NewsItem, NewsService } from '../news.service';
import { Seo } from '../seo';
import { SITE } from '../site.config';

// Lecture d'une actualité : /actualites/:id
@Component({
  selector: 'app-news-detail',
  imports: [RouterLink, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .crumbs {
      background: var(--soft);
      border-bottom: 1px solid var(--line);
      padding: 0.9rem 0;
      font-size: 0.9rem;
      color: var(--muted);
    }
    .crumbs a {
      color: var(--muted);
      text-decoration: none;
    }
    .crumbs a:hover {
      color: var(--primary);
    }
    .crumbs [aria-current] {
      color: var(--ink);
    }

    .article {
      max-width: 780px;
      margin-inline: auto;
    }
    time {
      display: block;
      margin-bottom: 0.6rem;
      color: var(--muted);
      font-size: 0.9rem;
    }
    h1 {
      margin-bottom: 1.5rem;
    }
    .cover {
      width: 100%;
      max-height: 460px;
      object-fit: cover;
      border-radius: 10px;
      margin-bottom: 2rem;
      background: #e9ecef;
    }
    .body p {
      margin-bottom: 1.2em;
      font-size: 1.08rem;
      line-height: 1.8;
      white-space: pre-line;
    }

    .share {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      flex-wrap: wrap;
      margin-top: 2.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--line);
    }
    .share strong {
      margin-right: 0.3rem;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.5rem 1rem;
      border: 1px solid #d3d8dd;
      border-radius: 999px;
      background: #fff;
      color: var(--ink);
      font: inherit;
      font-size: 0.9rem;
      text-decoration: none;
      cursor: pointer;
    }
    .chip:hover {
      border-color: var(--primary);
      color: var(--primary);
    }

    .back {
      display: inline-block;
      margin-top: 2rem;
      font-weight: 600;
      text-decoration: none;
    }
    .back:hover {
      text-decoration: underline;
    }

    .more h2 {
      margin-bottom: 1.5rem;
    }
    .more-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.25rem;
    }
    .more-card {
      padding: 1.4rem;
    }
    .more-card time {
      margin-bottom: 0.3rem;
    }
    .more-card h3 {
      margin-bottom: 0;
      font-size: 1.05rem;
    }
    .more-card a {
      text-decoration: none;
      color: var(--ink);
    }
    .more-card a:hover {
      color: var(--primary);
    }

    .state {
      text-align: center;
      padding: 4rem 0;
      color: var(--muted);
    }
    .skeleton {
      height: 18px;
      margin-bottom: 1rem;
      border-radius: 6px;
      background: #e9ecef;
    }
    @media (max-width: 820px) {
      .more-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
  template: `
    <nav class="crumbs" aria-label="Fil d'Ariane">
      <div class="container">
        <a routerLink="/">Accueil</a> › <a routerLink="/actualites">Actualités</a>
        @if (article(); as a) {
          › <span aria-current="page">{{ a.title }}</span>
        }
      </div>
    </nav>

    <section class="section">
      <div class="container">
        @if (article() === undefined) {
          <div class="article" aria-busy="true">
            <div class="skeleton" style="width: 30%"></div>
            <div class="skeleton" style="height: 38px; width: 80%"></div>
            <div class="skeleton"></div>
            <div class="skeleton"></div>
            <div class="skeleton" style="width: 70%"></div>
          </div>
        } @else if (article(); as a) {
          <article class="article">
            @if (a.published_at) {
              <time [attr.datetime]="a.published_at">{{
                a.published_at | date: 'dd MMMM yyyy'
              }}</time>
            }
            <h1>{{ a.title }}</h1>
            @if (a.image_url) {
              <img class="cover" [src]="a.image_url" [alt]="a.title" />
            }
            <div class="body">
              @for (p of paragraphs(); track $index) {
                <p>{{ p }}</p>
              }
            </div>

            <div class="share">
              <strong>Partager</strong>
              <a class="chip" [href]="whatsappShare()" target="_blank" rel="noopener">WhatsApp</a>
              <a class="chip" [href]="facebookShare()" target="_blank" rel="noopener">Facebook</a>
              <button class="chip" type="button" (click)="copyLink()">
                {{ copied() ? 'Lien copié ✓' : 'Copier le lien' }}
              </button>
            </div>

            <a class="back" routerLink="/actualites">← Toutes les actualités</a>
          </article>
        } @else {
          <div class="state">
            <h1>Actualité introuvable</h1>
            <p>Cet article n'existe plus ou l'adresse est incorrecte.</p>
            <a class="btn" routerLink="/actualites">Voir les actualités</a>
          </div>
        }
      </div>
    </section>

    @if (article() && others().length) {
      <section class="section soft more">
        <div class="container">
          <h2>À lire aussi</h2>
          <div class="more-grid">
            @for (n of others(); track n.id) {
              <article class="card more-card">
                @if (n.published_at) {
                  <time>{{ n.published_at | date: 'dd MMMM yyyy' }}</time>
                }
                <h3>
                  <a [routerLink]="['/actualites', n.id]">{{ n.title }}</a>
                </h3>
              </article>
            }
          </div>
        </div>
      </section>
    }
  `,
})
export class NewsDetail {
  readonly id = input.required<string>();

  private readonly news = inject(NewsService);
  private readonly seo = inject(Seo);

  // undefined = chargement, null = introuvable
  protected readonly article = signal<NewsItem | null | undefined>(undefined);
  protected readonly copied = signal(false);

  protected readonly paragraphs = computed(() =>
    (this.article()?.text ?? '').split(/\n{2,}/).filter((p) => p.trim()),
  );
  protected readonly others = computed(() =>
    this.news
      .items()
      .filter((n) => n.id && n.id !== this.id())
      .slice(0, 3),
  );

  private get pageUrl() {
    return `${SITE.url}/actualites/${this.id()}`;
  }

  protected whatsappShare = computed(
    () =>
      `https://wa.me/?text=${encodeURIComponent(`${this.article()?.title ?? ''} ${this.pageUrl}`)}`,
  );
  protected facebookShare = computed(
    () => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.pageUrl)}`,
  );

  constructor() {
    effect(() => {
      const id = this.id();
      this.article.set(undefined);
      this.news.getById(id).then((a) => this.article.set(a));
    });

    effect(() => {
      const a = this.article();
      if (a === undefined) return;
      if (!a) {
        this.seo.noindex();
        return;
      }
      const description = a.text.replace(/\s+/g, ' ').slice(0, 155);
      this.seo.setShare({ title: a.title, description, image: a.image_url });
      this.seo.setStructuredData({
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: a.title,
        description,
        image: a.image_url ? [a.image_url] : undefined,
        datePublished: a.published_at || undefined,
        mainEntityOfPage: this.pageUrl,
        publisher: {
          '@type': 'Organization',
          name: SITE.name,
          logo: { '@type': 'ImageObject', url: `${SITE.url}/logo.jpg` },
        },
      });
    });

    inject(DestroyRef).onDestroy(() => {
      this.seo.resetShare();
      this.seo.clearStructuredData();
    });
  }

  protected async copyLink() {
    try {
      await navigator.clipboard.writeText(location.href);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2500);
    } catch {
      // Copie refusée par le navigateur : le visiteur peut copier l'adresse manuellement
    }
  }
}
