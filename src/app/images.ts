// Photos hébergées dans public/images. Les bandeaux et l'accueil utilisent des photos libres de droits
// (Unsplash) en deux largeurs ; « group » et la galerie sont de vraies photos de l'association.
// Pour remplacer une photo : déposer le fichier au même nom.
export interface Photo {
  src: string;
  srcset: string;
}

const photo = (name: string, large = 1600): Photo => ({
  src: `/images/${name}-${large}.jpg`,
  srcset: `/images/${name}-800.jpg 800w, /images/${name}-${large}.jpg ${large}w`,
});

export interface GalleryPhoto {
  src: string;
  alt: string;
}

// Photos réelles des activités (206 px : à remplacer par des versions plus grandes si possible)
export const GALLERY: readonly GalleryPhoto[] = [
  {
    src: '/images/galerie-1.jpg',
    alt: "Maintenance d'équipements réseau dans une salle technique",
  },
  {
    src: '/images/galerie-2.jpg',
    alt: 'Participants en atelier de formation dans une salle informatique',
  },
  { src: '/images/galerie-3.jpg', alt: "Remise d'une attestation à une participante" },
  { src: '/images/galerie-4.jpg', alt: "Trois intervenants lors d'une rencontre publique" },
  { src: '/images/galerie-5.jpg', alt: 'Séance de formation en salle informatique' },
  { src: '/images/galerie-6.jpg', alt: 'Travaux pratiques pendant une formation' },
  { src: '/images/galerie-7.jpg', alt: 'Participants en atelier devant leurs ordinateurs' },
];

export const IMAGES = {
  hero: photo('hero'),
  group: photo('groupe', 1080),
  // Bandeaux des pages intérieures
  activities: photo('activites'),
  team: photo('equipe'),
  news: photo('actualites'),
  contact: photo('contact'),
} as const;

/** Valeur de la variable CSS --head-image utilisée par les bandeaux (.page-head). */
export const cssUrl = (image: Photo) => `url(${image.src})`;
