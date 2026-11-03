import { TestBed } from '@angular/core/testing';
import { Meta } from '@angular/platform-browser';
import { describe, expect, it } from 'vitest';
import { Seo } from './seo';

describe('Seo', () => {
  it("applique la description et l'indexation de la route", () => {
    const seo = TestBed.inject(Seo);
    const meta = TestBed.inject(Meta);
    seo.applyRoute({ description: 'Une description' }, '/contact');
    expect(meta.getTag('name="description"')?.content).toBe('Une description');
    expect(meta.getTag('name="robots"')?.content).toBe('index, follow');
  });

  it('exclut les pages marquées noindex', () => {
    const seo = TestBed.inject(Seo);
    const meta = TestBed.inject(Meta);
    seo.applyRoute({ noindex: true }, '/admin');
    expect(meta.getTag('name="robots"')?.content).toContain('noindex');
  });
});
