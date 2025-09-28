import React from 'react'
import { Intern, JobCard } from './JobCard';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { createTranslationFunction } from '@/lib/utils';

interface Recommendation {
  job_title?: string;
  role?: string;
  description?: string;
  skills?: string[];
  matched_skills?: string[];
  company?: string;
  similarity_score?: number;
  missing_skills?: string[];
  location?: string;
  stipend?: string;
  duration?: string;
  score?: number;
}

interface InternshipsProps {
  recommendations: Recommendation[];
  isLoading: boolean;
}

export const Internships = ({ recommendations, isLoading }: InternshipsProps) => {
  const { language } = useLanguage();
  // Create a translation function that uses the passed language
  const t = createTranslationFunction(language);
  if (isLoading) {
    return (
      <div className="space-y-4 w-full">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">{t('internships.loading')}</p>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="space-y-4 w-full">
        <div className="text-center py-8">
          <p className="text-muted-foreground">{t('internships.noRecommendations')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">{t('internships.title')}</h2>
        <p className="text-sm text-muted-foreground">{t('internships.found', { count: recommendations.length })}</p>
      </div>
      {
        recommendations.slice(0, 5).map((rec, index) => (
          <JobCard 
            intern={convertRecommendationToIntern(rec, language)} 
            key={`${rec.job_title ?? rec.role ?? 'unknown'}-${index}`} 
          />
        ))
      }
    </div>
  )
}

// Convert API recommendation to Intern format
const convertRecommendationToIntern = (rec: Recommendation, language: Language = 'en'): Intern => {
  // Create a translation function that uses the passed language
  const t = createTranslationFunction(language);
  return {
    title: rec.job_title || rec.role || t('jobCard.defaultTitle'),
    description: rec.description || `Great opportunity at ${rec.company || 'a leading company'}`,
    skills: rec.skills || rec.matched_skills || [],
    company: rec.company || t('jobCard.defaultCompany'),
    logo: undefined, // Could be added later
    similarity_score: rec.similarity_score,
    missing_skills: rec.missing_skills,
    location: rec.location,
    stipend: rec.stipend,
    duration: rec.duration,
    score: rec.score
  };
}
