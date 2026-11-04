import { describe, expect, it } from 'vitest';
import { GALLERY, GROUP_PHOTO, defaultActivityPhoto } from './images';

describe('images', () => {
  it('propose la photo de groupe en deux largeurs', () => {
    expect(GROUP_PHOTO.srcset).toBe('/images/groupe-800.jpg 800w, /images/groupe-1080.jpg 1080w');
    expect(GROUP_PHOTO.src).toBe('/images/groupe-1080.jpg');
  });

  it('liste les photos de la galerie avec un texte alternatif', () => {
    expect(GALLERY.length).toBeGreaterThan(0);
    for (const p of GALLERY) expect(p.alt.length).toBeGreaterThan(10);
  });

  it("trouve la photo par défaut d'une activité malgré accents et majuscules", () => {
    expect(defaultActivityPhoto('Écoles et communautés')).toBe('/images/activite-ecoles.jpg');
    expect(defaultActivityPhoto(' INITIATION ')).toBe('/images/activite-initiation.jpg');
  });

  it('ne propose aucune photo pour une activité inconnue', () => {
    expect(defaultActivityPhoto('Concours de robotique')).toBeNull();
  });
});
