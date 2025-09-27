import Image from 'next/image';
import React from 'react'

export interface Intern {
  title: string;
  description: string;
  skills: string[];
  company: string;
  logo?: string;
}


export const JobCard = ({ intern }: { intern: Intern }) => {
  return (
    <div className="shadow-faded border border-border p-6 rounded-lg bg-card hover:shadow-lg transition-shadow max-w-3/5 mx-auto">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-card-foreground mb-2">{intern.title}</h1>
          <p className="text-muted-foreground mb-3">{intern.description}</p>
          <div className="flex flex-wrap gap-2">
            {intern.skills.map((skill, index) => (
              <span 
                key={index}
                className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-md"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="flex-shrink-0">
          {
            intern.logo ? (
              <Image
                src={intern.logo}
                height={60}
                width={60}
                alt={intern.company + " logo"}
                className="rounded-lg border border-border"
              />
            ) : (
              <div className="size-[60px] rounded-lg bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-sm font-medium">
                  {intern.company.charAt(0)}
                </span>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}