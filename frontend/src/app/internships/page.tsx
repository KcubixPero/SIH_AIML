"use client"

import { useState } from 'react';
import { Filter } from "@/components/Filter";
import { Internships } from "@/components/Internships";
import { useTranslation } from "@/lib/useTranslation";

export default function page() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t, language, changeLanguage } = useTranslation();

  const handleRecommendations = (newRecommendations: any[]) => {
    setRecommendations(newRecommendations);
  };

  const handleLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Language Toggle */}
      <div className="flex justify-end mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => changeLanguage('en')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              language === 'en' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {t('page.languageEnglish')}
          </button>
          <button
            onClick={() => changeLanguage('hi')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              language === 'hi' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {t('page.languageHindi')}
          </button>
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {t('page.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('page.subtitle')}
        </p>
      </div>
      
      <Filter 
        onRecommendations={handleRecommendations}
        onLoading={handleLoading}
        language={language}
      />
      
      <Internships 
        recommendations={recommendations}
        isLoading={isLoading}
        language={language}
      />
    </div>
  )
}