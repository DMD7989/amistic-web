import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ActivityService } from './activity.service';
import { defaultActivityPhoto } from './images';
import { Reveal } from './reveal';

@Component({
  selector: 'app-activity-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal],
  styles: `
    .grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2.5rem 2.2rem;
    }
    .frame {
      overflow: hidden;
      border-radius: 8px;
      margin-bottom: 1rem;
    }
    .photo {
      aspect-ratio: 3 / 2;
      width: 100%;
      height: auto;
      object-fit: cover;
      display: block;
      transition: transform 0.6s ease;
    }
    // Visuel de remplacement tant qu'aucune photo n'a été ajoutée
    .photo.empty {
      background:
        radial-gradient(circle at 80% 20%, rgba(236, 160, 32, 0.45), transparent 45%),
        linear-gradient(135deg, var(--primary-dark), var(--primary));
      display: grid;
      place-items: center;
      color: rgba(255, 255, 255, 0.9);
      font-family: 'Courier Prime', monospace;
      font-weight: 700;
      font-size: 3rem;
    }
    article:hover .photo {
      transform: scale(1.07);
    }
    h3 {
      position: relative;
      color: var(--primary);
      text-transform: uppercase;
      font-size: 1.5rem;
      margin-bottom: 0.9rem;
      padding-bottom: 0.5rem;
    }
    h3::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 36px;
      height: 3px;
      background: var(--accent);
      transition: width 0.35s ease;
    }
    article:hover h3::after {
      width: 100%;
    }
    p {
      color: var(--ink);
      margin: 0;
    }
    .state {
      color: var(--muted);
      margin-bottom: 1.5rem;
    }
    .retry {
      font: inherit;
      color: var(--primary);
      background: none;
      border: 0;
      padding: 0;
      margin-left: 0.5rem;
      text-decoration: underline;
      cursor: pointer;
    }
    @media (max-width: 900px) {
      .grid {
        grid-template-columns: 1fr 1fr;
      }
    }
    @media (max-width: 560px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }
  `,
  template: `
    @if (service.error()) {
      <p class="state" role="alert">
        {{ service.error() }}
        <button class="retry" type="button" (click)="service.load()">Réessayer</button>
      </p>
    } @else if (service.loading()) {
      <p class="state" role="status">Chargement…</p>
    } @else if (items().length === 0) {
      <p class="state">Aucune activité pour le moment.</p>
    }
    <div class="grid">
      @for (a of items(); track a.id ?? a.title; let i = $index) {
        <article appReveal [style.--d]="(i % 3) * 120 + 'ms'">
          <div class="frame">
            @if (a.image_url ?? defaultPhoto(a.title); as src) {
              <img
                class="photo"
                [src]="src"
                alt=""
                width="900"
                height="600"
                loading="lazy"
                decoding="async"
              />
            } @else {
              <div class="photo empty" aria-hidden="true">{{ a.title.charAt(0) }}</div>
            }
          </div>
          <h3>{{ a.title }}</h3>
          <p>{{ a.text }}</p>
        </article>
      }
    </div>
  `,
})
export class ActivityGrid {
  protected readonly service = inject(ActivityService);
  readonly limit = input<number>(Infinity);
  protected readonly defaultPhoto = defaultActivityPhoto;
  protected readonly items = computed(() => this.service.items().slice(0, this.limit()));
}
