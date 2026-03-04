import { enTranslation } from './translations/en';
import { idTranslation } from './translations/id';

export const resources = {
  id: {
    translation: idTranslation,
  },
  en: {
    translation: enTranslation,
  },
} as const;

export type TranslationResources = typeof resources;
