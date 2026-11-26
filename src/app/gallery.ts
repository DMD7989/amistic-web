import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { GALLERY, GalleryPhoto } from './images';
import { Reveal } from './reveal';

// Galerie de photos : chaque photo garde ses proportions (disposition en colonnes),
// et un clic l'ouvre en grand avec navigation au clavier (← → Échap).
@Component({
  selector: 'app-gallery',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal],
  styles: `
    .grid {
      column-width: 250px;
      column-gap: 0.9rem;
    }
    // Mode « aligné » : rangée régulière, photos recadrées en 4:3
    .grid.uniform {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 0.9rem;
      column-width: auto;
    }
    .uniform .item {
      margin: 0;
    }
    .uniform .item img {
      aspect-ratio: 4 / 3;
      object-fit: cover;
    }
    .item {
      display: block;
      width: 100%;
      margin: 0 0 0.9rem;
      padding: 0;
      border: 0;
      border-radius: 10px;
      overflow: hidden;
      background: #dfe3e6;
      cursor: zoom-in;
      break-inside: avoid;
      position: relative;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition:
        box-shadow 0.3s ease,
        transform 0.3s ease;
    }
    .item:hover {
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
      transform: translateY(-3px);
    }
    .item img {
      display: block;
      width: 100%;
      height: auto;
    }
    .item::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.35), transparent 45%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .item:hover::after,
    .item:focus-visible::after {
      opacity: 1;
    }

    dialog {
      width: min(1100px, 94vw);
      max-height: 94vh;
      padding: 0;
      border: 0;
      border-radius: 12px;
      background: #111;
      color: #fff;
      overflow: hidden;
    }
    dialog:focus {
      outline: none;
    }
    dialog::backdrop {
      background: rgba(0, 0, 0, 0.82);
    }
    .stage {
      display: grid;
      place-items: center;
      min-height: 200px;
      padding: 1rem 3.5rem 0;
    }
    .stage img {
      max-width: 100%;
      max-height: 78vh;
      object-fit: contain;
      border-radius: 6px;
    }
    .bar {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: center;
      padding: 0.8rem 1.2rem 1rem;
      font-size: 0.9rem;
      color: #ddd;
    }
    .bar span:last-child {
      white-space: nowrap;
      color: #aaa;
    }
    .ctl {
      position: absolute;
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.14);
      color: #fff;
      font-size: 1.5rem;
      line-height: 1;
      cursor: pointer;
      transition: background 0.2s ease;
    }
    .ctl:hover {
      background: rgba(255, 255, 255, 0.28);
    }
    .ctl.prev {
      left: 0.6rem;
      top: 40%;
    }
    .ctl.next {
      right: 0.6rem;
      top: 40%;
    }
    .ctl.close {
      right: 0.6rem;
      top: 0.6rem;
      width: 38px;
      height: 38px;
      font-size: 1.3rem;
    }
    @media (max-width: 600px) {
      .stage {
        padding: 3rem 0.5rem 0;
      }
      .ctl.prev,
      .ctl.next {
        top: auto;
        bottom: 0.8rem;
      }
    }
  `,
  template: `
    <div class="grid" [class.uniform]="uniform()">
      @for (p of shown(); track p.src; let i = $index) {
        <button
          type="button"
          class="item"
          appReveal
          [style.--d]="(i % 3) * 100 + 'ms'"
          [attr.aria-label]="'Agrandir la photo : ' + p.alt"
          (click)="open(i)"
        >
          <img
            [src]="p.src"
            [alt]="p.alt"
            [attr.width]="p.width"
            [attr.height]="p.height"
            loading="lazy"
            decoding="async"
          />
        </button>
      }
    </div>

    <dialog
      #viewer
      tabindex="-1"
      [attr.aria-label]="'Photo ' + (current() + 1) + ' sur ' + shown().length"
      (click)="onBackdrop($event)"
      (close)="current.set(-1)"
      (keydown.arrowleft)="step(-1)"
      (keydown.arrowright)="step(1)"
    >
      @if (selected(); as p) {
        <div class="stage">
          <img [src]="p.full ?? p.src" [alt]="p.alt" />
        </div>
        <div class="bar">
          <span>{{ p.alt }}</span>
          <span>{{ current() + 1 }} / {{ shown().length }}</span>
        </div>
        <button type="button" class="ctl close" aria-label="Fermer" (click)="close()">×</button>
        @if (shown().length > 1) {
          <button type="button" class="ctl prev" aria-label="Photo précédente" (click)="step(-1)">
            ‹
          </button>
          <button type="button" class="ctl next" aria-label="Photo suivante" (click)="step(1)">
            ›
          </button>
        }
      }
    </dialog>
  `,
})
export class Gallery {
  readonly photos = input<readonly GalleryPhoto[]>(GALLERY);
  readonly limit = input(Infinity);
  readonly uniform = input(false);
  protected readonly shown = computed(() => this.photos().slice(0, this.limit()));

  private readonly viewer = viewChild.required<ElementRef<HTMLDialogElement>>('viewer');
  protected readonly current = signal(-1);
  protected readonly selected = computed(() => this.shown()[this.current()] ?? null);

  protected open(index: number) {
    this.current.set(index);
    this.viewer().nativeElement.showModal();
  }

  protected close() {
    this.viewer().nativeElement.close();
  }

  protected step(delta: number) {
    const n = this.shown().length;
    this.current.update((i) => (i + delta + n) % n);
  }

  // Un clic sur le fond sombre (en dehors du contenu) ferme la fenêtre
  protected onBackdrop(event: MouseEvent) {
    if (event.target === this.viewer().nativeElement) this.close();
  }
}
