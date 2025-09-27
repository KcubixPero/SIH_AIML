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
    <div className="shadow-faded border border-border p-4 rounded-lg max-w-2xl mx-auto">
      <div className="flex justify-between">
        <div>
          <h1 className="text-lg font-semibold">{intern.title}</h1>
          <p className="text-muted-foreground">{intern.description}</p>
        </div>
        {
          intern.logo ? (
            <Image
              src={intern.logo}
              height={50}
              width={50}
              alt={intern.company + " logo"}
              className="rounded-lg"
            />
          ) : (
            <div className="size-[50px] rounded-lg bg-muted-foreground" />
          )
        }
      </div>
      <div>
        <p className="text-muted-foreground text-sm">
          {intern.skills.join(", ")}
        </p>
      </div>
    </div>
  )
}