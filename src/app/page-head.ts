import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BannerPhoto } from './images';

// Bandeau d'en-tête des pages intérieures : titre à gauche sur l'ocre, photo à droite en fondu.
@Component({
  selector: 'app-page-head',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
    }
    .page-head {
      position: relative;
      overflow: hidden;
      min-height: 220px;
      display: flex;
      align-items: center;
    }
    .container {
      position: relative;
      z-index: 2;
    }
    .photo {
      position: absolute;
      top: 0;
      right: 0;
      width: 50%;
      height: 100%;
      object-fit: cover;
      mask-image: linear-gradient(to right, transparent, #000 35%);
    }
    @media (max-width: 760px) {
      .page-head {
        flex-direction: column;
        align-items: stretch;
        padding-bottom: 0;
      }
      .photo {
        position: static;
        order: 3;
        width: 100%;
        height: 150px;
        margin-top: 1.5rem;
        mask-image: linear-gradient(to bottom, transparent, #000 35%);
      }
    }
  `,
  template: `
    <section class="page-head">
      <div class="container">
        <h1>{{ title() }}</h1>
        @if (subtitle()) {
          <p>{{ subtitle() }}</p>
        }
      </div>
      @if (photo(); as p) {
        <img
          class="photo"
          [src]="p.src"
          [alt]="p.alt"
          [style.object-position]="p.position"
          width="1000"
          height="500"
          decoding="async"
        />
      }
    </section>
  `,
})
export class PageHead {
  readonly title = input.required<string>();
  readonly subtitle = input('');
  readonly photo = input<BannerPhoto>();
}
