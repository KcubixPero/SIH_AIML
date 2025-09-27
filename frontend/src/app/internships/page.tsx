import { Intern, JobCard } from "@/components/JobCard";

export default function page() {
  return (
    <div className="space-y-4 my-8">
      {
        internships.map(i => (
          <JobCard intern={i} key={i.title} />
        ))
      }
    </div>
  )
}

const internships: Intern[] = [
  {
    title: "Software Engineering Intern",
    description: "Build scalable web apps with our team.",
    skills: ["JavaScript", "React", "Node.js", "Problem Solving"],
    company: "TechNova",
    // No logo for this one
  },
  {
    title: "Data Science Intern",
    description: "Analyze data and build predictive models.",
    skills: ["Python", "Pandas", "Machine Learning", "Statistics"],
    company: "DataWiz",
    // Using a company logo (example: a generic data logo)
    logo: "https://dummyimage.com/80x80/cccccc/000000&text=D"
  },
  {
    title: "Product Design Intern",
    description: "Create user-friendly interfaces with designers.",
    skills: ["Figma", "UI/UX", "Prototyping", "Creativity"],
    company: "Designify",
    // Using a character image with company initial "D"
    logo: "https://dummyimage.com/80x80/cccccc/000000&text=D"
  },
  {
    title: "Marketing Intern",
    description: "Assist with campaigns and content creation.",
    skills: ["Content Writing", "SEO", "Social Media", "Analytics"],
    company: "MarketMinds",
    // No logo for this one
  },
  {
    title: "Cybersecurity Intern",
    description: "Help monitor and secure our systems.",
    skills: ["Networking", "Security Tools", "Linux", "Attention to Detail"],
    company: "SecureNet",
    // Using a character image with company initial "S"
    logo: "https://dummyimage.com/80x80/cccccc/000000&text=N"
  }
];
