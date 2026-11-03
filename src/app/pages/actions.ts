import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivityGrid } from '../activity-grid';
import { Gallery } from '../gallery';
import { IMAGES, cssUrl } from '../images';

@Component({
  selector: 'app-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ActivityGrid, Gallery],
  template: `
    <section class="page-head" [style.--head-image]="head">
      <div class="container">
        <h1>Nos activités</h1>
        <p>Ce que nous faisons sur le terrain.</p>
      </div>
    </section>

    <section class="section soft">
      <div class="container">
        <app-activity-grid />
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="title-bar"><h2>En images</h2></div>
        <app-gallery />
      </div>
    </section>
  `,
})
export class Actions {
  protected readonly head = cssUrl(IMAGES.activities);
}
