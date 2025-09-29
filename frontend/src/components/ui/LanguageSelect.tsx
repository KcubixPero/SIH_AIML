import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Language, useLanguage } from '@/contexts/LanguageContext';

export const LanguageSelect = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div>
      <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-[180px] min-h-10 border-none">
            <SelectValue placeholder={"Select language"} />
          </SelectTrigger>
          <SelectContent>
            {
              Object.keys(languages).map(k => (
                <SelectItem key={k} value={k}>
                  {languages[k as Language]}
                </SelectItem>
              ))
            }
          </SelectContent>
        </Select>
    </div>
  )
}

const languages: Record<Language, string> = {
  "en": "English",
  "hi": "हिंदी",
  "ta": "தமிழ்",
  "te": "తెలుగు",
  "kn": "ಕನ್ನಡ",
  "bh": "भोजपुरी",
  "gu": "ગુજરાતી",
  "pa": "ਪੰਜਾਬੀ",
  "bn": "বাংলা",
  "or": "ଓଡ଼ିଆ"
}