import Image from 'next/image';
import React from 'react'
import { useTranslation } from '@/lib/useTranslation';

export interface Intern {
  title: string;
  description: string;
  skills: string[];
  company: string;
  logo?: string;
  // ML model specific fields
  similarity_score?: number;
  missing_skills?: string[];
  location?: string;
  stipend?: string;
  duration?: string;
  score?: number;
}

interface JobCardProps {
  intern: Intern;
  recommendation?: any;
  language?: 'en' | 'hi';
}

export const JobCard = ({ intern, recommendation, language = 'en' }: JobCardProps) => {
  const { t } = useTranslation(language);
  return (
    <div className="shadow-faded border border-border p-6 rounded-lg bg-card hover:shadow-lg transition-shadow max-w-3/5 mx-auto">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-lg font-semibold text-card-foreground">{intern.title}</h1>
          </div>
          
          <p className="text-muted-foreground mb-2">{intern.description}</p>
          
          {/* Company and Location Info */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <span>{t('jobCard.companyEmoji')} {intern.company}</span>
            {intern.location && <span>{t('jobCard.locationEmoji')} {intern.location}</span>}
            {intern.stipend && <span>{t('jobCard.stipendEmoji')} {intern.stipend}</span>}
            {intern.duration && <span>{t('jobCard.durationEmoji')} {intern.duration}</span>}
          </div>

          {/* Skills Section */}
          <div className="mb-3">
            <h4 className="text-sm font-medium text-card-foreground mb-2">{t('internships.requiredSkills')}</h4>
            <div className="flex flex-wrap gap-2">
              {intern.skills.map((skill, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-md"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Missing Skills (if available) */}
          {intern.missing_skills && intern.missing_skills.length > 0 && (
            <div className="mb-3">
              <h4 className="text-sm font-medium text-orange-600 mb-2">{t('internships.skillsToLearn')}</h4>
              <div className="flex flex-wrap gap-2">
                {intern.missing_skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-md border border-orange-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-shrink-0">
          {
            intern.logo ? (
              <Image
                src={intern.logo}
                height={60}
                width={60}
                alt={intern.company + " logo"}
                className="rounded-lg border border-border"
              />
            ) : (
              <div className="size-[60px] rounded-lg bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-sm font-medium">
                  {intern.company.charAt(0)}
                </span>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}