"use client"

import React from 'react'
import { Input } from './ui/Input';
import { Button } from './ui/button';

export const FeedbackFrom = () => {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // form submission logic here
    alert("Thank you for your feedback!");
    (e.target as HTMLFormElement).reset();
  }

  return (
    <form
      className="space-y-4"
      onSubmit={onSubmit}
    >
      <div>
        <label htmlFor="name" className="block mb-1 font-medium">
          Name (optional)
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Your name"
        />
      </div>
      <div>
        <label htmlFor="email" className="block mb-1 font-medium">
          Email (optional)
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label htmlFor="feedback" className="block mb-1 font-medium">
          Your Feedback <span className="text-red-500">*</span>
        </label>
        <textarea
          id="feedback"
          name="feedback"
          required
          rows={5}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring resize-none"
          placeholder="Share your experience, suggestions, or issues..."
        />
      </div>
      <Button
        type="submit"
        className="w-full"
      >
        Submit Feedback
      </Button>
    </form>
  )
}