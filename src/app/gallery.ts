import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { GALLERY, IMAGES } from './images';
import { Reveal } from './reveal';

// Photos des activités. En mode « featured », la photo de groupe prend la place d'honneur.
@Component({
  selector: 'app-gallery',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal],
  styles: `
    .grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.8rem;
    }
    figure {
      margin: 0;
      overflow: hidden;
      border-radius: 8px;
      background: #dfe3e6;
    }
    img {
      display: block;
      width: 100%;
      height: 100%;
      aspect-ratio: 1;
      object-fit: cover;
      transition: transform 0.6s ease;
    }
    figure:hover img {
      transform: scale(1.06);
    }
    .featured {
      grid-column: span 2;
      grid-row: span 2;
    }
    @media (max-width: 820px) {
      .grid {
        grid-template-columns: 1fr 1fr;
      }
    }
  `,
  template: `
    <div class="grid">
      @if (featured()) {
        <figure class="featured" appReveal>
          <img
            [src]="group.src"
            [attr.srcset]="group.srcset"
            sizes="(max-width: 820px) 100vw, 560px"
            width="1080"
            height="810"
            alt="Les membres d'AMISTIC réunis pour les 20 ans de l'association"
            loading="lazy"
            decoding="async"
          />
        </figure>
      }
      @for (p of photos(); track p.src; let i = $index) {
        <figure appReveal [style.--d]="(i % 4) * 100 + 'ms'">
          <img
            [src]="p.src"
            [alt]="p.alt"
            width="206"
            height="206"
            loading="lazy"
            decoding="async"
          />
        </figure>
      }
    </div>
  `,
})
export class Gallery {
  readonly featured = input(false);
  protected readonly group = IMAGES.group;
  protected photos() {
    return this.featured() ? GALLERY.slice(0, 4) : GALLERY;
  }
}
