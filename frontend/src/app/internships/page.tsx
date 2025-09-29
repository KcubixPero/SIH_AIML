"use client"

import { useState } from 'react';
import { Filter, Recommendation } from "@/components/Filter";
import { Internships } from "@/components/Internships";
import { useTranslation } from "@/lib/useTranslation";
import { Button } from '@/components/ui/button';
import { LanguageSelect } from '@/components/ui/LanguageSelect';


export default function InternshipsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const handleRecommendations = (newRecommendations: Recommendation[]) => {
    setRecommendations(newRecommendations);
  };

  const handleLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="text-center mt-12 mb-8">
        <h1 className="text-3xl md:text-4xl leading-8 font-bold text-foreground mb-1 md:mb-2">
          {t('page.title')}
        </h1>
        <p className="text-muted-foreground max-md:text-sm">
          {t('page.subtitle')}
        </p>
      </div>

      <Filter
        onRecommendations={handleRecommendations}
        onLoading={handleLoading}
      />

      <Internships
        recommendations={recommendations}
        isLoading={isLoading}
      />
    </div>
  )
}