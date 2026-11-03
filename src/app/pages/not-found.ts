import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .box {
      text-align: center;
      padding: 6rem 0 7rem;
    }
    .code {
      font-family: 'Courier Prime', 'Courier New', monospace;
      font-size: clamp(4rem, 14vw, 8rem);
      font-weight: 700;
      line-height: 1;
      color: var(--accent);
    }
    p {
      max-width: 460px;
      margin-inline: auto;
      color: var(--muted);
    }
    .links {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 1.5rem;
    }
  `,
  template: `
    <section class="section">
      <div class="container box">
        <div class="code" aria-hidden="true">404</div>
        <h1>Page introuvable</h1>
        <p>La page que vous cherchez n'existe pas ou a été déplacée.</p>
        <div class="links">
          <a class="btn" routerLink="/">Retour à l'accueil</a>
          <a class="btn secondary" routerLink="/contact">Nous contacter</a>
        </div>
      </div>
    </section>
  `,
})
export class NotFound {}
