import { describe, expect, it } from 'vitest';
import { GALLERY, IMAGES, cssUrl } from './images';

describe('IMAGES', () => {
  it('propose deux largeurs pour chaque photo', () => {
    for (const image of Object.values(IMAGES)) {
      expect(image.srcset).toMatch(/-800\.jpg 800w, .*-(1600|1080)\.jpg \d+w$/);
      expect(image.src).toMatch(/-(1600|1080)\.jpg$/);
    }
  });

  it("fabrique la valeur CSS d'un bandeau", () => {
    expect(cssUrl(IMAGES.hero)).toBe('url(/images/hero-1600.jpg)');
  });
});
