"use client"

import React from 'react'
import { FeedbackFrom } from '@/components/FeedbackFrom'
import { useTranslation } from '@/lib/useTranslation'

export default function FeedbackPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-lg mx-auto mt-18 md:mt-24 p-6">
      <h1 className="text-2xl font-bold text-center">{t('feedback.title')}</h1>
      <p className="mb-6 text-muted-foreground text-center text-sm">
        {t('feedback.subtitle')}
      </p>
      <FeedbackFrom />
    </div>
  )
}