'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaGlobe, FaCheck } from 'react-icons/fa';
import i18n from '../lib/i18n-client';

const languages = [
  { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'en', name: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'ku', name: 'Kurdî', flag: '🏴󠁩󠁲󠁱󠁶󠁿', dir: 'ltr' },
];

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('ar');
  const { i18n: i18nInstance } = useTranslation();

  useEffect(() => {
    const savedLang = localStorage.getItem('i18nextLng') || 'ar';
    setCurrentLang(savedLang);
    i18nInstance.changeLanguage(savedLang);
    
    const langData = languages.find(l => l.code === savedLang);
    if (langData) {
      document.documentElement.dir = langData.dir;
      document.documentElement.lang = savedLang;
    }
  }, [i18nInstance]);

  const changeLanguage = (langCode: string) => {
    i18nInstance.changeLanguage(langCode);
    setCurrentLang(langCode);
    setIsOpen(false);
    
    localStorage.setItem('i18nextLng', langCode);
    
    const langData = languages.find(l => l.code === langCode);
    if (langData) {
      document.documentElement.dir = langData.dir;
      document.documentElement.lang = langCode;
    }
  };

  const currentLangData = languages.find(l => l.code === currentLang);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="اختيار اللغة"
      >
        <FaGlobe className="text-gray-300 text-sm" />
        <span className="text-white text-xs hidden sm:inline">
          {currentLangData?.name}
        </span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute left-0 top-full mt-2 bg-gray-800 rounded-lg shadow-xl z-50 min-w-[140px] overflow-hidden">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors ${
                  currentLang === lang.code
                    ? 'bg-red-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="flex-1 text-right">{lang.name}</span>
                {currentLang === lang.code && <FaCheck size={12} />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}