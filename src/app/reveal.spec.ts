import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { Reveal } from './reveal';

@Component({ imports: [Reveal], template: '<p appReveal>Texte</p>' })
class Host {}

describe('Reveal', () => {
  it("affiche directement l'élément quand IntersectionObserver n'existe pas", () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const p: HTMLElement = fixture.nativeElement.querySelector('p');
    expect(p.classList).toContain('reveal');
    expect(p.classList).toContain('in');
    vi.unstubAllGlobals();
  });
});
