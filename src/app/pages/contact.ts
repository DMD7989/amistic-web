import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../inbox.service';
import { SITE, whatsappLink } from '../site.config';
import { IMAGES, cssUrl } from '../images';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  styles: `
    form {
      display: grid;
      gap: 1rem;
    }
    label {
      display: grid;
      gap: 0.3rem;
      font-weight: 500;
      color: var(--ink);
      font-size: 0.9rem;
    }
    input,
    textarea {
      font: inherit;
      padding: 0.8rem;
      border: 1px solid #c8cdd2;
      border-radius: 8px;
    }
    input:focus,
    textarea:focus {
      outline: 2px solid var(--primary);
      border-color: transparent;
    }
    // Champ piège pour les robots : invisible pour les visiteurs
    .trap {
      position: absolute;
      left: -9999px;
      height: 0;
      overflow: hidden;
    }
    .info p {
      margin-bottom: 1.2rem;
    }
    .info strong {
      display: block;
      color: var(--ink);
    }
    .error {
      color: #b3261e;
      margin: 0;
    }
    .success {
      background: #e8f5ec;
      border-left: 4px solid #1b7a3a;
      padding: 1rem 1.2rem;
      border-radius: 8px;
    }
  `,
  template: `
    <section class="page-head" [style.--head-image]="head">
      <div class="container">
        <h1>Contact</h1>
        <p>Une question, un projet, une adhésion ? Écrivez-nous.</p>
      </div>
    </section>

    <section class="section">
      <div class="container split">
        <div class="info">
          <div class="title-bar"><h2>Nos coordonnées</h2></div>
          <p><strong>Adresse</strong>{{ site.address }}</p>
          <p>
            <strong>Email</strong><a [href]="'mailto:' + site.email">{{ site.email }}</a>
          </p>
          <p><strong>Téléphone</strong>{{ site.phone }}</p>
          @if (site.facebook) {
            <p>
              <strong>Facebook</strong
              ><a [href]="site.facebook" target="_blank" rel="noopener">Notre page Facebook</a>
            </p>
          }
          @if (whatsapp) {
            <p>
              <strong>WhatsApp</strong
              ><a [href]="whatsapp" target="_blank" rel="noopener">Nous écrire sur WhatsApp</a>
            </p>
          }
        </div>

        @if (sent()) {
          <p class="success" role="status">
            Merci, votre message a bien été envoyé. Nous vous répondrons dès que possible.
          </p>
        } @else {
          <form (ngSubmit)="send()">
            <label
              >Nom complet<input
                name="name"
                [(ngModel)]="name"
                maxlength="100"
                required
                autocomplete="name"
            /></label>
            <label
              >Email<input
                name="email"
                type="email"
                [(ngModel)]="email"
                maxlength="200"
                required
                autocomplete="email"
            /></label>
            <label
              >Message<textarea
                name="message"
                rows="6"
                [(ngModel)]="message"
                maxlength="2000"
                required
              ></textarea>
            </label>
            <label class="trap" aria-hidden="true"
              >Ne pas remplir<input
                name="website"
                [(ngModel)]="website"
                tabindex="-1"
                autocomplete="off"
            /></label>
            @if (error()) {
              <p class="error" role="alert">{{ error() }}</p>
            }
            <div>
              <button class="btn" type="submit" [disabled]="busy()">
                {{ busy() ? 'Envoi…' : 'Envoyer' }}
              </button>
            </div>
          </form>
        }
      </div>
    </section>
  `,
})
export class Contact {
  protected readonly head = cssUrl(IMAGES.contact);
  private readonly messages = inject(MessageService);
  protected readonly site = SITE;
  protected readonly whatsapp = whatsappLink;

  protected name = '';
  protected email = '';
  protected message = '';
  protected website = '';

  protected readonly busy = signal(false);
  protected readonly sent = signal(false);
  protected readonly error = signal<string | null>(null);

  protected async send() {
    // Un robot a rempli le champ piège : on fait comme si tout allait bien
    if (this.website) return this.sent.set(true);

    this.busy.set(true);
    const error = await this.messages.send(
      this.name.trim(),
      this.email.trim(),
      this.message.trim(),
    );
    this.busy.set(false);
    this.error.set(error);
    if (!error) this.sent.set(true);
  }
}
