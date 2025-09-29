"use client"

import React, { useState, useEffect, useRef } from 'react'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './ui/button'
import { XIcon, Search, Loader2, Mic } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import translations from '@/lib/translations.json'
import { createTranslationFunction } from '@/lib/utils'

export interface Recommendation {
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

interface FilterProps {
  onRecommendations: (recommendations: Recommendation[]) => void;
  onLoading: (loading: boolean) => void;
}

export const Filter = ({ onRecommendations, onLoading }: FilterProps) => {
  const { language } = useLanguage();
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedDuration, setSelectedDuration] = useState<string>("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="w-full space-y-4">
      <div className="flex max-md:flex-col gap-4 mb-6">
        <div className="flex gap-4">
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-1/2 md:w-[180px] min-h-10">
              <SelectValue placeholder={t('filter.location')} />
            </SelectTrigger>
            <SelectContent>
              {availableLocations.map(loc => (
                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedDuration} onValueChange={setSelectedDuration}>
            <SelectTrigger className="w-1/2 md:w-[180px] min-h-10">
              <SelectValue placeholder={t('filter.duration')} />
            </SelectTrigger>
            <SelectContent>
              {translations[language].durations.map(d => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 flex gap-2">
          <SkillsSelect
            selectedSkills={selectedSkills}
            onSkillsChange={setSelectedSkills}
            availableSkills={availableSkills}
          />
        </div>

        <VoiceInput t={t} />
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



const VoiceInput = ({ t }: { t: (key: string) => string }) => {
  const words = t('voiceInput.example').split(" ");
  const [displayedWords, setDisplayedWords] = useState<string[]>(words);
  const [animating, setAnimating] = useState(false);
  const timeouts = useRef<NodeJS.Timeout[]>([]);

  // Start animation when dialog opens
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setDisplayedWords([]);
      setAnimating(true);
      let currentIndex = 0;
      const showNextWord = () => {
        if (currentIndex < words.length) {
          setDisplayedWords((prev) => [...prev, words[currentIndex]]);
          currentIndex++;
          // Random delay between 200ms and 1800ms for natural effect
          const delay = 200 + Math.random() * 1600;
          const timeout = setTimeout(showNextWord, delay);
          timeouts.current.push(timeout);
        } else {
          setAnimating(false);
        }
      };
      showNextWord();
      return () => {
        // Cleanup on unmount or dialog close
        timeouts.current.forEach(clearTimeout);
        timeouts.current = [];
      };
    } else {
      // If dialog closes, cleanup and reset
      setDisplayedWords([]);
      setAnimating(false);
      timeouts.current.forEach(clearTimeout);
      timeouts.current = [];
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full size-10 cursor-pointer">
          <Mic className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t('voiceInput.title')}
          </DialogTitle>
          <div className="border my-4 p-2 rounded-lg min-h-[2.5rem] bg-black/5 transition-colors">
            <span className="text-muted-foreground text-xs block mb-1">
              {t('voiceInput.label')}
            </span>
            <span className="block text-base">
              {displayedWords.map((word, i) => (
                <span
                  key={i}
                  className="inline-block animate-fade-in"
                  style={{
                    animation: "fadeIn 0.4s",
                    marginRight: "0.5ch",
                  }}
                >
                  {word}
                </span>
              ))}
              {animating && (
                <span className="inline-block animate-pulse text-muted-foreground">|</span>
              )}
            </span>
            <style jsx>{`
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(0.5em);}
                to { opacity: 1; transform: translateY(0);}
              }
            `}</style>
          </div>
          <Mic size={40} className="mx-auto my-4" />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

interface SkillsSelectProps {
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
  availableSkills: string[];
}

const SkillsSelect = ({ selectedSkills, onSkillsChange, availableSkills }: SkillsSelectProps) => {
  const { language } = useLanguage();
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