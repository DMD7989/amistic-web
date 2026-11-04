import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivityGrid } from '../activity-grid';
import { Gallery } from '../gallery';
import { BANNERS } from '../images';
import { PageHead } from '../page-head';

@Component({
  selector: 'app-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
        <div class="title-bar"><h2>En images</h2></div>
        <app-gallery />
      </div>
    </section>
  `,
})
export class Actions {
  protected readonly banner = BANNERS.activities;
}
