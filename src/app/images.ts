// Photos de l'association, hébergées dans public/images.
// Pour remplacer une photo : déposer le nouveau fichier au même nom.
export interface Photo {
  src: string;
  srcset: string;
}

export interface GalleryPhoto {
  src: string;
  alt: string;
}

// Photo de groupe (1080 px) : accueil et page « À propos »
export const GROUP_PHOTO: Photo = {
  src: '/images/groupe-1080.jpg',
  srcset: '/images/groupe-800.jpg 800w, /images/groupe-1080.jpg 1080w',
};

// Photos des activités (206 px : à remplacer par des versions plus grandes si possible)
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
  { src: '/images/galerie-5.jpg', alt: 'Séance de formation en salle informatique' },
  { src: '/images/galerie-6.jpg', alt: 'Travaux pratiques pendant une formation' },
  { src: '/images/galerie-7.jpg', alt: 'Participants en atelier devant leurs ordinateurs' },
  { src: '/images/galerie-4.jpg', alt: "Trois intervenants lors d'une rencontre publique" },
];
