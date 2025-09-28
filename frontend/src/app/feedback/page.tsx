import React from 'react'
import { FeedbackFrom } from '@/components/FeedbackFrom'

export default function page() {
  return (
    <div className="max-w-lg mx-auto mt-18 md:mt-24 p-6">
      <h1 className="text-2xl font-bold text-center">Feedback</h1>
      <p className="mb-6 text-muted-foreground text-center text-sm">
        We value your feedback! Please let us know your thoughts about the internship platform.
      </p>
      <FeedbackFrom />
    </div>
  )
}