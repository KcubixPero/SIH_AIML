import { Filter } from "@/components/Filter";
import { Internships } from "@/components/Internships";

export default function page() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <Filter />
      <Internships />
    </div>
  )
}