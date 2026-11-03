// Coordonnées et réseaux sociaux de l'association, utilisés dans tout le site.
// Laisser vide un lien (facebook, whatsapp) pour ne pas l'afficher.
export const SITE = {
  name: 'AMISTIC',
  address: 'Bamako, Mali',
  email: 'contact@amistic.ml',
  phone: '+223 00 00 00 00',
  facebook: '', // ex. 'https://www.facebook.com/amistic'
  whatsapp: '', // numéro en format international, sans « + » ni espaces, ex. '22370000000'
  url: 'https://amistic.ml', // adresse définitive du site (aussi à reporter dans src/index.html)
};

export const whatsappLink = SITE.whatsapp ? `https://wa.me/${SITE.whatsapp}` : '';
