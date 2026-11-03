import { describe, expect, it, vi } from 'vitest';
import { shrinkImage } from './image-resize';

describe('shrinkImage', () => {
  it('renvoie le fichier tel quel si le navigateur ne sait pas le traiter', async () => {
    vi.stubGlobal('createImageBitmap', undefined);
    const file = new File(['x'], 'photo.jpg', { type: 'image/jpeg' });
    expect(await shrinkImage(file)).toBe(file);
    vi.unstubAllGlobals();
  });

  it('laisse les SVG intacts', async () => {
    const file = new File(['<svg/>'], 'logo.svg', { type: 'image/svg+xml' });
    expect(await shrinkImage(file)).toBe(file);
  });

  it("renvoie le fichier d'origine en cas d'erreur de lecture", async () => {
    vi.stubGlobal('createImageBitmap', () => Promise.reject(new Error('illisible')));
    const file = new File(['x'], 'photo.png', { type: 'image/png' });
    expect(await shrinkImage(file)).toBe(file);
    vi.unstubAllGlobals();
  });
});
