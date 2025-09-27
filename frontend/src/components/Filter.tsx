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

interface FilterProps {
  onRecommendations: (recommendations: any[]) => void;
  onLoading: (loading: boolean) => void;
}

export const Filter = ({ onRecommendations, onLoading }: FilterProps) => {
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedDuration, setSelectedDuration] = useState<string>("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modelType, setModelType] = useState<'tfidf' | 'ann'>('tfidf');

  // Load available skills and locations from API
  useEffect(() => {
    const loadData = async () => {
      try {
        const [skillsRes, locationsRes] = await Promise.all([
          fetch('http://localhost:5000/api/skills/'),
          fetch('http://localhost:5000/api/locations/')
        ]);
        
        if (skillsRes.ok) {
          const skillsData = await skillsRes.json();
          setAvailableSkills(skillsData.skills || []);
        }
        
        if (locationsRes.ok) {
          const locationsData = await locationsRes.json();
          setAvailableLocations(locationsData.locations || []);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to hardcoded data
        setAvailableSkills(skills);
        setAvailableLocations(filters.location);
      }
    };

    loadData();
  }, []);

  const handleGetRecommendations = async () => {
    if (selectedSkills.length === 0) {
      alert('Please select at least one skill');
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
        alert('Error getting recommendations: ' + (errorData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Network Error:', error);
      alert('Network error. Make sure the backend server is running on port 5000.');
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
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            {availableLocations.map(loc => (
              <SelectItem key={loc} value={loc}>{loc}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedDuration} onValueChange={setSelectedDuration}>
          <SelectTrigger className="w-[180px] min-h-10">
            <SelectValue placeholder="Duration" />
          </SelectTrigger>
          <SelectContent>
            {filters.duration.map(d => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex-1 flex gap-2">
          <SkillsSelect 
            selectedSkills={selectedSkills}
            onSkillsChange={setSelectedSkills}
            availableSkills={availableSkills}
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
              Getting Recommendations...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Get Recommendations
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
}

const SkillsSelect = ({ selectedSkills, onSkillsChange, availableSkills }: SkillsSelectProps) => {
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
          <span className="text-muted-foreground text-sm">No skills selected</span>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="px-3 py-1.5 max-h-10 rounded-lg border border-border shadow-faded text-sm bg-background hover:bg-accent hover:text-accent-foreground transition-colors">
          Select skills
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-[18rem] w-[200px]">
          <DropdownMenuLabel>Select Skills</DropdownMenuLabel>
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

const SelectBox = ({ filter }: { filter: string }) => (
  <Select>
    <SelectTrigger className="w-[180px] min-h-10">
      <SelectValue placeholder={filter[0].toUpperCase() + filter.substring(1)} />
    </SelectTrigger>
    <SelectContent>
      {
        filters[filter].map(f => (
          <SelectItem key={f} value={f}>{f}</SelectItem>
        ))
      }
    </SelectContent>
  </Select>
)

const filters: {
  [key: string]: string[]
} = {
  location: [
    "Remote",
    "Bangalore",
    "Hyderabad",
    "Mumbai",
    "Delhi",
    "Chennai",
    "Pune",
    "Gurgaon",
    "Kolkata"
  ],
  duration: [
    "1 month",
    "3 months",
    "6 months"
  ]
}

const skills = [
  "JavaScript",
  "React",
  "Node.js",
  "Problem Solving",
  "Python",
  "Pandas",
  "Machine Learning",
  "Statistics",
  "Figma",
  "UI/UX",
  "Prototyping",
  "Creativity",
  "Content Writing",
  "SEO",
  "Social Media",
  "Analytics",
  "Networking",
  "Security Tools",
  "Linux",
  "Attention to Detail"
];
