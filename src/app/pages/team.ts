import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Reveal } from '../reveal';
import { TeamService } from '../team.service';

@Component({
  selector: 'app-team',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal],
  styles: `
    .grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.25rem;
    }
    .card {
      padding: 1rem 1rem 1.4rem;
    }
    .photo {
      aspect-ratio: 1;
      width: 100%;
      object-fit: cover;
      background: linear-gradient(135deg, var(--primary-dark), var(--primary));
      border-radius: 6px;
      display: grid;
      place-items: center;
      color: rgba(255, 255, 255, 0.92);
      font-family: 'Courier Prime', monospace;
      font-weight: 700;
      font-size: 2.6rem;
      margin-bottom: 1rem;
    }
    .card h3 {
      margin-bottom: 0.2rem;
    }
    .role {
      color: var(--primary);
      font-weight: 600;
      font-size: 0.9rem;
    }
    .state {
      color: var(--muted);
    }
    @media (max-width: 900px) {
      .grid {
        grid-template-columns: 1fr 1fr;
      }
    }
    @media (max-width: 480px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }
  `,
  template: `
    <section class="page-head">
      <div class="container">
        <h1>Équipe</h1>
        <p>Le bureau de l'association.</p>
      </div>
    </section>

    <section class="section soft">
      <div class="container">
        @if (service.error()) {
          <p class="state" role="alert">{{ service.error() }}</p>
        } @else if (service.loading()) {
          <p class="state" role="status">Chargement…</p>
        } @else if (service.items().length === 0) {
          <p class="state">L'équipe sera présentée prochainement.</p>
        }
        <div class="grid">
          @for (m of service.items(); track m.id ?? $index; let i = $index) {
            <article class="card" appReveal [style.--d]="(i % 4) * 100 + 'ms'">
              @if (m.image_url) {
                <img
                  class="photo"
                  [src]="m.image_url"
                  [alt]="m.name"
                  loading="lazy"
                  decoding="async"
                />
              } @else {
                <div class="photo" aria-hidden="true">{{ initials(m.name) }}</div>
              }
              <h3>{{ m.name }}</h3>
              <span class="role">{{ m.role }}</span>
            </article>
          }
        </div>
      </div>
    </section>
  `,
})
export class Team {
  protected readonly service = inject(TeamService);

  protected initials(name: string): string {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0].toUpperCase())
      .join('');
  }
}
