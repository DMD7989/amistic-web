import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Supabase } from '../supabase';

// Page de connexion autonome : sans en-tête ni pied de page du site
@Component({
  selector: 'app-admin-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, RouterLink],
  styles: `
    :host {
      display: grid;
      place-items: center;
      min-height: 100vh;
      padding: 1.5rem;
      background: var(--soft);
    }
    .box {
      width: min(420px, 100%);
      padding: 2.2rem;
      text-align: center;
    }
    .logo {
      width: 72px;
      height: 72px;
      border-radius: 10px;
      margin-bottom: 1rem;
    }
    h1 {
      font-size: 1.5rem;
      margin-bottom: 0.3rem;
    }
    .sub {
      color: var(--muted);
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
    }
    form {
      display: grid;
      gap: 1rem;
      text-align: left;
    }
    label {
      display: grid;
      gap: 0.3rem;
      font-weight: 500;
      font-size: 0.9rem;
    }
    input {
      font: inherit;
      padding: 0.8rem;
      border: 1px solid #c8cdd2;
      border-radius: 8px;
    }
    input:focus {
      outline: 2px solid var(--primary);
      border-color: transparent;
    }
    .btn {
      width: 100%;
    }
    .error {
      color: #b3261e;
      margin: 0;
      font-size: 0.9rem;
    }
    .notice {
      background: #fff4dd;
      border-left: 4px solid var(--accent);
      padding: 1rem;
      border-radius: 8px;
      text-align: left;
      font-size: 0.9rem;
    }
    .back {
      display: inline-block;
      margin-top: 1.5rem;
      font-size: 0.9rem;
      color: var(--muted);
      text-decoration: none;
    }
    .back:hover {
      color: var(--primary);
    }
  `,
  template: `
    <div class="box card">
      <img class="logo" src="logo.jpg" alt="Logo AMISTIC" />
      <h1>Administration</h1>
      <p class="sub">Espace réservé aux administrateurs d'AMISTIC</p>

      @if (!sb.configured) {
        <p class="notice">
          Le back-office n'est pas encore configuré. Suis les étapes du fichier
          <strong>supabase/LISEZMOI.md</strong>.
        </p>
      } @else {
        <form (ngSubmit)="submit()">
          <label
            >Email<input
              type="email"
              name="email"
              [(ngModel)]="email"
              autocomplete="username"
              required
          /></label>
          <label
            >Mot de passe<input
              type="password"
              name="password"
              [(ngModel)]="password"
              autocomplete="current-password"
              required
          /></label>
          @if (error()) {
            <p class="error">{{ error() }}</p>
          }
          <button class="btn" type="submit" [disabled]="busy()">
            {{ busy() ? 'Connexion…' : 'Se connecter' }}
          </button>
        </form>
      }

      <a class="back" routerLink="/">← Retour au site</a>
    </div>
  `,
})
export class AdminLogin {
  protected readonly sb = inject(Supabase);
  private readonly router = inject(Router);

  protected email = '';
  protected password = '';
  protected readonly error = signal<string | null>(null);
  protected readonly busy = signal(false);

  protected async submit() {
    this.busy.set(true);
    this.error.set(await this.sb.signIn(this.email, this.password));
    this.busy.set(false);
    if (!this.error()) this.router.navigateByUrl('/admin');
  }
}
