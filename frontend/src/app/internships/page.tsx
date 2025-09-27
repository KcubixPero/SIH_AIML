"use client"

import { useState } from 'react';
import { Filter } from "@/components/Filter";
import { Internships } from "@/components/Internships";

export default function page() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleRecommendations = (newRecommendations: any[]) => {
    setRecommendations(newRecommendations);
  };

  const handleLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">AI-Powered Internship Recommendations</h1>
        <p className="text-muted-foreground">Get personalized internship suggestions based on your skills and preferences</p>
      </div>
      
      <Filter 
        onRecommendations={handleRecommendations}
        onLoading={handleLoading}
      />
      
      <Internships 
        recommendations={recommendations}
        isLoading={isLoading}
      />
    </div>
  )
}