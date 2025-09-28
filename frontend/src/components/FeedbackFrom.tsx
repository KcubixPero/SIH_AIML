"use client"

import React from 'react'
import { Input } from './ui/Input';
import { Button } from './ui/button';
import { useTranslation } from '@/lib/useTranslation';

export const FeedbackFrom = () => {
  const { t } = useTranslation();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // form submission logic here
    alert(t('feedback.thankYouMessage'));
    (e.target as HTMLFormElement).reset();
  }

  return (
    <form
      className="space-y-4"
      onSubmit={onSubmit}
    >
      <div>
        <label htmlFor="name" className="block mb-1 font-medium">
          {t('feedback.nameLabel')}
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder={t('feedback.namePlaceholder')}
        />
      </div>
      <div>
        <label htmlFor="email" className="block mb-1 font-medium">
          {t('feedback.emailLabel')}
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder={t('feedback.emailPlaceholder')}
        />
      </div>
      <div>
        <label htmlFor="feedback" className="block mb-1 font-medium">
          {t('feedback.feedbackLabel')} <span className="text-red-500">{t('feedback.required')}</span>
        </label>
        <textarea
          id="feedback"
          name="feedback"
          required
          rows={5}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring resize-none"
          placeholder={t('feedback.feedbackPlaceholder')}
        />
      </div>
      <Button
        type="submit"
        className="w-full"
      >
        {t('feedback.submitButton')}
      </Button>
    </form>
  )
}