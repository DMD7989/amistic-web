import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivityGrid } from '../activity-grid';
import { Gallery } from '../gallery';
import { BANNERS, TRAINING_PHOTOS } from '../images';
import { PageHead } from '../page-head';

@Component({
  selector: 'app-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .lead {
      max-width: 720px;
      margin-bottom: 1.5rem;
    }
  `,
  imports: [PageHead, ActivityGrid, Gallery],
  template: `
    <app-page-head
      title="Nos activités"
      subtitle="Ce que nous faisons sur le terrain."
      [photo]="banner"
    />

    <section class="section soft">
      <div class="container">
        <app-activity-grid />
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="title-bar">
          <h2>Formation : l'intelligence artificielle et la recherche documentaire</h2>
        </div>
        <p class="lead">
          AMISTIC a organisé une formation sur « L'intelligence artificielle et la méthodologie de
          recherche documentaire en ligne », avec des participants équipés de leurs ordinateurs.
        </p>
        <app-gallery [photos]="training" />
      </div>
    </section>

    <section class="section soft">
      <div class="container">
        <div class="title-bar"><h2>En images</h2></div>
        <app-gallery />
      </div>
    </section>
  `,
})
export class Actions {
  protected readonly banner = BANNERS.activities;
  protected readonly training = TRAINING_PHOTOS;
}
