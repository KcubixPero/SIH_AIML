import React from 'react'
import { Intern, JobCard } from './JobCard';
import { useTranslation } from '@/lib/useTranslation';

interface InternshipsProps {
  recommendations: any[];
  isLoading: boolean;
  language: 'en' | 'hi';
}

export const Internships = ({ recommendations, isLoading, language }: InternshipsProps) => {
  const { t } = useTranslation(language);
  if (isLoading) {
    return (
      <div className="space-y-4 w-5xl">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">{t('internships.loading')}</p>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="space-y-4 w-5xl">
        <div className="text-center py-8">
          <p className="text-muted-foreground">{t('internships.noRecommendations')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-5xl">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">{t('internships.title')}</h2>
        <p className="text-sm text-muted-foreground">{t('internships.found', { count: recommendations.length })}</p>
      </div>
      {
        recommendations.slice(0, 5).map((rec, index) => (
          <JobCard 
            intern={convertRecommendationToIntern(rec)} 
            key={`${rec.job_title || rec.role}-${index}`} 
            recommendation={rec}
            language={language}
          />
        ))
      }
    </div>
  )
}

// Convert API recommendation to Intern format
const convertRecommendationToIntern = (rec: any): Intern => {
  return {
    title: rec.job_title || rec.role || 'Internship Position',
    description: rec.description || `Great opportunity at ${rec.company || 'a leading company'}`,
    skills: rec.skills || rec.matched_skills || [],
    company: rec.company || 'Company',
    logo: undefined, // Could be added later
    // Additional fields from ML model
    similarity_score: rec.similarity_score,
    missing_skills: rec.missing_skills,
    location: rec.location,
    stipend: rec.stipend,
    duration: rec.duration,
    score: rec.score
  };
}

const internships: Intern[] = [
  {
    title: "Software Engineering Intern",
    description: "Build scalable web apps with our team.",
    skills: ["JavaScript", "React", "Node.js", "Problem Solving"],
    company: "TechNova",
    // No logo for this one
  },
  {
    title: "Data Science Intern",
    description: "Analyze data and build predictive models.",
    skills: ["Python", "Pandas", "Machine Learning", "Statistics"],
    company: "DataWiz",
    // Using a company logo (example: a generic data logo)
    logo: "https://dummyimage.com/80x80/cccccc/000000&text=D"
  },
  {
    title: "Product Design Intern",
    description: "Create user-friendly interfaces with designers.",
    skills: ["Figma", "UI/UX", "Prototyping", "Creativity"],
    company: "Designify",
    // Using a character image with company initial "D"
    logo: "https://dummyimage.com/80x80/cccccc/000000&text=D"
  },
  {
    title: "Marketing Intern",
    description: "Assist with campaigns and content creation.",
    skills: ["Content Writing", "SEO", "Social Media", "Analytics"],
    company: "MarketMinds",
    // No logo for this one
  },
  {
    title: "Cybersecurity Intern",
    description: "Help monitor and secure our systems.",
    skills: ["Networking", "Security Tools", "Linux", "Attention to Detail"],
    company: "SecureNet",
    // Using a character image with company initial "S"
    logo: "https://dummyimage.com/80x80/cccccc/000000&text=N"
  }
];
