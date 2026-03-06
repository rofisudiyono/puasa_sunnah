import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { resources } from './resources';

export type AppLanguage = 'id' | 'en';

export function normalizeLanguage(language?: string | null): AppLanguage {
  if (!language) {
    return 'en';
  }

  return language.toLowerCase().startsWith('id') ? 'id' : 'en';
}

function resolveDeviceLanguage(): AppLanguage {
  const locale = Localization.getLocales()[0];
  const regionCode = locale?.regionCode
    ?? locale?.languageTag?.split('-')[1]
    ?? locale?.languageTag?.split('_')[1];

  if (regionCode?.toUpperCase() === 'ID') {
    return 'id';
  }

  return 'en';
}

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    compatibilityJSON: 'v4',
    resources,
    lng: resolveDeviceLanguage(),
    fallbackLng: 'id',
    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18n;
