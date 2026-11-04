import { describe, expect, it } from 'vitest';
import { GALLERY, GROUP_PHOTO } from './images';

describe('images', () => {
  it('propose la photo de groupe en deux largeurs', () => {
    expect(GROUP_PHOTO.srcset).toBe('/images/groupe-800.jpg 800w, /images/groupe-1080.jpg 1080w');
    expect(GROUP_PHOTO.src).toBe('/images/groupe-1080.jpg');
  });

  it('liste les photos de la galerie avec un texte alternatif', () => {
    expect(GALLERY.length).toBeGreaterThan(0);
    for (const p of GALLERY) expect(p.alt.length).toBeGreaterThan(10);
  });
});
