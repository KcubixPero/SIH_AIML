import { useLanguage } from '@/contexts/LanguageContext';
import translations from './translations.json';

type TranslationKey = string;

export const useTranslation = () => {
  const { language } = useLanguage();

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: unknown = translations[language];
    
    for (const k of keys) {
      value = (value as Record<string, string>)[k];
    }
    
    if (typeof value !== 'string') {
      return key; // Return key if translation not found
    }
    
    // Replace parameters in the string
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }
    
    return value;
  };

  return {
    t,
    language,
    isEnglish: language === 'en',
    isHindi: language === 'hi'
  };
};
