import { HomeStats } from "@/lib/types";

const LABELS: { key: keyof HomeStats; label: string }[] = [
  { key: "totalCompanies", label: "Companies indexed" },
  { key: "totalCategories", label: "Categories tracked" },
  { key: "totalCountries", label: "Countries covered" },
  { key: "totalTechStacks", label: "Data points / month" },
];

export function StatsBar({ stats }: { stats: HomeStats }) {
  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 sm:py-4 xl:p-5 bottomGlass rounded-[25px]">
      {LABELS.map(({ key, label }) => (
        <div 
          key={key} 
          className="
            bg-white text-center p-5 border-border

            border-b
            last:border-b-0

            sm:border-b
            sm:nth-3:border-b-0
            sm:nth-4:border-b-0

            sm:border-r
            sm:nth-2:border-r-0
            sm:nth-4:border-r-0

            lg:border-b-0!
            lg:border-r!
            lg:nth-4:border-r-0!
          "
        >
          <dd className="text-[28px] xl:text-[42px] leading-9 xl:leading-16.25 tracking-[-1.26px] text-primary mb-2 font-fraunces inline-block">{stats[key]}+</dd>
          <dt className="text-lg leading-7 text-secondary">{label}</dt>
        </div>
      ))}
    </dl>
  );
}
