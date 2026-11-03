import { describe, expect, it } from 'vitest';
import { SITE } from './site.config';

describe('SITE', () => {
  it('a une adresse de site sans barre finale', () => {
    expect(SITE.url).toMatch(/^https?:\/\/[^/]+$/);
  });
});
