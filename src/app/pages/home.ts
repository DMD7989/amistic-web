import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivityGrid } from '../activity-grid';
import { Gallery } from '../gallery';
import { IMAGES } from '../images';
import { NewsService } from '../news.service';
import { PartnerService } from '../partner.service';
import { Reveal } from '../reveal';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ActivityGrid, Gallery, Reveal, DatePipe],
  styles: `
    .hero {
      position: relative;
      overflow: hidden;
      background-color: var(--accent);
      color: var(--ink);
      padding: 7rem 0 7.5rem;
    }
    // Carte du Mali en filigrane blanc discret, avec un léger flottement
    .map {
      position: absolute;
      right: 4%;
      top: 50%;
      height: 125%;
      fill: #fff;
      opacity: 0.22;
      pointer-events: none;
      transform: translateY(-50%);
      animation: drift 9s ease-in-out infinite alternate;
    }
    @keyframes drift {
      from {
        transform: translateY(-50%) translateX(0) rotate(0deg);
      }
      to {
        transform: translateY(-52%) translateX(-18px) rotate(1.5deg);
      }
    }
    .hero-bg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    // Voile ocre : garde le titre lisible à gauche, laisse voir la photo à droite
    .hero::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 1;
      background: linear-gradient(
        100deg,
        rgba(236, 160, 32, 0.95) 0%,
        rgba(236, 160, 32, 0.88) 40%,
        rgba(236, 160, 32, 0.3)
      );
    }
    .map {
      z-index: 1;
    }
    .hero .container {
      z-index: 2;
      position: relative;
    }
    .hero h1 {
      max-width: 640px;
      font-size: clamp(2.2rem, 5vw, 3.6rem);
    }
    .hero p {
      max-width: 520px;
      font-size: 1.1rem;
      margin-bottom: 2rem;
    }
    .hero-cta {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }

    // Entrée en cascade du texte d'accueil
    .hero h1,
    .hero p,
    .hero-cta {
      animation: rise 0.8s ease both;
    }
    .hero p {
      animation-delay: 0.15s;
    }
    .hero-cta {
      animation-delay: 0.3s;
    }
    @keyframes rise {
      from {
        opacity: 0;
        transform: translateY(26px);
      }
      to {
        opacity: 1;
        transform: none;
      }
    }

    .more {
      margin-top: 3rem;
      text-align: center;
    }

    .lines {
      list-style: none;
      padding: 0;
      margin: 1.5rem 0 0;
    }
    .lines li {
      font-family: 'Courier Prime', 'Courier New', monospace;
      font-weight: 700;
      padding: 0.4rem 0;
      border-bottom: 1px solid var(--line);
      transition:
        padding-left 0.25s ease,
        color 0.25s ease;
    }
    .lines li:hover {
      padding-left: 0.8rem;
      color: var(--primary);
    }

    .news-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.25rem;
    }
    .news-card {
      position: relative;
      padding: 0 0 1.5rem;
      overflow: hidden;
      transition:
        transform 0.25s ease,
        box-shadow 0.25s ease;
    }
    .news-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
    }
    .news-card h3 a {
      color: inherit;
      text-decoration: none;
    }
    .news-card h3 a::after {
      content: '';
      position: absolute;
      inset: 0;
    }
    .news-card:hover h3 a {
      color: var(--primary);
    }
    .read {
      color: var(--primary);
      font-weight: 600;
      font-size: 0.9rem;
    }
    .news-card > *:not(.news-thumb) {
      margin-inline: 1.5rem;
    }
    .news-thumb {
      width: 100%;
      height: 170px;
      object-fit: cover;
      display: block;
      background: #e9ecef;
      margin-bottom: 1.2rem;
    }
    .news-card time {
      display: block;
      color: var(--muted);
      font-size: 0.85rem;
      margin-bottom: 0.3rem;
    }
    .news-card p {
      margin-bottom: 0.8rem;
      color: var(--muted);
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .partners {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.25rem;
      margin-top: 2rem;
    }
    .partner {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      height: 100px;
      padding: 1rem;
      display: grid;
      place-items: center;
      font-size: 0.85rem;
      text-align: center;
      text-decoration: none;
      color: var(--muted);
      transition:
        opacity 0.7s ease,
        transform 0.25s ease,
        box-shadow 0.25s ease;
    }
    .partner img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
    .partner:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
    }

    @media (max-width: 900px) {
      .news-grid {
        grid-template-columns: 1fr;
      }
      .partners {
        grid-template-columns: 1fr 1fr;
      }
      .map {
        right: -20%;
        opacity: 0.3;
      }
    }
    @media (max-width: 560px) {
      .hero {
        padding: 4rem 0 4.5rem;
      }
      .map {
        right: -45%;
        top: 55%;
        height: 85%;
        opacity: 0.25;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .map,
      .hero h1,
      .hero p,
      .hero-cta {
        animation: none;
      }
    }
  `,
  template: `
    <section class="hero">
      <img
        class="hero-bg"
        [src]="hero.src"
        [attr.srcset]="hero.srcset"
        sizes="100vw"
        width="1600"
        height="900"
        alt=""
        fetchpriority="high"
      />
      <svg class="map" viewBox="90 20 870 880" aria-hidden="true">
        <path
          d="M448 30 L580 115 L700 235 L830 340 L890 362 L893 392 L940 405 L935 440 L930 520 L908 608 L760 636 L618 652 L575 672 L548 730 L505 785 L450 800 L440 850 L370 885 L290 880 L262 845 L262 790 L300 745 L200 705 L110 690 L105 640 L130 565 L150 555 L178 583 L438 575 L455 545 L440 490 Z"
          stroke="#fff"
          stroke-width="14"
          stroke-linejoin="round"
        />
      </svg>
      <div class="container">
        <h1>Rendre les TIC accessibles à tous</h1>
        <p>
          L'Association Malienne pour l'Initiation et la Sensibilisation aux Technologies de
          l'Information et de la Communication.
        </p>
        <div class="hero-cta">
          <a class="btn" routerLink="/contact">Rejoindre</a>
          <a class="btn light" routerLink="/nos-actions">Nos activités</a>
        </div>
      </div>
    </section>

    <section class="section soft">
      <div class="container">
        <div class="title-bar" appReveal><h2>Nos activités</h2></div>
        <app-activity-grid [limit]="3" />
        <div class="more" appReveal>
          <a class="btn" routerLink="/nos-actions">Voir toutes nos activités</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container split">
        <div appReveal>
          <div class="title-bar"><h2>Qui sommes-nous</h2></div>
          <p>
            AMISTIC est une association malienne qui œuvre pour que chacun puisse comprendre le
            numérique et l'utiliser à son avantage, que ce soit pour étudier, travailler ou
            entreprendre.
          </p>
          <p>
            Nous privilégions l'action de terrain et les collaborations dans la durée plutôt que les
            opérations ponctuelles.
          </p>
          <ul class="lines">
            <li>Initier.</li>
            <li>Sensibiliser.</li>
            <li>Accompagner dans la durée.</li>
          </ul>
        </div>
        <div class="block-primary" appReveal style="--d: 150ms">
          <p class="kicker">Notre engagement</p>
          <h2>Le numérique au service du développement</h2>
          <p>
            Nous voulons réduire la fracture numérique au Mali en rendant les technologies
            accessibles et utiles à tous.
          </p>
          <a class="btn secondary" routerLink="/a-propos">En savoir plus</a>
        </div>
      </div>
    </section>

    <section class="section soft">
      <div class="container">
        <div class="title-bar" appReveal><h2>L'association en images</h2></div>
        <app-gallery [featured]="true" />
      </div>
    </section>

    @if (!news.error() && news.items().length > 0) {
      <section class="section soft">
        <div class="container">
          <div class="title-bar" appReveal><h2>Dernières actualités</h2></div>
          <div class="news-grid">
            @for (n of latestNews(); track n.id ?? $index; let i = $index) {
              <article class="card news-card" appReveal [style.--d]="i * 120 + 'ms'">
                @if (n.image_url) {
                  <img class="news-thumb" [src]="n.image_url" [alt]="n.title" loading="lazy" />
                } @else {
                  <div class="news-thumb"></div>
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
          <div class="more" appReveal>
            <a class="btn" routerLink="/actualites">Toutes les actualités</a>
          </div>
        </div>
      </section>
    }

    @if (!partners.error() && partners.items().length > 0) {
      <section class="section">
        <div class="container">
          <div class="title-bar" appReveal><h2>Nos partenaires</h2></div>
          <div class="partners">
            @for (p of partners.items(); track p.id ?? $index; let i = $index) {
              @if (p.website) {
                <a
                  class="partner"
                  [href]="p.website"
                  target="_blank"
                  rel="noopener"
                  [attr.aria-label]="p.name"
                  appReveal
                  [style.--d]="(i % 4) * 100 + 'ms'"
                >
                  @if (p.image_url) {
                    <img [src]="p.image_url" [alt]="p.name" loading="lazy" />
                  } @else {
                    {{ p.name }}
                  }
                </a>
              } @else {
                <div class="partner" appReveal [style.--d]="(i % 4) * 100 + 'ms'">
                  @if (p.image_url) {
                    <img [src]="p.image_url" [alt]="p.name" loading="lazy" />
                  } @else {
                    {{ p.name }}
                  }
                </div>
              }
            }
          </div>
        </div>
      </section>
    }
  `,
})
export class Home {
  protected readonly hero = IMAGES.hero;
  protected readonly news = inject(NewsService);
  protected readonly partners = inject(PartnerService);
  protected readonly latestNews = computed(() => this.news.items().slice(0, 3));
}
