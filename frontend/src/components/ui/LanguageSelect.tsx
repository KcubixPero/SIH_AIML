import React, { useState } from 'react'
import { useTranslation } from '@/lib/useTranslation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const LanguageSelect = () => {
  const { t } = useTranslation();
  const [language, setLanguage] = useState("en");

  // return (
  //   <div className = "flex justify-end mb-4">
  //     <div className="flex gap-2">
  //       <button
  //         onClick={() => changeLanguage('en')}
  //         className={`px-3 py-1 rounded text-sm font-medium transition-colors ${language === 'en'
  //             ? 'bg-primary text-primary-foreground'
  //             : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
  //           }`}
  //       >
  //         {t('page.languageEnglish')}
  //       </button>
  //       <button
  //         onClick={() => changeLanguage('hi')}
  //         className={`px-3 py-1 rounded text-sm font-medium transition-colors ${language === 'hi'
  //             ? 'bg-primary text-primary-foreground'
  //             : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
  //           }`}
  //       >
  //         {t('page.languageHindi')}
  //       </button>
  //     </div>
  //   </div>
  // )

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