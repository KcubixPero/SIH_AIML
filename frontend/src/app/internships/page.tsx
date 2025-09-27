import { Filter } from "@/components/Filter";
import { Internships } from "@/components/Internships";

export default function page() {
  return (
    <div className="w-5xl px-4 py-8 space-y-96">
      <Filter />
      <Internships />
    </div>
  )
}