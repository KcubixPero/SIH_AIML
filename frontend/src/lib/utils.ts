import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import translations from './translations.json';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to create a translation function for a specific language
export const createTranslationFunction = (language: 'en' | 'hi') => {
  return (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
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
};