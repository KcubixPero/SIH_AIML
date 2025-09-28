import React, { useState } from 'react'
import { useTranslation } from '@/lib/useTranslation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLanguage } from '@/contexts/LanguageContext';

export const LanguageSelect = () => {
  const { t } = useTranslation();
  // const [language, setLanguage] = useState("en");
  const { language, setLanguage } = useLanguage();

  return (
    <div>
      <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-[180px] min-h-10">
            <SelectValue placeholder={"Select language"} />
          </SelectTrigger>
          <SelectContent>
            {
              Object.keys(languages).map(k => (
                <SelectItem key={k} value={k}>
                  {languages[k]}
                </SelectItem>
              ))
            }
          </SelectContent>
        </Select>
    </div>
  )
}

const languages: Record<string, string> = {
  "en": "English",
  "hi": "Hindi"
}