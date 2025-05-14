import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: require('../locales/en.json') },
    sv: { translation: require('../locales/sv.json') }
  },
  lng: 'sv',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

export const locales = ['en', 'sv'];
