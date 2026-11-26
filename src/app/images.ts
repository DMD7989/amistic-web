// Photos de l'association, hébergées dans public/images.
// Pour remplacer une photo : déposer le nouveau fichier au même nom.
export interface Photo {
  src: string;
  srcset: string;
}

export interface GalleryPhoto {
  src: string; // version affichée dans la galerie
  full?: string; // grande version, ouverte au clic (par défaut : src)
  alt: string;
  width: number;
  height: number;
}

// Photos de la formation « L'intelligence artificielle et la méthodologie de recherche documentaire en ligne »
// (version légère -640 pour les galeries ; les meilleures photos en premier)
const trainingPhoto = (n: string, alt: string, portrait = false): GalleryPhoto => ({
  src: `/images/formation-ia-${n}-640.jpg`,
  full: `/images/formation-ia-${n}.jpg`,
  alt,
  width: portrait ? 480 : 640,
  height: portrait ? 640 : 480,
});

export const TRAINING_PHOTOS: readonly GalleryPhoto[] = [
  trainingPhoto('06', "Le formateur s'adresse aux participants installés autour des tables"),
  trainingPhoto(
    '07',
    "Participants suivant la présentation sur l'intelligence artificielle avec leurs ordinateurs",
  ),
  trainingPhoto('08', 'Participants en séance de travail avec leurs ordinateurs portables'),
  trainingPhoto(
    '10',
    'Participants attentifs pendant la formation sur la recherche documentaire en ligne',
  ),
  trainingPhoto('11', 'Participants installés autour des tables pendant la formation'),
  trainingPhoto('01', 'Le formateur devant les participants en début de séance', true),
  trainingPhoto('02', 'Participants assis en salle pendant la formation', true),
  trainingPhoto('03', 'Participants suivant la présentation projetée sur écran'),
  trainingPhoto('04', 'Participants suivant la présentation projetée dans la salle'),
  trainingPhoto('05', 'Participants devant la présentation projetée sur écran'),
  trainingPhoto('09', 'Participants suivant la formation dans la salle'),
];

// Photo de bannière : `position` règle la zone visible (object-position) quand l'image est recadrée
export interface BannerPhoto {
  src: string;
  alt: string;
  position: string;
}

export const BANNERS = {
  activities: {
    src: '/images/formation-ia-08.jpg',
    alt: 'Participants à une formation AMISTIC travaillant sur leurs ordinateurs portables',
    position: '50% 55%',
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
    width: 206,
    height: 206,
  },
  {
    src: '/images/galerie-2.jpg',
    alt: 'Participants en atelier de formation dans une salle informatique',
    width: 206,
    height: 206,
  },
  {
    src: '/images/galerie-3.jpg',
    alt: "Remise d'une attestation à une participante",
    width: 206,
    height: 206,
  },
  {
    src: '/images/galerie-5.jpg',
    alt: 'Séance de formation en salle informatique',
    width: 206,
    height: 206,
  },
  {
    src: '/images/galerie-6.jpg',
    alt: 'Travaux pratiques pendant une formation',
    width: 206,
    height: 206,
  },
  {
    src: '/images/galerie-7.jpg',
    alt: 'Participants en atelier devant leurs ordinateurs',
    width: 206,
    height: 206,
  },
  {
    src: '/images/galerie-4.jpg',
    alt: "Trois intervenants lors d'une rencontre publique",
    width: 206,
    height: 206,
  },
];

// Sélection pour l'accueil : formation récente et activités passées
export const HOME_GALLERY: readonly GalleryPhoto[] = [
  TRAINING_PHOTOS[0],
  GALLERY[0],
  TRAINING_PHOTOS[2],
  GALLERY[2],
];

// Photos par défaut des activités (photos libres de droits, Unsplash), reconnues d'après le titre.
// Une photo envoyée depuis le back-office remplace toujours celle-ci.
const ACTIVITY_PHOTOS: Record<string, string> = {
  initiation: '/images/activite-initiation.jpg',
  sensibilisation: '/images/activite-sensibilisation.jpg',
  formation: '/images/formation-ia-06.jpg',
  'ecoles et communautes': '/images/activite-ecoles.jpg',
  partenariats: '/images/activite-partenariats.jpg',
  innovation: '/images/activite-innovation.jpg',
};

const normalize = (title: string) =>
  title
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();

/** Photo par défaut d'une activité d'après son titre, ou null si aucune ne correspond. */
export const defaultActivityPhoto = (title: string): string | null =>
  ACTIVITY_PHOTOS[normalize(title)] ?? null;
