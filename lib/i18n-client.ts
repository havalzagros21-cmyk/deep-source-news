// lib/i18n-client.ts
'use client';

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// استيراد ملفات الترجمة
import ar from '../messages/ar.json';
import en from '../messages/en.json';
import ku from '../messages/ku.json';

// تهيئة i18next للاستخدام في العميل (ترجمة فورية بدون تغيير الرابط)
if (typeof window !== 'undefined' && !i18next.isInitialized) {
  i18next
    .use(LanguageDetector)
    .use(initReactI18next)
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

export default i18next;