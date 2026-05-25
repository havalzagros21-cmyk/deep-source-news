// lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// استيراد ملفات الترجمة
import ar from '../messages/ar.json';
import en from '../messages/en.json';
import ku from '../messages/ku.json';

// تهيئة i18next
if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
      resources: {
        ar: { translation: ar },
        en: { translation: en },
        ku: { translation: ku },
      },
      fallbackLng: 'ar',
      lng: 'ar',
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
      },
    });
}

export default i18n;