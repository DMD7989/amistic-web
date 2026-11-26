import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { GALLERY, GalleryPhoto } from './images';
import { Reveal } from './reveal';

// Photos des activités ; `limit` réduit le nombre de photos affichées (ex. sur l'accueil).
@Component({
  selector: 'app-gallery',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal],
  styles: `
    .grid {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.8rem;
    }
    figure {
      flex: 0 0 calc(25% - 0.6rem);
      margin: 0;
      overflow: hidden;
      border-radius: 8px;
      background: #dfe3e6;
    }
    img {
      display: block;
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
      transition: transform 0.6s ease;
    }
    figure:hover img {
      transform: scale(1.06);
    }
    @media (max-width: 820px) {
      figure {
        flex-basis: calc(50% - 0.4rem);
      }
    }
  `,
  template: `
    <div class="grid">
      @for (p of shown(); track p.src; let i = $index) {
        <figure appReveal [style.--d]="(i % 4) * 100 + 'ms'">
          <img
            [src]="p.src"
            [alt]="p.alt"
            width="640"
            height="640"
            loading="lazy"
            decoding="async"
          />
        </figure>
      }
    </div>
  `,
})
export class Gallery {
  readonly photos = input<readonly GalleryPhoto[]>(GALLERY);
  readonly limit = input(Infinity);
  protected readonly shown = computed(() => this.photos().slice(0, this.limit()));
}
