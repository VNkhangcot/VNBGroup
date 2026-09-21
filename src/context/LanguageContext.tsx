import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, type Language, type TranslationSchema } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationSchema;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('vnb_language') as Language;
      if (saved === 'vi' || saved === 'en' || saved === 'zh') return saved;
    } catch {
      // ignore localStorage error in incognito/restricted environment
    }
    return 'vi';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('vnb_language', lang);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
    if (language === 'vi') {
      document.title = 'VNBGroup — Tập Đoàn Công Nghệ Thông Tin Toàn Diện';
    } else if (language === 'en') {
      document.title = 'VNBGroup — Comprehensive Enterprise IT Corporation';
    } else if (language === 'zh') {
      document.title = 'VNBGroup — 全栈式企业级IT科技集团';
    }
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
