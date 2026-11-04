import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NewsService } from '../news.service';
import { Reveal } from '../reveal';

@Component({
  selector: 'app-news',
  imports: [Reveal, DatePipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.25rem;
    }
    .card {
      position: relative;
      padding: 0 0 1.5rem;
      overflow: hidden;
      transition:
        transform 0.25s ease,
        box-shadow 0.25s ease;
    }
    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
    }
    .card > *:not(.thumb) {
      margin-inline: 1.5rem;
    }
    .thumb {
      width: 100%;
      height: 180px;
      object-fit: cover;
      display: block;
      background: #e9ecef;
      margin-bottom: 1.2rem;
    }
    time {
      display: block;
      color: var(--muted);
      font-size: 0.85rem;
      margin-bottom: 0.3rem;
      min-height: 1.2em;
    }
    h3 a {
      color: inherit;
      text-decoration: none;
    }
    // Toute la carte est cliquable
    h3 a::after {
      content: '';
      position: absolute;
      inset: 0;
    }
    .card:hover h3 a {
      color: var(--primary);
    }
    p {
      margin-bottom: 0.8rem;
      color: var(--muted);
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .read {
      color: var(--primary);
      font-weight: 600;
      font-size: 0.9rem;
    }
    .state {
      color: var(--muted);
    }
    @media (max-width: 820px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }
  `,
  template: `
    <section class="page-head">
      <div class="container">
        <h1>Actualités</h1>
        <p>Les activités et événements de l'association.</p>
      </div>
    </section>

    <section class="section soft">
      <div class="container">
        @if (service.error()) {
          <p class="state" role="alert">{{ service.error() }}</p>
        } @else if (service.loading()) {
          <p class="state" role="status">Chargement…</p>
        } @else if (service.items().length === 0) {
          <p class="state">Aucune actualité pour le moment.</p>
        }
        <div class="grid">
          @for (n of service.items(); track n.id ?? $index; let i = $index) {
            <article class="card" appReveal [style.--d]="(i % 3) * 120 + 'ms'">
              @if (n.image_url) {
                <img class="thumb" [src]="n.image_url" [alt]="n.title" loading="lazy" />
              } @else {
                <div class="thumb"></div>
              }
              <time>{{
                n.published_at ? (n.published_at | date: 'dd MMMM yyyy') : 'Date à définir'
              }}</time>
              <h3>
                @if (n.id) {
                  <a [routerLink]="['/actualites', n.id]">{{ n.title }}</a>
                } @else {
                  {{ n.title }}
                }
              </h3>
              <p>{{ n.text }}</p>
              @if (n.id) {
                <span class="read" aria-hidden="true">Lire la suite →</span>
              }
            </article>
          }
        </div>
      </div>
    </section>
  `,
})
export class News {
  protected readonly service = inject(NewsService);
}
