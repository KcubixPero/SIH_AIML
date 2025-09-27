"use client"

import React, { useState, useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from './ui/button'
import { XIcon, Search, Loader2 } from 'lucide-react'
import { useTranslation } from '@/lib/useTranslation'
import translations from '@/lib/translations.json'
import { createTranslationFunction } from '@/lib/utils'

interface FilterProps {
  onRecommendations: (recommendations: any[]) => void;
  onLoading: (loading: boolean) => void;
  language: 'en' | 'hi';
}

export const Filter = ({ onRecommendations, onLoading, language }: FilterProps) => {
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedDuration, setSelectedDuration] = useState<string>("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modelType, setModelType] = useState<'tfidf' | 'ann'>('tfidf');
  const { t: tBase } = useTranslation();
  
  // Create a translation function that uses the passed language
  const t = createTranslationFunction(language);

  // Use translated skills and locations
  useEffect(() => {
    setAvailableSkills(translations[language].skills);
    setAvailableLocations(translations[language].locations);
  }, [language]);

  const handleGetRecommendations = async () => {
    if (selectedSkills.length === 0) {
      alert(t('filter.selectAtLeastOneSkill'));
      return;
    }

    setIsLoading(true);
    onLoading(true);

    try {
      const requestBody = {
        skills: selectedSkills,
        locations: selectedLocation ? [selectedLocation] : [],
        interests: [], // Could be added later
        model_type: modelType,
        top_k: 10
      };

      const response = await fetch('http://localhost:5000/api/recommendations/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        onRecommendations(data.recommendations || []);
      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        alert(t('filter.errorGettingRecommendations') + ' ' + (errorData.error || t('filter.unknownError')));
      }
    } catch (error) {
      console.error('Network Error:', error);
      alert(t('filter.networkError'));
    } finally {
      setIsLoading(false);
      onLoading(false);
    }
  };

  return (
    <div className="w-5xl space-y-4">
      <div className="flex gap-4 mb-6">
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="w-[180px] min-h-10">
            <SelectValue placeholder={t('filter.location')} />
          </SelectTrigger>
          <SelectContent>
            {availableLocations.map(loc => (
              <SelectItem key={loc} value={loc}>{loc}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedDuration} onValueChange={setSelectedDuration}>
          <SelectTrigger className="w-[180px] min-h-10">
            <SelectValue placeholder={t('filter.duration')} />
          </SelectTrigger>
          <SelectContent>
            {translations[language].durations.map(d => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex-1 flex gap-2">
          <SkillsSelect 
            selectedSkills={selectedSkills}
            onSkillsChange={setSelectedSkills}
            availableSkills={availableSkills}
            language={language}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={handleGetRecommendations}
          disabled={isLoading || selectedSkills.length === 0}
          className="px-8 py-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('filter.gettingRecommendations')}
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              {t('filter.getRecommendations')}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

interface SkillsSelectProps {
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
  availableSkills: string[];
  language: 'en' | 'hi';
}

const SkillsSelect = ({ selectedSkills, onSkillsChange, availableSkills, language }: SkillsSelectProps) => {
  // Create a translation function that uses the passed language
  const t = createTranslationFunction(language);
  const handleSkillSelect = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      onSkillsChange(selectedSkills.filter((s) => s !== skill));
    } else {
      onSkillsChange([...selectedSkills, skill]);
    }
  };

  return (
    <div className="w-full flex gap-2">
      <div className="flex-1 min-h-10 border rounded-lg p-2 flex flex-wrap gap-1 shadow-faded">
        {
          selectedSkills.map(s => (
            <span 
              key={s}
              className="px-2 h-6 text-xs bg-secondary text-secondary-foreground rounded-sm border border-border flex items-center gap-1"
            >
              {s}
              <button
                onClick={() => handleSkillSelect(s)}
                className="ml-1 hover:text-destructive"
                type="button"
              >
                <XIcon className="size-2" />
              </button>
            </span>
          ))
        }
        {selectedSkills.length === 0 && (
          <span className="text-muted-foreground text-sm">{t('filter.noSkillsSelected')}</span>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="px-3 py-1.5 max-h-10 rounded-lg border border-border shadow-faded text-sm bg-background hover:bg-accent hover:text-accent-foreground transition-colors">
          {t('filter.selectSkills')}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-[18rem] w-[200px]">
          <DropdownMenuLabel>{t('filter.selectSkills')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {
            availableSkills.map(s => (
              <DropdownMenuItem
                key={s}
                onClick={() => handleSkillSelect(s)}
                className="cursor-pointer"
              >
                {s}
                {selectedSkills.includes(s) && (
                  <span className="ml-auto text-primary">✓</span>
                )}
              </DropdownMenuItem>
            ))
          }
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

 