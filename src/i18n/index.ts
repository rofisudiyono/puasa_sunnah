import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { resources } from './resources';

export type AppLanguage = 'id' | 'en';

export function normalizeLanguage(language?: string | null): AppLanguage {
  if (!language) {
    return 'id';
  }

  return language.toLowerCase().startsWith('id') ? 'id' : 'en';
}

function resolveDeviceLanguage(): AppLanguage {
  const locale = Localization.getLocales()[0];
  return normalizeLanguage(locale?.languageCode);
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
