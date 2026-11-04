import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GROUP_PHOTO } from '../images';
import { Reveal } from '../reveal';

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal],
  styles: `
    .photo {
      width: 100%;
      height: 100%;
      min-height: 320px;
      max-height: 440px;
      object-fit: cover;
      border-radius: 8px;
    }
    .vals {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.25rem;
      margin-top: 2rem;
    }
    .vals .card {
      border-top: 4px solid var(--accent);
    }
    .vals p {
      margin: 0;
      color: var(--muted);
    }
    @media (max-width: 820px) {
      .vals {
        grid-template-columns: 1fr;
      }
    }
  `,
  template: `
    <section class="page-head">
      <div class="container">
        <h1>À propos</h1>
        <p>L'association, sa mission et ses valeurs.</p>
      </div>
    </section>

    <section class="section">
      <div class="container split">
        <div>
          <div class="title-bar"><h2>Qui sommes-nous</h2></div>
          <p>
            AMISTIC, l'Association Malienne pour l'Initiation et la Sensibilisation aux Technologies
            de l'Information et de la Communication, rassemble des personnes engagées pour la
            diffusion du numérique au Mali.
          </p>
          <p>
            <em
              >Texte à compléter avec l'histoire de l'association : date de création, fondateurs,
              reconnaissance officielle.</em
            >
          </p>
        </div>
        <img
          class="photo"
          [src]="photo.src"
          [attr.srcset]="photo.srcset"
          sizes="(max-width: 820px) 100vw, 560px"
          width="1080"
          height="810"
          alt="Les membres d'AMISTIC réunis pour les 20 ans de l'association"
          loading="lazy"
        />
      </div>
    </section>

    <section class="section soft">
      <div class="container">
        <div class="title-bar"><h2>Mission, vision et valeurs</h2></div>
        <div class="vals">
          <article class="card" appReveal>
            <h3>Mission</h3>
            <p>Initier et sensibiliser les populations aux TIC et à leurs usages responsables.</p>
          </article>
          <article class="card" appReveal style="--d: 120ms">
            <h3>Vision</h3>
            <p>Un Mali où le numérique est accessible et utile à tous.</p>
          </article>
          <article class="card" appReveal style="--d: 240ms">
            <h3>Valeurs</h3>
            <p>Partage, solidarité, innovation et engagement citoyen.</p>
          </article>
        </div>
      </div>
    </section>
  `,
})
export class About {
  protected readonly photo = GROUP_PHOTO;
}
