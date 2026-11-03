import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { SITE } from './site.config';

export interface SharePreview {
  title: string;
  description: string;
  image?: string | null;
}

const DEFAULT_TITLE = 'AMISTIC – Rendre les TIC accessibles à tous';
const DEFAULT_IMAGE = `${SITE.url}/og-image.jpg`;

// Balises de référencement et de partage (description, indexation, adresse canonique, aperçu Facebook/WhatsApp)
@Injectable({ providedIn: 'root' })
export class Seo {
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);
  private structuredData?: HTMLScriptElement;

  /** Appliqué à chaque navigation à partir des données de la route (voir app.routes.ts). */
  applyRoute(data: { description?: string; noindex?: boolean }, url: string) {
    if (data.description) {
      this.meta.updateTag({ name: 'description', content: data.description });
      this.meta.updateTag({ property: 'og:description', content: data.description });
    }
    this.meta.updateTag({
      name: 'robots',
      content: data.noindex ? 'noindex, nofollow' : 'index, follow',
    });

    const path = url.split(/[?#]/)[0];
    const pageUrl = SITE.url + (path === '/' ? '/' : path);
    this.meta.updateTag({ property: 'og:url', content: pageUrl });
    this.doc.querySelector('link[rel="canonical"]')?.setAttribute('href', pageUrl);
  }

  /** Aperçu de partage propre à une page (ex. un article). */
  setShare({ title, description, image }: SharePreview) {
    const picture = image || DEFAULT_IMAGE;
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: picture });
    this.meta.updateTag({ name: 'twitter:image', content: picture });
  }

  resetShare() {
    this.meta.updateTag({ property: 'og:title', content: DEFAULT_TITLE });
    this.meta.updateTag({ property: 'og:image', content: DEFAULT_IMAGE });
    this.meta.updateTag({ name: 'twitter:image', content: DEFAULT_IMAGE });
  }

  noindex() {
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
  }

  /** Données structurées (JSON-LD) lues par Google. */
  setStructuredData(data: object) {
    this.clearStructuredData();
    const script = this.doc.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    this.doc.head.appendChild(script);
    this.structuredData = script;
  }

  clearStructuredData() {
    this.structuredData?.remove();
    this.structuredData = undefined;
  }
}
