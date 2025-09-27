"use client"

import React, { useState } from 'react'
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
import { XIcon } from 'lucide-react'

export const Filter = () => {
  return (
    <div className="w-5xl flex gap-4 mb-6">
      <SelectBox filter={"location"} />
      <SelectBox filter={"duration"} />
      <div className="flex-1 flex gap-2">
        <SkillsSelect />
      </div>
    </div>
  )
}

const SkillsSelect = () => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const handleSkillSelect = (skill: string) => {
    setSelectedSkills(prev => {
      if (prev.includes(skill)) {
        return prev.filter(s => s !== skill);
      }
      return [...prev, skill];
    });
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
            skills.map(s => (
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
