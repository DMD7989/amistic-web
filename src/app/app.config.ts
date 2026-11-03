import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withPreloading,
} from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      // Les paramètres d'adresse (ex. :id) arrivent directement en input() des composants
      withComponentInputBinding(),
      // Retour en haut à chaque page, et retour à la position précédente avec le bouton « Précédent »
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
      // Les pages se chargent en arrière-plan : la navigation devient instantanée
      withPreloading(PreloadAllModules),
    ),
  ],
};
