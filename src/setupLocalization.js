import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en';

export default () => i18next.use(initReactI18next).init({
  lng: 'en',
  resources: {
    en: { translation: enTranslation },
  },
  interpolation: { escapeValue: false },
});
