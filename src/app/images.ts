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

// Photo de bannière : `position` règle la zone visible (object-position) quand l'image est recadrée
export interface BannerPhoto {
  src: string;
  alt: string;
  position: string;
}

export const BANNERS = {
  activities: {
    src: '/images/banniere-activites.jpg',
    alt: "Quatre membres de l'association lors d'une activité",
    position: '50% 40%',
  },
  team: {
    src: '/images/banniere-equipe.jpg',
    alt: "Trois membres de l'association lors d'une rencontre en plein air",
    position: '50% 45%',
  },
  news: {
    src: '/images/banniere-actualites.jpg',
    alt: 'Deux participants travaillent sur un ordinateur pendant un atelier',
    position: '30% 62%',
  },
  contact: {
    src: '/images/banniere-contact.jpg',
    alt: "Un groupe de membres de l'association posant ensemble",
    position: '50% 25%',
  },
} as const satisfies Record<string, BannerPhoto>;

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
