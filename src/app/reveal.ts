import { AfterViewInit, Directive, ElementRef, OnDestroy, inject } from '@angular/core';

// Fait apparaître l'élément en douceur quand il entre dans l'écran.
// Le décalage se règle avec la variable CSS --d (ex. style="--d: 120ms").
@Directive({ selector: '[appReveal]', host: { class: 'reveal' } })
export class Reveal implements AfterViewInit, OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private observer?: IntersectionObserver;

  ngAfterViewInit() {
    if (typeof IntersectionObserver === 'undefined') {
      this.el.classList.add('in');
      return;
    }
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.el.classList.add('in');
          this.observer?.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    this.observer.observe(this.el);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
